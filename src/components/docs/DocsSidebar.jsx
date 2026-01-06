import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Book, Terminal, Server, Package } from 'lucide-react';
import './DocsSidebar.css';

const docsNavigation = [
  {
    id: 'aiobs',
    title: 'aiobs (Python)',
    icon: Package,
    items: [
      { id: 'getting-started', title: 'Getting Started' },
      { id: 'usage', title: 'Usage' },
      { id: 'providers', title: 'Providers' },
      { id: 'function-tracing', title: 'Function Tracing' },
      { id: 'evals', title: 'Evaluations' },
      { id: 'architecture', title: 'Architecture' },
    ]
  },
  {
    id: 'aiobs-ts',
    title: 'aiobs (TypeScript)',
    icon: Package,
    items: [
      { id: 'getting-started', title: 'Getting Started' },
      { id: 'usage', title: 'Usage' },
      { id: 'openai', title: 'OpenAI Integration' },
      { id: 'function-tracing', title: 'Function Tracing' },
      { id: 'api-reference', title: 'API Reference' },
    ]
  },
  {
    id: 'shepherd-cli',
    title: 'Shepherd CLI',
    icon: Terminal,
    items: [
      { id: 'installation', title: 'Installation' },
      { id: 'configuration', title: 'Configuration' },
      { id: 'commands', title: 'Commands' },
      { id: 'shell', title: 'Interactive Shell' },
    ]
  },
  {
    id: 'shepherd-mcp',
    title: 'Shepherd MCP',
    icon: Server,
    items: [
      { id: 'overview', title: 'Overview' },
      { id: 'installation', title: 'Installation' },
      { id: 'configuration', title: 'Configuration' },
      { id: 'tools', title: 'Available Tools' },
      { id: 'use-cases', title: 'Use Cases' },
    ]
  },
];

export default function DocsSidebar({ activeSection, activeItem, onNavigate }) {
  const [expandedSections, setExpandedSections] = useState([activeSection || 'aiobs']);
  const location = useLocation();
  const basePath = import.meta.env.BASE_URL;

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleItemClick = (sectionId, itemId) => {
    if (onNavigate) {
      onNavigate(sectionId, itemId);
    }
  };

  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar__header">
        <Link to="/" className="docs-sidebar__logo">
          <img src={`${basePath}shepherd.svg`} alt="Shepherd" className="docs-sidebar__logo-icon" />
          <div className="docs-sidebar__logo-text">
            <span className="docs-sidebar__logo-title">Shepherd</span>
            <span className="docs-sidebar__logo-subtitle">Documentation</span>
          </div>
        </Link>
      </div>
      
      <nav className="docs-sidebar__nav">
        {docsNavigation.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.includes(section.id);
          const isActive = activeSection === section.id;
          
          return (
            <div key={section.id} className="docs-sidebar__section">
              <button 
                className={`docs-sidebar__section-header ${isActive ? 'docs-sidebar__section-header--active' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <Icon size={16} className="docs-sidebar__section-icon" />
                <span>{section.title}</span>
                <ChevronRight 
                  size={14} 
                  className={`docs-sidebar__chevron ${isExpanded ? 'docs-sidebar__chevron--expanded' : ''}`} 
                />
              </button>
              
              {isExpanded && (
                <ul className="docs-sidebar__items">
                  {section.items.map((item) => {
                    const isItemActive = isActive && activeItem === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          className={`docs-sidebar__item ${isItemActive ? 'docs-sidebar__item--active' : ''}`}
                          onClick={() => handleItemClick(section.id, item.id)}
                        >
                          {item.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="docs-sidebar__footer">
        <a 
          href="https://github.com/neuralis-in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="docs-sidebar__github"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
      </div>
    </aside>
  );
}

export { docsNavigation };

