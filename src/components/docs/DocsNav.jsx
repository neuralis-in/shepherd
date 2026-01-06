import { Link } from 'react-router-dom';
import { Menu, X, Search, Github, ExternalLink } from 'lucide-react';
import './DocsNav.css';

export default function DocsNav({ isSidebarOpen, onToggleSidebar, onOpenSearch }) {
  return (
    <header className="docs-nav">
      <div className="docs-nav__left">
        <button 
          className="docs-nav__toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="docs-nav__breadcrumb">
          <Link to="/" className="docs-nav__breadcrumb-link">Shepherd</Link>
          <span className="docs-nav__breadcrumb-sep">/</span>
          <span className="docs-nav__breadcrumb-current">Documentation</span>
        </div>
      </div>
      
      <div className="docs-nav__right">
        <button className="docs-nav__search" onClick={onOpenSearch}>
          <Search size={16} className="docs-nav__search-icon" />
          <span className="docs-nav__search-text">Search docs...</span>
          <span className="docs-nav__search-shortcut">⌘K</span>
        </button>
        
        <div className="docs-nav__links">
          <a 
            href="https://github.com/neuralis-in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="docs-nav__link"
          >
            <Github size={18} />
          </a>
          <Link to="/playground" className="docs-nav__link docs-nav__link--highlight">
            Playground
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
