import { DocsSection, DocsCodeBlock, DocsTable } from '../../../components/docs';

export const shepherdMcpContent = {
  'overview': {
    title: 'Overview',
    description: 'MCP server for Shepherd - Debug your AI agents like you debug your code.',
    content: () => (
      <>
        <DocsSection id="what-is-mcp" title="What is Shepherd MCP?">
          <p>Shepherd MCP is a <strong>Model Context Protocol (MCP)</strong> server that allows AI assistants (Claude, Cursor, etc.) to query and analyze your AI agent sessions from multiple observability providers.</p>
        </DocsSection>

        <DocsSection id="supported-providers" title="Supported Providers">
          <ul>
            <li><strong>AIOBS</strong> (Shepherd backend) - Native Shepherd observability</li>
            <li><strong>Langfuse</strong> - Open-source LLM observability platform</li>
          </ul>
        </DocsSection>

        <DocsSection id="architecture" title="Architecture">
          <DocsCodeBlock
            code={`┌─────────────────┐     stdio      ┌─────────────────┐
│  Cursor/Claude  │ ◄────────────► │  shepherd-mcp   │
│    (Client)     │   stdin/stdout │   (subprocess)  │
└─────────────────┘                └────────┬────────┘
                                            │ HTTPS
                                  ┌─────────┴─────────┐
                                  │                   │
                                  ▼                   ▼
                         ┌─────────────┐     ┌─────────────┐
                         │ Shepherd API│     │ Langfuse API│
                         │   (AIOBS)   │     │   (Cloud)   │
                         └─────────────┘     └─────────────┘`}
            language="text"
          />
        </DocsSection>
      </>
    )
  },

  'installation': {
    title: 'Installation',
    description: 'Install Shepherd MCP server.',
    content: () => (
      <>
        <DocsSection id="pip-install" title="Install with pip">
          <DocsCodeBlock
            code={`pip install shepherd-mcp`}
            language="bash"
          />
        </DocsSection>

        <DocsSection id="uvx-run" title="Run with uvx">
          <p>Or run directly without installing:</p>
          <DocsCodeBlock
            code={`uvx shepherd-mcp`}
            language="bash"
          />
        </DocsSection>
      </>
    )
  },

  'configuration': {
    title: 'Configuration',
    description: 'Configure Shepherd MCP for Claude Desktop and Cursor.',
    content: () => (
      <>
        <DocsSection id="env-vars" title="Environment Variables">
          <h3>AIOBS (Shepherd)</h3>
          <DocsTable 
            headers={['Variable', 'Required', 'Description']}
            rows={[
              [<code>AIOBS_API_KEY</code>, 'Yes', 'Your Shepherd API key'],
              [<code>AIOBS_ENDPOINT</code>, 'No', 'Custom API endpoint URL'],
            ]}
          />

          <h3>Langfuse</h3>
          <DocsTable 
            headers={['Variable', 'Required', 'Description']}
            rows={[
              [<code>LANGFUSE_PUBLIC_KEY</code>, 'Yes', 'Your Langfuse public API key'],
              [<code>LANGFUSE_SECRET_KEY</code>, 'Yes', 'Your Langfuse secret API key'],
              [<code>LANGFUSE_HOST</code>, 'No', 'Custom Langfuse host URL'],
            ]}
          />
        </DocsSection>

        <DocsSection id="claude-desktop" title="Claude Desktop">
          <p>Add to your <code>claude_desktop_config.json</code>:</p>
          <DocsCodeBlock
            code={`{
  "mcpServers": {
    "shepherd": {
      "command": "uvx",
      "args": ["shepherd-mcp"],
      "env": {
        "AIOBS_API_KEY": "aiobs_sk_xxxx",
        "LANGFUSE_PUBLIC_KEY": "pk-lf-xxxx",
        "LANGFUSE_SECRET_KEY": "sk-lf-xxxx",
        "LANGFUSE_HOST": "https://cloud.langfuse.com"
      }
    }
  }
}`}
            language="json"
            filename="claude_desktop_config.json"
          />
        </DocsSection>

        <DocsSection id="cursor" title="Cursor">
          <p>Add to your <code>.cursor/mcp.json</code>:</p>
          <DocsCodeBlock
            code={`{
  "mcpServers": {
    "shepherd": {
      "command": "uvx",
      "args": ["shepherd-mcp"],
      "env": {
        "AIOBS_API_KEY": "aiobs_sk_xxxx",
        "LANGFUSE_PUBLIC_KEY": "pk-lf-xxxx",
        "LANGFUSE_SECRET_KEY": "sk-lf-xxxx",
        "LANGFUSE_HOST": "https://cloud.langfuse.com"
      }
    }
  }
}`}
            language="json"
            filename=".cursor/mcp.json"
          />
        </DocsSection>
      </>
    )
  },

  'tools': {
    title: 'Available Tools',
    description: 'MCP tools available for querying sessions and traces.',
    content: () => (
      <>
        <DocsSection id="aiobs-tools" title="AIOBS (Shepherd) Tools">
          <h3>aiobs_list_sessions</h3>
          <p>List all AI agent sessions from Shepherd.</p>
          <DocsCodeBlock
            code={`> "List my recent AI agent sessions from AIOBS"`}
            language="text"
          />

          <h3>aiobs_get_session</h3>
          <p>Get detailed information about a specific session including the full trace tree, LLM calls, function events, and evaluations.</p>
          <DocsCodeBlock
            code={`> "Get AIOBS session details for abc123-def456"`}
            language="text"
          />

          <h3>aiobs_search_sessions</h3>
          <p>Search and filter sessions with multiple criteria:</p>
          <ul>
            <li><code>query</code>: Text search (matches name, ID, labels, metadata)</li>
            <li><code>labels</code>: Filter by labels as key-value pairs</li>
            <li><code>provider</code>: Filter by LLM provider (e.g., 'openai', 'anthropic')</li>
            <li><code>model</code>: Filter by model name</li>
            <li><code>has_errors</code>: Only return sessions with errors</li>
          </ul>
          <DocsCodeBlock
            code={`> "Find all AIOBS sessions that used OpenAI with errors"`}
            language="text"
          />

          <h3>aiobs_diff_sessions</h3>
          <p>Compare two sessions and show their differences.</p>
          <DocsCodeBlock
            code={`> "Compare AIOBS sessions abc123 and def456"`}
            language="text"
          />
        </DocsSection>

        <DocsSection id="langfuse-tools" title="Langfuse Tools">
          <h3>langfuse_list_traces</h3>
          <p>List traces with pagination and filters.</p>
          
          <h3>langfuse_get_trace</h3>
          <p>Get a specific trace with its observations.</p>
          
          <h3>langfuse_list_sessions</h3>
          <p>List sessions that group related traces together.</p>
          
          <h3>langfuse_list_observations</h3>
          <p>List observations (generations, spans, events) with filters.</p>
          
          <h3>langfuse_list_scores</h3>
          <p>List scores/evaluations with filters.</p>
        </DocsSection>
      </>
    )
  },

  'use-cases': {
    title: 'Use Cases',
    description: 'Common use cases for Shepherd MCP.',
    content: () => (
      <>
        <DocsSection id="debugging" title="Debugging Failed Runs">
          <DocsCodeBlock
            code={`> "Show me all AIOBS sessions that had errors in the last 24 hours"`}
            language="text"
          />
        </DocsSection>

        <DocsSection id="performance" title="Performance Analysis">
          <DocsCodeBlock
            code={`> "Compare AIOBS session abc123 with session def456 and tell me which one was more efficient"`}
            language="text"
          />
        </DocsSection>

        <DocsSection id="regression" title="Prompt Regression Detection">
          <DocsCodeBlock
            code={`> "Find Langfuse traces with failed evaluations"`}
            language="text"
          />
        </DocsSection>

        <DocsSection id="cost" title="Cost Tracking">
          <DocsCodeBlock
            code={`> "List Langfuse observations and summarize the total cost"`}
            language="text"
          />
        </DocsSection>

        <DocsSection id="inspection" title="Session Inspection">
          <DocsCodeBlock
            code={`> "Get the full trace tree for the most recent Langfuse trace and explain what happened"`}
            language="text"
          />
        </DocsSection>
      </>
    )
  }
};

