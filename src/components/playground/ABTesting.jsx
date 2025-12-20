import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCompare,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  CheckCircle,
  FlaskConical,
  Tag,
  Search,
  RotateCcw,
  Loader2,
  AlertCircle,
  Clock,
  DollarSign,
  Zap,
  Target,
  Brain,
  MessageSquare,
  Code2,
  Activity,
  X,
  Layers,
  Info,
  ArrowRight,
  Cpu,
  Terminal,
  FileText
} from 'lucide-react';
import './ABTesting.css';
import { formatDuration } from './utils';

// Model pricing (per 1M tokens)
const MODEL_PRICING = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4': { input: 30.00, output: 60.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'claude-3': { input: 3.00, output: 15.00 },
  'gemini': { input: 0.50, output: 1.50 },
  'default': { input: 1.00, output: 3.00 }
};

// Calculate cost from tokens
function calculateCost(model, inputTokens, outputTokens) {
  const pricing = Object.entries(MODEL_PRICING).find(([key]) => 
    model?.toLowerCase().includes(key)
  )?.[1] || MODEL_PRICING.default;
  
  return ((inputTokens / 1_000_000) * pricing.input) + ((outputTokens / 1_000_000) * pricing.output);
}

// Compute metrics from prompt groups
function computeMetrics(groups, selectedGroupSignatures) {
  const selectedGroups = groups.filter(g => selectedGroupSignatures.has(g.signature));
  
  // Pipeline A metrics
  const pipelineA = {
    totalCalls: 0,
    totalLatency: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
    latencies: [],
    piiPassed: 0,
    piiTotal: 0,
    hallucinationPassed: 0,
    hallucinationTotal: 0,
  };

  // Pipeline B metrics
  const pipelineB = {
    totalCalls: 0,
    totalLatency: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
    latencies: [],
    piiPassed: 0,
    piiTotal: 0,
    hallucinationPassed: 0,
    hallucinationTotal: 0,
  };

  selectedGroups.forEach(group => {
    // Process Pipeline A instances
    group.pipelineA.forEach(instance => {
      pipelineA.totalCalls++;
      pipelineA.totalLatency += instance.duration || 0;
      pipelineA.latencies.push(instance.duration || 0);
      pipelineA.totalInputTokens += instance.inputTokens || 0;
      pipelineA.totalOutputTokens += instance.outputTokens || 0;
      pipelineA.totalCost += calculateCost(instance.model, instance.inputTokens || 0, instance.outputTokens || 0);
      
      // Check evaluations
      if (instance.evaluations) {
        instance.evaluations.forEach(ev => {
          if (ev.eval_type === 'pii_detection') {
            pipelineA.piiTotal++;
            if (ev.passed) pipelineA.piiPassed++;
          }
          if (ev.eval_type === 'hallucination_detection') {
            pipelineA.hallucinationTotal++;
            if (ev.passed) pipelineA.hallucinationPassed++;
          }
        });
      }
    });

    // Process Pipeline B instances
    group.pipelineB.forEach(instance => {
      pipelineB.totalCalls++;
      pipelineB.totalLatency += instance.duration || 0;
      pipelineB.latencies.push(instance.duration || 0);
      pipelineB.totalInputTokens += instance.inputTokens || 0;
      pipelineB.totalOutputTokens += instance.outputTokens || 0;
      pipelineB.totalCost += calculateCost(instance.model, instance.inputTokens || 0, instance.outputTokens || 0);
      
      if (instance.evaluations) {
        instance.evaluations.forEach(ev => {
          if (ev.eval_type === 'pii_detection') {
            pipelineB.piiTotal++;
            if (ev.passed) pipelineB.piiPassed++;
          }
          if (ev.eval_type === 'hallucination_detection') {
            pipelineB.hallucinationTotal++;
            if (ev.passed) pipelineB.hallucinationPassed++;
          }
        });
      }
    });
  });

  // Calculate averages and percentiles
  const calcPercentile = (arr, p) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)];
  };

  return {
    pipelineA: {
      ...pipelineA,
      avgLatency: pipelineA.totalCalls > 0 ? pipelineA.totalLatency / pipelineA.totalCalls : 0,
      p50Latency: calcPercentile(pipelineA.latencies, 50),
      p95Latency: calcPercentile(pipelineA.latencies, 95),
      p99Latency: calcPercentile(pipelineA.latencies, 99),
      piiScore: pipelineA.piiTotal > 0 ? (pipelineA.piiPassed / pipelineA.piiTotal) * 100 : null,
      hallucinationScore: pipelineA.hallucinationTotal > 0 ? (pipelineA.hallucinationPassed / pipelineA.hallucinationTotal) * 100 : null,
    },
    pipelineB: {
      ...pipelineB,
      avgLatency: pipelineB.totalCalls > 0 ? pipelineB.totalLatency / pipelineB.totalCalls : 0,
      p50Latency: calcPercentile(pipelineB.latencies, 50),
      p95Latency: calcPercentile(pipelineB.latencies, 95),
      p99Latency: calcPercentile(pipelineB.latencies, 99),
      piiScore: pipelineB.piiTotal > 0 ? (pipelineB.piiPassed / pipelineB.piiTotal) * 100 : null,
      hallucinationScore: pipelineB.hallucinationTotal > 0 ? (pipelineB.hallucinationPassed / pipelineB.hallucinationTotal) * 100 : null,
    }
  };
}

// Metrics that can be computed from existing trace data
const COMPUTABLE_METRICS = [
  { id: 'latency', label: 'Latency', icon: <Clock size={18} />, desc: 'Response time (duration_ms)', computable: true },
  { id: 'cost', label: 'Cost', icon: <DollarSign size={18} />, desc: 'Estimated API cost from tokens', computable: true },
  { id: 'tokens', label: 'Token Usage', icon: <Zap size={18} />, desc: 'Input/output token breakdown', computable: true },
  { id: 'pii_detection', label: 'PII Detection', icon: <Target size={18} />, desc: 'From existing evaluations', computable: true },
  { id: 'hallucination', label: 'Hallucination', icon: <AlertCircle size={18} />, desc: 'From existing evaluations', computable: true },
];

// Metrics that require additional LLM evaluation (future)
const FUTURE_METRICS = [
  { id: 'accuracy', label: 'Accuracy', icon: <Target size={18} />, desc: 'Output correctness', computable: false },
  { id: 'quality', label: 'Quality Score', icon: <Brain size={18} />, desc: 'Overall response quality', computable: false },
  { id: 'relevance', label: 'Relevance', icon: <MessageSquare size={18} />, desc: 'Prompt relevance score', computable: false },
  { id: 'code_quality', label: 'Code Quality', icon: <Code2 size={18} />, desc: 'Generated code analysis', computable: false },
];

// Create a unique signature for grouping LLM calls
function createPromptSignature(trace) {
  return `${trace.provider || ''}|${trace.api || ''}|${trace.request?.model || ''}`;
}

// Extract prompt details from a trace
function getPromptDetails(trace) {
  let systemPrompt = '';
  let userPrompt = '';
  
  if (trace.request?.messages) {
    const sysMsg = trace.request.messages.find(m => m.role === 'system');
    const userMsg = trace.request.messages.find(m => m.role === 'user');
    systemPrompt = sysMsg?.content || '';
    userPrompt = userMsg?.content || '';
  } else if (trace.request?.config?.system_instruction) {
    systemPrompt = trace.request.config.system_instruction;
  }
  if (trace.request?.contents) {
    if (typeof trace.request.contents === 'string') {
      userPrompt = trace.request.contents;
    } else if (Array.isArray(trace.request.contents)) {
      userPrompt = trace.request.contents.map(c => c.parts?.map(p => p.text).join(' ') || '').join(' ');
    } else {
      userPrompt = JSON.stringify(trace.request.contents);
    }
  }
  
  return {
    provider: trace.provider,
    api: trace.api,
    model: trace.request?.model || trace.response?.model || 'unknown',
    systemPrompt,
    userPrompt,
    output: trace.response?.text || '',
    duration: trace.duration_ms || 0,
    tokens: trace.response?.usage?.total_tokens || trace.response?.usage?.total_token_count || 0,
    inputTokens: trace.response?.usage?.prompt_tokens || trace.response?.usage?.prompt_token_count || 0,
    outputTokens: trace.response?.usage?.completion_tokens || trace.response?.usage?.candidates_token_count || 0,
  };
}

// Extract all LLM events from session data
function extractLLMEventsFromSession(sessionData, sessionName = null) {
  const events = [];
  
  // Process trace_tree recursively
  const processTraceTree = (traces) => {
    if (!traces) return;
    traces.forEach(trace => {
      // Only include LLM calls (not function calls)
      if (trace.provider && trace.provider !== 'function' && trace.api !== 'embeddings.create') {
        events.push({
          ...trace,
          ...getPromptDetails(trace),
          signature: createPromptSignature(trace),
          sessionName
        });
      }
      if (trace.children && trace.children.length > 0) {
        processTraceTree(trace.children);
      }
    });
  };
  
  if (sessionData?.trace_tree) {
    processTraceTree(sessionData.trace_tree);
  }
  
  // Also check events array
  if (sessionData?.events) {
    sessionData.events.forEach(event => {
      if (event.provider && event.provider !== 'function' && event.api !== 'embeddings.create') {
        events.push({
          ...event,
          ...getPromptDetails(event),
          signature: createPromptSignature(event),
          sessionName
        });
      }
    });
  }
  
  return events;
}

// Label Filter Component
function LabelFilter({ label, values, selectedValues, onToggle, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection = selectedValues && selectedValues.length > 0;

  return (
    <div className="ab-label-filter" ref={dropdownRef}>
      <button
        className={`ab-label-filter__trigger ${hasSelection ? 'ab-label-filter__trigger--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Tag size={12} />
        <span className="ab-label-filter__name">{label}</span>
        {hasSelection && (
          <span className="ab-label-filter__selected">{selectedValues.length}</span>
        )}
        <ChevronDown
          size={12}
          className={`ab-label-filter__chevron ${isOpen ? 'ab-label-filter__chevron--open' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="ab-label-dropdown">
          <div className="ab-label-dropdown__header">
            <span>{label}</span>
            {hasSelection && (
              <button className="ab-label-dropdown__clear" onClick={() => { onClear(label); setIsOpen(false); }}>
                Clear
              </button>
            )}
          </div>
          <div className="ab-label-dropdown__options">
            {values.map(value => {
              const isSelected = selectedValues?.includes(value);
              return (
                <button
                  key={value}
                  className={`ab-label-option ${isSelected ? 'ab-label-option--selected' : ''}`}
                  onClick={() => onToggle(label, value)}
                >
                  <span className="ab-label-option__checkbox">
                    {isSelected && <Check size={10} />}
                  </span>
                  <span className="ab-label-option__text">{value}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Pipeline Selector Component
function PipelineSelector({ title, badge, sessions, filters, onFilterChange, allLabels }) {
  const matchingCount = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return sessions.length;
    }
    return sessions.filter(session => {
      const sessionLabels = session.data?.sessions?.[0]?.labels || {};
      for (const [key, values] of Object.entries(filters)) {
        const sessionValue = String(sessionLabels[key] || '');
        if (!values.includes(sessionValue)) {
          return false;
        }
      }
      return true;
    }).length;
  }, [sessions, filters]);

  const handleToggle = useCallback((label, value) => {
    const currentValues = filters[label] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    const newFilters = { ...filters };
    if (newValues.length === 0) {
      delete newFilters[label];
    } else {
      newFilters[label] = newValues;
    }
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handleClear = useCallback((label) => {
    const newFilters = { ...filters };
    delete newFilters[label];
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handleClearAll = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className={`ab-pipeline-selector ${hasFilters ? 'ab-pipeline-selector--active' : ''}`}>
      <div className="ab-pipeline-selector__header">
        <div className="ab-pipeline-selector__title">
          <span className="ab-pipeline-selector__badge">{badge}</span>
          <span className="ab-pipeline-selector__count">
            {title} · {matchingCount} sessions
          </span>
        </div>
        {hasFilters && (
          <button className="ab-pipeline-selector__clear" onClick={handleClearAll}>
            <X size={12} />
            Clear
          </button>
        )}
      </div>
      
      <div className="ab-pipeline-selector__labels">
        {Object.entries(allLabels).map(([label, values]) => (
          <LabelFilter
            key={label}
            label={label}
            values={values}
            selectedValues={filters[label] || []}
            onToggle={handleToggle}
            onClear={handleClear}
          />
        ))}
      </div>

      {hasFilters && (
        <div className="ab-pipeline-selector__summary">
          {Object.entries(filters).map(([key, values]) =>
            values.map(value => (
              <span key={`${key}-${value}`} className="ab-label-chip">
                {key}: {value}
                <button onClick={() => handleToggle(key, value)}>
                  <X size={10} />
                </button>
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Format helpers
const formatMs = (val) => val >= 1000 ? `${(val / 1000).toFixed(2)}s` : `${val.toFixed(0)}ms`;
const formatCost = (val) => val >= 1 ? `$${val.toFixed(2)}` : `$${val.toFixed(4)}`;
const formatTokens = (val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toLocaleString();
const formatPercent = (val) => `${val.toFixed(1)}%`;


// Circular Progress for percentages
function CircularScore({ value, pipelineLabel, colorClass }) {
  const circumference = 2 * Math.PI * 36; // radius 36
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className={`ab-circle-score ${colorClass}`}>
      <svg viewBox="0 0 80 80" className="ab-circle-score__svg">
        <circle cx="40" cy="40" r="36" className="ab-circle-score__track" />
        <circle 
          cx="40" cy="40" r="36" 
          className="ab-circle-score__fill"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="ab-circle-score__content">
        <span className="ab-circle-score__value">{value.toFixed(0)}%</span>
        <span className="ab-circle-score__label">{pipelineLabel}</span>
      </div>
    </div>
  );
}

// Winner Badge
function WinnerBadge({ winner, metric }) {
  if (!winner) return null;
  return (
    <div className={`ab-winner-badge ab-winner-badge--${winner.toLowerCase()}`}>
      <CheckCircle size={12} />
      <span>{winner} wins on {metric}</span>
    </div>
  );
}

// Stat Comparison Row
function StatRow({ label, valueA, valueB, format = 'number', higherIsBetter = false, showDiff = true }) {
  const formatValue = (val) => {
    if (format === 'ms') return formatMs(val);
    if (format === 'cost') return formatCost(val);
    if (format === 'tokens') return formatTokens(val);
    if (format === 'percent') return formatPercent(val);
    return val.toFixed(2);
  };

  const aIsBetter = higherIsBetter ? valueA > valueB : valueA < valueB;
  const bIsBetter = higherIsBetter ? valueB > valueA : valueB < valueA;
  
  // Calculate diff
  const diff = valueA > 0 ? ((valueB - valueA) / valueA) * 100 : 0;
  const isDiffGood = higherIsBetter ? diff > 0 : diff < 0;

  return (
    <div className={`ab-stat-row ${showDiff ? 'ab-stat-row--with-diff' : ''}`}>
      <span className="ab-stat-row__label">{label}</span>
      <span className={`ab-stat-row__value ab-stat-row__value--a ${aIsBetter ? 'ab-stat-row__value--winner' : ''}`}>
        {formatValue(valueA || 0)}
      </span>
      <span className={`ab-stat-row__value ab-stat-row__value--b ${bIsBetter ? 'ab-stat-row__value--winner' : ''}`}>
        {formatValue(valueB || 0)}
      </span>
      {showDiff && (
        <span className={`ab-stat-row__diff ${Math.abs(diff) < 0.5 ? '' : isDiffGood ? 'ab-stat-row__diff--good' : 'ab-stat-row__diff--bad'}`}>
          {Math.abs(diff) < 0.5 ? '—' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`}
        </span>
      )}
    </div>
  );
}

// Instance Item Component - shows a single input/output pair (matching EnhancePrompts pattern)
function InstanceItem({ instance, index }) {
  return (
    <div className="ab-instance">
      <div className="ab-instance__header">
        <span className="ab-instance__num">#{index + 1}</span>
        <span className="ab-instance__duration">{formatDuration(instance.duration)}</span>
        {instance.tokens > 0 && (
          <span className="ab-instance__tokens">{instance.tokens} tokens</span>
        )}
      </div>
      <div className="ab-instance__io">
        <div className="ab-instance__input">
          <MessageSquare size={10} />
          <span>{instance.userPrompt?.substring(0, 150) || 'N/A'}{instance.userPrompt?.length > 150 ? '...' : ''}</span>
        </div>
        <ArrowRight size={12} className="ab-instance__arrow" />
        <div className="ab-instance__output">
          <span>{instance.output?.substring(0, 150) || 'N/A'}{instance.output?.length > 150 ? '...' : ''}</span>
        </div>
      </div>
    </div>
  );
}

// Prompt Group Card - shows a group with instances from both pipelines
function PromptGroupCard({ group, isSelected, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullSystem, setShowFullSystem] = useState(false);

  const p1Stats = useMemo(() => {
    const instances = group.pipelineA;
    const totalLatency = instances.reduce((sum, i) => sum + (i.duration || 0), 0);
    const totalTokens = instances.reduce((sum, i) => sum + (i.tokens || 0), 0);
    return {
      count: instances.length,
      avgLatency: instances.length > 0 ? totalLatency / instances.length : 0,
      totalTokens
    };
  }, [group.pipelineA]);

  const p2Stats = useMemo(() => {
    const instances = group.pipelineB;
    const totalLatency = instances.reduce((sum, i) => sum + (i.duration || 0), 0);
    const totalTokens = instances.reduce((sum, i) => sum + (i.tokens || 0), 0);
    return {
      count: instances.length,
      avgLatency: instances.length > 0 ? totalLatency / instances.length : 0,
      totalTokens
    };
  }, [group.pipelineB]);

  const isSystemLong = group.systemPrompt?.length > 150;

  return (
    <div className={`ab-prompt-group ${isSelected ? 'ab-prompt-group--selected' : ''}`}>
      <div className="ab-prompt-group__header" onClick={() => onToggle(group.signature)}>
        <span className="ab-prompt-group__checkbox">
          {isSelected && <Check size={12} />}
        </span>
        
        <div className="ab-prompt-group__info">
          <div className="ab-prompt-group__title-row">
            <Cpu size={14} />
            <span className="ab-prompt-group__api">{group.api}</span>
            <span className="ab-prompt-group__model">{group.model}</span>
          </div>
          {group.systemPrompt && (
            <div className="ab-prompt-group__system-preview">
              <Terminal size={10} />
              <span>{group.systemPrompt.substring(0, 80)}{group.systemPrompt.length > 80 ? '...' : ''}</span>
            </div>
          )}
        </div>

        <div className="ab-prompt-group__stats">
          <div className="ab-prompt-group__stat ab-prompt-group__stat--a">
            <span className="ab-prompt-group__stat-label">A</span>
            <span className="ab-prompt-group__stat-value">{p1Stats.count}</span>
          </div>
          <div className="ab-prompt-group__stat ab-prompt-group__stat--b">
            <span className="ab-prompt-group__stat-label">B</span>
            <span className="ab-prompt-group__stat-value">{p2Stats.count}</span>
          </div>
        </div>

        <button
          className="ab-prompt-group__expand"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <ChevronDown
            size={14}
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
          />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="ab-prompt-group__details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* System Prompt */}
            {group.systemPrompt && (
              <div className="ab-prompt-group__system">
                <div className="ab-prompt-group__system-header">
                  <Terminal size={12} />
                  <span>System Prompt</span>
                </div>
                <div className="ab-prompt-group__system-text">
                  {showFullSystem || !isSystemLong
                    ? group.systemPrompt
                    : group.systemPrompt.substring(0, 150) + '...'}
                  {isSystemLong && (
                    <button className="ab-instance-item__toggle" onClick={() => setShowFullSystem(!showFullSystem)}>
                      {showFullSystem ? 'less' : 'more'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Stats Comparison */}
            <div className="ab-prompt-group__comparison-stats">
              <div className="ab-prompt-group__cstat">
                <span className="ab-prompt-group__cstat-label">Pipeline A Avg Latency</span>
                <span className="ab-prompt-group__cstat-value">{formatDuration(p1Stats.avgLatency)}</span>
              </div>
              <div className="ab-prompt-group__cstat">
                <span className="ab-prompt-group__cstat-label">Pipeline B Avg Latency</span>
                <span className="ab-prompt-group__cstat-value">{formatDuration(p2Stats.avgLatency)}</span>
              </div>
              <div className="ab-prompt-group__cstat">
                <span className="ab-prompt-group__cstat-label">Pipeline A Tokens</span>
                <span className="ab-prompt-group__cstat-value">{p1Stats.totalTokens.toLocaleString()}</span>
              </div>
              <div className="ab-prompt-group__cstat">
                <span className="ab-prompt-group__cstat-label">Pipeline B Tokens</span>
                <span className="ab-prompt-group__cstat-value">{p2Stats.totalTokens.toLocaleString()}</span>
              </div>
            </div>

            {/* Side by side instances */}
            <div className="ab-prompt-group__instances">
              <div className="ab-prompt-group__pipeline-col">
                <div className="ab-prompt-group__col-header">
                  <span className="ab-prompt-group__col-badge ab-prompt-group__col-badge--a">Pipeline A</span>
                  <span>{p1Stats.count} calls</span>
                </div>
                <div className="ab-prompt-group__col-list">
                  {group.pipelineA.slice(0, 5).map((instance, idx) => (
                    <InstanceItem key={idx} instance={instance} index={idx} />
                  ))}
                  {group.pipelineA.length > 5 && (
                    <div className="ab-prompt-group__more">+{group.pipelineA.length - 5} more</div>
                  )}
                  {group.pipelineA.length === 0 && (
                    <div className="ab-prompt-group__empty">No calls</div>
                  )}
                </div>
              </div>
              
              <div className="ab-prompt-group__pipeline-col">
                <div className="ab-prompt-group__col-header">
                  <span className="ab-prompt-group__col-badge ab-prompt-group__col-badge--b">Pipeline B</span>
                  <span>{p2Stats.count} calls</span>
                </div>
                <div className="ab-prompt-group__col-list">
                  {group.pipelineB.slice(0, 5).map((instance, idx) => (
                    <InstanceItem key={idx} instance={instance} index={idx} />
                  ))}
                  {group.pipelineB.length > 5 && (
                    <div className="ab-prompt-group__more">+{group.pipelineB.length - 5} more</div>
                  )}
                  {group.pipelineB.length === 0 && (
                    <div className="ab-prompt-group__empty">No calls</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ABTesting({ sessions = [] }) {
  const [step, setStep] = useState(1);
  const [pipeline1Filters, setPipeline1Filters] = useState({});
  const [pipeline2Filters, setPipeline2Filters] = useState({});
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [selectedEvals, setSelectedEvals] = useState(new Set());
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique labels from sessions (excluding system labels)
  const allLabels = useMemo(() => {
    const labels = {};
    sessions.forEach(session => {
      const sessionLabels = session.data?.sessions?.[0]?.labels || {};
      Object.entries(sessionLabels).forEach(([key, value]) => {
        if (key.startsWith('aiobs_')) return;
        if (!labels[key]) labels[key] = new Set();
        labels[key].add(String(value));
      });
    });
    return Object.fromEntries(
      Object.entries(labels)
        .map(([key, valueSet]) => [key, Array.from(valueSet).sort()])
        .sort(([a], [b]) => a.localeCompare(b))
    );
  }, [sessions]);

  // Filter sessions for Pipeline 1
  const pipeline1Sessions = useMemo(() => {
    if (Object.keys(pipeline1Filters).length === 0) return [];
    return sessions.filter(session => {
      const sessionLabels = session.data?.sessions?.[0]?.labels || {};
      for (const [key, values] of Object.entries(pipeline1Filters)) {
        if (!values.includes(String(sessionLabels[key] || ''))) return false;
      }
      return true;
    });
  }, [sessions, pipeline1Filters]);

  // Filter sessions for Pipeline 2
  const pipeline2Sessions = useMemo(() => {
    if (Object.keys(pipeline2Filters).length === 0) return [];
    return sessions.filter(session => {
      const sessionLabels = session.data?.sessions?.[0]?.labels || {};
      for (const [key, values] of Object.entries(pipeline2Filters)) {
        if (!values.includes(String(sessionLabels[key] || ''))) return false;
      }
      return true;
    });
  }, [sessions, pipeline2Filters]);

  // Extract LLM events from each pipeline and group by signature
  const { promptGroups, overlappingGroups, p1EventCount, p2EventCount } = useMemo(() => {
    // Extract all LLM events from Pipeline A
    const p1Events = [];
    pipeline1Sessions.forEach(session => {
      const events = extractLLMEventsFromSession(session.data, session.fileName);
      p1Events.push(...events);
    });

    // Extract all LLM events from Pipeline B
    const p2Events = [];
    pipeline2Sessions.forEach(session => {
      const events = extractLLMEventsFromSession(session.data, session.fileName);
      p2Events.push(...events);
    });

    // Debug logging
    console.log('[A/B Testing] Pipeline A:', { sessions: pipeline1Sessions.length, events: p1Events.length });
    console.log('[A/B Testing] Pipeline B:', { sessions: pipeline2Sessions.length, events: p2Events.length });

    // Group events by signature
    const p1Groups = new Map();
    p1Events.forEach(event => {
      if (!p1Groups.has(event.signature)) {
        p1Groups.set(event.signature, []);
      }
      p1Groups.get(event.signature).push(event);
    });

    const p2Groups = new Map();
    p2Events.forEach(event => {
      if (!p2Groups.has(event.signature)) {
        p2Groups.set(event.signature, []);
      }
      p2Groups.get(event.signature).push(event);
    });

    // Find overlapping signatures (present in both pipelines)
    const allSignatures = new Set([...p1Groups.keys(), ...p2Groups.keys()]);
    const groups = [];

    allSignatures.forEach(signature => {
      const p1Instances = p1Groups.get(signature) || [];
      const p2Instances = p2Groups.get(signature) || [];
      
      // Only include if at least one pipeline has instances
      if (p1Instances.length > 0 || p2Instances.length > 0) {
        const firstInstance = p1Instances[0] || p2Instances[0];
        groups.push({
          signature,
          api: firstInstance.api,
          model: firstInstance.model,
          provider: firstInstance.provider,
          systemPrompt: firstInstance.systemPrompt,
          pipelineA: p1Instances,
          pipelineB: p2Instances,
          isOverlapping: p1Instances.length > 0 && p2Instances.length > 0
        });
      }
    });

    // Sort by overlapping first, then by total instances
    groups.sort((a, b) => {
      if (a.isOverlapping !== b.isOverlapping) return b.isOverlapping ? 1 : -1;
      return (b.pipelineA.length + b.pipelineB.length) - (a.pipelineA.length + a.pipelineB.length);
    });

    // Filter by search query
    const filtered = groups.filter(g => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        g.api?.toLowerCase().includes(q) ||
        g.model?.toLowerCase().includes(q) ||
        g.systemPrompt?.toLowerCase().includes(q)
      );
    });

    return {
      promptGroups: filtered,
      overlappingGroups: filtered.filter(g => g.isOverlapping),
      p1EventCount: p1Events.length,
      p2EventCount: p2Events.length
    };
  }, [pipeline1Sessions, pipeline2Sessions, searchQuery]);

  // Handle group selection
  const handleGroupSelection = useCallback((signature) => {
    setSelectedGroups(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(signature)) {
        newSelection.delete(signature);
      } else {
        newSelection.add(signature);
      }
      return newSelection;
    });
  }, []);

  // Handle select all overlapping groups
  const handleSelectAllGroups = useCallback(() => {
    if (selectedGroups.size === overlappingGroups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(overlappingGroups.map(g => g.signature)));
    }
  }, [selectedGroups, overlappingGroups]);

  // Handle eval selection
  const handleEvalSelection = useCallback((evalId) => {
    setSelectedEvals(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(evalId)) {
        newSelection.delete(evalId);
      } else {
        newSelection.add(evalId);
      }
      return newSelection;
    });
  }, []);

  // Handle A/B test run
  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResults(null);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Compute real metrics from the trace data
      const metrics = computeMetrics(promptGroups, selectedGroups);
      setTestResults(metrics);
    } catch (error) {
      console.error('A/B Test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  // Reset all
  const handleReset = useCallback(() => {
    setStep(1);
    setPipeline1Filters({});
    setPipeline2Filters({});
    setSelectedGroups(new Set());
    setSelectedEvals(new Set());
    setTestResults(null);
    setSearchQuery('');
  }, []);

  const isPipeline1Selected = Object.keys(pipeline1Filters).length > 0;
  const isPipeline2Selected = Object.keys(pipeline2Filters).length > 0;
  const hasPipeline1Sessions = pipeline1Sessions.length > 0;
  const hasPipeline2Sessions = pipeline2Sessions.length > 0;
  const canProceedToStep2 = isPipeline1Selected && isPipeline2Selected && hasPipeline1Sessions && hasPipeline2Sessions;
  const canProceedToStep3 = selectedGroups.size > 0;
  const canProceedToStep4 = selectedEvals.size > 0;

  const steps = [
    { num: 1, label: 'Pipelines', desc: 'Select A & B', icon: <GitCompare size={16} /> },
    { num: 2, label: 'Prompts', desc: 'Match groups', icon: <Layers size={16} /> },
    { num: 3, label: 'Metrics', desc: 'Choose what to compare', icon: <Activity size={16} /> },
    { num: 4, label: 'Results', desc: 'Run & analyze', icon: <FlaskConical size={16} /> },
  ];

  const canGoNext = step === 1 ? canProceedToStep2 : step === 2 ? canProceedToStep3 : step === 3 ? canProceedToStep4 : false;

  return (
    <div className="ab-testing-layout">
      {/* Left Sidebar */}
      <aside className="ab-sidebar">
        <div className="ab-sidebar__header">
          <GitCompare size={20} />
          <span>A/B Testing</span>
        </div>

        {/* Vertical Steps */}
        <nav className="ab-sidebar__nav">
          {steps.map((s) => (
            <button
              key={s.num}
              className={`ab-sidebar__step ${step === s.num ? 'ab-sidebar__step--active' : ''} ${step > s.num ? 'ab-sidebar__step--completed' : ''} ${step < s.num ? 'ab-sidebar__step--disabled' : ''}`}
              onClick={() => step > s.num && setStep(s.num)}
              disabled={step < s.num}
            >
              <div className="ab-sidebar__step-icon">
                {step > s.num ? <Check size={14} /> : s.icon}
              </div>
              <div className="ab-sidebar__step-content">
                <span className="ab-sidebar__step-label">{s.label}</span>
                <span className="ab-sidebar__step-desc">{s.desc}</span>
              </div>
              {step === s.num && <ChevronRight size={14} className="ab-sidebar__step-indicator" />}
            </button>
          ))}
        </nav>

        {/* Quick Status - only show when there's data */}
        {(isPipeline1Selected || isPipeline2Selected || selectedGroups.size > 0 || selectedEvals.size > 0) && (
          <div className="ab-sidebar__status">
            {isPipeline1Selected && (
              <div className="ab-sidebar__status-item">
                <span className="ab-sidebar__status-badge ab-sidebar__status-badge--a">A</span>
                <span>{pipeline1Sessions.length}</span>
              </div>
            )}
            {isPipeline2Selected && (
              <div className="ab-sidebar__status-item">
                <span className="ab-sidebar__status-badge ab-sidebar__status-badge--b">B</span>
                <span>{pipeline2Sessions.length}</span>
              </div>
            )}
            {selectedGroups.size > 0 && (
              <div className="ab-sidebar__status-item">
                <Layers size={10} />
                <span>{selectedGroups.size}</span>
              </div>
            )}
            {selectedEvals.size > 0 && (
              <div className="ab-sidebar__status-item">
                <Activity size={10} />
                <span>{selectedEvals.size}</span>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="ab-main">
        <div className="ab-main__header">
          <h2 className="ab-main__title">{steps[step - 1].label}</h2>
          <p className="ab-main__desc">{steps[step - 1].desc}</p>
        </div>

        <div className="ab-main__content">
          <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="ab-step-content"
          >
            {Object.keys(allLabels).length === 0 ? (
              <div className="ab-groups-empty">
                <AlertCircle size={24} />
                <span>No labels found in sessions</span>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Upload sessions with labels to use A/B testing
                </p>
              </div>
            ) : (
              <>
                <div className="ab-pipelines-grid">
                  <PipelineSelector
                    title="Pipeline A"
                    badge="A"
                    sessions={sessions}
                    filters={pipeline1Filters}
                    onFilterChange={setPipeline1Filters}
                    allLabels={allLabels}
                  />
                  
                  <div className="ab-pipelines-divider">
                    <GitCompare size={20} />
                    <span>vs</span>
                  </div>
                  
                  <PipelineSelector
                    title="Pipeline B"
                    badge="B"
                    sessions={sessions}
                    filters={pipeline2Filters}
                    onFilterChange={setPipeline2Filters}
                    allLabels={allLabels}
                  />
                </div>

                {isPipeline1Selected && isPipeline2Selected && (
                  <div className={`ab-overlap-preview ${(!hasPipeline1Sessions || !hasPipeline2Sessions) ? 'ab-overlap-preview--warning' : ''}`}>
                    {hasPipeline1Sessions && hasPipeline2Sessions ? (
                      <>
                        <CheckCircle size={16} />
                        <span>
                          Pipeline A: <strong>{pipeline1Sessions.length}</strong> sessions, 
                          Pipeline B: <strong>{pipeline2Sessions.length}</strong> sessions
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} />
                        <span>
                          {!hasPipeline1Sessions && !hasPipeline2Sessions 
                            ? 'No sessions match either pipeline filters'
                            : !hasPipeline1Sessions 
                              ? 'No sessions match Pipeline A filters'
                              : 'No sessions match Pipeline B filters'
                          }
                        </span>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="ab-step-content"
          >
            {/* Pipeline Stats Summary */}
            <div className="ab-pipeline-stats">
              <div className="ab-pipeline-stat ab-pipeline-stat--a">
                <span className="ab-pipeline-stat__badge">Pipeline A</span>
                <span className="ab-pipeline-stat__value">{pipeline1Sessions.length} sessions</span>
                <span className="ab-pipeline-stat__detail">{p1EventCount} LLM calls</span>
              </div>
              <div className="ab-pipeline-stat ab-pipeline-stat--b">
                <span className="ab-pipeline-stat__badge">Pipeline B</span>
                <span className="ab-pipeline-stat__value">{pipeline2Sessions.length} sessions</span>
                <span className="ab-pipeline-stat__detail">{p2EventCount} LLM calls</span>
              </div>
            </div>

            <div className="ab-step2-info">
              <Info size={14} />
              <span>
                Prompts are grouped by their signature (API, model, system prompt). 
                Select groups that appear in both pipelines to compare.
              </span>
            </div>

            <div className="ab-groups-header">
              <div className="ab-groups-search">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search by API, model, or system prompt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="ab-groups-actions">
                <span className="ab-groups-count">
                  {selectedGroups.size} / {overlappingGroups.length} selected
                </span>
                {overlappingGroups.length > 0 && (
                  <button className="ab-groups-select-all" onClick={handleSelectAllGroups}>
                    {selectedGroups.size === overlappingGroups.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
            </div>

            {promptGroups.length > 0 ? (
              <div className="ab-groups-list">
                {overlappingGroups.length > 0 && (
                  <div className="ab-groups-section">
                    <div className="ab-groups-section__header">
                      <CheckCircle size={14} />
                      <span>Matching Prompts ({overlappingGroups.length})</span>
                    </div>
                    {overlappingGroups.map(group => (
                      <PromptGroupCard
                        key={group.signature}
                        group={group}
                        isSelected={selectedGroups.has(group.signature)}
                        onToggle={handleGroupSelection}
                      />
                    ))}
                  </div>
                )}
                
                {promptGroups.filter(g => !g.isOverlapping).length > 0 && (
                  <div className="ab-groups-section ab-groups-section--non-overlapping">
                    <div className="ab-groups-section__header">
                      <AlertCircle size={14} />
                      <span>Non-matching Prompts ({promptGroups.filter(g => !g.isOverlapping).length})</span>
                    </div>
                    <p className="ab-groups-section__desc">
                      These prompts only appear in one pipeline and cannot be compared.
                    </p>
                    {promptGroups.filter(g => !g.isOverlapping).slice(0, 3).map(group => (
                      <PromptGroupCard
                        key={group.signature}
                        group={group}
                        isSelected={false}
                        onToggle={() => {}}
                      />
                    ))}
                    {promptGroups.filter(g => !g.isOverlapping).length > 3 && (
                      <div className="ab-prompt-group__more" style={{ textAlign: 'center', padding: '0.75rem' }}>
                        +{promptGroups.filter(g => !g.isOverlapping).length - 3} more non-matching prompts
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="ab-groups-empty">
                <AlertCircle size={24} />
                <span>No LLM calls found</span>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  {p1EventCount === 0 && p2EventCount === 0 
                    ? 'Neither pipeline has any LLM calls in the selected sessions.'
                    : p1EventCount === 0
                      ? `Pipeline A has no LLM calls. Pipeline B has ${p2EventCount} calls.`
                      : `Pipeline A has ${p1EventCount} calls but Pipeline B has none.`
                  }
                </p>
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="ab-step-content"
          >
            {/* Computable Metrics */}
            <div className="ab-metrics-section">
              <div className="ab-metrics-section__header">
                <CheckCircle size={14} />
                <span>Available Metrics</span>
                <span className="ab-metrics-section__badge">From trace data</span>
                <button 
                  className="ab-metrics-section__select-all"
                  onClick={() => {
                    if (selectedEvals.size === COMPUTABLE_METRICS.length) {
                      setSelectedEvals(new Set());
                    } else {
                      setSelectedEvals(new Set(COMPUTABLE_METRICS.map(m => m.id)));
                    }
                  }}
                >
                  {selectedEvals.size === COMPUTABLE_METRICS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="ab-evals-grid">
                {COMPUTABLE_METRICS.map(metric => {
                  const isSelected = selectedEvals.has(metric.id);
                  return (
                    <button
                      key={metric.id}
                      className={`ab-eval-card ${isSelected ? 'ab-eval-card--selected' : ''}`}
                      onClick={() => handleEvalSelection(metric.id)}
                    >
                      <span className="ab-eval-card__checkbox">
                        {isSelected && <Check size={10} />}
                      </span>
                      <span className="ab-eval-card__icon">{metric.icon}</span>
                      <div className="ab-eval-card__content">
                        <span className="ab-eval-card__label">{metric.label}</span>
                        <span className="ab-eval-card__desc">{metric.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Future Metrics */}
            <div className="ab-metrics-section ab-metrics-section--future">
              <div className="ab-metrics-section__header">
                <Clock size={14} />
                <span>Coming Soon</span>
                <span className="ab-metrics-section__badge ab-metrics-section__badge--future">Requires LLM eval</span>
              </div>
              <div className="ab-evals-grid ab-evals-grid--disabled">
                {FUTURE_METRICS.map(metric => (
                  <div
                    key={metric.id}
                    className="ab-eval-card ab-eval-card--disabled"
                  >
                    <span className="ab-eval-card__icon">{metric.icon}</span>
                    <div className="ab-eval-card__content">
                      <span className="ab-eval-card__label">{metric.label}</span>
                      <span className="ab-eval-card__desc">{metric.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="ab-step-content"
          >
            {!isTesting && !testResults && (
              <>
                <div className="ab-test-summary">
                  <h4>Test Configuration</h4>
                  <div className="ab-test-summary__grid">
                    <div className="ab-test-summary__item">
                      <span className="ab-test-summary__label">Pipeline A</span>
                      <span className="ab-test-summary__value">{pipeline1Sessions.length} sessions</span>
                    </div>
                    <div className="ab-test-summary__item">
                      <span className="ab-test-summary__label">Pipeline B</span>
                      <span className="ab-test-summary__value">{pipeline2Sessions.length} sessions</span>
                    </div>
                    <div className="ab-test-summary__item">
                      <span className="ab-test-summary__label">Prompt Groups</span>
                      <span className="ab-test-summary__value">{selectedGroups.size}</span>
                    </div>
                    <div className="ab-test-summary__item">
                      <span className="ab-test-summary__label">Metrics</span>
                      <span className="ab-test-summary__value">{selectedEvals.size}</span>
                    </div>
                  </div>
                  <div className="ab-test-summary__metrics">
                    <span className="ab-test-summary__metrics-label">Selected Metrics:</span>
                    <div className="ab-test-summary__metrics-list">
                      {Array.from(selectedEvals).map(id => {
                        const metric = COMPUTABLE_METRICS.find(m => m.id === id);
                        return metric ? (
                          <span key={id} className="ab-test-summary__metric-tag">
                            {metric.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {isTesting && (
              <div className="ab-test-running">
                <Loader2 size={32} className="ab-test-running__spinner" />
                <span>Analyzing {selectedGroups.size} prompt groups...</span>
                <p>Computing metrics across {pipeline1Sessions.length + pipeline2Sessions.length} sessions</p>
              </div>
            )}

            {testResults && (
              <div className="ab-results">
                {/* Header with call counts */}
                <div className="ab-results__header">
                  <div className="ab-results__title">
                    <CheckCircle size={20} />
                    <span>Test Results</span>
                  </div>
                  <div className="ab-results__pipelines">
                    <div className="ab-results__pipeline">
                      <span className="ab-results__pipeline-label ab-results__pipeline-label--a">A</span>
                      <span className="ab-results__pipeline-count">{testResults.pipelineA.totalCalls} calls</span>
                    </div>
                    <span className="ab-results__vs">vs</span>
                    <div className="ab-results__pipeline">
                      <span className="ab-results__pipeline-label ab-results__pipeline-label--b">B</span>
                      <span className="ab-results__pipeline-count">{testResults.pipelineB.totalCalls} calls</span>
                    </div>
                  </div>
                </div>

                {/* Performance Section - Latency & Cost grouped */}
                {(selectedEvals.has('latency') || selectedEvals.has('cost')) && (
                  <div className="ab-results__section">
                    <h4 className="ab-results__section-title">
                      <Activity size={16} />
                      Performance
                    </h4>
                    <div className="ab-results__perf-grid">
                      {/* Latency bars */}
                      {selectedEvals.has('latency') && (
                        <div className="ab-results__perf-card">
                          <div className="ab-results__perf-header">
                            <Clock size={14} />
                            <span>Latency</span>
                            <WinnerBadge 
                              winner={testResults.pipelineA.avgLatency < testResults.pipelineB.avgLatency ? 'A' : testResults.pipelineB.avgLatency < testResults.pipelineA.avgLatency ? 'B' : null}
                              metric="speed"
                            />
                          </div>
                          <div className="ab-results__table">
                            <div className="ab-results__table-header">
                              <span></span>
                              <span className="ab-results__table-col-a">Pipeline A</span>
                              <span className="ab-results__table-col-b">Pipeline B</span>
                              <span>Diff</span>
                            </div>
                            <StatRow label="Average" valueA={testResults.pipelineA.avgLatency} valueB={testResults.pipelineB.avgLatency} format="ms" />
                            <StatRow label="P50 (Median)" valueA={testResults.pipelineA.p50Latency} valueB={testResults.pipelineB.p50Latency} format="ms" />
                            <StatRow label="P95" valueA={testResults.pipelineA.p95Latency} valueB={testResults.pipelineB.p95Latency} format="ms" />
                            <StatRow label="P99" valueA={testResults.pipelineA.p99Latency} valueB={testResults.pipelineB.p99Latency} format="ms" />
                          </div>
                        </div>
                      )}

                      {/* Cost comparison */}
                      {selectedEvals.has('cost') && (
                        <div className="ab-results__perf-card">
                          <div className="ab-results__perf-header">
                            <DollarSign size={14} />
                            <span>Cost</span>
                            <WinnerBadge 
                              winner={testResults.pipelineA.totalCost < testResults.pipelineB.totalCost ? 'A' : testResults.pipelineB.totalCost < testResults.pipelineA.totalCost ? 'B' : null}
                              metric="cost"
                            />
                          </div>
                          <div className="ab-results__cost-comparison">
                            <div className="ab-results__cost-item ab-results__cost-item--a">
                              <span className="ab-results__cost-label">Pipeline A</span>
                              <span className="ab-results__cost-value">{formatCost(testResults.pipelineA.totalCost)}</span>
                            </div>
                            <div className="ab-results__cost-item ab-results__cost-item--b">
                              <span className="ab-results__cost-label">Pipeline B</span>
                              <span className="ab-results__cost-value">{formatCost(testResults.pipelineB.totalCost)}</span>
                            </div>
                          </div>
                          {testResults.pipelineA.totalCost !== testResults.pipelineB.totalCost && (
                            <div className="ab-results__cost-savings">
                              {testResults.pipelineB.totalCost < testResults.pipelineA.totalCost 
                                ? `B saves ${((1 - testResults.pipelineB.totalCost / testResults.pipelineA.totalCost) * 100).toFixed(0)}%`
                                : `A saves ${((1 - testResults.pipelineA.totalCost / testResults.pipelineB.totalCost) * 100).toFixed(0)}%`
                              }
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Token Usage Section */}
                {selectedEvals.has('tokens') && (
                  <div className="ab-results__section">
                    <h4 className="ab-results__section-title">
                      <Zap size={16} />
                      Token Usage
                    </h4>
                    <div className="ab-results__tokens-table">
                      <div className="ab-results__tokens-header">
                        <span></span>
                        <span className="ab-results__tokens-col-a">Pipeline A</span>
                        <span className="ab-results__tokens-col-b">Pipeline B</span>
                      </div>
                      <StatRow 
                        label="Input" 
                        valueA={testResults.pipelineA.totalInputTokens} 
                        valueB={testResults.pipelineB.totalInputTokens} 
                        format="tokens"
                      />
                      <StatRow 
                        label="Output" 
                        valueA={testResults.pipelineA.totalOutputTokens} 
                        valueB={testResults.pipelineB.totalOutputTokens} 
                        format="tokens"
                      />
                      <div className="ab-results__tokens-total">
                        <StatRow 
                          label="Total" 
                          valueA={testResults.pipelineA.totalInputTokens + testResults.pipelineA.totalOutputTokens} 
                          valueB={testResults.pipelineB.totalInputTokens + testResults.pipelineB.totalOutputTokens} 
                          format="tokens"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Quality Section - PII & Hallucination with circular scores */}
                {(selectedEvals.has('pii_detection') || selectedEvals.has('hallucination')) && (
                  <div className="ab-results__section">
                    <h4 className="ab-results__section-title">
                      <Target size={16} />
                      Quality Scores
                    </h4>
                    <div className="ab-results__quality-grid">
                      {/* PII Detection */}
                      {selectedEvals.has('pii_detection') && (
                        <div className="ab-results__quality-card">
                          <div className="ab-results__quality-header">PII Detection Pass Rate</div>
                          {testResults.pipelineA.piiScore !== null || testResults.pipelineB.piiScore !== null ? (
                            <div className="ab-results__circles">
                              <CircularScore 
                                value={testResults.pipelineA.piiScore || 0} 
                                pipelineLabel="A"
                                colorClass="ab-circle-score--a"
                              />
                              <CircularScore 
                                value={testResults.pipelineB.piiScore || 0} 
                                pipelineLabel="B"
                                colorClass="ab-circle-score--b"
                              />
                            </div>
                          ) : (
                            <div className="ab-results__no-data">
                              <AlertCircle size={16} />
                              <span>No PII evaluations in data</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Hallucination */}
                      {selectedEvals.has('hallucination') && (
                        <div className="ab-results__quality-card">
                          <div className="ab-results__quality-header">Hallucination Pass Rate</div>
                          {testResults.pipelineA.hallucinationScore !== null || testResults.pipelineB.hallucinationScore !== null ? (
                            <div className="ab-results__circles">
                              <CircularScore 
                                value={testResults.pipelineA.hallucinationScore || 0} 
                                pipelineLabel="A"
                                colorClass="ab-circle-score--a"
                              />
                              <CircularScore 
                                value={testResults.pipelineB.hallucinationScore || 0} 
                                pipelineLabel="B"
                                colorClass="ab-circle-score--b"
                              />
                            </div>
                          ) : (
                            <div className="ab-results__no-data">
                              <AlertCircle size={16} />
                              <span>No hallucination evaluations in data</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Key Insights */}
                <div className="ab-results__insights">
                  <h4 className="ab-results__section-title">
                    <Info size={16} />
                    Key Insights
                  </h4>
                  <div className="ab-results__insight-list">
                    {selectedEvals.has('latency') && testResults.pipelineA.avgLatency !== testResults.pipelineB.avgLatency && (
                      <div className={`ab-results__insight ${testResults.pipelineB.avgLatency < testResults.pipelineA.avgLatency ? 'ab-results__insight--b' : 'ab-results__insight--a'}`}>
                        <Clock size={14} />
                        <span>
                          <strong>Pipeline {testResults.pipelineB.avgLatency < testResults.pipelineA.avgLatency ? 'B' : 'A'}</strong> is{' '}
                          <strong>
                            {testResults.pipelineB.avgLatency < testResults.pipelineA.avgLatency 
                              ? ((1 - testResults.pipelineB.avgLatency / testResults.pipelineA.avgLatency) * 100).toFixed(0)
                              : ((1 - testResults.pipelineA.avgLatency / testResults.pipelineB.avgLatency) * 100).toFixed(0)
                            }% faster
                          </strong> on average
                        </span>
                      </div>
                    )}
                    {selectedEvals.has('cost') && testResults.pipelineA.totalCost !== testResults.pipelineB.totalCost && (
                      <div className={`ab-results__insight ${testResults.pipelineB.totalCost < testResults.pipelineA.totalCost ? 'ab-results__insight--b' : 'ab-results__insight--a'}`}>
                        <DollarSign size={14} />
                        <span>
                          <strong>Pipeline {testResults.pipelineB.totalCost < testResults.pipelineA.totalCost ? 'B' : 'A'}</strong> costs{' '}
                          <strong>
                            {testResults.pipelineB.totalCost < testResults.pipelineA.totalCost 
                              ? ((1 - testResults.pipelineB.totalCost / testResults.pipelineA.totalCost) * 100).toFixed(0)
                              : ((1 - testResults.pipelineA.totalCost / testResults.pipelineB.totalCost) * 100).toFixed(0)
                            }% less
                          </strong>
                        </span>
                      </div>
                    )}
                    {selectedEvals.has('tokens') && (
                      <div className="ab-results__insight">
                        <Zap size={14} />
                        <span>
                          Total tokens: <strong>A</strong>={formatTokens(testResults.pipelineA.totalInputTokens + testResults.pipelineA.totalOutputTokens)},{' '}
                          <strong>B</strong>={formatTokens(testResults.pipelineB.totalInputTokens + testResults.pipelineB.totalOutputTokens)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="ab-bottom-nav">
        <div className="ab-bottom-nav__left">
          {step > 1 && !isTesting && !testResults && (
            <button className="ab-bottom-nav__btn ab-bottom-nav__btn--back" onClick={() => setStep(step - 1)}>
              <ChevronLeft size={14} />
              Back
            </button>
          )}
          {testResults && (
            <button className="ab-bottom-nav__btn ab-bottom-nav__btn--reset" onClick={handleReset}>
              <RotateCcw size={14} />
              New Test
            </button>
          )}
        </div>
        <div className="ab-bottom-nav__right">
          {!testResults && step < 4 && (
            <button 
              className="ab-bottom-nav__btn ab-bottom-nav__btn--next" 
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext}
            >
              {step === 3 ? 'Review & Run' : 'Continue'}
              <ChevronRight size={14} />
            </button>
          )}
          {step === 4 && !testResults && !isTesting && (
            <button 
              className="ab-bottom-nav__btn ab-bottom-nav__btn--run" 
              onClick={handleRunTest}
            >
              <FlaskConical size={16} />
              Run A/B Test
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
