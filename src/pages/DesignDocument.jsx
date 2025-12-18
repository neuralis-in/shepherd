import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Github,
  ExternalLink,
  FileCode,
  Layers,
  Database,
  Server,
  Code,
  Cpu,
  Shield,
  Zap,
  GitBranch,
  Cloud,
  Key,
  Activity,
  Box,
  Terminal,
  Settings,
  Layout,
  Search,
  BarChart3,
  GitCompare,
  Upload,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import './DesignDocument.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

function DesignHeader() {
  return (
    <header className="design-header">
      <div className="container design-header__container">
        <Link to="/" className="design-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="design-header__logo">
          <svg viewBox="0 0 32 32" className="design-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        <nav className="design-header__nav">
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="design-header__link">
            Docs <ExternalLink size={12} />
          </a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer" className="design-header__link">
            <Github size={16} />
          </a>
        </nav>
      </div>
    </header>
  )
}

function DesignSection({ icon, title, id, githubUrl, children }) {
  return (
    <motion.section className="design-section" variants={fadeInUp} id={id}>
      <div className="design-section__header">
        <div className="design-section__icon">
          {icon}
        </div>
        <h2 className="design-section__title">{title}</h2>
        {githubUrl && (
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="design-section__github"
            title="View on GitHub"
          >
            <Github size={16} />
          </a>
        )}
      </div>
      <div className="design-section__content">
        {children}
      </div>
    </motion.section>
  )
}

function CodeBlock({ title, children }) {
  return (
    <div className="design-code-block">
      {title && <div className="design-code-block__header">{title}</div>}
      <pre className="design-code-block__content">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function TableOfContents() {
  const [activeSection, setActiveSection] = useState('overview')
  
  const sections = [
    { id: 'overview', label: 'System Overview' },
    { id: 'aiobs-sdk', label: 'aiobs SDK' },
    { id: 'flush-server', label: 'aiobs-flush-server' },
    { id: 'shepherd-server', label: 'shepherd-server' },
    { id: 'orchestrator', label: 'Evaluation Orchestrator' },
    { id: 'mcp', label: 'shepherd-mcp' },
    { id: 'playground', label: 'Playground (Web UI)' },
    { id: 'data-flow', label: 'Data Flow' },
    { id: 'trace-tree', label: 'Trace Tree Structure' },
    { id: 'env-vars', label: 'Environment Variables' },
    { id: 'deployment', label: 'Deployment Architecture' },
    { id: 'security', label: 'Security Model' },
    { id: 'quickstart', label: 'Quick Start' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
    }
  }

  return (
    <motion.nav className="design-toc" variants={fadeInUp}>
      <h3 className="design-toc__title">Contents</h3>
      <ul className="design-toc__list">
        {sections.map((section) => (
          <li key={section.id}>
            <a 
              href={`#${section.id}`} 
              className={`design-toc__link ${activeSection === section.id ? 'design-toc__link--active' : ''}`}
              onClick={(e) => handleClick(e, section.id)}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}

export default function DesignDocument() {
  return (
    <div className="design-page">
      <DesignHeader />
      
      <main className="design-main">
        <div className="container">
          <motion.div 
            className="design-hero"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="design-hero__badge" variants={fadeInUp}>
              <FileCode size={14} />
              Architecture Design Document
            </motion.div>
            <motion.h1 className="heading-xl design-hero__title" variants={fadeInUp}>
              Shepherd Architecture
            </motion.h1>
            <motion.p className="text-lg design-hero__subtitle" variants={fadeInUp}>
              Debug your AI agents like you debug your code.
            </motion.p>
            <motion.p className="design-hero__description" variants={fadeInUp}>
              End-to-end tracing, evaluation, and debugging capabilities for AI/LLM applications.
            </motion.p>
          </motion.div>

          <div className="design-layout">
            <TableOfContents />
            
            <motion.div 
              className="design-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* System Overview */}
              <DesignSection icon={<Layers size={20} />} title="System Overview" id="overview">
                {/* Flow 1: Trace Ingestion */}
                <div className="design-flow-section">
                  <div className="design-flow-section__label">Data Ingestion Flow</div>
                  <div className="design-flow-section__row">
                    <div className="design-flow-card">
                      <div className="design-flow-card__icon"><Code size={18} /></div>
                      <div className="design-flow-card__title">aiobs (SDK)</div>
                      <div className="design-flow-card__desc">@observe() traces</div>
                    </div>
                    <div className="design-flow-arrow">→</div>
                    <div className="design-flow-card">
                      <div className="design-flow-card__icon"><Server size={18} /></div>
                      <div className="design-flow-card__title">aiobs-flush-server</div>
                      <div className="design-flow-card__desc">POST /v1/traces, Store to DB</div>
                    </div>
                    <div className="design-flow-arrow">→</div>
                    <div className="design-flow-card">
                      <div className="design-flow-card__icon"><Cpu size={18} /></div>
                      <div className="design-flow-card__title">shepherd-evaluation-orchestrator</div>
                      <div className="design-flow-card__desc">Run evaluations, Store results</div>
                    </div>
                  </div>
                </div>

                {/* Flow 2: API Access */}
                <div className="design-flow-section">
                  <div className="design-flow-section__label">API & Data Access</div>
                  <div className="design-flow-section__row">
                    <div className="design-flow-card design-flow-card--primary">
                      <div className="design-flow-card__icon"><Database size={18} /></div>
                      <div className="design-flow-card__title">shepherd-server</div>
                      <div className="design-flow-card__desc">API keys, Usage, Sessions</div>
                    </div>
                    <div className="design-flow-arrow">→</div>
                    <div className="design-flow-card">
                      <div className="design-flow-card__icon"><Terminal size={18} /></div>
                      <div className="design-flow-card__title">shepherd-mcp</div>
                      <div className="design-flow-card__desc">MCP Server for IDEs</div>
                      <div className="design-flow-card__user">AI Coding Assistants</div>
                    </div>
                  </div>
                </div>

                {/* Flow 3: Playground */}
                <div className="design-flow-section">
                  <div className="design-flow-section__row">
                    <div className="design-flow-card design-flow-card--primary">
                      <div className="design-flow-card__icon"><Database size={18} /></div>
                      <div className="design-flow-card__title">shepherd-server</div>
                      <div className="design-flow-card__desc">API keys, Usage, Sessions</div>
                    </div>
                    <div className="design-flow-arrow">→</div>
                    <div className="design-flow-card">
                      <div className="design-flow-card__icon"><Layout size={18} /></div>
                      <div className="design-flow-card__title">shepherd (Playground)</div>
                      <div className="design-flow-card__desc">React SPA, Visualize, A/B Test</div>
                      <div className="design-flow-card__user">Developers (Web Browser)</div>
                    </div>
                  </div>
                </div>

                {/* Flow 4: External */}
                <div className="design-flow-section">
                  <div className="design-flow-section__label">External Integration</div>
                  <div className="design-flow-section__row">
                    <div className="design-flow-card design-flow-card--dashed">
                      <div className="design-flow-card__icon"><Cloud size={18} /></div>
                      <div className="design-flow-card__title">Langfuse</div>
                      <div className="design-flow-card__desc">External Provider</div>
                    </div>
                    <div className="design-flow-arrow">→</div>
                    <div className="design-flow-card">
                      <div className="design-flow-card__icon"><Terminal size={18} /></div>
                      <div className="design-flow-card__title">shepherd-mcp</div>
                      <div className="design-flow-card__desc">MCP Server for IDEs</div>
                    </div>
                  </div>
                </div>
              </DesignSection>

              {/* aiobs SDK */}
              <DesignSection icon={<Code size={20} />} title="1. aiobs — The Python SDK" id="aiobs-sdk" githubUrl="https://github.com/neuralis-in/aiobs">
                <p><strong>Purpose:</strong> Instrument your Python AI/LLM applications with zero-friction observability.</p>
                <p><strong>Location:</strong> <code>/aiobs/</code></p>
                
                <h4>Key Features</h4>
                <ul>
                  <li><strong>Provider Instrumentation:</strong> Auto-patches OpenAI and Gemini clients to capture all LLM calls</li>
                  <li><strong>@observe Decorator:</strong> Trace any function with parent-child span relationships</li>
                  <li><strong>Session Management:</strong> Group related traces into sessions with labels and metadata</li>
                  <li><strong>Local + Remote Flushing:</strong> Dump traces to JSON locally AND send to remote server</li>
                </ul>

                <h4>Data Flow</h4>
                <CodeBlock title="Python">
{`# 1. Initialize observer with API key
import aiobs
aiobs.observe(api_key="aiobs_sk_...")  # Validates key with shepherd-server

# 2. Traces are captured automatically (LLM calls) or explicitly (@observe)
@aiobs.observe(name="summarize")
def summarize(text: str) -> str:
    return openai.chat.completions.create(...)  # Auto-captured

# 3. Flush sends data to aiobs-flush-server
aiobs.flush()  # POST /v1/traces with full session payload`}
                </CodeBlock>

                <h4>Key Files</h4>
                <ul>
                  <li><code>collector.py</code> — Core Collector class managing sessions, events, flushing</li>
                  <li><code>observe.py</code> — @observe decorator for function tracing</li>
                  <li><code>providers/openai/</code> — OpenAI instrumentation</li>
                  <li><code>providers/gemini/</code> — Gemini instrumentation</li>
                </ul>

                <h4>API Key Validation</h4>
                <CodeBlock>
{`aiobs → shepherd-server (GET /v1/usage)
        ├── Valid → Continue
        ├── Invalid → Raise ValueError
        └── Rate limited → Raise RuntimeError`}
                </CodeBlock>
              </DesignSection>

              {/* aiobs-flush-server */}
              <DesignSection icon={<Server size={20} />} title="2. aiobs-flush-server — Trace Ingestion Service" id="flush-server" githubUrl="https://github.com/neuralis-in/aiobs-flush-server">
                <p><strong>Purpose:</strong> Receive and persist trace data from the aiobs SDK.</p>
                <p><strong>Location:</strong> <code>/aiobs-flush-server/</code></p>

                <h4>Endpoints</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Path</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>POST</code></td>
                        <td><code>/v1/traces</code></td>
                        <td>Ingest single trace session (202 Accepted)</td>
                      </tr>
                      <tr>
                        <td><code>POST</code></td>
                        <td><code>/v1/traces/batch</code></td>
                        <td>Batch ingest multiple sessions</td>
                      </tr>
                      <tr>
                        <td><code>GET</code></td>
                        <td><code>/v1/health</code></td>
                        <td>Health check</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>Database Schema</h4>
                <CodeBlock title="SQL">
{`sessions (
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
)`}
                </CodeBlock>

                <h4>Processing Flow</h4>
                <ol>
                  <li>Receive trace payload via POST <code>/v1/traces</code></li>
                  <li>Validate API key (extract account_id)</li>
                  <li>Insert session, provider_events, function_events</li>
                  <li>Session created with <code>evaluation_status = 'queued'</code></li>
                  <li>Trigger PostgreSQL NOTIFY for orchestrator</li>
                </ol>
              </DesignSection>

              {/* shepherd-server */}
              <DesignSection icon={<Database size={20} />} title="3. shepherd-server — Core API & Playground Backend" id="shepherd-server" githubUrl="https://github.com/neuralis-in/shepherd-server">
                <p><strong>Purpose:</strong> Central API for authentication, usage metering, and trace retrieval.</p>
                <p><strong>Location:</strong> <code>/shepherd-server/</code></p>

                <h4>Key Responsibilities</h4>
                <ul>
                  <li><strong>API Key Management:</strong> Generate, validate, revoke keys (<code>aiobs_sk_...</code>)</li>
                  <li><strong>Usage Metering:</strong> Track trace counts per account/tier</li>
                  <li><strong>OAuth Integration:</strong> Google OAuth for user authentication</li>
                  <li><strong>Session Retrieval:</strong> Fetch traces for playground/MCP</li>
                </ul>

                <h4>Endpoints</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Path</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>GET</code></td>
                        <td><code>/v1/usage</code></td>
                        <td>Get current usage (validates API key)</td>
                      </tr>
                      <tr>
                        <td><code>POST</code></td>
                        <td><code>/v1/usage</code></td>
                        <td>Record trace usage</td>
                      </tr>
                      <tr>
                        <td><code>POST</code></td>
                        <td><code>/v1/sessions</code></td>
                        <td>Get all sessions for account</td>
                      </tr>
                      <tr>
                        <td><code>POST</code></td>
                        <td><code>/v1/sessions/{'{id}'}/tree</code></td>
                        <td>Get single session with trace tree</td>
                      </tr>
                      <tr>
                        <td><code>POST</code></td>
                        <td><code>/v1/accounts</code></td>
                        <td>Create new account</td>
                      </tr>
                      <tr>
                        <td><code>POST</code></td>
                        <td><code>/oauth/google/callback</code></td>
                        <td>Google OAuth flow</td>
                      </tr>
                      <tr>
                        <td><code>POST</code></td>
                        <td><code>/v1/subscriptions/webhook</code></td>
                        <td>Razorpay webhook</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>API Key Format</h4>
                <CodeBlock>
{`aiobs_sk_<random-32-chars>

Stored as: SHA256(api_key) → key_hash`}
                </CodeBlock>

                <h4>Usage Tiers</h4>
                <CodeBlock title="Python">
{`TIERS = {
    "free": {"traces_limit": 1_000},
    "pro": {"traces_limit": 100_000},
    "enterprise": {"traces_limit": float('inf')}
}`}
                </CodeBlock>
              </DesignSection>

              {/* Evaluation Orchestrator */}
              <DesignSection icon={<Cpu size={20} />} title="4. shepherd-evaluation-orchestrator — Async Evaluation Engine" id="orchestrator" githubUrl="https://github.com/neuralis-in/shepherd-evaluation-orchestrator">
                <p><strong>Purpose:</strong> Run evaluations on traced sessions asynchronously.</p>
                <p><strong>Location:</strong> <code>/shepherd-evaluation-orchestrator/</code></p>

                <h4>Architecture</h4>
                <div className="design-diagram design-diagram--small">
                  <div className="design-diagram__flow">
                    <div className="design-diagram__component">
                      <Box size={16} />
                      <strong>Orchestrator</strong>
                      <span>Cloud Run Service (max-instances=1)</span>
                      <span className="design-diagram__detail">Listen for NOTIFY • Poll for QUEUED • Trigger worker jobs</span>
                    </div>
                    <div className="design-diagram__arrow design-diagram__arrow--down">↓</div>
                    <div className="design-diagram__arrow-label">Cloud Run Jobs API</div>
                    <div className="design-diagram__arrow design-diagram__arrow--down">↓</div>
                    <div className="design-diagram__component">
                      <Activity size={16} />
                      <strong>Worker (Evaluator)</strong>
                      <span>Cloud Run Job (parallel tasks)</span>
                      <span className="design-diagram__detail">Fetch session data • Run evaluations • Store results • Mark session SUCCESS</span>
                    </div>
                  </div>
                </div>

                <h4>Orchestrator Flow</h4>
                <ol>
                  <li>Wait for PostgreSQL <code>NOTIFY session_created</code> or timeout (polling)</li>
                  <li>Fetch batch of <code>QUEUED</code> sessions with <code>FOR UPDATE SKIP LOCKED</code></li>
                  <li>Mark sessions as <code>PROCESSING</code></li>
                  <li>Trigger Cloud Run Job with session IDs</li>
                  <li>Job processes sessions and marks <code>SUCCESS</code> or <code>ERROR</code></li>
                </ol>

                <h4>Evaluators</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Evaluator</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>GroundTruthEvaluator</code></td>
                        <td>Compare output against expected answer</td>
                      </tr>
                      <tr>
                        <td><code>HallucinationDetector</code></td>
                        <td>LLM-based detection of hallucinations</td>
                      </tr>
                      <tr>
                        <td><code>LatencyEvaluator</code></td>
                        <td>Check if response time within threshold</td>
                      </tr>
                      <tr>
                        <td><code>PIIDetector</code></td>
                        <td>Detect personally identifiable information</td>
                      </tr>
                      <tr>
                        <td><code>RegexEvaluator</code></td>
                        <td>Pattern matching validation</td>
                      </tr>
                      <tr>
                        <td><code>SchemaEvaluator</code></td>
                        <td>JSON schema validation</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>Evaluation Results Schema</h4>
                <CodeBlock title="SQL">
{`evaluations (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES sessions,
    span_id VARCHAR,
    span_type ENUM('provider','function'),
    eval_type VARCHAR,           -- 'hallucination', 'latency', 'pii', etc.
    score FLOAT,
    passed BOOLEAN,
    feedback TEXT,
    status ENUM('pending','completed','error')
)`}
                </CodeBlock>
              </DesignSection>

              {/* shepherd-mcp */}
              <DesignSection icon={<Terminal size={20} />} title="5. shepherd-mcp — Model Context Protocol Server" id="mcp" githubUrl="https://github.com/neuralis-in/shepherd-mcp">
                <p><strong>Purpose:</strong> Expose observability data to AI coding assistants via MCP.</p>
                <p><strong>Location:</strong> <code>/shepherd-mcp/</code></p>

                <h4>What is MCP?</h4>
                <p>
                  Model Context Protocol (MCP) is a standard for AI assistants to access external tools and data. 
                  Shepherd-MCP allows assistants like Cursor, Cline, and others to:
                </p>
                <ul>
                  <li>List and search traced sessions</li>
                  <li>Inspect individual traces with full detail</li>
                  <li>Compare two sessions (diff)</li>
                  <li>Filter by labels, provider, model, errors, failed evals</li>
                </ul>

                <h4>Supported Providers</h4>
                <ol>
                  <li><strong>AIOBS</strong> (Shepherd native)</li>
                  <li><strong>Langfuse</strong> (external observability platform)</li>
                </ol>

                <h4>Tools Exposed</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Tool</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>aiobs_list_sessions</code></td>
                        <td>List all sessions</td>
                      </tr>
                      <tr>
                        <td><code>aiobs_get_session</code></td>
                        <td>Get session with trace tree</td>
                      </tr>
                      <tr>
                        <td><code>aiobs_search_sessions</code></td>
                        <td>Filter by query, labels, provider, model, date, errors</td>
                      </tr>
                      <tr>
                        <td><code>aiobs_diff_sessions</code></td>
                        <td>Compare two sessions</td>
                      </tr>
                      <tr>
                        <td><code>langfuse_list_traces</code></td>
                        <td>List Langfuse traces</td>
                      </tr>
                      <tr>
                        <td><code>langfuse_get_trace</code></td>
                        <td>Get Langfuse trace details</td>
                      </tr>
                      <tr>
                        <td><code>langfuse_search_*</code></td>
                        <td>Search Langfuse data</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>Configuration (mcp.json)</h4>
                <CodeBlock title="JSON">
{`{
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
}`}
                </CodeBlock>

                <h4>Usage with AI Coding Assistants</h4>
                <CodeBlock>
{`User: "Show me sessions that failed evaluations today"
AI Assistant: [calls aiobs_search_sessions with evals_failed=true, after="2024-12-18"]
              → Returns matching sessions with errors highlighted

User: "Compare the last two runs of my summarize pipeline"
AI Assistant: [calls aiobs_diff_sessions]
              → Shows diff in tokens, latency, models, prompts, responses`}
                </CodeBlock>
              </DesignSection>

              {/* Playground */}
              <DesignSection icon={<Layout size={20} />} title="6. shepherd — The Playground (Web UI)" id="playground" githubUrl="https://github.com/neuralis-in/shepherd">
                <p><strong>Purpose:</strong> Visual interface for exploring, analyzing, and debugging AI agent traces.</p>
                <p><strong>Location:</strong> <code>/shepherd/</code></p>

                <h4>Tech Stack</h4>
                <ul>
                  <li><strong>React</strong> — UI framework</li>
                  <li><strong>Vite</strong> — Build tool</li>
                  <li><strong>Framer Motion</strong> — Animations</li>
                  <li><strong>Lucide React</strong> — Icons</li>
                </ul>

                <h4>📊 Multiple View Modes</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>View</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Tree</strong></td>
                        <td>Hierarchical trace visualization with parent-child span relationships</td>
                      </tr>
                      <tr>
                        <td><strong>List</strong></td>
                        <td>Flat list of provider events and function events</td>
                      </tr>
                      <tr>
                        <td><strong>Analytics</strong></td>
                        <td>Dashboard with token usage, latency metrics, cost analysis</td>
                      </tr>
                      <tr>
                        <td><strong>Timeline</strong></td>
                        <td>Chronological waterfall view of all events</td>
                      </tr>
                      <tr>
                        <td><strong>Enhance</strong></td>
                        <td>Prompt enhancement suggestions based on trace patterns</td>
                      </tr>
                      <tr>
                        <td><strong>Issues</strong></td>
                        <td>Filtered view of errors and failed evaluations</td>
                      </tr>
                      <tr>
                        <td><strong>A/B Test</strong></td>
                        <td>Side-by-side comparison of two pipeline runs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>🔍 Session Management</h4>
                <div className="design-playground-mock">
                  <div className="design-playground-mock__sidebar">
                    <div className="design-playground-mock__sidebar-header">
                      <Layers size={14} />
                      <span>Sessions</span>
                      <span className="design-playground-mock__count">3</span>
                    </div>
                    <div className="design-playground-mock__sessions">
                      <div className="design-playground-mock__session design-playground-mock__session--active">
                        <Activity size={12} />
                        <span>summarize_pipeline</span>
                      </div>
                      <div className="design-playground-mock__session">
                        <Activity size={12} />
                        <span>extract_entities</span>
                      </div>
                      <div className="design-playground-mock__session">
                        <Activity size={12} />
                        <span>chat_completion</span>
                      </div>
                    </div>
                    <div className="design-playground-mock__divider"></div>
                    <div className="design-playground-mock__actions">
                      <div className="design-playground-mock__action">
                        <Upload size={12} />
                        <span>Upload JSON</span>
                      </div>
                      <div className="design-playground-mock__action">
                        <Key size={12} />
                        <span>Your Traces</span>
                      </div>
                      <div className="design-playground-mock__action">
                        <Cloud size={12} />
                        <span>GCP Import</span>
                      </div>
                    </div>
                  </div>
                  <div className="design-playground-mock__main">
                    <div className="design-playground-mock__stats">
                      <div className="design-playground-mock__stat">
                        <span className="design-playground-mock__stat-value">12</span>
                        <span className="design-playground-mock__stat-label">LLM Calls</span>
                      </div>
                      <div className="design-playground-mock__stat">
                        <span className="design-playground-mock__stat-value">4,521</span>
                        <span className="design-playground-mock__stat-label">Tokens</span>
                      </div>
                      <div className="design-playground-mock__stat">
                        <span className="design-playground-mock__stat-value">1.2s</span>
                        <span className="design-playground-mock__stat-label">Latency</span>
                      </div>
                      <div className="design-playground-mock__stat">
                        <span className="design-playground-mock__stat-value">$0.045</span>
                        <span className="design-playground-mock__stat-label">Cost</span>
                      </div>
                    </div>
                    <div className="design-playground-mock__tabs">
                      <div className="design-playground-mock__tab design-playground-mock__tab--active">Tree</div>
                      <div className="design-playground-mock__tab">List</div>
                      <div className="design-playground-mock__tab">Analytics</div>
                      <div className="design-playground-mock__tab">Timeline</div>
                    </div>
                    <div className="design-playground-mock__tree">
                      <div className="design-playground-mock__node design-playground-mock__node--root">
                        <div className="design-playground-mock__node-header">
                          <ChevronDown size={12} />
                          <Code size={12} />
                          <span>run_pipeline</span>
                          <span className="design-playground-mock__node-time">5.4s</span>
                        </div>
                        <div className="design-playground-mock__node-children">
                          <div className="design-playground-mock__node">
                            <div className="design-playground-mock__node-header">
                              <ChevronRight size={12} />
                              <Code size={12} />
                              <span>fetch_documents</span>
                              <span className="design-playground-mock__node-time">0.2s</span>
                            </div>
                          </div>
                          <div className="design-playground-mock__node">
                            <div className="design-playground-mock__node-header">
                              <ChevronDown size={12} />
                              <Code size={12} />
                              <span>summarize</span>
                              <span className="design-playground-mock__node-time">4.5s</span>
                            </div>
                            <div className="design-playground-mock__node-children">
                              <div className="design-playground-mock__node design-playground-mock__node--provider">
                                <div className="design-playground-mock__node-header">
                                  <Cpu size={12} />
                                  <span>openai.chat.completions</span>
                                  <span className="design-playground-mock__node-badge">gpt-4o-mini</span>
                                  <span className="design-playground-mock__node-eval">✓ PASS</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h4>📈 Analytics Dashboard</h4>
                <p>The Analytics view provides comprehensive insights:</p>
                <ul>
                  <li><strong>Token Usage:</strong> Input/output/cached/reasoning token breakdown by model</li>
                  <li><strong>Latency Metrics:</strong> P50, P90, P99 percentiles with distribution charts</li>
                  <li><strong>Cost Analysis:</strong> Per-model cost calculation using standard pricing</li>
                  <li><strong>Provider Distribution:</strong> Pie charts showing OpenAI vs Gemini vs other providers</li>
                  <li><strong>Evaluation Summary:</strong> Pass/fail rates with drill-down to individual evals</li>
                </ul>

                <h4>🧪 A/B Testing</h4>
                <p>Compare two pipeline runs side-by-side:</p>
                <div className="design-abtest-mock">
                  <div className="design-abtest-mock__header">
                    <GitCompare size={14} />
                    <span>A/B Testing</span>
                  </div>
                  <div className="design-abtest-mock__comparison">
                    <div className="design-abtest-mock__pipeline">
                      <div className="design-abtest-mock__pipeline-header">
                        <span className="design-abtest-mock__pipeline-label">A</span>
                        <span className="design-abtest-mock__pipeline-name">summarize_v1</span>
                      </div>
                      <div className="design-abtest-mock__metrics">
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">Total Calls</span>
                          <span className="design-abtest-mock__metric-value">12</span>
                        </div>
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">Avg Latency</span>
                          <span className="design-abtest-mock__metric-value">1.2s</span>
                        </div>
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">Total Cost</span>
                          <span className="design-abtest-mock__metric-value">$0.045</span>
                        </div>
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">PII Passed</span>
                          <span className="design-abtest-mock__metric-value">100%</span>
                        </div>
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">Hallucination</span>
                          <span className="design-abtest-mock__metric-value">95%</span>
                        </div>
                      </div>
                    </div>
                    <div className="design-abtest-mock__vs">VS</div>
                    <div className="design-abtest-mock__pipeline design-abtest-mock__pipeline--b">
                      <div className="design-abtest-mock__pipeline-header">
                        <span className="design-abtest-mock__pipeline-label design-abtest-mock__pipeline-label--b">B</span>
                        <span className="design-abtest-mock__pipeline-name">summarize_v2</span>
                      </div>
                      <div className="design-abtest-mock__metrics">
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">Total Calls</span>
                          <span className="design-abtest-mock__metric-value">15</span>
                        </div>
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">Avg Latency</span>
                          <span className="design-abtest-mock__metric-value">0.8s</span>
                          <span className="design-abtest-mock__metric-change design-abtest-mock__metric-change--good">↓ 33%</span>
                        </div>
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">Total Cost</span>
                          <span className="design-abtest-mock__metric-value">$0.032</span>
                          <span className="design-abtest-mock__metric-change design-abtest-mock__metric-change--good">↓ 29%</span>
                        </div>
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">PII Passed</span>
                          <span className="design-abtest-mock__metric-value">100%</span>
                        </div>
                        <div className="design-abtest-mock__metric">
                          <span className="design-abtest-mock__metric-label">Hallucination</span>
                          <span className="design-abtest-mock__metric-value">98%</span>
                          <span className="design-abtest-mock__metric-change design-abtest-mock__metric-change--good">↑ 3%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="design-abtest-mock__prompts">
                    <div className="design-abtest-mock__prompts-header">Prompt Group Comparison</div>
                    <div className="design-abtest-mock__prompt-list">
                      <div className="design-abtest-mock__prompt-item">
                        <input type="checkbox" checked readOnly />
                        <span className="design-abtest-mock__prompt-name">summarize_text</span>
                        <span className="design-abtest-mock__prompt-stats">A: 5 calls, B: 6 calls</span>
                      </div>
                      <div className="design-abtest-mock__prompt-item">
                        <input type="checkbox" checked readOnly />
                        <span className="design-abtest-mock__prompt-name">extract_entities</span>
                        <span className="design-abtest-mock__prompt-stats">A: 4 calls, B: 5 calls</span>
                      </div>
                      <div className="design-abtest-mock__prompt-item">
                        <input type="checkbox" readOnly />
                        <span className="design-abtest-mock__prompt-name">generate_response</span>
                        <span className="design-abtest-mock__prompt-stats">A: 3 calls, B: 4 calls</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h4>🔗 Data Sources</h4>
                <p>The Playground supports multiple data sources:</p>
                <ol>
                  <li><strong>File Upload:</strong> Drag & drop <code>llm_observability.json</code> files</li>
                  <li><strong>Sample Data:</strong> Load built-in sample for exploration</li>
                  <li><strong>Your Traces:</strong> Fetch sessions from server using API key</li>
                  <li><strong>GCP Import:</strong> Connect to Google Cloud Storage for batch import</li>
                </ol>

                <h4>Your Traces Modal</h4>
                <CodeBlock title="JavaScript">
{`// Fetch sessions using API key
const response = await fetch('/v1/sessions', {
  method: 'POST',
  body: JSON.stringify({ api_key: 'aiobs_sk_...' })
});
const { sessions, events, function_events, trace_tree } = await response.json();`}
                </CodeBlock>

                <h4>🎨 Component Library</h4>
                <p>Key React components in <code>src/components/playground/</code>:</p>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td><code>TreeNode</code></td><td>Recursive trace tree rendering with expand/collapse</td></tr>
                      <tr><td><code>EventCard</code></td><td>Card displaying single LLM call with request/response</td></tr>
                      <tr><td><code>SessionInfo</code></td><td>Session metadata (name, duration, labels)</td></tr>
                      <tr><td><code>StatsBar</code></td><td>Quick stats row (calls, tokens, latency, cost)</td></tr>
                      <tr><td><code>Timeline</code></td><td>Waterfall chart of events over time</td></tr>
                      <tr><td><code>Analytics</code></td><td>Full analytics dashboard</td></tr>
                      <tr><td><code>ABTesting</code></td><td>Side-by-side pipeline comparison</td></tr>
                      <tr><td><code>EvaluationBadge</code></td><td>Pass/fail badge with eval details</td></tr>
                      <tr><td><code>EvaluationsPanel</code></td><td>Expandable panel showing all evals for a span</td></tr>
                      <tr><td><code>IssuesView</code></td><td>Filtered view of errors and failures</td></tr>
                      <tr><td><code>SearchBar</code></td><td>Full-text search across traces</td></tr>
                      <tr><td><code>PlaygroundFilters</code></td><td>Filter by provider, model, date, labels</td></tr>
                      <tr><td><code>UploadZone</code></td><td>Drag & drop file upload area</td></tr>
                      <tr><td><code>YourTracesModal</code></td><td>API key input to fetch remote sessions</td></tr>
                      <tr><td><code>GCPConnectionModal</code></td><td>GCS bucket connection for import</td></tr>
                    </tbody>
                  </table>
                </div>

                <h4>🔍 Search & Filter</h4>
                <p><strong>Full-Text Search</strong> (available in Tree, List, Timeline views):</p>
                <ul>
                  <li>Searches prompts, responses, model names, API names</li>
                  <li>Highlights matching nodes</li>
                  <li>Shows result count</li>
                </ul>
                <p><strong>Filters</strong> (sidebar):</p>
                <ul>
                  <li>Provider (OpenAI, Gemini, Anthropic)</li>
                  <li>Model (gpt-4o, gpt-4o-mini, gemini-pro)</li>
                  <li>Date range</li>
                  <li>Labels (key-value pairs)</li>
                  <li>Has errors</li>
                  <li>Failed evaluations</li>
                </ul>
              </DesignSection>

              {/* Data Flow */}
              <DesignSection icon={<GitBranch size={20} />} title="Data Flow: End-to-End" id="data-flow">
                <p className="design-section__intro">The complete trace lifecycle from capture to query:</p>
                
                <div className="design-flow">
                  <div className="design-flow__step">
                    <div className="design-flow__number">1</div>
                    <div className="design-flow__content">
                      <h4>CAPTURE</h4>
                      <p>User code with @aiobs.observe decorator and LLM calls</p>
                      <CodeBlock title="Python">
{`@aiobs.observe(name="summarize")
def summarize(text):
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": text}]
    )
    return response.choices[0].message.content`}
                      </CodeBlock>
                    </div>
                  </div>

                  <div className="design-flow__step">
                    <div className="design-flow__number">2</div>
                    <div className="design-flow__content">
                      <h4>INSTRUMENT</h4>
                      <p>aiobs SDK Collector captures:</p>
                      <ul>
                        <li>FunctionEvent (summarize, args, result, span_id, parent_id)</li>
                        <li>ProviderEvent (openai, request, response, tokens, latency)</li>
                        <li>Session (id, name, labels, meta)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="design-flow__step">
                    <div className="design-flow__number">3</div>
                    <div className="design-flow__content">
                      <h4>FLUSH</h4>
                      <CodeBlock>
{`POST https://aiobs-flush-server/v1/traces
Authorization: Bearer aiobs_sk_...
Body: { sessions, events, function_events, trace_tree, ... }`}
                      </CodeBlock>
                    </div>
                  </div>

                  <div className="design-flow__step">
                    <div className="design-flow__number">4</div>
                    <div className="design-flow__content">
                      <h4>STORE</h4>
                      <p>aiobs-flush-server:</p>
                      <ul>
                        <li>Insert into PostgreSQL (sessions, provider_events, etc.)</li>
                        <li>Set evaluation_status = 'QUEUED'</li>
                        <li>NOTIFY session_created</li>
                      </ul>
                    </div>
                  </div>

                  <div className="design-flow__step">
                    <div className="design-flow__number">5</div>
                    <div className="design-flow__content">
                      <h4>EVALUATE</h4>
                      <p><strong>Orchestrator:</strong></p>
                      <ul>
                        <li>Receives NOTIFY or polls for QUEUED sessions</li>
                        <li>Triggers Cloud Run Job with session_ids</li>
                      </ul>
                      <p><strong>Worker:</strong></p>
                      <ul>
                        <li>Fetches session data</li>
                        <li>Runs evaluations (hallucination, latency, PII, etc.)</li>
                        <li>Stores results in evaluations table</li>
                        <li>Marks session SUCCESS/ERROR</li>
                      </ul>
                    </div>
                  </div>

                  <div className="design-flow__step">
                    <div className="design-flow__number">6</div>
                    <div className="design-flow__content">
                      <h4>QUERY</h4>
                      <p><strong>shepherd-server:</strong></p>
                      <ul>
                        <li>POST /v1/sessions → Returns all sessions with events</li>
                        <li>POST /v1/sessions/{'{id}'}/tree → Single session trace tree</li>
                      </ul>
                      <p><strong>shepherd-mcp:</strong></p>
                      <ul>
                        <li>MCP tools for AI assistants</li>
                        <li>list_sessions, get_session, search, diff</li>
                        <li>Used by Cursor, Cline, etc.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </DesignSection>

              {/* Trace Tree Structure */}
              <DesignSection icon={<Layers size={20} />} title="Trace Tree Structure" id="trace-tree">
                <p>Shepherd builds a hierarchical trace tree from flat events:</p>
                <CodeBlock title="JSON">
{`{
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
}`}
                </CodeBlock>
              </DesignSection>

              {/* Environment Variables */}
              <DesignSection icon={<Settings size={20} />} title="Environment Variables" id="env-vars">
                <h4>aiobs SDK</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Variable</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>AIOBS_API_KEY</code></td>
                        <td>API key for authentication</td>
                      </tr>
                      <tr>
                        <td><code>AIOBS_FLUSH_SERVER_URL</code></td>
                        <td>Override flush server endpoint</td>
                      </tr>
                      <tr>
                        <td><code>AIOBS_LABEL_*</code></td>
                        <td>Auto-add labels (e.g., AIOBS_LABEL_ENVIRONMENT=production)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>aiobs-flush-server</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Variable</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>DATABASE_URL</code></td>
                        <td>PostgreSQL connection string</td>
                      </tr>
                      <tr>
                        <td><code>ALLOWED_ORIGINS</code></td>
                        <td>CORS allowed origins</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>shepherd-server</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Variable</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>DATABASE_URL</code></td>
                        <td>PostgreSQL connection string</td>
                      </tr>
                      <tr>
                        <td><code>GOOGLE_CLIENT_ID</code></td>
                        <td>OAuth client ID</td>
                      </tr>
                      <tr>
                        <td><code>GOOGLE_CLIENT_SECRET</code></td>
                        <td>OAuth client secret</td>
                      </tr>
                      <tr>
                        <td><code>RAZORPAY_KEY_ID</code></td>
                        <td>Payment integration</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>shepherd-evaluation-orchestrator</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Variable</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>DATABASE_URL</code></td>
                        <td>PostgreSQL connection string</td>
                      </tr>
                      <tr>
                        <td><code>WORKER_JOB_NAME</code></td>
                        <td>Cloud Run Job name</td>
                      </tr>
                      <tr>
                        <td><code>BATCH_SIZE</code></td>
                        <td>Sessions per worker batch</td>
                      </tr>
                      <tr>
                        <td><code>OPENAI_API_KEY</code></td>
                        <td>For hallucination detection</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>shepherd-mcp</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Variable</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>AIOBS_API_KEY</code></td>
                        <td>AIOBS authentication</td>
                      </tr>
                      <tr>
                        <td><code>AIOBS_ENDPOINT</code></td>
                        <td>Override API endpoint</td>
                      </tr>
                      <tr>
                        <td><code>LANGFUSE_PUBLIC_KEY</code></td>
                        <td>Langfuse integration</td>
                      </tr>
                      <tr>
                        <td><code>LANGFUSE_SECRET_KEY</code></td>
                        <td>Langfuse integration</td>
                      </tr>
                      <tr>
                        <td><code>LANGFUSE_HOST</code></td>
                        <td>Langfuse host URL</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4>shepherd (Playground)</h4>
                <div className="design-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Variable</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>VITE_API_URL</code></td>
                        <td>Backend API URL (defaults to production)</td>
                      </tr>
                      <tr>
                        <td><code>BASE_URL</code></td>
                        <td>Base URL for static assets</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </DesignSection>

              {/* Deployment Architecture */}
              <DesignSection icon={<Cloud size={20} />} title="Deployment Architecture" id="deployment">
                <h4>Google Cloud Platform</h4>
                <div className="design-diagram design-diagram--deployment">
                  <div className="design-diagram__deployment-grid">
                    <div className="design-diagram__service">
                      <Cloud size={20} />
                      <strong>Cloud Run (Service)</strong>
                      <span>aiobs-flush-server</span>
                    </div>
                    <div className="design-diagram__service">
                      <Cloud size={20} />
                      <strong>Cloud Run (Service)</strong>
                      <span>shepherd-server</span>
                    </div>
                    <div className="design-diagram__service">
                      <Cloud size={20} />
                      <strong>Cloud Run (Service)</strong>
                      <span>orchestrator (max=1)</span>
                    </div>
                  </div>
                  <div className="design-diagram__database">
                    <Database size={24} />
                    <strong>Cloud SQL (PostgreSQL)</strong>
                    <span>sessions | provider_events | function_events | evaluations | accounts | api_keys | usage</span>
                  </div>
                  <div className="design-diagram__job">
                    <Zap size={20} />
                    <strong>Cloud Run Job (Evaluator)</strong>
                    <span>Batch eval • Parallel processing • Triggered by orchestrator</span>
                  </div>
                </div>

                <h4>GitHub Pages / Vercel / Netlify</h4>
                <div className="design-deployment-card">
                  <Layout size={20} />
                  <div>
                    <strong>Shepherd Playground (React SPA)</strong>
                    <ul>
                      <li>Static files served from CDN</li>
                      <li>Calls shepherd-server APIs for session data</li>
                      <li>No server-side rendering needed</li>
                      <li>Can work offline with uploaded JSON files</li>
                    </ul>
                  </div>
                </div>

                <h4>Developer Machines</h4>
                <div className="design-deployment-card">
                  <Terminal size={20} />
                  <div>
                    <strong>shepherd-mcp (Local Process)</strong>
                    <ul>
                      <li>Runs as stdio MCP server</li>
                      <li>Spawned by AI coding assistants (Cursor, Cline, etc.)</li>
                      <li>Communicates with shepherd-server via HTTPS</li>
                    </ul>
                  </div>
                </div>
              </DesignSection>

              {/* Security Model */}
              <DesignSection icon={<Shield size={20} />} title="Security Model" id="security">
                <div className="design-security-grid">
                  <div className="design-security-card">
                    <Key size={24} />
                    <h4>1. API Key Authentication</h4>
                    <ul>
                      <li>Keys generated with <code>aiobs_sk_</code> prefix</li>
                      <li>Stored as SHA256 hashes</li>
                      <li>Validated on every SDK operation</li>
                    </ul>
                  </div>
                  <div className="design-security-card">
                    <Database size={24} />
                    <h4>2. Account Isolation</h4>
                    <ul>
                      <li>All queries scoped by <code>account_id</code></li>
                      <li>No cross-account data access</li>
                    </ul>
                  </div>
                  <div className="design-security-card">
                    <Activity size={24} />
                    <h4>3. Rate Limiting</h4>
                    <ul>
                      <li>Per-account trace limits by tier</li>
                      <li>429 responses when exceeded</li>
                    </ul>
                  </div>
                  <div className="design-security-card">
                    <Shield size={24} />
                    <h4>4. OAuth Integration</h4>
                    <ul>
                      <li>Google OAuth for user login</li>
                      <li>JWT tokens for web sessions</li>
                    </ul>
                  </div>
                </div>
              </DesignSection>

              {/* Quick Start */}
              <DesignSection icon={<Zap size={20} />} title="Quick Start" id="quickstart">
                <CodeBlock title="Python">
{`import aiobs
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

# View in Cursor: "Show my recent sessions"`}
                </CodeBlock>
              </DesignSection>

              <motion.div className="design-footer-note" variants={fadeInUp}>
                <p>Built with ❤️ by Shepherd</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="design-footer">
        <div className="container design-footer__container">
          <span>© Shepherd, 2025</span>
          <div className="design-footer__links">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact">Contact</Link>
            <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
