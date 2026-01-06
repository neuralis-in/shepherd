import './DocsSection.css';

export default function DocsSection({ id, title, children, level = 2 }) {
  const Tag = `h${level}`;
  
  return (
    <section id={id} className="docs-section">
      <Tag className={`docs-section__title docs-section__title--h${level}`}>
        <a href={`#${id}`} className="docs-section__link">
          {title}
          <span className="docs-section__hash">#</span>
        </a>
      </Tag>
      <div className="docs-section__content">
        {children}
      </div>
    </section>
  );
}
