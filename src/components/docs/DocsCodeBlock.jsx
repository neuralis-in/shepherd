import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import './DocsCodeBlock.css';

// Custom dark theme matching the app
const customTheme = {
  plain: {
    color: '#E5E5E5',
    backgroundColor: '#0D0D0D',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#6A737D', fontStyle: 'italic' },
    },
    {
      types: ['namespace'],
      style: { opacity: 0.7 },
    },
    {
      types: ['string', 'attr-value', 'template-string'],
      style: { color: '#A5D6FF' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: '#E5E5E5' },
    },
    {
      types: ['entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'property', 'regex', 'inserted'],
      style: { color: '#79C0FF' },
    },
    {
      types: ['atrule', 'keyword', 'attr-name'],
      style: { color: '#FF7B72' },
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: { color: '#D2A8FF' },
    },
    {
      types: ['function-variable'],
      style: { color: '#D2A8FF' },
    },
    {
      types: ['selector', 'class-name', 'builtin'],
      style: { color: '#FFA657' },
    },
    {
      types: ['char', 'tag', 'important'],
      style: { color: '#7EE787' },
    },
  ],
};

// Map language aliases
const languageMap = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'sh': 'bash',
  'shell': 'bash',
  'yml': 'yaml',
};

export default function DocsCodeBlock({ 
  code, 
  language = 'python', 
  filename = null,
  showLineNumbers = false 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Normalize language
  const normalizedLang = languageMap[language] || language;

  return (
    <div className="docs-code-block">
      {filename && (
        <div className="docs-code-block__header">
          <span className="docs-code-block__filename">{filename}</span>
          <span className="docs-code-block__lang">{language}</span>
        </div>
      )}
      <div className="docs-code-block__content">
        <button 
          className="docs-code-block__copy" 
          onClick={handleCopy}
          title="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        <Highlight
          theme={customTheme}
          code={code.trim()}
          language={normalizedLang}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style, margin: 0, background: 'transparent' }}>
              <code>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="docs-code-block__line">
                    {showLineNumbers && (
                      <span className="docs-code-block__line-number">{i + 1}</span>
                    )}
                    <span className="docs-code-block__line-content">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
