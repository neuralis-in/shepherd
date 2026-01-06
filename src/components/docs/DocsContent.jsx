import { ChevronRight, ExternalLink } from 'lucide-react';
import './DocsContent.css';

export default function DocsContent({ title, description, children, prevPage, nextPage, onNavigate }) {
  return (
    <main className="docs-content">
      <div className="docs-content__container">
        <header className="docs-content__header">
          <h1 className="docs-content__title">{title}</h1>
          {description && (
            <p className="docs-content__description">{description}</p>
          )}
        </header>
        
        <article className="docs-content__body">
          {children}
        </article>
        
        <nav className="docs-content__pagination">
          {prevPage ? (
            <button 
              className="docs-content__pagination-btn docs-content__pagination-btn--prev"
              onClick={() => onNavigate && onNavigate(prevPage.section, prevPage.id)}
            >
              <ChevronRight size={16} className="docs-content__pagination-icon--prev" />
              <div className="docs-content__pagination-info">
                <span className="docs-content__pagination-label">Previous</span>
                <span className="docs-content__pagination-title">{prevPage.title}</span>
              </div>
            </button>
          ) : <div />}
          
          {nextPage ? (
            <button 
              className="docs-content__pagination-btn docs-content__pagination-btn--next"
              onClick={() => onNavigate && onNavigate(nextPage.section, nextPage.id)}
            >
              <div className="docs-content__pagination-info">
                <span className="docs-content__pagination-label">Next</span>
                <span className="docs-content__pagination-title">{nextPage.title}</span>
              </div>
              <ChevronRight size={16} />
            </button>
          ) : <div />}
        </nav>
        
        <footer className="docs-content__footer">
          <a 
            href="https://github.com/neuralis-in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="docs-content__edit-link"
          >
            Edit this page on GitHub
            <ExternalLink size={14} />
          </a>
        </footer>
      </div>
    </main>
  );
}

