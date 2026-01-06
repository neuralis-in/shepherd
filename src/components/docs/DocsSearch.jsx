import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, ArrowRight } from 'lucide-react';
import './DocsSearch.css';

// Search index - all searchable documentation items
const searchIndex = [
  // aiobs (Python)
  { section: 'aiobs', item: 'getting-started', title: 'Getting Started', category: 'aiobs (Python)', keywords: ['install', 'pip', 'api key', 'quick start'] },
  { section: 'aiobs', item: 'usage', title: 'Usage', category: 'aiobs (Python)', keywords: ['session', 'trace', 'observe', 'flush'] },
  { section: 'aiobs', item: 'providers', title: 'Providers', category: 'aiobs (Python)', keywords: ['openai', 'gemini', 'anthropic', 'llm'] },
  { section: 'aiobs', item: 'function-tracing', title: 'Function Tracing', category: 'aiobs (Python)', keywords: ['decorator', 'observe', 'trace', 'span'] },
  { section: 'aiobs', item: 'evals', title: 'Evaluations', category: 'aiobs (Python)', keywords: ['eval', 'quality', 'score', 'judge'] },
  { section: 'aiobs', item: 'architecture', title: 'Architecture', category: 'aiobs (Python)', keywords: ['design', 'structure', 'collector', 'events'] },
  
  // aiobs-ts (TypeScript)
  { section: 'aiobs-ts', item: 'getting-started', title: 'Getting Started', category: 'aiobs (TypeScript)', keywords: ['install', 'npm', 'yarn', 'api key'] },
  { section: 'aiobs-ts', item: 'usage', title: 'Usage', category: 'aiobs (TypeScript)', keywords: ['session', 'labels', 'remote', 'storage'] },
  { section: 'aiobs-ts', item: 'openai', title: 'OpenAI Integration', category: 'aiobs (TypeScript)', keywords: ['openai', 'wrap', 'client', 'chat'] },
  { section: 'aiobs-ts', item: 'function-tracing', title: 'Function Tracing', category: 'aiobs (TypeScript)', keywords: ['observe', 'wrapper', 'trace', 'nested'] },
  { section: 'aiobs-ts', item: 'api-reference', title: 'API Reference', category: 'aiobs (TypeScript)', keywords: ['api', 'methods', 'env', 'variables'] },
  
  // Shepherd CLI
  { section: 'shepherd-cli', item: 'installation', title: 'Installation', category: 'Shepherd CLI', keywords: ['install', 'pip', 'cli', 'command'] },
  { section: 'shepherd-cli', item: 'configuration', title: 'Configuration', category: 'Shepherd CLI', keywords: ['config', 'api key', 'setup'] },
  { section: 'shepherd-cli', item: 'commands', title: 'Commands', category: 'Shepherd CLI', keywords: ['list', 'sessions', 'get', 'filter'] },
  { section: 'shepherd-cli', item: 'shell', title: 'Interactive Shell', category: 'Shepherd CLI', keywords: ['shell', 'interactive', 'repl'] },
  
  // Shepherd MCP
  { section: 'shepherd-mcp', item: 'overview', title: 'Overview', category: 'Shepherd MCP', keywords: ['mcp', 'claude', 'cursor', 'model context'] },
  { section: 'shepherd-mcp', item: 'installation', title: 'Installation', category: 'Shepherd MCP', keywords: ['install', 'pip', 'uv'] },
  { section: 'shepherd-mcp', item: 'configuration', title: 'Configuration', category: 'Shepherd MCP', keywords: ['config', 'claude', 'cursor', 'env'] },
  { section: 'shepherd-mcp', item: 'tools', title: 'Available Tools', category: 'Shepherd MCP', keywords: ['tools', 'list', 'get', 'search', 'diff'] },
  { section: 'shepherd-mcp', item: 'use-cases', title: 'Use Cases', category: 'Shepherd MCP', keywords: ['debug', 'analyze', 'compare', 'regression'] },
];

export default function DocsSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = searchIndex.filter(item => {
      const searchText = `${item.title} ${item.category} ${item.keywords.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item) => {
    navigate(`/docs?section=${item.section}&item=${item.item}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="docs-search-overlay" onClick={onClose}>
      <div className="docs-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="docs-search-modal__header">
          <Search size={18} className="docs-search-modal__icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="docs-search-modal__input"
          />
          <button className="docs-search-modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="docs-search-modal__body">
          {query && results.length === 0 && (
            <div className="docs-search-modal__empty">
              No results found for "{query}"
            </div>
          )}
          
          {results.length > 0 && (
            <ul className="docs-search-modal__results">
              {results.map((item, index) => (
                <li key={`${item.section}-${item.item}`}>
                  <button
                    className={`docs-search-modal__result ${index === selectedIndex ? 'docs-search-modal__result--selected' : ''}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <FileText size={16} className="docs-search-modal__result-icon" />
                    <div className="docs-search-modal__result-content">
                      <span className="docs-search-modal__result-title">{item.title}</span>
                      <span className="docs-search-modal__result-category">{item.category}</span>
                    </div>
                    <ArrowRight size={14} className="docs-search-modal__result-arrow" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          {!query && (
            <div className="docs-search-modal__hints">
              <p className="docs-search-modal__hint-title">Quick searches</p>
              <div className="docs-search-modal__hint-tags">
                <button onClick={() => setQuery('install')}>install</button>
                <button onClick={() => setQuery('api key')}>api key</button>
                <button onClick={() => setQuery('openai')}>openai</button>
                <button onClick={() => setQuery('trace')}>trace</button>
                <button onClick={() => setQuery('cli')}>cli</button>
              </div>
            </div>
          )}
        </div>

        <div className="docs-search-modal__footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to select</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}

