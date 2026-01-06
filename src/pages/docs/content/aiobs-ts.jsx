import { Link } from 'react-router-dom';
import { DocsSection, DocsCodeBlock, DocsTable } from '../../../components/docs';

export const aiobsTsContent = {
  'getting-started': {
    title: 'Getting Started with aiobs (TypeScript)',
    description: 'AI Observability SDK for TypeScript - trace and monitor LLM calls.',
    content: () => (
      <>
        <DocsSection id="install" title="Installation">
          <p>Install aiobs using your preferred package manager:</p>
          
          <DocsCodeBlock
            code={`npm install aiobs`}
            language="bash"
            filename="npm"
          />
          
          <DocsCodeBlock
            code={`yarn add aiobs`}
            language="bash"
            filename="yarn"
          />
          
          <DocsCodeBlock
            code={`pnpm add aiobs`}
            language="bash"
            filename="pnpm"
          />
        </DocsSection>

        <DocsSection id="quick-start" title="Quick Start">
          <DocsCodeBlock
            code={`import OpenAI from 'openai';
import { observer, wrapOpenAIClient, observe } from 'aiobs';

// Create and wrap OpenAI client for automatic tracing
const openai = wrapOpenAIClient(new OpenAI(), observer);

// Start an observability session (requires API key)
await observer.observe({
  sessionName: 'my-session',
  apiKey: 'aiobs_sk_...', // or set AIOBS_API_KEY env var
});

// Make LLM calls - they're automatically traced
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
});

// End session and flush traces (to file and remote server)
observer.end();
await observer.flush();`}
            language="typescript"
            filename="index.ts"
          />
        </DocsSection>

        <DocsSection id="api-key" title="API Key Authentication">
          <p>
            aiobs requires an API key for usage tracking and remote trace storage. 
            You can get your free API key from the <Link to="/api-keys" className="docs-link">API Keys page</Link>.
          </p>
          <DocsCodeBlock
            code={`// Option 1: Pass directly
await observer.observe({ apiKey: 'aiobs_sk_...' });

// Option 2: Environment variable
// Set AIOBS_API_KEY=aiobs_sk_...
await observer.observe();`}
            language="typescript"
          />
          
          <p>The SDK validates your API key on session start and will throw an error if:</p>
          <ul>
            <li>No API key is provided</li>
            <li>The API key is invalid</li>
            <li>Your rate limit has been exceeded</li>
          </ul>
        </DocsSection>
      </>
    )
  },

  'usage': {
    title: 'Usage',
    description: 'Learn how to use aiobs for session management and labels.',
    content: () => (
      <>
        <DocsSection id="session-labels" title="Session Labels">
          <p>Add metadata to your sessions for filtering and categorization:</p>
          <DocsCodeBlock
            code={`// At session start
await observer.observe({
  sessionName: 'production-run',
  labels: {
    environment: 'production',
    user_id: 'user123',
    version: '1.0.0',
  },
});

// Or dynamically during the session
observer.addLabel('request_id', 'req-abc123');
observer.setLabels({ batch_id: 'batch-1' }, true); // merge with existing`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection id="env-labels" title="Environment Variable Labels">
          <p>Set labels via environment variables (prefixed with <code>AIOBS_LABEL_</code>):</p>
          <DocsCodeBlock
            code={`AIOBS_LABEL_ENVIRONMENT=production
AIOBS_LABEL_SERVICE=my-service`}
            language="bash"
          />
          <p>These are automatically included in all sessions.</p>
        </DocsSection>

        <DocsSection id="remote-storage" title="Remote Trace Storage">
          <p>When you call <code>flush()</code>, traces are automatically sent to the aiobs server:</p>
          <DocsCodeBlock
            code={`// Traces are written locally AND sent to the server
await observer.flush();

// Skip local file, only send to server
await observer.flush({ persist: false });`}
            language="typescript"
          />
        </DocsSection>
      </>
    )
  },

  'openai': {
    title: 'OpenAI Integration',
    description: 'Automatic instrumentation for OpenAI API calls.',
    content: () => (
      <>
        <DocsSection id="wrap-client" title="Wrapping the OpenAI Client">
          <p>Wrap your OpenAI client to automatically capture all chat completion calls:</p>
          <DocsCodeBlock
            code={`import OpenAI from 'openai';
import { observer, wrapOpenAIClient } from 'aiobs';

const openai = wrapOpenAIClient(new OpenAI(), observer);

// All chat.completions.create calls are now traced
await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'What is TypeScript?' }],
});`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection id="captured-data" title="What Gets Captured">
          <p>For each OpenAI call, aiobs captures:</p>
          <ul>
            <li><strong>Request</strong>: model, messages, temperature, max_tokens, etc.</li>
            <li><strong>Response</strong>: text content, model, usage statistics</li>
            <li><strong>Timing</strong>: start/end timestamps, duration_ms</li>
            <li><strong>Errors</strong>: exception name and message if the call fails</li>
          </ul>
        </DocsSection>
      </>
    )
  },

  'function-tracing': {
    title: 'Function Tracing',
    description: 'Trace your own functions with the observe wrapper.',
    content: () => (
      <>
        <DocsSection id="observe-wrapper" title="The observe Wrapper">
          <p>Use the <code>observe</code> wrapper to trace your own functions:</p>
          <DocsCodeBlock
            code={`import { observe } from 'aiobs';

// Wrap a function for tracing
const processQuery = observe(async function processQuery(query: string) {
  // Your logic here
  return result;
});

// With options
const analyzeText = observe(
  async function analyzeText(text: string) {
    // Your logic here
    return analysis;
  },
  { name: 'text_analysis', captureArgs: true, captureResult: true }
);`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection id="nested-tracing" title="Nested Tracing">
          <p>Traces automatically capture parent-child relationships:</p>
          <DocsCodeBlock
            code={`const outerFunction = observe(async function outerFunction() {
  // This creates a child span linked to outerFunction
  await innerFunction();
});

const innerFunction = observe(async function innerFunction() {
  // OpenAI calls here are also linked as children
  await openai.chat.completions.create({ ... });
});`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection id="options" title="Options">
          <DocsTable 
            headers={['Option', 'Type', 'Description']}
            rows={[
              [<code>name</code>, 'string', 'Custom name for the trace (default: function name)'],
              [<code>captureArgs</code>, 'boolean', 'Capture function arguments (default: true)'],
              [<code>captureResult</code>, 'boolean', 'Capture return value (default: true)'],
              [<code>enhPrompt</code>, 'boolean', 'Include in enhanced prompt traces (default: false)'],
            ]}
          />
        </DocsSection>
      </>
    )
  },

  'api-reference': {
    title: 'API Reference',
    description: 'Complete API reference for the aiobs TypeScript SDK.',
    content: () => (
      <>
        <DocsSection id="observer" title="observer (Collector singleton)">
          <DocsTable 
            headers={['Method', 'Description']}
            rows={[
              [<code>observe(options?)</code>, 'Start a new session (async). Returns session ID.'],
              [<code>end()</code>, 'End the current session.'],
              [<code>flush(options?)</code>, 'Write traces to file and server (async).'],
              [<code>addLabel(key, value)</code>, 'Add a label to current session.'],
              [<code>setLabels(labels, merge?)</code>, 'Set/merge labels on current session.'],
              [<code>removeLabel(key)</code>, 'Remove a label from current session.'],
              [<code>getLabels()</code>, 'Get all labels for current session.'],
              [<code>reset()</code>, 'Reset collector state (for testing).'],
            ]}
          />
        </DocsSection>

        <DocsSection id="env-vars" title="Environment Variables">
          <DocsTable 
            headers={['Variable', 'Description']}
            rows={[
              [<code>AIOBS_API_KEY</code>, 'API key for authentication'],
              [<code>AIOBS_DEBUG</code>, 'Set to any value to enable debug logging'],
              [<code>AIOBS_LABEL_*</code>, 'Auto-included labels (e.g., AIOBS_LABEL_ENV=prod)'],
              [<code>AIOBS_FLUSH_SERVER_URL</code>, 'Override flush server URL (for self-hosted)'],
              [<code>LLM_OBS_OUT</code>, 'Default output file path'],
            ]}
          />
        </DocsSection>

        <DocsSection id="output-format" title="Output Format">
          <p>Traces are written as JSON with the following structure:</p>
          <DocsCodeBlock
            code={`{
  "sessions": [...],
  "events": [...],
  "function_events": [...],
  "trace_tree": [...],
  "enh_prompt_traces": [...],
  "generated_at": 1234567890.123,
  "version": 1
}`}
            language="json"
          />
        </DocsSection>
      </>
    )
  }
};

