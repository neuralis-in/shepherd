import { Link } from 'react-router-dom';
import { DocsSection, DocsCodeBlock, DocsTable } from '../../../components/docs';

export const aiobsContent = {
  'getting-started': {
    title: 'Getting Started with aiobs',
    description: 'A lightweight Python library that adds observability to AI/LLM applications.',
    content: () => (
      <>
        <DocsSection id="install" title="Installation">
          <p>Install aiobs using pip. Choose the version based on your LLM provider:</p>
          
          <DocsCodeBlock
            code={`# Core only
pip install aiobs

# With OpenAI support
pip install aiobs[openai]

# With Gemini support
pip install aiobs[gemini]

# With all providers
pip install aiobs[all]`}
            language="bash"
            filename="Terminal"
          />
        </DocsSection>

        <DocsSection id="api-key" title="Get Your API Key">
          <p>
            An API key is required to use aiobs. Get your free API key from the{' '}
            <Link to="/api-keys" className="docs-link">API Keys page</Link>.
          </p>
          
          <p>Once you have your API key, set it as an environment variable:</p>
          <DocsCodeBlock
            code={`export AIOBS_API_KEY=aiobs_sk_your_key_here`}
            language="bash"
          />
          
          <p>Or add it to your <code>.env</code> file:</p>
          <DocsCodeBlock
            code={`AIOBS_API_KEY=aiobs_sk_your_key_here`}
            language="text"
            filename=".env"
          />
          
          <p>You can also pass the API key directly when starting a session:</p>
          <DocsCodeBlock
            code={`observer.observe(api_key="aiobs_sk_your_key_here")`}
            language="python"
          />
        </DocsSection>

        <DocsSection id="quick-start" title="Quick Start">
          <p>Here's a minimal example with OpenAI:</p>
          <DocsCodeBlock
            code={`from aiobs import observer
from openai import OpenAI

observer.observe()

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}]
)

observer.end()
observer.flush()  # writes llm_observability.json`}
            language="python"
            filename="main.py"
          />
          
          <p>And with Google Gemini:</p>
          <DocsCodeBlock
            code={`from aiobs import observer
from google import genai

observer.observe()

client = genai.Client()
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Hello!"
)

observer.end()
observer.flush()  # writes llm_observability.json`}
            language="python"
            filename="gemini_example.py"
          />
        </DocsSection>
      </>
    )
  },
  
  'usage': {
    title: 'Usage',
    description: 'Learn how to use aiobs for session management, labels, and tracing.',
    content: () => (
      <>
        <DocsSection id="session-labels" title="Session Labels">
          <p>Add labels to sessions for filtering and categorization in enterprise dashboards:</p>
          <DocsCodeBlock
            code={`from aiobs import observer

observer.observe(
    session_name="my-session",
    labels={
        "environment": "production",
        "team": "ml-platform",
        "project": "recommendation-engine",
        "version": "v2.3.1",
    }
)

# ... your LLM calls ...

observer.end()
observer.flush()`}
            language="python"
          />
          
          <p>Labels are key-value string pairs that enable:</p>
          <ul>
            <li><strong>Dashboard filtering</strong>: Filter sessions by environment, team, project, etc.</li>
            <li><strong>Cost attribution</strong>: Track usage by team or project</li>
            <li><strong>Comparison</strong>: Compare metrics across environments (prod vs staging)</li>
          </ul>
        </DocsSection>

        <DocsSection id="dynamic-labels" title="Dynamic Label Updates">
          <p>Update labels during an active session:</p>
          <DocsCodeBlock
            code={`from aiobs import observer

observer.observe(labels={"environment": "staging"})

# Add a single label
observer.add_label("user_tier", "enterprise")

# Update multiple labels (merge with existing)
observer.set_labels({"experiment_id": "exp-42", "feature_flag": "new_model"})

# Replace all user labels (system labels preserved)
observer.set_labels({"environment": "production"}, merge=False)

# Remove a label
observer.remove_label("experiment_id")

# Get current labels
labels = observer.get_labels()
print(labels)  # {'environment': 'production', 'aiobs_sdk_version': '0.1.0', ...}

observer.end()
observer.flush()`}
            language="python"
          />
        </DocsSection>

        <DocsSection id="env-labels" title="Environment Variable Labels">
          <p>Labels can be auto-populated from environment variables:</p>
          <DocsCodeBlock
            code={`# Set in shell or .env
export AIOBS_LABEL_ENVIRONMENT=production
export AIOBS_LABEL_TEAM=ml-platform
export AIOBS_LABEL_SERVICE=api-gateway`}
            language="bash"
          />
          
          <p>These are automatically merged with explicit labels (explicit takes precedence).</p>
        </DocsSection>
      </>
    )
  },

  'providers': {
    title: 'Providers',
    description: 'Built-in support for OpenAI and Google Gemini APIs.',
    content: () => (
      <>
        <DocsSection id="openai" title="OpenAI">
          <h3>Chat Completions</h3>
          <DocsCodeBlock
            code={`from aiobs import observer
from openai import OpenAI

observer.observe()

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}]
)

observer.end()
observer.flush()`}
            language="python"
          />

          <h3>Embeddings</h3>
          <DocsCodeBlock
            code={`from aiobs import observer
from openai import OpenAI

observer.observe()

client = OpenAI()
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="Hello world"
)

observer.end()
observer.flush()`}
            language="python"
          />
        </DocsSection>

        <DocsSection id="gemini" title="Google Gemini">
          <h3>Generate Content</h3>
          <DocsCodeBlock
            code={`from aiobs import observer
from google import genai

observer.observe()

client = genai.Client()
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain quantum computing"
)

observer.end()
observer.flush()`}
            language="python"
          />

          <h3>Video Generation (Veo)</h3>
          <DocsCodeBlock
            code={`from aiobs import observer
from google import genai
import time

observer.observe()

client = genai.Client()
operation = client.models.generate_videos(
    model="veo-3.1-generate-preview",
    prompt="A cinematic shot of waves crashing on a beach at sunset",
)

# Poll until video is ready
while not operation.done:
    time.sleep(10)
    operation = client.operations.get(operation)

observer.end()
observer.flush()`}
            language="python"
          />
        </DocsSection>

        <DocsSection id="custom-providers" title="Custom Providers">
          <p>You can add new provider SDKs by subclassing <code>BaseProvider</code>:</p>
          <DocsCodeBlock
            code={`from aiobs import BaseProvider, observer

class MyProvider(BaseProvider):
    name = "my-provider"

    @classmethod
    def is_available(cls) -> bool:
        try:
            import my_sdk  # noqa: F401
            return True
        except Exception:
            return False

    def install(self, collector):
        # monkeypatch or add hooks into your SDK
        # call collector._record_event({ ... normalized payload ... })
        def unpatch():
            pass
        return unpatch

# Register before observe()
observer.register_provider(MyProvider())
observer.observe()`}
            language="python"
          />
        </DocsSection>
      </>
    )
  },

  'function-tracing': {
    title: 'Function Tracing',
    description: 'Trace any function with the @observe decorator.',
    content: () => (
      <>
        <DocsSection id="observe-decorator" title="The @observe Decorator">
          <p>Trace any function (sync or async) with the <code>@observe</code> decorator:</p>
          <DocsCodeBlock
            code={`from aiobs import observer, observe

@observe
def research(query: str) -> list:
    # your logic here
    return results

@observe(name="custom_name")
async def fetch_data(url: str) -> dict:
    # async logic here
    return data

observer.observe(session_name="my-pipeline")
research("What is an API?")
observer.end()
observer.flush()`}
            language="python"
          />
        </DocsSection>

        <DocsSection id="decorator-options" title="Decorator Options">
          <DocsTable 
            headers={['Option', 'Default', 'Description']}
            rows={[
              [<code>name</code>, 'function name', 'Custom display name for the traced function'],
              [<code>capture_args</code>, <code>True</code>, 'Whether to capture function arguments'],
              [<code>capture_result</code>, <code>True</code>, 'Whether to capture the return value'],
              [<code>enh_prompt</code>, <code>False</code>, 'Mark trace for enhanced prompt analysis'],
              [<code>auto_enhance_after</code>, <code>None</code>, 'Number of traces after which to run auto prompt enhancer'],
            ]}
          />
          
          <h3>Examples</h3>
          <DocsCodeBlock
            code={`# Don't capture sensitive arguments
@observe(capture_args=False)
def login(username: str, password: str):
    ...

# Don't capture large return values
@observe(capture_result=False)
def get_large_dataset():
    ...`}
            language="python"
          />
        </DocsSection>

        <DocsSection id="enhanced-prompt" title="Enhanced Prompt Tracing">
          <p>Mark functions for automatic prompt enhancement analysis:</p>
          <DocsCodeBlock
            code={`from aiobs import observer, observe

@observe(enh_prompt=True, auto_enhance_after=10)
def summarize(text: str) -> str:
    """After 10 traces, auto prompt enhancer will run."""
    response = client.chat.completions.create(...)
    return response.choices[0].message.content

@observe(enh_prompt=True, auto_enhance_after=5)
def analyze(data: dict) -> dict:
    """Different threshold for this function."""
    return process(data)

observer.observe()
summarize("Hello world")
analyze({"key": "value"})
observer.end()
observer.flush()`}
            language="python"
          />
        </DocsSection>
      </>
    )
  },

  'evals': {
    title: 'Evaluations',
    description: 'Comprehensive evaluation framework for assessing LLM outputs.',
    content: () => (
      <>
        <DocsSection id="overview" title="Overview">
          <p>The evals module provides evaluators for:</p>
          <ul>
            <li><strong>Correctness</strong>: Verify outputs match expected patterns, schemas, or ground truth</li>
            <li><strong>Safety</strong>: Detect PII leakage and sensitive information exposure</li>
            <li><strong>Reliability</strong>: Check latency consistency and performance stability</li>
            <li><strong>Quality Assurance</strong>: Automated testing of LLM responses</li>
          </ul>
        </DocsSection>

        <DocsSection id="quick-start" title="Quick Start">
          <DocsCodeBlock
            code={`from aiobs.evals import EvalInput, RegexAssertion, PIIDetectionEval

# Create input
eval_input = EvalInput(
    user_input="What is the capital of France?",
    model_output="The capital of France is Paris.",
    system_prompt="You are a geography expert."
)

# Run regex evaluation
regex_eval = RegexAssertion.from_patterns(patterns=[r"Paris"])
result = regex_eval(eval_input)
print(f"Status: {result.status.value}")  # "passed"

# Check for PII
pii_eval = PIIDetectionEval.default()
result = pii_eval(eval_input)
print(f"PII found: {result.details['pii_count']}")  # 0`}
            language="python"
          />
        </DocsSection>

        <DocsSection id="regex-assertion" title="Regex Assertion">
          <p>Assert that model output matches (or doesn't match) regex patterns:</p>
          <DocsCodeBlock
            code={`from aiobs.evals import RegexAssertion, EvalInput

# Patterns that MUST match
evaluator = RegexAssertion.from_patterns(
    patterns=[r"Paris", r"\\d+"],
    match_mode="all",  # All patterns must match (or "any")
    case_sensitive=False,
)

result = evaluator(EvalInput(
    user_input="Population of Paris?",
    model_output="Paris has about 2.1 million people."
))
print(result.status.value)  # "passed"`}
            language="python"
          />
        </DocsSection>

        <DocsSection id="pii-detection" title="PII Detection">
          <p>Detect personally identifiable information in model outputs:</p>
          <DocsCodeBlock
            code={`from aiobs.evals import PIIDetectionEval, PIIType, EvalInput

# Default detector (email, phone, SSN, credit card)
evaluator = PIIDetectionEval.default()

result = evaluator(EvalInput(
    user_input="Contact info?",
    model_output="Email me at john@example.com"
))
print(result.status.value)  # "failed" (PII detected)
print(result.details["pii_types_found"])  # ["email"]

# Scan and redact PII
matches = evaluator.scan("Call 555-123-4567")
redacted = evaluator.redact("Call 555-123-4567")
print(redacted)  # "Call [PHONE REDACTED]"`}
            language="python"
          />
        </DocsSection>

        <DocsSection id="hallucination-detection" title="Hallucination Detection">
          <p>Detect hallucinations using an LLM-as-judge approach:</p>
          <DocsCodeBlock
            code={`from openai import OpenAI
from aiobs.evals import HallucinationDetectionEval, EvalInput

client = OpenAI()
evaluator = HallucinationDetectionEval(
    client=client,
    model="gpt-4o-mini",
)

result = evaluator(EvalInput(
    user_input="What is the capital of France?",
    model_output="Paris is the capital of France. It was founded by Julius Caesar in 250 BC.",
    context={
        "documents": ["Paris is the capital and largest city of France."]
    }
))

print(result.status.value)  # "failed" (hallucination detected)
print(result.details["hallucinations"])  # List of detected hallucinations`}
            language="python"
          />
        </DocsSection>
      </>
    )
  },

  'architecture': {
    title: 'Architecture',
    description: 'Understanding the internal architecture of aiobs.',
    content: () => (
      <>
        <DocsSection id="core" title="Core Components">
          <ul>
            <li><code>Collector</code> manages sessions, events, and flushing JSON</li>
            <li><code>aiobs.models</code> provide Pydantic v2 schemas: <code>Session</code>, <code>Event</code>, <code>FunctionEvent</code>, <code>ObservedEvent</code>, and <code>ObservabilityExport</code></li>
          </ul>
        </DocsSection>

        <DocsSection id="providers" title="Providers">
          <p>Base provider interface: <code>aiobs.providers.base.BaseProvider</code></p>
          
          <h3>OpenAI Provider</h3>
          <ul>
            <li><code>providers/openai/provider.py</code>: orchestrates API modules</li>
            <li><code>providers/openai/apis/chat_completions.py</code>: instruments <code>chat.completions.create</code></li>
          </ul>
          
          <h3>Gemini Provider</h3>
          <ul>
            <li><code>providers/gemini/provider.py</code>: orchestrates API modules</li>
            <li><code>providers/gemini/apis/generate_content.py</code>: instruments <code>models.generate_content</code></li>
            <li><code>providers/gemini/apis/generate_videos.py</code>: instruments <code>models.generate_videos</code></li>
          </ul>
        </DocsSection>

        <DocsSection id="flow" title="Flow">
          <ol>
            <li>Call <code>observer.observe()</code> to start a session and install providers</li>
            <li>Make LLM API calls (OpenAI, Gemini, etc.)</li>
            <li>Providers build typed request/response models and record an Event with timing and callsite</li>
            <li><code>observer.flush()</code> serializes an <code>ObservabilityExport</code> JSON file</li>
          </ol>
        </DocsSection>

        <DocsSection id="trace-tree" title="Trace Tree">
          <p>Events are linked via <code>span_id</code> and <code>parent_span_id</code> fields:</p>
          <ul>
            <li>Each decorated function (<code>@observe</code>) generates a unique <code>span_id</code></li>
            <li>Nested calls inherit the parent's <code>span_id</code> as their <code>parent_span_id</code></li>
            <li>The <code>trace_tree</code> field in the export provides a nested view of the execution</li>
          </ul>
          
          <DocsCodeBlock
            code={`{
  "trace_tree": [
    {
      "name": "research",
      "span_id": "abc-123",
      "children": [
        {
          "provider": "openai",
          "api": "chat.completions",
          "parent_span_id": "abc-123"
        }
      ]
    }
  ]
}`}
            language="json"
          />
        </DocsSection>
      </>
    )
  }
};

