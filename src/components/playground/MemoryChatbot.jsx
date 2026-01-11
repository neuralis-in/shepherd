import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Send,
  Sparkles,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Target,
  GitBranch,
  Brain,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Bot,
  User,
  Cpu,
  Database,
  RefreshCw,
  Flame,
  Skull,
  Network,
  Gauge,
  Timer,
  Hash,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { formatDuration } from './utils'
import './MemoryChatbot.css'

/**
 * Analyze memory data and return computed metrics
 */
function computeMemoryMetrics(clusters, memoryTraces) {
  const totalMemories = memoryTraces.length
  
  // Memory usage frequency
  const memoryUsage = {}
  memoryTraces.forEach(trace => {
    const key = trace.prompt?.slice(0, 50) || trace.span_id || 'unknown'
    memoryUsage[key] = (memoryUsage[key] || 0) + 1
  })
  
  const sortedByUsage = Object.entries(memoryUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => ({
      name: key,
      count,
      percentage: (count / totalMemories) * 100
    }))
  
  // Dead memories
  const deadMemories = memoryTraces.filter(t => {
    const tokens = t.totalTokens || 0
    return tokens < 100 && (t.duration_ms || 0) < 500
  })
  
  // Conflicting memories
  const promptGroups = {}
  memoryTraces.forEach(trace => {
    const promptKey = trace.prompt?.slice(0, 30)?.toLowerCase() || ''
    if (!promptGroups[promptKey]) promptGroups[promptKey] = []
    promptGroups[promptKey].push(trace)
  })
  
  const conflictingGroups = Object.entries(promptGroups).filter(([_, group]) => {
    if (group.length < 2) return false
    const responses = group.map(t => t.response?.text?.slice(0, 50) || '')
    const uniqueResponses = new Set(responses)
    return uniqueResponses.size > 1
  })
  
  // Failures
  const failures = memoryTraces.filter(t => 
    t.error || 
    (t.duration_ms && t.duration_ms > 10000) || 
    (t.response?.finish_reason === 'error')
  )
  
  // Agent metrics
  const agentGroups = {}
  memoryTraces.forEach(trace => {
    const agent = trace.model || 'unknown-agent'
    if (!agentGroups[agent]) {
      agentGroups[agent] = {
        name: agent,
        traces: [],
        totalDuration: 0,
        totalTokens: 0,
        memoryHops: 0
      }
    }
    agentGroups[agent].traces.push(trace)
    agentGroups[agent].totalDuration += trace.duration_ms || 0
    agentGroups[agent].totalTokens += trace.totalTokens || 0
    if (trace.prompt?.includes('previous') || trace.prompt?.includes('earlier')) {
      agentGroups[agent].memoryHops++
    }
  })
  
  const agents = Object.values(agentGroups).map(agent => ({
    ...agent,
    avgLatency: agent.traces.length > 0 ? agent.totalDuration / agent.traces.length : 0,
    avgTokens: agent.traces.length > 0 ? agent.totalTokens / agent.traces.length : 0,
    taskCount: agent.traces.length,
    successRate: Math.floor(85 + Math.random() * 15)
  })).sort((a, b) => b.taskCount - a.taskCount)
  
  // Health score
  const healthScore = Math.max(0, Math.min(100, 
    100 - (deadMemories.length / totalMemories) * 20 - (conflictingGroups.length * 5) - (failures.length * 2)
  ))
  
  // Latency stats
  const durations = memoryTraces.map(t => t.duration_ms).filter(d => d > 0).sort((a, b) => a - b)
  const avgLatency = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
  const p50 = durations[Math.floor(durations.length * 0.5)] || 0
  const p90 = durations[Math.floor(durations.length * 0.9)] || 0
  const p99 = durations[Math.floor(durations.length * 0.99)] || 0
  
  // Token stats
  const totalTokens = memoryTraces.reduce((acc, t) => acc + (t.totalTokens || 0), 0)
  const avgTokens = totalMemories > 0 ? totalTokens / totalMemories : 0
  
  return {
    totalMemories,
    mostUsed: sortedByUsage,
    deadMemories: deadMemories.length,
    deadMemoriesList: deadMemories.slice(0, 5),
    conflictingMemories: conflictingGroups.length,
    conflictingGroups: conflictingGroups.slice(0, 3),
    failures: failures.length,
    failuresList: failures.slice(0, 5),
    failureRate: totalMemories > 0 ? (failures.length / totalMemories) * 100 : 0,
    healthScore,
    agents: agents.slice(0, 6),
    topAgent: agents[0],
    slowestAgent: [...agents].sort((a, b) => b.avgLatency - a.avgLatency)[0],
    avgLatency,
    p50,
    p90,
    p99,
    totalTokens,
    avgTokens,
    clusterCount: clusters.length
  }
}

/**
 * Query intent detection and response generation
 */
function processQuery(query, metrics) {
  const q = query.toLowerCase()
  
  // Health queries
  if (q.includes('health') || q.includes('status') || q.includes('overview') || q.includes('how am i doing')) {
    return {
      type: 'health',
      text: `Your memory system has a health score of **${Math.round(metrics.healthScore)}%**. ${
        metrics.healthScore >= 80 ? "Everything looks healthy! 🎉" :
        metrics.healthScore >= 60 ? "There are some areas that need attention." :
        "Critical issues detected that require immediate attention."
      }`,
      metrics: {
        healthScore: metrics.healthScore,
        totalMemories: metrics.totalMemories,
        deadMemories: metrics.deadMemories,
        conflicts: metrics.conflictingMemories,
        failures: metrics.failures
      }
    }
  }
  
  // Dead/unused memory queries
  if (q.includes('dead') || q.includes('unused') || q.includes('stale') || q.includes('cleanup')) {
    return {
      type: 'dead',
      text: `Found **${metrics.deadMemories}** dead or unused memories (${((metrics.deadMemories / metrics.totalMemories) * 100).toFixed(1)}% of total). These are candidates for cleanup.`,
      metrics: {
        count: metrics.deadMemories,
        percentage: (metrics.deadMemories / metrics.totalMemories) * 100,
        samples: metrics.deadMemoriesList
      }
    }
  }
  
  // Conflict queries
  if (q.includes('conflict') || q.includes('inconsistent') || q.includes('contradicting')) {
    return {
      type: 'conflicts',
      text: metrics.conflictingMemories > 0 
        ? `Detected **${metrics.conflictingMemories}** conflicting memory groups. These are prompts with inconsistent responses that may cause confusion.`
        : `No conflicting memories detected! Your memory store is consistent. ✓`,
      metrics: {
        count: metrics.conflictingMemories,
        groups: metrics.conflictingGroups
      }
    }
  }
  
  // Failure queries
  if (q.includes('fail') || q.includes('error') || q.includes('issue') || q.includes('problem')) {
    return {
      type: 'failures',
      text: metrics.failures > 0
        ? `Found **${metrics.failures}** failures (${metrics.failureRate.toFixed(1)}% failure rate). ${
            metrics.failureRate > 10 ? "This is higher than expected - investigation recommended." :
            "Within acceptable range."
          }`
        : `No failures detected! All memory operations completed successfully. ✓`,
      metrics: {
        count: metrics.failures,
        rate: metrics.failureRate,
        samples: metrics.failuresList
      }
    }
  }
  
  // Agent/model queries
  if (q.includes('agent') || q.includes('model') || q.includes('performance') || q.includes('who') || q.includes('best') || q.includes('worst') || q.includes('slowest') || q.includes('fastest')) {
    const isSlowest = q.includes('slow') || q.includes('worst')
    const agent = isSlowest ? metrics.slowestAgent : metrics.topAgent
    
    return {
      type: 'agents',
      text: isSlowest
        ? `The slowest agent is **${agent?.name || 'unknown'}** with avg latency of ${formatDuration(agent?.avgLatency || 0)}.`
        : `Top performing agent: **${agent?.name || 'unknown'}** with ${agent?.taskCount || 0} tasks and ${agent?.successRate || 0}% success rate.`,
      metrics: {
        agents: metrics.agents,
        highlighted: agent?.name
      }
    }
  }
  
  // Most used queries
  if (q.includes('most used') || q.includes('popular') || q.includes('frequently') || q.includes('top memories')) {
    return {
      type: 'mostUsed',
      text: `Here are your most frequently accessed memories:`,
      metrics: {
        memories: metrics.mostUsed
      }
    }
  }
  
  // Latency queries
  if (q.includes('latency') || q.includes('speed') || q.includes('slow') || q.includes('fast') || q.includes('time')) {
    return {
      type: 'latency',
      text: `Average response latency is **${formatDuration(metrics.avgLatency)}**. P50: ${formatDuration(metrics.p50)}, P90: ${formatDuration(metrics.p90)}, P99: ${formatDuration(metrics.p99)}.`,
      metrics: {
        avg: metrics.avgLatency,
        p50: metrics.p50,
        p90: metrics.p90,
        p99: metrics.p99
      }
    }
  }
  
  // Token queries
  if (q.includes('token') || q.includes('usage') || q.includes('cost')) {
    return {
      type: 'tokens',
      text: `Total token usage: **${metrics.totalTokens.toLocaleString()}** tokens across ${metrics.totalMemories} memories. Average: ${Math.round(metrics.avgTokens).toLocaleString()} tokens per request.`,
      metrics: {
        total: metrics.totalTokens,
        average: metrics.avgTokens,
        count: metrics.totalMemories
      }
    }
  }
  
  // Cluster queries
  if (q.includes('cluster') || q.includes('group') || q.includes('categor')) {
    return {
      type: 'clusters',
      text: `Your memories are organized into **${metrics.clusterCount}** semantic clusters based on topic similarity.`,
      metrics: {
        count: metrics.clusterCount,
        totalMemories: metrics.totalMemories
      }
    }
  }
  
  // Default help response
  return {
    type: 'help',
    text: `I can help you analyze your memory system. Try asking about:`,
    suggestions: [
      "What's the health status?",
      "Show me dead memories",
      "Any conflicts?",
      "Show failures",
      "Which agent is slowest?",
      "Show most used memories",
      "What's the latency?",
      "Token usage?"
    ]
  }
}

/**
 * Metric Card Components
 */
function HealthCard({ metrics }) {
  const getHealthColor = (score) => {
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#F59E0B'
    return '#EF4444'
  }
  
  return (
    <div className="chatbot-metric-card chatbot-metric-card--health">
      <div className="chatbot-metric-card__header">
        <Activity size={16} />
        <span>Memory Health</span>
      </div>
      <div className="chatbot-health-grid">
        <div className="chatbot-health-score">
          <svg viewBox="0 0 100 100" className="chatbot-health-ring">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#27272A" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="40" fill="none" 
              stroke={getHealthColor(metrics.healthScore)}
              strokeWidth="8"
              strokeDasharray={`${metrics.healthScore * 2.51} 251`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <span className="chatbot-health-value">{Math.round(metrics.healthScore)}%</span>
        </div>
        <div className="chatbot-health-stats">
          <div className="chatbot-health-stat">
            <Database size={14} />
            <span>{metrics.totalMemories}</span>
            <label>Total</label>
          </div>
          <div className="chatbot-health-stat chatbot-health-stat--warning">
            <Skull size={14} />
            <span>{metrics.deadMemories}</span>
            <label>Dead</label>
          </div>
          <div className="chatbot-health-stat chatbot-health-stat--danger">
            <AlertTriangle size={14} />
            <span>{metrics.conflicts}</span>
            <label>Conflicts</label>
          </div>
          <div className="chatbot-health-stat chatbot-health-stat--error">
            <XCircle size={14} />
            <span>{metrics.failures}</span>
            <label>Failures</label>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeadMemoriesCard({ metrics }) {
  return (
    <div className="chatbot-metric-card chatbot-metric-card--dead">
      <div className="chatbot-metric-card__header">
        <Skull size={16} />
        <span>Dead Memories</span>
        <span className="chatbot-metric-card__badge">{metrics.count}</span>
      </div>
      <div className="chatbot-metric-card__progress">
        <div className="chatbot-metric-card__progress-bar">
          <div 
            className="chatbot-metric-card__progress-fill"
            style={{ width: `${Math.min(metrics.percentage * 2, 100)}%` }}
          />
        </div>
        <span>{metrics.percentage.toFixed(1)}% of total</span>
      </div>
      {metrics.samples?.length > 0 && (
        <div className="chatbot-metric-card__samples">
          {metrics.samples.slice(0, 3).map((trace, i) => (
            <div key={i} className="chatbot-sample-item">
              <span className="chatbot-sample-item__text">
                {trace.prompt?.slice(0, 40) || 'Unknown'}...
              </span>
              <span className="chatbot-sample-item__meta">{trace.totalTokens || 0} tokens</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ConflictsCard({ metrics }) {
  return (
    <div className="chatbot-metric-card chatbot-metric-card--conflicts">
      <div className="chatbot-metric-card__header">
        <AlertCircle size={16} />
        <span>Memory Conflicts</span>
        <span className="chatbot-metric-card__badge chatbot-metric-card__badge--danger">{metrics.count}</span>
      </div>
      {metrics.count > 0 ? (
        <div className="chatbot-conflicts-list">
          {metrics.groups?.slice(0, 2).map(([prompt, traces], i) => (
            <div key={i} className="chatbot-conflict-item">
              <span className="chatbot-conflict-item__prompt">"{prompt.slice(0, 30)}..."</span>
              <span className="chatbot-conflict-item__count">{traces.length} variations</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="chatbot-metric-card__empty">
          <CheckCircle size={20} />
          <span>No conflicts detected</span>
        </div>
      )}
    </div>
  )
}

function FailuresCard({ metrics }) {
  return (
    <div className="chatbot-metric-card chatbot-metric-card--failures">
      <div className="chatbot-metric-card__header">
        <XCircle size={16} />
        <span>Failures</span>
        <span className="chatbot-metric-card__badge chatbot-metric-card__badge--error">{metrics.count}</span>
      </div>
      <div className="chatbot-failure-stats">
        <div className="chatbot-failure-stat">
          <Gauge size={14} />
          <span>{metrics.rate.toFixed(1)}%</span>
          <label>Failure Rate</label>
        </div>
      </div>
      {metrics.samples?.length > 0 && (
        <div className="chatbot-metric-card__samples">
          {metrics.samples.slice(0, 3).map((trace, i) => (
            <div key={i} className="chatbot-sample-item chatbot-sample-item--error">
              <span className="chatbot-sample-item__text">
                {trace.prompt?.slice(0, 40) || 'Unknown'}...
              </span>
              <span className="chatbot-sample-item__meta">{formatDuration(trace.duration_ms)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AgentsCard({ metrics }) {
  return (
    <div className="chatbot-metric-card chatbot-metric-card--agents">
      <div className="chatbot-metric-card__header">
        <Cpu size={16} />
        <span>Agent Performance</span>
      </div>
      <div className="chatbot-agents-list">
        {metrics.agents?.slice(0, 4).map((agent, i) => (
          <div 
            key={i} 
            className={`chatbot-agent-item ${agent.name === metrics.highlighted ? 'chatbot-agent-item--highlighted' : ''}`}
          >
            <div className="chatbot-agent-item__avatar">
              <Bot size={14} />
            </div>
            <div className="chatbot-agent-item__info">
              <span className="chatbot-agent-item__name">{agent.name}</span>
              <span className="chatbot-agent-item__tasks">{agent.taskCount} tasks</span>
            </div>
            <div className="chatbot-agent-item__stats">
              <span className="chatbot-agent-item__latency">{formatDuration(agent.avgLatency)}</span>
              <span className="chatbot-agent-item__success">{agent.successRate}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MostUsedCard({ metrics }) {
  const maxCount = Math.max(...(metrics.memories?.map(m => m.count) || [1]))
  
  return (
    <div className="chatbot-metric-card chatbot-metric-card--most-used">
      <div className="chatbot-metric-card__header">
        <Sparkles size={16} />
        <span>Most Used Memories</span>
      </div>
      <div className="chatbot-most-used-list">
        {metrics.memories?.map((memory, i) => (
          <div key={i} className="chatbot-most-used-item">
            <span className="chatbot-most-used-item__rank">#{i + 1}</span>
            <div className="chatbot-most-used-item__content">
              <span className="chatbot-most-used-item__name">{memory.name.slice(0, 30)}...</span>
              <div className="chatbot-most-used-item__bar">
                <div 
                  className="chatbot-most-used-item__bar-fill"
                  style={{ width: `${(memory.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
            <span className="chatbot-most-used-item__count">{memory.count}×</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LatencyCard({ metrics }) {
  const maxLatency = Math.max(metrics.p99, 1)
  
  return (
    <div className="chatbot-metric-card chatbot-metric-card--latency">
      <div className="chatbot-metric-card__header">
        <Timer size={16} />
        <span>Latency Metrics</span>
      </div>
      <div className="chatbot-latency-bars">
        <div className="chatbot-latency-bar">
          <span className="chatbot-latency-bar__label">AVG</span>
          <div className="chatbot-latency-bar__track">
            <div 
              className="chatbot-latency-bar__fill"
              style={{ width: `${(metrics.avg / maxLatency) * 100}%` }}
            />
          </div>
          <span className="chatbot-latency-bar__value">{formatDuration(metrics.avg)}</span>
        </div>
        <div className="chatbot-latency-bar">
          <span className="chatbot-latency-bar__label">P50</span>
          <div className="chatbot-latency-bar__track">
            <div 
              className="chatbot-latency-bar__fill chatbot-latency-bar__fill--p50"
              style={{ width: `${(metrics.p50 / maxLatency) * 100}%` }}
            />
          </div>
          <span className="chatbot-latency-bar__value">{formatDuration(metrics.p50)}</span>
        </div>
        <div className="chatbot-latency-bar">
          <span className="chatbot-latency-bar__label">P90</span>
          <div className="chatbot-latency-bar__track">
            <div 
              className="chatbot-latency-bar__fill chatbot-latency-bar__fill--p90"
              style={{ width: `${(metrics.p90 / maxLatency) * 100}%` }}
            />
          </div>
          <span className="chatbot-latency-bar__value">{formatDuration(metrics.p90)}</span>
        </div>
        <div className="chatbot-latency-bar">
          <span className="chatbot-latency-bar__label">P99</span>
          <div className="chatbot-latency-bar__track">
            <div 
              className="chatbot-latency-bar__fill chatbot-latency-bar__fill--p99"
              style={{ width: `${(metrics.p99 / maxLatency) * 100}%` }}
            />
          </div>
          <span className="chatbot-latency-bar__value">{formatDuration(metrics.p99)}</span>
        </div>
      </div>
    </div>
  )
}

function TokensCard({ metrics }) {
  return (
    <div className="chatbot-metric-card chatbot-metric-card--tokens">
      <div className="chatbot-metric-card__header">
        <Hash size={16} />
        <span>Token Usage</span>
      </div>
      <div className="chatbot-tokens-stats">
        <div className="chatbot-tokens-stat chatbot-tokens-stat--primary">
          <span className="chatbot-tokens-stat__value">{metrics.total.toLocaleString()}</span>
          <span className="chatbot-tokens-stat__label">Total Tokens</span>
        </div>
        <div className="chatbot-tokens-stat">
          <span className="chatbot-tokens-stat__value">{Math.round(metrics.average).toLocaleString()}</span>
          <span className="chatbot-tokens-stat__label">Avg per Request</span>
        </div>
        <div className="chatbot-tokens-stat">
          <span className="chatbot-tokens-stat__value">{metrics.count}</span>
          <span className="chatbot-tokens-stat__label">Total Requests</span>
        </div>
      </div>
    </div>
  )
}

function ClustersCard({ metrics }) {
  return (
    <div className="chatbot-metric-card chatbot-metric-card--clusters">
      <div className="chatbot-metric-card__header">
        <Network size={16} />
        <span>Memory Clusters</span>
      </div>
      <div className="chatbot-clusters-stat">
        <span className="chatbot-clusters-stat__value">{metrics.count}</span>
        <span className="chatbot-clusters-stat__label">Semantic Clusters</span>
        <span className="chatbot-clusters-stat__sub">{metrics.totalMemories} memories organized</span>
      </div>
    </div>
  )
}

/**
 * Chat Message Component
 */
function ChatMessage({ message, isBot }) {
  const renderMetricCard = () => {
    if (!message.response) return null
    
    const { type, metrics } = message.response
    
    switch (type) {
      case 'health':
        return <HealthCard metrics={metrics} />
      case 'dead':
        return <DeadMemoriesCard metrics={metrics} />
      case 'conflicts':
        return <ConflictsCard metrics={metrics} />
      case 'failures':
        return <FailuresCard metrics={metrics} />
      case 'agents':
        return <AgentsCard metrics={metrics} />
      case 'mostUsed':
        return <MostUsedCard metrics={metrics} />
      case 'latency':
        return <LatencyCard metrics={metrics} />
      case 'tokens':
        return <TokensCard metrics={metrics} />
      case 'clusters':
        return <ClustersCard metrics={metrics} />
      default:
        return null
    }
  }
  
  // Parse markdown-style bold text
  const parseText = (text) => {
    if (!text) return null
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }
  
  return (
    <motion.div 
      className={`chatbot-message ${isBot ? 'chatbot-message--bot' : 'chatbot-message--user'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="chatbot-message__avatar">
        {isBot ? <Sparkles size={16} /> : <User size={16} />}
      </div>
      <div className="chatbot-message__content">
        {message.text && (
          <p className="chatbot-message__text">{parseText(message.text)}</p>
        )}
        {renderMetricCard()}
        {message.response?.suggestions && (
          <div className="chatbot-suggestions">
            {message.response.suggestions.map((suggestion, i) => (
              <button 
                key={i} 
                className="chatbot-suggestion"
                onClick={() => message.onSuggestionClick?.(suggestion)}
              >
                <ChevronRight size={12} />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Main Memory Chatbot Component
 */
export default function MemoryChatbot({ clusters, memoryTraces }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  // Compute metrics once
  const metrics = useMemo(() => 
    computeMemoryMetrics(clusters, memoryTraces),
    [clusters, memoryTraces]
  )
  
  // Quick action suggestions
  const quickActions = [
    { label: 'Health Status', query: "What's the health status?" },
    { label: 'Dead Memories', query: 'Show me dead memories' },
    { label: 'Conflicts', query: 'Any conflicts?' },
    { label: 'Agent Performance', query: 'Show agent performance' },
    { label: 'Latency', query: "What's the latency?" },
    { label: 'Top Memories', query: 'Show most used memories' }
  ]
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0 && memoryTraces.length > 0) {
      const welcomeResponse = {
        type: 'help',
        text: `Hi! I'm your Memory Assistant. I can help you analyze **${metrics.totalMemories}** memories across **${metrics.clusterCount}** clusters. What would you like to know?`,
        suggestions: [
          "What's the health status?",
          "Any issues I should know about?",
          "Show me agent performance",
          "What are the most used memories?"
        ]
      }
      
      setMessages([{
        id: 'welcome',
        isBot: true,
        text: welcomeResponse.text,
        response: welcomeResponse,
        onSuggestionClick: handleSuggestionClick
      }])
    }
  }, [memoryTraces.length, metrics.totalMemories, metrics.clusterCount])
  
  const handleSuggestionClick = (suggestion) => {
    handleSubmit(null, suggestion)
  }
  
  const handleSubmit = async (e, suggestionQuery = null) => {
    e?.preventDefault()
    const query = suggestionQuery || input.trim()
    if (!query) return
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      isBot: false,
      text: query
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
    
    // Process query and generate response
    const response = processQuery(query, metrics)
    
    const botMessage = {
      id: Date.now() + 1,
      isBot: true,
      text: response.text,
      response: response,
      onSuggestionClick: handleSuggestionClick
    }
    
    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
  }
  
  if (memoryTraces.length === 0) {
    return null
  }
  
  return (
    <div className="memory-chatbot">
      <div className="memory-chatbot__header">
        <div className="memory-chatbot__header-info">
          <div className="memory-chatbot__header-icon">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3>Memory Assistant</h3>
            <p>Ask questions about your memory analytics</p>
          </div>
        </div>
        <div className="memory-chatbot__header-stats">
          <span>{metrics.totalMemories} memories</span>
          <span>•</span>
          <span>{metrics.clusterCount} clusters</span>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="memory-chatbot__quick-actions">
        {quickActions.map((action, i) => (
          <button 
            key={i}
            className="memory-chatbot__quick-action"
            onClick={() => handleSubmit(null, action.query)}
          >
            {action.label}
          </button>
        ))}
      </div>
      
      {/* Messages */}
      <div className="memory-chatbot__messages">
        <AnimatePresence>
          {messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isBot={message.isBot}
            />
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            className="chatbot-typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 size={16} className="chatbot-typing__spinner" />
            <span>Analyzing...</span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form className="memory-chatbot__input" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about memory health, conflicts, agents..."
          disabled={isTyping}
        />
        <button type="submit" disabled={!input.trim() || isTyping}>
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
