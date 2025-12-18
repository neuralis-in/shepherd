# Shepherd Architecture Design Document

> **Debug your AI agents like you debug your code.**

This document describes the architecture of the Shepherd observability platform, which provides end-to-end tracing, evaluation, and debugging capabilities for AI/LLM applications.

---

## System Overview

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                 SHEPHERD PLATFORM                                      │
│                                                                                       │
│  ┌─────────────┐     ┌──────────────────┐     ┌─────────────────────────────┐         │
│  │   aiobs     │────▶│ aiobs-flush-     │────▶│  shepherd-evaluation-       │         │
│  │   (SDK)     │     │ server           │     │  orchestrator               │         │
│  │             │     │                  │     │                             │         │
│  │ @observe()  │     │ POST /v1/traces  │     │  ┌─────────────────────┐    │         │
│  │ traces      │     │ Store to DB      │     │  │ Orchestrator        │    │         │
│  │             │     │ Trigger evals    │     │  │ (polls for new      │    │         │
│  └─────────────┘     └──────────────────┘     │  │  sessions)          │    │         │
│         │                    │                │  └──────────┬──────────┘    │         │
│         │                    │                │             │               │         │
│         ▼                    │                │  ┌──────────▼──────────┐    │         │
│  ┌─────────────┐             │                │  │ Worker              │    │         │
│  │ shepherd-   │◀────────────┘                │  │ (Cloud Run Job)     │    │         │
│  │ server      │                              │  │ - Run evaluations   │    │         │
│  │             │◀──────────────────────────────  │ - Store results     │    │         │
│  │ API keys,   │                              │  └─────────────────────┘    │         │
│  │ Usage,      │                              └─────────────────────────────┘         │
│  │ Sessions    │                                                                      │
│  └──────┬──────┘                                                                      │
│         │                                                                             │
│         ├───────────────────────────┬─────────────────────────────┐                   │
│         ▼                           ▼                             ▼                   │
│  ┌─────────────┐             ┌─────────────┐               ┌─────────────┐            │
│  │ shepherd-   │             │ shepherd    │               │ shepherd-   │            │
│  │ mcp         │             │ (Playground)│               │ mcp         │            │
│  │             │             │             │               │ (Langfuse)  │            │
│  │ MCP Server  │             │ React SPA   │               │             │            │
│  │ for IDEs    │             │ Visualize   │               │ External    │            │
│  └─────────────┘             │ Analyze     │               │ Providers   │            │
│        ▲                     │ A/B Test    │               └─────────────┘            │
│        │                     └─────────────┘                                          │
│  AI Coding Assistants              ▲                                                  │
│  (Cursor, Cline, etc.)             │                                                  │
│                              Developers                                               │
│                              (Web Browser)                                            │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. `aiobs` — The Python SDK

**Purpose:** Instrument your Python AI/LLM applications with zero-friction observability.

**Location:** `/aiobs/`

**Key Features:**
- **Provider Instrumentation**: Auto-patches OpenAI and Gemini clients to capture all LLM calls
- **`@observe` Decorator**: Trace any function with parent-child span relationships
- **Session Management**: Group related traces into sessions with labels and metadata
- **Local + Remote Flushing**: Dump traces to JSON locally AND send to remote server

**Data Flow:**
```python
# 1. Initialize observer with API key
import aiobs
aiobs.observe(api_key="aiobs_sk_...")  # Validates key with shepherd-server

# 2. Traces are captured automatically (LLM calls) or explicitly (@observe)
@aiobs.observe(name="summarize")
def summarize(text: str) -> str:
    return openai.chat.completions.create(...)  # Auto-captured

# 3. Flush sends data to aiobs-flush-server
aiobs.flush()  # POST /v1/traces with full session payload
```

**Key Files:**
- `collector.py` — Core `Collector` class managing sessions, events, flushing
- `observe.py` — `@observe` decorator for function tracing
- `providers/openai/` — OpenAI instrumentation
- `providers/gemini/` — Gemini instrumentation

**API Key Validation:**
```
aiobs → shepherd-server (GET /v1/usage)
        ├── Valid → Continue
        ├── Invalid → Raise ValueError
        └── Rate limited → Raise RuntimeError
```

---

### 2. `aiobs-flush-server` — Trace Ingestion Service

**Purpose:** Receive and persist trace data from the aiobs SDK.

**Location:** `/aiobs-flush-server/`

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1/traces` | Ingest single trace session (202 Accepted) |
| `POST` | `/v1/traces/batch` | Batch ingest multiple sessions |
| `GET` | `/v1/health` | Health check |

**Database Schema:**
```sql
sessions (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL,
    external_id VARCHAR,          -- SDK-generated UUID
    name VARCHAR,
    started_at FLOAT,
    ended_at FLOAT,
    meta JSONB,
    evaluation_status ENUM('queued','processing','success','error')
)

provider_events (
    session_id UUID REFERENCES sessions,
    span_id VARCHAR,
    parent_span_id VARCHAR,
    provider VARCHAR,             -- 'openai', 'gemini', 'anthropic'
    api VARCHAR,                  -- 'chat.completions', 'generate_content'
    request JSONB,
    response JSONB,
    duration_ms FLOAT,
    error TEXT
)

function_events (
    session_id UUID REFERENCES sessions,
    span_id VARCHAR,
    parent_span_id VARCHAR,
    name VARCHAR,                 -- Function name
    module VARCHAR,               -- Python module path
    args JSONB,
    kwargs JSONB,
    result JSONB,
    duration_ms FLOAT
)

session_labels (
    session_id UUID REFERENCES sessions,
    key VARCHAR,
    value VARCHAR
)
```

**Processing Flow:**
1. Receive trace payload via POST `/v1/traces`
2. Validate API key (extract account_id)
3. Insert session, provider_events, function_events
4. Session created with `evaluation_status = 'queued'`
5. Trigger PostgreSQL NOTIFY for orchestrator

---

### 3. `shepherd-server` — Core API & Playground Backend

**Purpose:** Central API for authentication, usage metering, and trace retrieval.

**Location:** `/shepherd-server/`

**Key Responsibilities:**
- **API Key Management**: Generate, validate, revoke keys (`aiobs_sk_...`)
- **Usage Metering**: Track trace counts per account/tier
- **OAuth Integration**: Google OAuth for user authentication
- **Session Retrieval**: Fetch traces for playground/MCP

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/usage` | Get current usage (validates API key) |
| `POST` | `/v1/usage` | Record trace usage |
| `POST` | `/v1/sessions` | Get all sessions for account |
| `POST` | `/v1/sessions/{id}/tree` | Get single session with trace tree |
| `POST` | `/v1/accounts` | Create new account |
| `POST` | `/oauth/google/callback` | Google OAuth flow |
| `POST` | `/v1/subscriptions/webhook` | Razorpay webhook |

**API Key Format:**
```
aiobs_sk_<random-32-chars>

Stored as: SHA256(api_key) → key_hash
```

**Usage Tiers:**
```python
TIERS = {
    "free": {"traces_limit": 1_000},
    "pro": {"traces_limit": 100_000},
    "enterprise": {"traces_limit": float('inf')}
}
```

---

### 4. `shepherd-evaluation-orchestrator` — Async Evaluation Engine

**Purpose:** Run evaluations on traced sessions asynchronously.

**Location:** `/shepherd-evaluation-orchestrator/`

**Architecture:**
```
┌─────────────────────────┐
│     Orchestrator        │  (Cloud Run Service, max-instances=1)
│                         │
│  - Listen for NOTIFY    │
│  - Poll for QUEUED      │
│  - Trigger worker jobs  │
└───────────┬─────────────┘
            │
            │ Cloud Run Jobs API
            ▼
┌─────────────────────────┐
│     Worker (Evaluator)  │  (Cloud Run Job, parallel tasks)
│                         │
│  - Fetch session data   │
│  - Run evaluations      │
│  - Store results        │
│  - Mark session SUCCESS │
└─────────────────────────┘
```

**Orchestrator Flow:**
1. Wait for PostgreSQL `NOTIFY session_created` or timeout (polling)
2. Fetch batch of `QUEUED` sessions with `FOR UPDATE SKIP LOCKED`
3. Mark sessions as `PROCESSING`
4. Trigger Cloud Run Job with session IDs
5. Job processes sessions and marks `SUCCESS` or `ERROR`

**Evaluators:**
| Evaluator | Description |
|-----------|-------------|
| `GroundTruthEvaluator` | Compare output against expected answer |
| `HallucinationDetector` | LLM-based detection of hallucinations |
| `LatencyEvaluator` | Check if response time within threshold |
| `PIIDetector` | Detect personally identifiable information |
| `RegexEvaluator` | Pattern matching validation |
| `SchemaEvaluator` | JSON schema validation |

**Evaluation Results:**
```sql
evaluations (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES sessions,
    span_id VARCHAR,
    span_type ENUM('provider','function'),
    eval_type VARCHAR,           -- 'hallucination', 'latency', 'pii', etc.
    score FLOAT,
    passed BOOLEAN,
    feedback TEXT,
    status ENUM('pending','completed','error')
)
```

---

### 5. `shepherd-mcp` — Model Context Protocol Server

**Purpose:** Expose observability data to AI coding assistants via MCP.

**Location:** `/shepherd-mcp/`

**What is MCP?**
Model Context Protocol (MCP) is a standard for AI assistants to access external tools and data. Shepherd-MCP allows assistants like Cursor, Cline, and others to:

- List and search traced sessions
- Inspect individual traces with full detail
- Compare two sessions (diff)
- Filter by labels, provider, model, errors, failed evals

**Supported Providers:**
1. **AIOBS** (Shepherd native)
2. **Langfuse** (external observability platform)

**Tools Exposed:**
| Tool | Description |
|------|-------------|
| `aiobs_list_sessions` | List all sessions |
| `aiobs_get_session` | Get session with trace tree |
| `aiobs_search_sessions` | Filter by query, labels, provider, model, date, errors |
| `aiobs_diff_sessions` | Compare two sessions |
| `langfuse_list_traces` | List Langfuse traces |
| `langfuse_get_trace` | Get Langfuse trace details |
| `langfuse_search_*` | Search Langfuse data |

**Configuration (mcp.json):**
```json
{
  "mcpServers": {
    "shepherd": {
      "command": "shepherd-mcp",
      "env": {
        "AIOBS_API_KEY": "aiobs_sk_...",
        "LANGFUSE_PUBLIC_KEY": "pk-...",
        "LANGFUSE_SECRET_KEY": "sk-..."
      }
    }
  }
}
```

**Usage with Cursor:**
```
User: "Show me sessions that failed evaluations today"
Assistant: [calls aiobs_search_sessions with evals_failed=true, after="2024-12-18"]
           → Returns matching sessions with errors highlighted

User: "Compare the last two runs of my summarize pipeline"
Assistant: [calls aiobs_diff_sessions]
           → Shows diff in tokens, latency, models, prompts, responses
```

---

### 6. `shepherd` — The Playground (Web UI)

**Purpose:** Visual interface for exploring, analyzing, and debugging AI agent traces.

**Location:** `/shepherd/`

**Tech Stack:**
- **React** — UI framework
- **Vite** — Build tool
- **Framer Motion** — Animations
- **Lucide React** — Icons

**Key Features:**

#### 📊 Multiple View Modes

| View | Description |
|------|-------------|
| **Tree** | Hierarchical trace visualization with parent-child span relationships |
| **List** | Flat list of provider events and function events |
| **Analytics** | Dashboard with token usage, latency metrics, cost analysis |
| **Timeline** | Chronological waterfall view of all events |
| **Enhance** | Prompt enhancement suggestions based on trace patterns |
| **Issues** | Filtered view of errors and failed evaluations |
| **A/B Test** | Side-by-side comparison of two pipeline runs |

#### 🔍 Session Management

```
┌─────────────────────────────────────────────────────────────────┐
│  PLAYGROUND                                                      │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐ │
│  │ Session List │  │ Main Content Area                        │ │
│  │              │  │                                          │ │
│  │ ▼ Session 1  │  │  ┌─────────────────────────────────────┐ │ │
│  │   Session 2  │  │  │  Stats Bar (tokens, latency, cost)  │ │ │
│  │   Session 3  │  │  └─────────────────────────────────────┘ │ │
│  │              │  │                                          │ │
│  │ ────────────│  │  ┌─────────────────────────────────────┐ │ │
│  │ + Upload    │  │  │  Trace Tree / Analytics / Timeline  │ │ │
│  │ + Your Traces│  │  │                                     │ │ │
│  │ + GCP Import│  │  │  [Expandable nodes with details]    │ │ │
│  │              │  │  │                                     │ │ │
│  └──────────────┘  │  └─────────────────────────────────────┘ │ │
│                    └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 📈 Analytics Dashboard

The Analytics view provides comprehensive insights:

- **Token Usage**: Input/output/cached/reasoning token breakdown by model
- **Latency Metrics**: P50, P90, P99 percentiles with distribution charts
- **Cost Analysis**: Per-model cost calculation using standard pricing
- **Provider Distribution**: Pie charts showing OpenAI vs Gemini vs other providers
- **Evaluation Summary**: Pass/fail rates with drill-down to individual evals

#### 🧪 A/B Testing

Compare two pipeline runs side-by-side:

```
┌─────────────────────────────────────────────────────────────────┐
│  A/B TESTING                                                     │
│  ┌──────────────────────────┬──────────────────────────────┐    │
│  │     Pipeline A           │     Pipeline B                │    │
│  │  ───────────────────    │  ───────────────────────     │    │
│  │  Total Calls: 12         │  Total Calls: 15              │    │
│  │  Avg Latency: 1.2s       │  Avg Latency: 0.8s ⬇️ 33%     │    │
│  │  Total Cost: $0.045      │  Total Cost: $0.032 ⬇️ 29%    │    │
│  │  PII Passed: 100%        │  PII Passed: 100%             │    │
│  │  Hallucination: 95%      │  Hallucination: 98% ⬆️        │    │
│  └──────────────────────────┴──────────────────────────────┘    │
│                                                                  │
│  Prompt Group Comparison (select prompts to compare)            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [✓] summarize_text    A: 5 calls, B: 6 calls            │   │
│  │ [✓] extract_entities  A: 4 calls, B: 5 calls            │   │
│  │ [ ] generate_response A: 3 calls, B: 4 calls            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### 🔗 Data Sources

The Playground supports multiple data sources:

1. **File Upload**: Drag & drop `llm_observability.json` files
2. **Sample Data**: Load built-in sample for exploration
3. **Your Traces**: Fetch sessions from server using API key
4. **GCP Import**: Connect to Google Cloud Storage for batch import

**Your Traces Modal:**
```javascript
// Fetch sessions using API key
const response = await fetch('/v1/sessions', {
  method: 'POST',
  body: JSON.stringify({ api_key: 'aiobs_sk_...' })
});
const { sessions, events, function_events, trace_tree } = await response.json();
```

#### 🎨 Component Library

Key React components in `src/components/playground/`:

| Component | Purpose |
|-----------|---------|
| `TreeNode` | Recursive trace tree rendering with expand/collapse |
| `EventCard` | Card displaying single LLM call with request/response |
| `SessionInfo` | Session metadata (name, duration, labels) |
| `StatsBar` | Quick stats row (calls, tokens, latency, cost) |
| `Timeline` | Waterfall chart of events over time |
| `Analytics` | Full analytics dashboard |
| `ABTesting` | Side-by-side pipeline comparison |
| `EvaluationBadge` | Pass/fail badge with eval details |
| `EvaluationsPanel` | Expandable panel showing all evals for a span |
| `IssuesView` | Filtered view of errors and failures |
| `SearchBar` | Full-text search across traces |
| `PlaygroundFilters` | Filter by provider, model, date, labels |
| `UploadZone` | Drag & drop file upload area |
| `YourTracesModal` | API key input to fetch remote sessions |
| `GCPConnectionModal` | GCS bucket connection for import |

#### 🔍 Search & Filter

**Full-Text Search** (available in Tree, List, Timeline views):
- Searches prompts, responses, model names, API names
- Highlights matching nodes
- Shows result count

**Filters** (sidebar):
- Provider (OpenAI, Gemini, Anthropic)
- Model (gpt-4o, gpt-4o-mini, gemini-pro)
- Date range
- Labels (key-value pairs)
- Has errors
- Failed evaluations

---

## Data Flow: End-to-End

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           TRACE LIFECYCLE                                     │
│                                                                              │
│  1. CAPTURE                                                                  │
│     ┌─────────────────────────────────────────────────────────────────┐      │
│     │  User Code                                                       │      │
│     │  ┌──────────────────────────────────────────────────────────┐   │      │
│     │  │ @aiobs.observe(name="summarize")                         │   │      │
│     │  │ def summarize(text):                                     │   │      │
│     │  │     response = openai.chat.completions.create(           │   │      │
│     │  │         model="gpt-4o",                                  │   │      │
│     │  │         messages=[{"role": "user", "content": text}]     │   │      │
│     │  │     )                                                    │   │      │
│     │  │     return response.choices[0].message.content           │   │      │
│     │  └──────────────────────────────────────────────────────────┘   │      │
│     └─────────────────────────────────────────────────────────────────┘      │
│                            │                                                  │
│                            ▼                                                  │
│  2. INSTRUMENT (aiobs SDK)                                                   │
│     ┌─────────────────────────────────────────────────────────────────┐      │
│     │  Collector captures:                                             │      │
│     │  • FunctionEvent (summarize, args, result, span_id, parent_id)  │      │
│     │  • ProviderEvent (openai, request, response, tokens, latency)   │      │
│     │  • Session (id, name, labels, meta)                             │      │
│     └─────────────────────────────────────────────────────────────────┘      │
│                            │                                                  │
│                            ▼                                                  │
│  3. FLUSH (aiobs.flush())                                                    │
│     ┌─────────────────────────────────────────────────────────────────┐      │
│     │  POST https://aiobs-flush-server/v1/traces                       │      │
│     │  Authorization: Bearer aiobs_sk_...                              │      │
│     │  Body: { sessions, events, function_events, trace_tree, ... }   │      │
│     └─────────────────────────────────────────────────────────────────┘      │
│                            │                                                  │
│                            ▼                                                  │
│  4. STORE (aiobs-flush-server)                                               │
│     ┌─────────────────────────────────────────────────────────────────┐      │
│     │  • Insert into PostgreSQL (sessions, provider_events, etc.)     │      │
│     │  • Set evaluation_status = 'QUEUED'                             │      │
│     │  • NOTIFY session_created                                        │      │
│     └─────────────────────────────────────────────────────────────────┘      │
│                            │                                                  │
│                            ▼                                                  │
│  5. EVALUATE (shepherd-evaluation-orchestrator)                              │
│     ┌─────────────────────────────────────────────────────────────────┐      │
│     │  Orchestrator:                                                   │      │
│     │  • Receives NOTIFY or polls for QUEUED sessions                 │      │
│     │  • Triggers Cloud Run Job with session_ids                      │      │
│     │                                                                  │      │
│     │  Worker:                                                         │      │
│     │  • Fetches session data                                         │      │
│     │  • Runs evaluations (hallucination, latency, PII, etc.)         │      │
│     │  • Stores results in evaluations table                          │      │
│     │  • Marks session SUCCESS/ERROR                                  │      │
│     └─────────────────────────────────────────────────────────────────┘      │
│                            │                                                  │
│                            ▼                                                  │
│  6. QUERY (shepherd-server + shepherd-mcp)                                   │
│     ┌─────────────────────────────────────────────────────────────────┐      │
│     │  shepherd-server:                                                │      │
│     │  • POST /v1/sessions → Returns all sessions with events         │      │
│     │  • POST /v1/sessions/{id}/tree → Single session trace tree      │      │
│     │                                                                  │      │
│     │  shepherd-mcp:                                                   │      │
│     │  • MCP tools for AI assistants                                  │      │
│     │  • list_sessions, get_session, search, diff                     │      │
│     │  • Used by Cursor, Cline, etc.                                  │      │
│     └─────────────────────────────────────────────────────────────────┘      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Trace Tree Structure

Shepherd builds a hierarchical trace tree from flat events:

```json
{
  "trace_tree": [
    {
      "event_type": "function",
      "name": "run_pipeline",
      "duration_ms": 5432,
      "children": [
        {
          "event_type": "function",
          "name": "fetch_documents",
          "duration_ms": 234,
          "children": []
        },
        {
          "event_type": "function",
          "name": "summarize",
          "duration_ms": 4521,
          "children": [
            {
              "event_type": "provider",
              "provider": "openai",
              "api": "chat.completions.create",
              "model": "gpt-4o-mini",
              "duration_ms": 4234,
              "evaluations": [
                {
                  "eval_type": "hallucination",
                  "passed": true,
                  "score": 0.95
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Environment Variables

### aiobs SDK
| Variable | Description |
|----------|-------------|
| `AIOBS_API_KEY` | API key for authentication |
| `AIOBS_FLUSH_SERVER_URL` | Override flush server endpoint |
| `AIOBS_LABEL_*` | Auto-add labels (e.g., `AIOBS_LABEL_ENVIRONMENT=production`) |

### aiobs-flush-server
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ALLOWED_ORIGINS` | CORS allowed origins |

### shepherd-server
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret |
| `RAZORPAY_KEY_ID` | Payment integration |

### shepherd-evaluation-orchestrator
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `WORKER_JOB_NAME` | Cloud Run Job name |
| `BATCH_SIZE` | Sessions per worker batch |
| `OPENAI_API_KEY` | For hallucination detection |

### shepherd-mcp
| Variable | Description |
|----------|-------------|
| `AIOBS_API_KEY` | AIOBS authentication |
| `AIOBS_ENDPOINT` | Override API endpoint |
| `LANGFUSE_PUBLIC_KEY` | Langfuse integration |
| `LANGFUSE_SECRET_KEY` | Langfuse integration |
| `LANGFUSE_HOST` | Langfuse host URL |

### shepherd (Playground)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (defaults to production) |
| `BASE_URL` | Base URL for static assets |

---

## Deployment Architecture

```
                        Google Cloud Platform
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│   │  Cloud Run      │  │  Cloud Run      │  │  Cloud Run      │              │
│   │  (Service)      │  │  (Service)      │  │  (Service)      │              │
│   │                 │  │                 │  │                 │              │
│   │ aiobs-flush-    │  │ shepherd-       │  │ orchestrator    │              │
│   │ server          │  │ server          │  │ (max=1)         │              │
│   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│            │                    │                    │                       │
│            │                    │                    │                       │
│            ▼                    ▼                    ▼                       │
│   ┌─────────────────────────────────────────────────────────────┐            │
│   │                     Cloud SQL (PostgreSQL)                   │            │
│   │                                                              │            │
│   │   sessions │ provider_events │ function_events │ evaluations│            │
│   │   accounts │ api_keys        │ usage           │ ...        │            │
│   └─────────────────────────────────────────────────────────────┘            │
│                                                                               │
│   ┌─────────────────┐                                                         │
│   │  Cloud Run Job  │◀── Triggered by orchestrator                           │
│   │  (Evaluator)    │                                                         │
│   │  • Batch eval   │                                                         │
│   │  • Parallel     │                                                         │
│   └─────────────────┘                                                         │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘

                        GitHub Pages / Vercel / Netlify
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                    Shepherd Playground (React SPA)                   │    │
│   │                                                                      │    │
│   │   • Static files served from CDN                                    │    │
│   │   • Calls shepherd-server APIs for session data                     │    │
│   │   • No server-side rendering needed                                 │    │
│   │   • Can work offline with uploaded JSON files                       │    │
│   │                                                                      │    │
│   └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘

                        Developer Machines
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                      shepherd-mcp (Local Process)                    │    │
│   │                                                                      │    │
│   │   • Runs as stdio MCP server                                        │    │
│   │   • Spawned by AI coding assistants (Cursor, Cline, etc.)           │    │
│   │   • Communicates with shepherd-server via HTTPS                     │    │
│   │                                                                      │    │
│   └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Security Model

1. **API Key Authentication**
   - Keys generated with `aiobs_sk_` prefix
   - Stored as SHA256 hashes
   - Validated on every SDK operation

2. **Account Isolation**
   - All queries scoped by `account_id`
   - No cross-account data access

3. **Rate Limiting**
   - Per-account trace limits by tier
   - 429 responses when exceeded

4. **OAuth Integration**
   - Google OAuth for user login
   - JWT tokens for web sessions

---

## Quick Start

```python
import aiobs
from openai import OpenAI

# 1. Initialize
aiobs.observe(api_key="aiobs_sk_...")

# 2. Use your LLM as normal (auto-traced)
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}]
)

# 3. Flush traces to server
aiobs.flush()

# View in Cursor: "Show my recent sessions"
```

---

*Built with ❤️ by Shepherd*

