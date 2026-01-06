import { DocsSection, DocsCodeBlock, DocsTable } from '../../../components/docs';

export const shepherdCliContent = {
  'installation': {
    title: 'Installation',
    description: 'Install and set up Shepherd CLI for debugging AI agents.',
    content: () => (
      <>
        <DocsSection id="install" title="Install">
          <p>Install Shepherd CLI using pip:</p>
          <DocsCodeBlock
            code={`pip install shepherd-cli`}
            language="bash"
          />
          
          <p>For enhanced shell experience (tab completion, history):</p>
          <DocsCodeBlock
            code={`pip install shepherd-cli[shell]`}
            language="bash"
          />
        </DocsSection>

        <DocsSection id="verify" title="Verify Installation">
          <p>Check that the CLI is installed correctly:</p>
          <DocsCodeBlock
            code={`shepherd --version`}
            language="bash"
          />
        </DocsSection>
      </>
    )
  },

  'configuration': {
    title: 'Configuration',
    description: 'Configure Shepherd CLI with your API credentials.',
    content: () => (
      <>
        <DocsSection id="init" title="Initialize Configuration">
          <p>Run the interactive setup:</p>
          <DocsCodeBlock
            code={`shepherd config init`}
            language="bash"
          />
          
          <p>Or set the environment variable directly:</p>
          <DocsCodeBlock
            code={`export AIOBS_API_KEY=aiobs_sk_xxxx`}
            language="bash"
          />
        </DocsSection>

        <DocsSection id="config-file" title="Configuration File">
          <p>Config file location: <code>~/.shepherd/config.toml</code></p>
          <DocsCodeBlock
            code={`[default]
provider = "aiobs"

[providers.aiobs]
api_key = "aiobs_sk_xxxx"
endpoint = "https://shepherd-api-48963996968.us-central1.run.app"

[cli]
output_format = "table"
color = true`}
            language="toml"
            filename="~/.shepherd/config.toml"
          />
        </DocsSection>

        <DocsSection id="config-commands" title="Config Commands">
          <DocsCodeBlock
            code={`shepherd config init          # Interactive setup
shepherd config show          # Show current config
shepherd config set <key> <value>
shepherd config get <key>`}
            language="bash"
          />
        </DocsSection>
      </>
    )
  },

  'commands': {
    title: 'Commands',
    description: 'Available CLI commands for managing sessions.',
    content: () => (
      <>
        <DocsSection id="sessions-list" title="List Sessions">
          <DocsCodeBlock
            code={`shepherd sessions list          # List all sessions
shepherd sessions list -n 10    # Limit to 10 sessions
shepherd sessions list -o json  # Output as JSON
shepherd sessions list --ids    # List only session IDs (for scripting)`}
            language="bash"
          />
        </DocsSection>

        <DocsSection id="sessions-get" title="Get Session Details">
          <DocsCodeBlock
            code={`shepherd sessions get <id>      # Get session details with trace tree
shepherd sessions get <id> -o json  # Output as JSON`}
            language="bash"
          />
        </DocsSection>

        <DocsSection id="sessions-search" title="Search Sessions">
          <DocsCodeBlock
            code={`# Search by query
shepherd sessions search "query"

# Filter by label
shepherd sessions search --label env=prod

# Filter by provider or model
shepherd sessions search --provider openai
shepherd sessions search --model gpt-4

# Filter by function name
shepherd sessions search --function my_func

# Filter by date
shepherd sessions search --after 2025-12-01
shepherd sessions search --before 2025-12-07

# Filter by status
shepherd sessions search --has-errors
shepherd sessions search --evals-failed

# Combine filters
shepherd sessions search --provider anthropic --label user=alice --after 2025-12-01
shepherd sessions search "agent" --model claude-3 --evals-failed -n 5`}
            language="bash"
          />
        </DocsSection>

        <DocsSection id="sessions-diff" title="Compare Sessions">
          <DocsCodeBlock
            code={`shepherd sessions diff <id1> <id2>            # Compare sessions side-by-side
shepherd sessions diff <id1> <id2> -o json    # Output diff as JSON`}
            language="bash"
          />
        </DocsSection>
      </>
    )
  },

  'shell': {
    title: 'Interactive Shell',
    description: 'Use the interactive shell for enhanced productivity.',
    content: () => (
      <>
        <DocsSection id="start-shell" title="Start the Shell">
          <DocsCodeBlock
            code={`shepherd shell`}
            language="bash"
          />
        </DocsSection>

        <DocsSection id="shell-commands" title="Shell Commands">
          <p>Inside the shell, you can run commands without the <code>shepherd</code> prefix:</p>
          <DocsCodeBlock
            code={`shepherd > sessions list
shepherd > sessions get <id>
shepherd > sessions search --provider openai
shepherd > sessions diff <id1> <id2>
shepherd > config show
shepherd > help
shepherd > exit`}
            language="text"
          />
        </DocsSection>

        <DocsSection id="shell-features" title="Shell Features">
          <ul>
            <li><strong>Tab completion</strong>: Press Tab to autocomplete commands</li>
            <li><strong>Command history</strong>: Use Up/Down arrows to navigate history (persisted)</li>
            <li><strong>Auto-suggestions</strong>: See suggestions as you type</li>
            <li><strong>Flexible syntax</strong>: Both <code>/command</code> and <code>command</code> work</li>
          </ul>
        </DocsSection>
      </>
    )
  }
};

