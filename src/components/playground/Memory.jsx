import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Layers,
  ChevronRight,
  ChevronDown,
  Clock,
  Hash,
  Sparkles,
  Search,
  X,
  Zap,
  MessageSquare,
  ArrowRight,
  Files,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react'
import { fadeInUp } from './constants'
import { formatDuration, truncateString, getPromptText, extractLLMEvents } from './utils'
import './Memory.css'

/**
 * Simple tokenizer that extracts meaningful words from text
 */
function tokenize(text) {
  if (!text || typeof text !== 'string') return []
  
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'between',
    'and', 'or', 'but', 'if', 'then', 'else', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 'just', 'also', 'now', 'here', 'there', 'this', 'that', 'these',
    'those', 'what', 'which', 'who', 'whom', 'whose', 'i', 'me', 'my', 'myself',
    'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself',
    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its',
    'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'please', 'thank',
    'thanks', 'help', 'want', 'like', 'get', 'make', 'know', 'think', 'see',
    'come', 'go', 'take', 'give', 'let', 'put', 'say', 'tell', 'ask', 'use',
    'find', 'first', 'new', 'way', 'any', 'well', 'about', 'many', 'made'
  ])
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
}

/**
 * Calculate TF (Term Frequency) for a document
 */
function calculateTF(tokens) {
  const tf = {}
  const totalTerms = tokens.length
  if (totalTerms === 0) return tf
  
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1
  })
  
  // Normalize by total terms
  Object.keys(tf).forEach(term => {
    tf[term] = tf[term] / totalTerms
  })
  
  return tf
}

/**
 * Calculate cosine similarity between two TF vectors
 */
function cosineSimilarity(tf1, tf2) {
  const allTerms = new Set([...Object.keys(tf1), ...Object.keys(tf2)])
  
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0
  
  allTerms.forEach(term => {
    const v1 = tf1[term] || 0
    const v2 = tf2[term] || 0
    dotProduct += v1 * v2
    norm1 += v1 * v1
    norm2 += v2 * v2
  })
  
  if (norm1 === 0 || norm2 === 0) return 0
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
}

/**
 * Extract key topics from a set of tokens
 */
function extractTopics(tokens, limit = 5) {
  const freq = {}
  tokens.forEach(token => {
    freq[token] = (freq[token] || 0) + 1
  })
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term]) => term)
}

/**
 * Simple k-means-like clustering
 */
function clusterTraces(traces, numClusters = 6, similarityThreshold = 0.15) {
  if (traces.length === 0) return []
  if (traces.length <= numClusters) {
    // Each trace is its own cluster
    return traces.map((trace, i) => ({
      id: `cluster-${i}`,
      name: extractTopics(trace.tokens, 2).join(' + ') || 'Uncategorized',
      topics: extractTopics(trace.tokens, 5),
      traces: [trace],
      avgDuration: trace.duration_ms || 0,
      totalTokens: trace.totalTokens || 0,
      color: getClusterColor(i)
    }))
  }
  
  // Prepare traces with TF vectors
  const tracesWithTF = traces.map(trace => ({
    ...trace,
    tf: calculateTF(trace.tokens)
  }))
  
  // Initialize clusters with diverse seeds
  const clusters = []
  const usedIndices = new Set()
  
  // Pick first seed randomly
  let seedIndex = 0
  usedIndices.add(seedIndex)
  clusters.push({
    centroid: tracesWithTF[seedIndex].tf,
    traces: []
  })
  
  // Pick remaining seeds based on maximum distance from existing centroids
  while (clusters.length < numClusters && usedIndices.size < tracesWithTF.length) {
    let maxMinDist = -1
    let nextSeedIndex = -1
    
    for (let i = 0; i < tracesWithTF.length; i++) {
      if (usedIndices.has(i)) continue
      
      // Find minimum distance to any existing centroid
      let minDist = Infinity
      clusters.forEach(cluster => {
        const dist = 1 - cosineSimilarity(tracesWithTF[i].tf, cluster.centroid)
        minDist = Math.min(minDist, dist)
      })
      
      if (minDist > maxMinDist) {
        maxMinDist = minDist
        nextSeedIndex = i
      }
    }
    
    if (nextSeedIndex >= 0) {
      usedIndices.add(nextSeedIndex)
      clusters.push({
        centroid: tracesWithTF[nextSeedIndex].tf,
        traces: []
      })
    } else {
      break
    }
  }
  
  // Assign traces to nearest cluster
  tracesWithTF.forEach(trace => {
    let maxSim = -1
    let bestCluster = 0
    
    clusters.forEach((cluster, i) => {
      const sim = cosineSimilarity(trace.tf, cluster.centroid)
      if (sim > maxSim) {
        maxSim = sim
        bestCluster = i
      }
    })
    
    // Only add if similarity is above threshold, otherwise create new cluster or add to misc
    if (maxSim >= similarityThreshold) {
      clusters[bestCluster].traces.push(trace)
    } else {
      // Try to find or create a "miscellaneous" cluster
      let miscCluster = clusters.find(c => c.isMisc)
      if (!miscCluster) {
        clusters.push({
          centroid: {},
          traces: [trace],
          isMisc: true
        })
      } else {
        miscCluster.traces.push(trace)
      }
    }
  })
  
  // Update centroids based on assigned traces (one iteration)
  clusters.forEach(cluster => {
    if (cluster.traces.length === 0) return
    
    const newCentroid = {}
    cluster.traces.forEach(trace => {
      Object.entries(trace.tf).forEach(([term, freq]) => {
        newCentroid[term] = (newCentroid[term] || 0) + freq
      })
    })
    // Normalize
    Object.keys(newCentroid).forEach(term => {
      newCentroid[term] /= cluster.traces.length
    })
    cluster.centroid = newCentroid
  })
  
  // Format clusters for display
  return clusters
    .filter(cluster => cluster.traces.length > 0)
    .map((cluster, i) => {
      const allTokens = cluster.traces.flatMap(t => t.tokens)
      const topics = extractTopics(allTokens, 5)
      const avgDuration = cluster.traces.reduce((sum, t) => sum + (t.duration_ms || 0), 0) / cluster.traces.length
      const totalTokens = cluster.traces.reduce((sum, t) => sum + (t.totalTokens || 0), 0)
      
      return {
        id: `cluster-${i}`,
        name: cluster.isMisc ? 'Miscellaneous' : (topics.slice(0, 2).join(' + ') || 'Cluster ' + (i + 1)),
        topics,
        traces: cluster.traces,
        avgDuration,
        totalTokens,
        color: getClusterColor(i),
        isMisc: cluster.isMisc
      }
    })
    .sort((a, b) => b.traces.length - a.traces.length)
}

/**
 * Get a color for a cluster based on index
 */
function getClusterColor(index) {
  const colors = [
    { bg: '#EEF2FF', border: '#C7D2FE', text: '#4F46E5', accent: '#6366F1' },
    { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669', accent: '#10B981' },
    { bg: '#FEF3C7', border: '#FDE68A', text: '#D97706', accent: '#F59E0B' },
    { bg: '#FCE7F3', border: '#FBCFE8', text: '#DB2777', accent: '#EC4899' },
    { bg: '#E0E7FF', border: '#A5B4FC', text: '#4338CA', accent: '#6366F1' },
    { bg: '#CFFAFE', border: '#67E8F9', text: '#0891B2', accent: '#06B6D4' },
    { bg: '#FEE2E2', border: '#FECACA', text: '#DC2626', accent: '#EF4444' },
    { bg: '#F3E8FF', border: '#D8B4FE', text: '#9333EA', accent: '#A855F7' }
  ]
  return colors[index % colors.length]
}

/**
 * Calculate positions for knowledge graph layout
 */
function calculateGraphLayout(clusters, width, height) {
  if (clusters.length === 0) return []
  
  const centerX = width / 2
  const centerY = height / 2
  const maxRadius = Math.min(width, height) * 0.38
  
  // Position nodes in a circular pattern with some variation
  return clusters.map((cluster, i) => {
    const totalClusters = clusters.length
    const angle = (i / totalClusters) * 2 * Math.PI - Math.PI / 2
    
    // Add some variation based on cluster size
    const sizeRatio = cluster.traces.length / Math.max(...clusters.map(c => c.traces.length))
    const radiusVariation = 0.7 + sizeRatio * 0.3
    const radius = maxRadius * radiusVariation
    
    // Slight randomization for organic feel (deterministic based on index)
    const angleOffset = (Math.sin(i * 1.5) * 0.15)
    const radiusOffset = (Math.cos(i * 2.3) * 0.1)
    
    const x = centerX + Math.cos(angle + angleOffset) * radius * (1 + radiusOffset)
    const y = centerY + Math.sin(angle + angleOffset) * radius * (1 + radiusOffset)
    
    // Node size based on trace count
    const baseSize = 50
    const maxSize = 90
    const size = baseSize + (maxSize - baseSize) * sizeRatio
    
    return { ...cluster, x, y, size }
  })
}

/**
 * Calculate edges between similar clusters
 */
function calculateEdges(clusters) {
  const edges = []
  
  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      // Calculate topic overlap
      const topics1 = new Set(clusters[i].topics)
      const topics2 = new Set(clusters[j].topics)
      const overlap = [...topics1].filter(t => topics2.has(t)).length
      
      if (overlap > 0) {
        edges.push({
          source: i,
          target: j,
          strength: overlap / Math.max(topics1.size, topics2.size)
        })
      }
    }
  }
  
  return edges
}

/**
 * Knowledge Graph Visualization Component
 */
function KnowledgeGraph({ clusters, selectedCluster, onSelectCluster }) {
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hasMoved, setHasMoved] = useState(false)
  const [hoveredNode, setHoveredNode] = useState(null)
  
  // Measure container
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: Math.max(rect.height, 450) })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  
  // Calculate layout
  const nodes = useMemo(() => 
    calculateGraphLayout(clusters, dimensions.width, dimensions.height),
    [clusters, dimensions]
  )
  
  const edges = useMemo(() => calculateEdges(clusters), [clusters])
  
  // Pan handlers - only on the SVG background, not nodes
  const handleBackgroundMouseDown = useCallback((e) => {
    // Only start drag if clicking on the background (SVG or edges)
    const target = e.target
    const isNode = target.closest('.graph-node')
    if (isNode) return
    
    setIsDragging(true)
    setHasMoved(false)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }, [pan])
  
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    setHasMoved(true)
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }, [isDragging, dragStart])
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])
  
  // Node click handler - separate from drag
  const handleNodeClick = useCallback((e, node) => {
    e.stopPropagation()
    e.preventDefault()
    onSelectCluster(node)
  }, [onSelectCluster])
  
  const handleZoomIn = (e) => {
    e.stopPropagation()
    setZoom(z => Math.min(z + 0.2, 2))
  }
  const handleZoomOut = (e) => {
    e.stopPropagation()
    setZoom(z => Math.max(z - 0.2, 0.5))
  }
  const handleReset = (e) => {
    e.stopPropagation()
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }
  
  return (
    <div 
      className="knowledge-graph"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Controls */}
      <div className="knowledge-graph__controls">
        <button onClick={handleZoomIn} title="Zoom in">
          <ZoomIn size={14} />
        </button>
        <button onClick={handleZoomOut} title="Zoom out">
          <ZoomOut size={14} />
        </button>
        <button onClick={handleReset} title="Reset view">
          <Maximize2 size={14} />
        </button>
      </div>
      
      {/* Graph SVG */}
      <svg 
        className="knowledge-graph__svg"
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleBackgroundMouseDown}
        style={{ 
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background rect to capture clicks */}
        <rect 
          x="0" 
          y="0" 
          width={dimensions.width} 
          height={dimensions.height} 
          fill="transparent"
        />
        
        {/* Edges */}
        <g className="knowledge-graph__edges">
          {edges.map((edge, i) => {
            const source = nodes[edge.source]
            const target = nodes[edge.target]
            if (!source || !target) return null
            
            const isHighlighted = 
              selectedCluster?.id === clusters[edge.source]?.id ||
              selectedCluster?.id === clusters[edge.target]?.id ||
              hoveredNode === edge.source ||
              hoveredNode === edge.target
            
            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`graph-edge ${isHighlighted ? 'graph-edge--highlighted' : ''}`}
                strokeWidth={1 + edge.strength * 2}
                strokeOpacity={isHighlighted ? 0.6 : 0.15 + edge.strength * 0.2}
              />
            )
          })}
        </g>
        
        {/* Nodes */}
        <g className="knowledge-graph__nodes">
          {nodes.map((node, i) => {
            const isSelected = selectedCluster?.id === node.id
            const isHovered = hoveredNode === i
            
            return (
              <g
                key={node.id}
                className={`graph-node ${isSelected ? 'graph-node--selected' : ''} ${isHovered ? 'graph-node--hovered' : ''}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={(e) => handleNodeClick(e, node)}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node circle */}
                <circle
                  r={node.size / 2}
                  className="graph-node__circle"
                  style={{ '--node-color': node.color.accent }}
                  filter={isSelected || isHovered ? 'url(#glow)' : undefined}
                />
                
                {/* Inner circle */}
                <circle
                  r={node.size / 2 - 3}
                  className="graph-node__inner"
                />
                
                {/* Count */}
                <text
                  className="graph-node__count"
                  textAnchor="middle"
                  dy="-0.1em"
                >
                  {node.traces.length}
                </text>
                
                {/* Label */}
                <text
                  className="graph-node__label"
                  textAnchor="middle"
                  dy="1.1em"
                >
                  traces
                </text>
                
                {/* Name (below node) */}
                <text
                  className="graph-node__name"
                  textAnchor="middle"
                  y={node.size / 2 + 16}
                >
                  {node.name.length > 15 ? node.name.slice(0, 15) + '…' : node.name}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
      
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredNode !== null && nodes[hoveredNode] && !isDragging && (
          <motion.div
            className="knowledge-graph__tooltip"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            style={{
              left: nodes[hoveredNode].x * zoom + pan.x,
              top: (nodes[hoveredNode].y - nodes[hoveredNode].size / 2 - 10) * zoom + pan.y
            }}
          >
            <div className="knowledge-graph__tooltip-header">
              <span className="knowledge-graph__tooltip-name">{nodes[hoveredNode].name}</span>
            </div>
            <div className="knowledge-graph__tooltip-stats">
              <span><Clock size={10} /> {formatDuration(nodes[hoveredNode].avgDuration)}</span>
              <span><Hash size={10} /> {nodes[hoveredNode].totalTokens.toLocaleString()} tokens</span>
            </div>
            <div className="knowledge-graph__tooltip-topics">
              {nodes[hoveredNode].topics.slice(0, 4).map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Trace item in cluster detail view
 */
function MemoryTraceItem({ trace, index }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <motion.div
      className="memory-trace-item"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div 
        className="memory-trace-item__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="memory-trace-item__index">#{index + 1}</div>
        <div className="memory-trace-item__content">
          <span className="memory-trace-item__prompt">
            {truncateString(trace.prompt, 80)}
          </span>
          <div className="memory-trace-item__meta">
            <span className="memory-trace-item__model">{trace.model}</span>
            <span className="memory-trace-item__duration">
              <Clock size={10} />
              {formatDuration(trace.duration_ms)}
            </span>
            <span className="memory-trace-item__tokens">
              <Hash size={10} />
              {trace.totalTokens?.toLocaleString() || 0} tokens
            </span>
          </div>
        </div>
        <button className="memory-trace-item__expand">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="memory-trace-item__details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="memory-trace-item__section">
              <h5>
                <MessageSquare size={12} />
                Input Request
              </h5>
              <p className="memory-trace-item__text">{trace.prompt || 'N/A'}</p>
            </div>
            {trace.response && (
              <div className="memory-trace-item__section">
                <h5>
                  <ArrowRight size={12} />
                  Output Response
                </h5>
                <p className="memory-trace-item__text memory-trace-item__text--response">
                  {trace.response?.text || (typeof trace.response === 'string' ? trace.response : JSON.stringify(trace.response))}
                </p>
              </div>
            )}
            {trace.sessionName && (
              <div className="memory-trace-item__session">
                <Files size={10} />
                {trace.sessionName}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Cluster Detail Panel
 */
function ClusterDetailPanel({ cluster, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredTraces = useMemo(() => {
    if (!searchQuery.trim()) return cluster.traces
    const query = searchQuery.toLowerCase()
    return cluster.traces.filter(trace => 
      trace.prompt?.toLowerCase().includes(query) ||
      trace.response?.text?.toLowerCase().includes(query) ||
      trace.model?.toLowerCase().includes(query)
    )
  }, [cluster.traces, searchQuery])
  
  return (
    <motion.div
      className="cluster-detail-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        '--cluster-bg': cluster.color.bg,
        '--cluster-border': cluster.color.border,
        '--cluster-text': cluster.color.text,
        '--cluster-accent': cluster.color.accent
      }}
    >
      <div className="cluster-detail-panel__header">
        <div className="cluster-detail-panel__title-section">
          <div className="cluster-detail-panel__icon">
            {cluster.isMisc ? <Layers size={20} /> : <Brain size={20} />}
          </div>
          <div>
            <h3 className="cluster-detail-panel__title">{cluster.name}</h3>
            <p className="cluster-detail-panel__subtitle">
              Memory cluster with {cluster.traces.length} ingested traces
            </p>
          </div>
        </div>
        <button className="cluster-detail-panel__close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      
      <div className="cluster-detail-panel__topics">
        <span className="cluster-detail-panel__topics-label">Related topics:</span>
        {cluster.topics.map((topic, i) => (
          <span key={i} className="cluster-detail-panel__topic">{topic}</span>
        ))}
      </div>
      
      <div className="cluster-detail-panel__search">
        <Search size={14} />
        <input
          type="text"
          placeholder="Search within this cluster..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}>
            <X size={14} />
          </button>
        )}
      </div>
      
      <div className="cluster-detail-panel__traces">
        <div className="cluster-detail-panel__traces-header">
          <span>
            {filteredTraces.length} {filteredTraces.length === 1 ? 'trace' : 'traces'}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
        </div>
        <div className="cluster-detail-panel__traces-list">
          {filteredTraces.map((trace, i) => (
            <MemoryTraceItem key={trace.span_id || i} trace={trace} index={i} />
          ))}
          {filteredTraces.length === 0 && (
            <div className="cluster-detail-panel__empty">
              <Search size={20} />
              <span>No traces match your search</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Main Memory Component
 */
export default function Memory({ data, isAggregated = false, sessions = [] }) {
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [clusterCount, setClusterCount] = useState(6)
  
  // Extract and prepare all trace data for clustering
  const memoryTraces = useMemo(() => {
    let allEvents = []
    
    if (isAggregated && sessions.length > 0) {
      sessions.forEach(session => {
        const sessionName = session.data.sessions?.[0]?.name || session.fileName
        if (session.data.trace_tree) {
          const events = extractLLMEvents(session.data.trace_tree, [], sessionName)
          allEvents = [...allEvents, ...events]
        } else if (session.data.events) {
          const events = session.data.events
            .filter(e => e.provider !== 'function')
            .map(e => ({
              ...e,
              prompt: getPromptText(e.request, e.api),
              sessionName
            }))
          allEvents = [...allEvents, ...events]
        }
      })
    } else if (data.trace_tree) {
      allEvents = extractLLMEvents(data.trace_tree)
    } else if (data.events) {
      allEvents = data.events
        .filter(e => e.provider !== 'function')
        .map(e => ({
          ...e,
          prompt: getPromptText(e.request, e.api)
        }))
    }
    
    // Prepare traces with combined input+output text for clustering
    return allEvents.map(event => {
      const inputText = event.prompt || ''
      const outputText = event.response?.text || ''
      const combinedText = `${inputText} ${outputText}`
      const tokens = tokenize(combinedText)
      
      return {
        ...event,
        combinedText,
        tokens,
        totalTokens: event.tokens || (event.inputTokens || 0) + (event.outputTokens || 0)
      }
    })
  }, [data, isAggregated, sessions])
  
  // Perform semantic clustering
  const clusters = useMemo(() => {
    return clusterTraces(memoryTraces, clusterCount)
  }, [memoryTraces, clusterCount])
  
  // Handle cluster selection
  const handleClusterClick = (cluster) => {
    setSelectedCluster(selectedCluster?.id === cluster.id ? null : cluster)
  }
  
  if (memoryTraces.length === 0) {
    return (
      <div className="memory-empty">
        <Brain size={32} />
        <h3>No Memory Data</h3>
        <p>Upload traces to build semantic memory clusters</p>
      </div>
    )
  }
  
  return (
    <div className="memory">
      {/* Header */}
      <div className="memory-header">
        <div className="memory-header__info">
          <div className="memory-header__icon">
            <Brain size={24} />
          </div>
          <div>
            <h2 className="memory-header__title">Semantic Memory</h2>
            <p className="memory-header__subtitle">
              {memoryTraces.length} traces clustered into {clusters.length} memory groups
              {isAggregated && ` across ${sessions.length} sessions`}
            </p>
          </div>
        </div>
        <div className="memory-header__controls">
          <label className="memory-header__control">
            <span>Clusters:</span>
            <select 
              value={clusterCount} 
              onChange={(e) => {
                setClusterCount(Number(e.target.value))
                setSelectedCluster(null)
              }}
            >
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={12}>12</option>
            </select>
          </label>
        </div>
      </div>
      
      {/* Cluster Stats */}
      <div className="memory-stats">
        <div className="memory-stats__item">
          <Sparkles size={16} />
          <span className="memory-stats__value">{clusters.length}</span>
          <span className="memory-stats__label">Memory Clusters</span>
        </div>
        <div className="memory-stats__item">
          <Zap size={16} />
          <span className="memory-stats__value">{memoryTraces.length}</span>
          <span className="memory-stats__label">Total Traces</span>
        </div>
        <div className="memory-stats__item">
          <Hash size={16} />
          <span className="memory-stats__value">
            {memoryTraces.reduce((sum, t) => sum + (t.totalTokens || 0), 0).toLocaleString()}
          </span>
          <span className="memory-stats__label">Total Tokens</span>
        </div>
        <div className="memory-stats__item">
          <Clock size={16} />
          <span className="memory-stats__value">
            {formatDuration(memoryTraces.reduce((sum, t) => sum + (t.duration_ms || 0), 0) / memoryTraces.length)}
          </span>
          <span className="memory-stats__label">Avg Duration</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`memory-content ${selectedCluster ? 'memory-content--with-panel' : ''}`}>
        {/* Knowledge Graph */}
        <div className="memory-graph-container">
          <div className="memory-graph-container__header">
            <h3>
              <Layers size={16} />
              Knowledge Graph
            </h3>
            <span className="memory-graph-container__hint">
              Click a node to explore · Drag to pan · Scroll to zoom
            </span>
          </div>
          <KnowledgeGraph
            clusters={clusters}
            selectedCluster={selectedCluster}
            onSelectCluster={handleClusterClick}
          />
        </div>
        
        {/* Detail Panel */}
        <AnimatePresence>
          {selectedCluster && (
            <ClusterDetailPanel
              cluster={selectedCluster}
              onClose={() => setSelectedCluster(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
