import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DocsSidebar, DocsContent, DocsNav, DocsSearch } from '../components/docs';
import { aiobsContent, aiobsTsContent, shepherdCliContent, shepherdMcpContent } from './docs/content';
import './Docs.css';

// Map section IDs to their content
const contentMap = {
  'aiobs': aiobsContent,
  'aiobs-ts': aiobsTsContent,
  'shepherd-cli': shepherdCliContent,
  'shepherd-mcp': shepherdMcpContent,
};

// Navigation structure for pagination
const navigationOrder = [
  { section: 'aiobs', id: 'getting-started', title: 'Getting Started' },
  { section: 'aiobs', id: 'usage', title: 'Usage' },
  { section: 'aiobs', id: 'providers', title: 'Providers' },
  { section: 'aiobs', id: 'function-tracing', title: 'Function Tracing' },
  { section: 'aiobs', id: 'evals', title: 'Evaluations' },
  { section: 'aiobs', id: 'architecture', title: 'Architecture' },
  { section: 'aiobs-ts', id: 'getting-started', title: 'Getting Started (TS)' },
  { section: 'aiobs-ts', id: 'usage', title: 'Usage (TS)' },
  { section: 'aiobs-ts', id: 'openai', title: 'OpenAI Integration' },
  { section: 'aiobs-ts', id: 'function-tracing', title: 'Function Tracing (TS)' },
  { section: 'aiobs-ts', id: 'api-reference', title: 'API Reference' },
  { section: 'shepherd-cli', id: 'installation', title: 'Installation' },
  { section: 'shepherd-cli', id: 'configuration', title: 'Configuration' },
  { section: 'shepherd-cli', id: 'commands', title: 'Commands' },
  { section: 'shepherd-cli', id: 'shell', title: 'Interactive Shell' },
  { section: 'shepherd-mcp', id: 'overview', title: 'Overview' },
  { section: 'shepherd-mcp', id: 'installation', title: 'Installation (MCP)' },
  { section: 'shepherd-mcp', id: 'configuration', title: 'Configuration (MCP)' },
  { section: 'shepherd-mcp', id: 'tools', title: 'Available Tools' },
  { section: 'shepherd-mcp', id: 'use-cases', title: 'Use Cases' },
];

export default function Docs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Get current section and item from URL params
  const activeSection = searchParams.get('section') || 'aiobs';
  const activeItem = searchParams.get('item') || 'getting-started';
  
  // Get the content for current section/item
  const sectionContent = contentMap[activeSection];
  const pageContent = sectionContent?.[activeItem];
  
  // Find current page index for pagination
  const currentIndex = navigationOrder.findIndex(
    nav => nav.section === activeSection && nav.id === activeItem
  );
  const prevPage = currentIndex > 0 ? navigationOrder[currentIndex - 1] : null;
  const nextPage = currentIndex < navigationOrder.length - 1 ? navigationOrder[currentIndex + 1] : null;
  
  // Handle navigation
  const handleNavigate = (section, item) => {
    setSearchParams({ section, item });
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };
  
  // Keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSidebarOpen && !e.target.closest('.docs-sidebar')) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSidebarOpen]);

  // Set document title
  useEffect(() => {
    if (pageContent?.title) {
      document.title = `${pageContent.title} | Shepherd Docs`;
    }
  }, [pageContent?.title]);

  if (!pageContent) {
    return (
      <div className="docs">
        <DocsSidebar 
          activeSection={activeSection}
          activeItem={activeItem}
          onNavigate={handleNavigate}
        />
        <DocsNav 
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        <DocsContent
          title="Page Not Found"
          description="The documentation page you're looking for doesn't exist."
        >
          <p>Please select a topic from the sidebar.</p>
        </DocsContent>
        <DocsSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    );
  }

  const ContentComponent = pageContent.content;

  return (
    <div className="docs">
      <DocsSidebar 
        activeSection={activeSection}
        activeItem={activeItem}
        onNavigate={handleNavigate}
        className={isSidebarOpen ? 'docs-sidebar--open' : ''}
      />
      <DocsNav 
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <DocsContent
        title={pageContent.title}
        description={pageContent.description}
        prevPage={prevPage}
        nextPage={nextPage}
        onNavigate={handleNavigate}
      >
        <ContentComponent />
      </DocsContent>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && <div className="docs-overlay" onClick={() => setIsSidebarOpen(false)} />}
      
      {/* Search modal */}
      <DocsSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
