import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Key,
  CloudDownload,
  AlertCircle,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  Database
} from 'lucide-react'
import api from '../../api'
import './YourTracesModal.css'

/**
 * Modal for fetching user's traces from the backend using their API key
 */
export default function YourTracesModal({ isOpen, onClose, onImportSessions }) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchedSessions, setFetchedSessions] = useState(null)

  const handleFetch = useCallback(async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key')
      return
    }

    setIsLoading(true)
    setError(null)
    setFetchedSessions(null)

    try {
      const response = await api.fetchUserSessions(apiKey.trim())
      
      if (!response.sessions || response.sessions.length === 0) {
        setError('No sessions found for this API key')
        return
      }

      // Merge root-level events/trace_tree with sessions if they exist at root
      // This handles the format where events/trace_tree are at response root, not per-session
      const sessionsWithData = response.sessions.map(session => {
        // Filter events that belong to this session
        const sessionEvents = (response.events || []).filter(e => e.session_id === session.id)
        const sessionFunctionEvents = (response.function_events || []).filter(e => e.session_id === session.id)
        const sessionTraceTree = (response.trace_tree || []).filter(t => t.session_id === session.id)
        
        return {
          ...session,
          // Use session-level data if available, otherwise use filtered root-level data
          events: session.events || sessionEvents,
          function_events: session.function_events || sessionFunctionEvents,
          trace_tree: session.trace_tree || sessionTraceTree
        }
      })

      setFetchedSessions(sessionsWithData)
    } catch (err) {
      setError(err.message || 'Failed to fetch sessions')
    } finally {
      setIsLoading(false)
    }
  }, [apiKey])

  const handleImport = useCallback(() => {
    if (!fetchedSessions) return

    // Transform backend sessions to the format expected by Playground
    const transformedSessions = fetchedSessions.map((session, index) => ({
      id: `${Date.now()}-api-${index}-${Math.random().toString(36).substr(2, 9)}`,
      fileName: session.name || `Session ${index + 1}`,
      data: {
        sessions: [{
          id: session.external_id || session.id,
          name: session.name,
          started_at: session.started_at,
          ended_at: session.ended_at,
          meta: session.meta || {},
          labels: session.labels || []
        }],
        trace_tree: session.trace_tree || [],
        events: session.events || [],
        function_events: session.function_events || []
      },
      uploadedAt: Date.now(),
      source: 'api'
    }))

    onImportSessions(transformedSessions)
    handleClose()
  }, [fetchedSessions, onImportSessions])

  const handleClose = useCallback(() => {
    setApiKey('')
    setShowKey(false)
    setError(null)
    setFetchedSessions(null)
    setIsLoading(false)
    onClose()
  }, [onClose])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !isLoading && apiKey.trim()) {
      handleFetch()
    }
  }, [handleFetch, isLoading, apiKey])

  if (!isOpen) return null

  const totalEvents = fetchedSessions?.reduce((acc, s) => 
    acc + (s.trace_tree?.length || 0) + (s.events?.length || 0), 0
  ) || 0

  return (
    <motion.div
      className="your-traces-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="your-traces-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="your-traces-modal__close" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="your-traces-modal__header">
          <div className="your-traces-modal__icon">
            <Database size={24} />
          </div>
          <h2>Your Traces</h2>
          <p>Fetch your observability sessions using your API key</p>
        </div>

        <div className="your-traces-modal__content">
          {/* API Key Input */}
          <div className="your-traces-modal__input-group">
            <label htmlFor="api-key-input">
              <Key size={16} />
              API Key
            </label>
            <div className="your-traces-modal__input-wrapper">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                placeholder="sk_live_xxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                className="your-traces-modal__toggle-visibility"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span className="your-traces-modal__hint">
              Find your API key in <a href="/api-keys" target="_blank" rel="noopener noreferrer">API Keys</a> page
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="your-traces-modal__error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Fetched Sessions Preview */}
          {fetchedSessions && (
            <motion.div
              className="your-traces-modal__preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="your-traces-modal__preview-header">
                <CheckCircle size={18} />
                <span>Found {fetchedSessions.length} session{fetchedSessions.length > 1 ? 's' : ''}</span>
              </div>
              <div className="your-traces-modal__preview-stats">
                <div className="your-traces-modal__stat">
                  <span className="your-traces-modal__stat-value">{fetchedSessions.length}</span>
                  <span className="your-traces-modal__stat-label">Sessions</span>
                </div>
                <div className="your-traces-modal__stat">
                  <span className="your-traces-modal__stat-value">{totalEvents}</span>
                  <span className="your-traces-modal__stat-label">Events</span>
                </div>
              </div>
              <div className="your-traces-modal__preview-list">
                {fetchedSessions.slice(0, 5).map((session, index) => (
                  <div key={session.id || index} className="your-traces-modal__preview-item">
                    <span className="your-traces-modal__preview-item-name">
                      {session.name || `Session ${index + 1}`}
                    </span>
                    <span className="your-traces-modal__preview-item-meta">
                      {(session.trace_tree?.length || 0) + (session.events?.length || 0)} events
                    </span>
                  </div>
                ))}
                {fetchedSessions.length > 5 && (
                  <div className="your-traces-modal__preview-more">
                    +{fetchedSessions.length - 5} more sessions
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="your-traces-modal__actions">
          {!fetchedSessions ? (
            <button
              className="your-traces-modal__btn your-traces-modal__btn--primary"
              onClick={handleFetch}
              disabled={isLoading || !apiKey.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="your-traces-modal__spinner" />
                  Fetching...
                </>
              ) : (
                <>
                  <CloudDownload size={18} />
                  Fetch Sessions
                </>
              )}
            </button>
          ) : (
            <>
              <button
                className="your-traces-modal__btn your-traces-modal__btn--secondary"
                onClick={() => setFetchedSessions(null)}
              >
                Back
              </button>
              <button
                className="your-traces-modal__btn your-traces-modal__btn--primary"
                onClick={handleImport}
              >
                <CloudDownload size={18} />
                Import {fetchedSessions.length} Session{fetchedSessions.length > 1 ? 's' : ''}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

