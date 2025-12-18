import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link, useParams, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  User,
  BookOpen,
  Share2,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ChevronRight,
  Zap,
  RefreshCw,
  Brain,
  LineChart,
  Shield,
  Target,
  Layers,
  Database,
  GitBranch,
  PlayCircle,
  Repeat,
  AlertTriangle,
  Eye,
  Sparkles,
  Users,
  Code,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Github,
  Terminal,
  FileCode,
  Cpu,
  Activity,
  Settings,
  FlaskConical,
  Gauge,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  LayoutDashboard,
  Search,
  DollarSign,
  Rocket,
  Lock,
  Wrench,
  Timer,
  Bug,
  Route,
  Coins,
  Scale,
  PieChart,
  Bot,
  Workflow,
  Lightbulb,
  Plug,
  BrainCircuit,
  MousePointer,
  MonitorPlay,
  Quote,
  Globe,
  ArrowDown,
  AlertCircle
} from 'lucide-react'
import './Blog.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// Blog posts data
const blogPosts = [
  {
    slug: 'shepherd-mcp-observability-meets-agentic-coding',
    title: 'Shepherd-MCP: Observability Meets Agentic Coding',
    subtitle: 'Bringing AI Observability Directly Into Your IDE',
    excerpt: 'Shepherd-MCP bridges the gap between observability tools and AI-powered coding environments. Debug production issues, run root cause analysis, and fix bugs—all without leaving Cursor, Windsurf, or Claude Code.',
    date: 'December 18, 2025',
    readTime: '12 min read',
    tag: 'MCP',
    featured: true,
    icon: 'plug',
  },
  {
    slug: 'dashboards-power-center-ai-observability',
    title: 'Why Dashboards are the power center of AI observability.',
    subtitle: 'The Control Room for AI You Can Actually Trust',
    excerpt: 'If you can\'t see what your AI is doing, you can\'t trust what your AI is doing. Dashboards transform scattered AI activity into a control environment where teams can monitor, tune, and evolve their systems with confidence.',
    date: 'December 9, 2025',
    readTime: '10 min read',
    tag: 'Observability',
    featured: false,
    icon: 'dashboard',
  },
  {
    slug: 'self-healing-prompts',
    title: 'How Self-Healing Prompts Will Work',
    subtitle: 'A Simple, Intuitive Guide to the Future of AI Reliability',
    excerpt: 'Self-healing prompts create an automated feedback loop that learns from real-world usage and continuously improves the instructions given to AI models.',
    date: 'December 2, 2025',
    readTime: '15 min read',
    tag: 'AI Systems',
    featured: false,
    icon: 'sparkles',
  },
]

// Reading Progress Bar
function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  
  return (
    <motion.div 
      className="reading-progress"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

// Blog Header
function BlogHeader({ showShare = true }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="blog-header">
      <div className="container blog-header__container">
        <Link to="/" className="blog-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="blog-header__logo">
          <svg viewBox="0 0 32 32" className="blog-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        <nav className="blog-header__nav">
          <Link to="/blog" className="blog-header__link">All Posts</Link>
          {showShare && (
            <div className="blog-header__share">
              <span className="blog-header__share-label">Share</span>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('How Self-Healing Prompts Will Work')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-header__share-btn"
                aria-label="Share on Twitter"
              >
                <Twitter size={16} />
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-header__share-btn"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <button 
                className="blog-header__share-btn"
                onClick={handleCopyLink}
                aria-label="Copy link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          )}
        </nav>
      </div>
      <ReadingProgress />
    </header>
  )
}

// Blog List Page
function BlogList() {
  return (
    <div className="blog-list-page">
      <BlogHeader showShare={false} />
      <main className="blog-list-main">
        <div className="container">
          <motion.div 
            className="blog-list-hero"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 className="blog-list-hero__title" variants={fadeInUp}>
              Shepherd Blog
            </motion.h1>
            <motion.p className="blog-list-hero__subtitle" variants={fadeInUp}>
              Insights on AI observability, agent debugging, and the future of reliable AI systems.
            </motion.p>
          </motion.div>

          <motion.div 
            className="blog-list-grid"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {blogPosts.map((post, i) => (
              <motion.article 
                key={post.slug}
                className={`blog-card ${post.featured ? 'blog-card--featured' : ''}`}
                variants={fadeInUp}
              >
                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    <span className="blog-card__tag">{post.tag}</span>
                    <span className="blog-card__date">{post.date}</span>
                  </div>
                  <h2 className="blog-card__title">{post.title}</h2>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <div className="blog-card__footer">
                    <span className="blog-card__read-time">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                    <Link to={`/blog/${post.slug}`} className="blog-card__link">
                      Read article
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
                {post.featured && (
                  <div className="blog-card__visual">
                    <div className="blog-card__visual-bg">
                      {post.icon === 'dashboard' ? (
                        <LayoutDashboard size={64} className="blog-card__visual-icon" />
                      ) : post.icon === 'plug' ? (
                        <Plug size={64} className="blog-card__visual-icon" />
                      ) : (
                        <Sparkles size={64} className="blog-card__visual-icon" />
                      )}
                    </div>
                  </div>
                )}
              </motion.article>
            ))}
          </motion.div>

          <motion.div 
            className="blog-list-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p>Want to stay updated on AI observability?</p>
            <Link to="/" className="btn btn--primary">
              Book a Demo
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </main>
      <BlogFooter />
    </div>
  )
}

// Code Block Component
function CodeBlock({ title, language = 'python', children, filename }) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div 
      className={`blog-code-block ${isExpanded ? 'blog-code-block--expanded' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div 
        className="blog-code-block__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="blog-code-block__dots">
          <span></span><span></span><span></span>
        </div>
        <span className="blog-code-block__filename">
          <FileCode size={14} />
          {filename || title}
        </span>
        <div className="blog-code-block__actions">
          <button 
            className="blog-code-block__copy" 
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button className="blog-code-block__toggle">
            <ChevronRight size={16} className={`blog-code-block__chevron ${isExpanded ? 'blog-code-block__chevron--open' : ''}`} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="blog-code-block__content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <pre><code className={`language-${language}`}>{children}</code></pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Inline Code
function InlineCode({ children }) {
  return <code className="blog-inline-code">{children}</code>
}

// Self-Healing Loop Diagram - Horizontal Flow
function SelfHealingLoopDiagram() {
  const steps = [
    { icon: <Database size={18} />, label: 'Observe', color: '#111' },
    { icon: <Eye size={18} />, label: 'Evaluate', color: '#333' },
    { icon: <Brain size={18} />, label: 'Learn', color: '#555' },
    { icon: <Sparkles size={18} />, label: 'Improve', color: '#777' },
    { icon: <PlayCircle size={18} />, label: 'Deploy', color: '#10B981' },
  ]

  return (
    <div className="healing-flow">
      <div className="healing-flow__header">
        <motion.div 
          className="healing-flow__badge"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <RefreshCw size={14} className="healing-flow__badge-icon" />
          <span>Continuous Loop</span>
        </motion.div>
      </div>
      <div className="healing-flow__steps">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="healing-flow__step"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="healing-flow__step-icon" style={{ background: step.color }}>
              {step.icon}
            </div>
            <span className="healing-flow__step-label">{step.label}</span>
            {i < steps.length - 1 && (
              <motion.div 
                className="healing-flow__connector"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.3 }}
                viewport={{ once: true }}
              >
                <ChevronRight size={16} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div 
        className="healing-flow__loop-back"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        viewport={{ once: true }}
      >
        <svg viewBox="0 0 100 30" className="healing-flow__loop-svg">
          <motion.path
            d="M95 5 Q50 30 5 5"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            viewport={{ once: true }}
          />
          <motion.polygon
            points="5,5 10,2 8,8"
            fill="#10B981"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            viewport={{ once: true }}
          />
        </svg>
        <span className="healing-flow__loop-text">Repeat</span>
      </motion.div>
    </div>
  )
}

// AI Failure Types Visual
function AIFailureTypes() {
  const failures = [
    { icon: <HelpCircle />, title: 'Misunderstand', desc: 'Wrong interpretation' },
    { icon: <Sparkles />, title: 'Hallucinate', desc: 'Fabricated details' },
    { icon: <XCircle />, title: 'Wrong Tools', desc: 'Poor selection' },
    { icon: <AlertTriangle />, title: 'Inconsistent', desc: 'Varying results' },
  ]

  return (
    <div className="ai-failures">
      <div className="ai-failures__visual">
        <div className="ai-failures__bot">
          <Brain size={32} />
          <div className="ai-failures__bot-pulse"></div>
        </div>
        <div className="ai-failures__grid">
          {failures.map((failure, i) => (
            <motion.div
              key={i}
              className="ai-failures__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="ai-failures__item-icon">{failure.icon}</div>
              <div className="ai-failures__item-content">
                <h4>{failure.title}</h4>
                <p>{failure.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Architecture Diagram
function ArchitectureDiagram() {
  return (
    <div className="arch-diagram">
      <div className="arch-diagram__row">
        <div className="arch-diagram__box arch-diagram__box--code">
          <Terminal size={20} />
          <span>Your Agent Code</span>
          <code>@observe(enh_prompt=True)</code>
        </div>
        <div className="arch-diagram__arrow">→</div>
        <div className="arch-diagram__box arch-diagram__box--aiobs">
          <Activity size={20} />
          <span>aiobs SDK</span>
          <code>Traces + Evals</code>
        </div>
        <div className="arch-diagram__arrow">→</div>
        <div className="arch-diagram__box arch-diagram__box--shepherd">
          <Database size={20} />
          <span>Shepherd</span>
          <code>eval_set DB</code>
        </div>
      </div>
      <div className="arch-diagram__row arch-diagram__row--center">
        <div className="arch-diagram__flow">
          <span className="arch-diagram__flow-label">When threshold reached (e.g., 500 traces)</span>
          <div className="arch-diagram__flow-arrow">↓</div>
        </div>
      </div>
      <div className="arch-diagram__row">
        <div className="arch-diagram__box arch-diagram__box--optimizer">
          <Sparkles size={20} />
          <span>GEPA Optimizer</span>
          <code>DSPy Dataset</code>
        </div>
        <div className="arch-diagram__arrow">→</div>
        <div className="arch-diagram__box arch-diagram__box--test">
          <FlaskConical size={20} />
          <span>A/B Testing</span>
          <code>Compare Scores</code>
        </div>
        <div className="arch-diagram__arrow">→</div>
        <div className="arch-diagram__box arch-diagram__box--deploy">
          <Gauge size={20} />
          <span>Dashboard</span>
          <code>Deploy New Prompt</code>
        </div>
      </div>
    </div>
  )
}

// Eval Set Visualization
function EvalSetVisualization() {
  const evalResults = [
    { metric: 'aiobs.relevance', score: 0.92, status: 'pass' },
    { metric: 'aiobs.coherence', score: 0.88, status: 'pass' },
    { metric: 'aiobs.faithfulness', score: 0.76, status: 'warn' },
    { metric: 'custom.format_check', score: 1.0, status: 'pass' },
  ]

  return (
    <div className="eval-set-viz">
      <div className="eval-set-viz__header">
        <span className="eval-set-viz__title">
          <Database size={16} />
          eval_set entry
        </span>
        <span className="eval-set-viz__badge">trace_id: abc123</span>
      </div>
      <div className="eval-set-viz__content">
        <div className="eval-set-viz__section">
          <h4>Input</h4>
          <p className="eval-set-viz__text">"What are the key benefits of using RAG?"</p>
        </div>
        <div className="eval-set-viz__section">
          <h4>System Prompt</h4>
          <p className="eval-set-viz__text eval-set-viz__text--muted">"You are a helpful assistant..."</p>
        </div>
        <div className="eval-set-viz__section">
          <h4>Output</h4>
          <p className="eval-set-viz__text">"RAG (Retrieval-Augmented Generation) provides..."</p>
        </div>
        <div className="eval-set-viz__section eval-set-viz__section--evals">
          <h4>Evaluation Results</h4>
          <div className="eval-set-viz__metrics">
            {evalResults.map((evaluation, i) => (
              <div key={i} className={`eval-set-viz__metric eval-set-viz__metric--${evaluation.status}`}>
                <span className="eval-set-viz__metric-name">{evaluation.metric}</span>
                <span className="eval-set-viz__metric-score">{evaluation.score.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="eval-set-viz__section eval-set-viz__section--feedback">
          <h4>Feedback</h4>
          <div className="eval-set-viz__feedback">
            <div className="eval-set-viz__feedback-item">
              <Brain size={14} />
              <span>LLM Judge: "Good coverage but could be more concise"</span>
            </div>
            <div className="eval-set-viz__feedback-item eval-set-viz__feedback-item--human">
              <User size={14} />
              <span>Human: Marked as <strong>correct</strong></span>
              <ThumbsUp size={14} className="eval-set-viz__thumb" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Process Step Card
function ProcessStep({ number, icon, title, children, color = '#111' }) {
  return (
    <motion.div 
      className="process-step"
      variants={fadeInUp}
    >
      <div className="process-step__header">
        <div className="process-step__number" style={{ background: color }}>{number}</div>
        <div className="process-step__icon" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
        <h3 className="process-step__title">{title}</h3>
      </div>
      <div className="process-step__content">
        {children}
      </div>
    </motion.div>
  )
}

// Evaluation Pipeline Visual
function EvaluationPipeline() {
  const stages = [
    { title: 'Custom Rules', desc: 'Format & field checks', icon: <CheckCircle2 size={16} />, color: '#10B981' },
    { title: 'Internal Metrics', desc: 'Precision, recall, consistency', icon: <BarChart3 size={16} />, color: '#333' },
    { title: 'LLM-as-Judge', desc: 'Reasoned scoring', icon: <Brain size={16} />, color: '#555' },
    { title: 'Human Feedback', desc: 'Manual corrections', icon: <Users size={16} />, color: '#F59E0B' },
  ]

  return (
    <div className="eval-pipeline">
      {stages.map((stage, i) => (
        <motion.div
          key={i}
          className="eval-pipeline__stage"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: true }}
        >
          <div className="eval-pipeline__stage-icon" style={{ background: `${stage.color}20`, color: stage.color }}>
            {stage.icon}
          </div>
          <h4 className="eval-pipeline__stage-title">{stage.title}</h4>
          <p className="eval-pipeline__stage-desc">{stage.desc}</p>
          {i < stages.length - 1 && (
            <div className="eval-pipeline__connector">
              <ChevronRight size={16} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Benefits Section
function BenefitsSection() {
  const benefitGroups = [
    {
      title: 'Product & Business Teams',
      icon: <TrendingUp size={20} />,
      color: '#10B981',
      items: ['Fewer user complaints', 'More predictable AI behavior', 'Higher trust & adoption']
    },
    {
      title: 'Engineers',
      icon: <Code size={20} />,
      color: '#111',
      items: ['No more manual prompt tweaking', 'Automatic visibility into failure modes', 'Structured datasets for tuning', 'Safe A/B deployments']
    },
    {
      title: 'Companies',
      icon: <Shield size={20} />,
      color: '#F59E0B',
      items: ['Better reliability', 'Lower costs', 'Faster iteration cycles']
    }
  ]

  return (
    <div className="benefits-grid">
      {benefitGroups.map((group, i) => (
        <motion.div
          key={i}
          className="benefits-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="benefits-card__icon" style={{ background: `${group.color}15`, color: group.color }}>
            {group.icon}
          </div>
          <h4 className="benefits-card__title">{group.title}</h4>
          <ul className="benefits-card__list">
            {group.items.map((item, j) => (
              <li key={j}>
                <CheckCircle2 size={14} style={{ color: group.color }} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}

// Key Insight Callout
function KeyInsight({ children, icon = <Zap size={18} /> }) {
  return (
    <motion.div 
      className="key-insight"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="key-insight__icon">{icon}</div>
      <div className="key-insight__content">{children}</div>
    </motion.div>
  )
}

// Quote Block
function QuoteBlock({ children }) {
  return (
    <motion.blockquote 
      className="quote-block"
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.blockquote>
  )
}

// Table of Contents
function TableOfContents() {
  const [activeSection, setActiveSection] = useState('')
  
  const sections = [
    { id: 'intuition', label: 'The Intuition' },
    { id: 'why-matters', label: 'Why This Matters' },
    { id: 'how-works', label: 'How It Works' },
    { id: 'shepherd-approach', label: 'Shepherd\'s Approach' },
    { id: 'feedback-loop', label: 'The Feedback Loop' },
    { id: 'future', label: 'The Future' },
    { id: 'benefits', label: 'Who Benefits' },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="toc">
      <h4 className="toc__title">
        <BookOpen size={14} />
        Contents
      </h4>
      <ul className="toc__list">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`toc__link ${activeSection === id ? 'toc__link--active' : ''}`}
              onClick={() => scrollToSection(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Dashboard Stats Card Component
function DashboardStatsCard({ icon, title, value, trend, color = '#111' }) {
  return (
    <motion.div 
      className="dashboard-stat-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="dashboard-stat-card__icon" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="dashboard-stat-card__content">
        <span className="dashboard-stat-card__value">{value}</span>
        <span className="dashboard-stat-card__title">{title}</span>
      </div>
      {trend && (
        <span className={`dashboard-stat-card__trend ${trend > 0 ? 'dashboard-stat-card__trend--up' : 'dashboard-stat-card__trend--down'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </motion.div>
  )
}

// Dashboard Visual Component
function DashboardVisual() {
  return (
    <div className="dashboard-visual">
      <div className="dashboard-visual__header">
        <div className="dashboard-visual__dots">
          <span></span><span></span><span></span>
        </div>
        <span className="dashboard-visual__title">
          <LayoutDashboard size={14} />
          AI Observability Dashboard
        </span>
      </div>
      <div className="dashboard-visual__content">
        <div className="dashboard-visual__sidebar">
          <div className="dashboard-visual__nav-item dashboard-visual__nav-item--active">
            <LayoutDashboard size={14} />
            <span>Overview</span>
          </div>
          <div className="dashboard-visual__nav-item">
            <Activity size={14} />
            <span>Traces</span>
          </div>
          <div className="dashboard-visual__nav-item">
            <BarChart3 size={14} />
            <span>Analytics</span>
          </div>
          <div className="dashboard-visual__nav-item">
            <AlertTriangle size={14} />
            <span>Issues</span>
          </div>
        </div>
        <div className="dashboard-visual__main">
          <div className="dashboard-visual__stats">
            <DashboardStatsCard 
              icon={<Activity size={18} />} 
              title="Total Traces" 
              value="12,847" 
              trend={23}
              color="#111"
            />
            <DashboardStatsCard 
              icon={<Timer size={18} />} 
              title="Avg Latency" 
              value="342ms" 
              trend={-12}
              color="#444"
            />
            <DashboardStatsCard 
              icon={<CheckCircle2 size={18} />} 
              title="Success Rate" 
              value="98.7%" 
              trend={2}
              color="#111"
            />
            <DashboardStatsCard 
              icon={<DollarSign size={18} />} 
              title="Cost Today" 
              value="$47.23" 
              trend={-8}
              color="#666"
            />
          </div>
          <div className="dashboard-visual__chart">
            <div className="dashboard-visual__chart-header">
              <span>Request Volume</span>
              <span className="dashboard-visual__chart-period">Last 24h</span>
            </div>
            <div className="dashboard-visual__chart-bars">
              {[40, 65, 45, 80, 55, 70, 90, 75, 60, 85, 50, 95].map((h, i) => (
                <motion.div 
                  key={i}
                  className="dashboard-visual__bar"
                  style={{ height: `${h}%` }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// AI Chaos vs Clarity Visual
function ChaosVsClarityVisual() {
  return (
    <div className="chaos-clarity">
      <motion.div 
        className="chaos-clarity__side chaos-clarity__side--chaos"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="chaos-clarity__icon">
          <XCircle size={24} />
        </div>
        <h4>Without Dashboards</h4>
        <ul>
          <li><Eye size={14} /> Behavior buried in logs</li>
          <li><HelpCircle size={14} /> Silent failures</li>
          <li><Users size={14} /> Team confusion</li>
          <li><Clock size={14} /> Days to debug</li>
          <li><DollarSign size={14} /> Hidden cost leaks</li>
        </ul>
      </motion.div>
      <div className="chaos-clarity__divider">
        <ChevronRight size={24} />
      </div>
      <motion.div 
        className="chaos-clarity__side chaos-clarity__side--clarity"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="chaos-clarity__icon">
          <CheckCircle2 size={24} />
        </div>
        <h4>With Dashboards</h4>
        <ul>
          <li><Eye size={14} /> Everything visible</li>
          <li><AlertTriangle size={14} /> Real-time alerts</li>
          <li><Users size={14} /> Aligned teams</li>
          <li><Zap size={14} /> Minutes to debug</li>
          <li><TrendingUp size={14} /> Cost optimization</li>
        </ul>
      </motion.div>
    </div>
  )
}

// Dashboard Benefits Section
function DashboardBenefitCard({ number, icon, title, points, color = '#111' }) {
  return (
    <motion.div 
      className="dashboard-benefit"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="dashboard-benefit__header">
        <div className="dashboard-benefit__number" style={{ background: color }}>{number}</div>
        <div className="dashboard-benefit__icon" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
        <h3 className="dashboard-benefit__title">{title}</h3>
      </div>
      <ul className="dashboard-benefit__points">
        {points.map((point, i) => (
          <li key={i}>
            <ChevronRight size={14} />
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// AI Activity Items Component
function AIActivityItems() {
  const items = [
    { icon: <MessageSquare size={16} />, label: 'Prompts', color: '#111' },
    { icon: <Route size={16} />, label: 'Chain Steps', color: '#333' },
    { icon: <Wrench size={16} />, label: 'Tool Calls', color: '#444' },
    { icon: <RefreshCw size={16} />, label: 'Retries', color: '#555' },
    { icon: <Timer size={16} />, label: 'Latencies', color: '#666' },
    { icon: <XCircle size={16} />, label: 'Failures', color: '#777' },
  ]

  return (
    <div className="ai-activity-items">
      <div className="ai-activity-items__center">
        <Bot size={32} />
        <span>AI Activity</span>
      </div>
      <div className="ai-activity-items__grid">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="ai-activity-items__item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="ai-activity-items__icon" style={{ background: `${item.color}15`, color: item.color }}>
              {item.icon}
            </div>
            <span>{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Debugging Comparison
function DebuggingComparison() {
  const withoutDashboard = [
    { icon: <Database size={16} />, label: 'Backfilled logs' },
    { icon: <FlaskConical size={16} />, label: 'Manual experiments' },
    { icon: <HelpCircle size={16} />, label: 'Inconsistent tests' },
    { icon: <Clock size={16} />, label: 'Hours of work' },
  ]

  const withDashboard = [
    { icon: <Bug size={16} />, label: 'Failing traces', color: '#111' },
    { icon: <Wrench size={16} />, label: 'Tool bottlenecks', color: '#333' },
    { icon: <Route size={16} />, label: 'Long reasoning paths', color: '#444' },
    { icon: <AlertTriangle size={16} />, label: 'Hallucination hotspots', color: '#555' },
    { icon: <GitBranch size={16} />, label: 'Version regressions', color: '#666' },
  ]

  return (
    <div className="debugging-comparison">
      <motion.div 
        className="debugging-comparison__old"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h4>
          <XCircle size={16} />
          Traditional Debugging
        </h4>
        <div className="debugging-comparison__items">
          {withoutDashboard.map((item, i) => (
            <div key={i} className="debugging-comparison__item">
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="debugging-comparison__result debugging-comparison__result--bad">
          <Timer size={16} />
          Hours to days
        </div>
      </motion.div>
      <motion.div 
        className="debugging-comparison__new"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h4>
          <CheckCircle2 size={16} />
          Dashboard Debugging
        </h4>
        <div className="debugging-comparison__items">
          {withDashboard.map((item, i) => (
            <div key={i} className="debugging-comparison__item" style={{ borderColor: item.color }}>
              <span style={{ color: item.color }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="debugging-comparison__result debugging-comparison__result--good">
          <Zap size={16} />
          A few clicks
        </div>
      </motion.div>
    </div>
  )
}

// Cost Breakdown Visual
function CostBreakdownVisual() {
  const costs = [
    { label: 'Overly long prompts', percentage: 35, color: '#111' },
    { label: 'Runaway agents', percentage: 25, color: '#444' },
    { label: 'Unnecessary retries', percentage: 22, color: '#777' },
    { label: 'Inefficient context', percentage: 18, color: '#AAA' },
  ]

  return (
    <div className="cost-breakdown">
      <div className="cost-breakdown__chart">
        <motion.div 
          className="cost-breakdown__pie"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="cost-breakdown__center">
            <DollarSign size={24} />
            <span>Hidden Costs</span>
          </div>
        </motion.div>
      </div>
      <div className="cost-breakdown__legend">
        {costs.map((cost, i) => (
          <motion.div
            key={i}
            className="cost-breakdown__legend-item"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <span className="cost-breakdown__dot" style={{ background: cost.color }} />
            <span className="cost-breakdown__label">{cost.label}</span>
            <span className="cost-breakdown__value">{cost.percentage}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Dashboard Metrics Grid
function DashboardMetricsGrid() {
  const metrics = [
    { icon: <Coins size={18} />, label: 'Token costs', desc: 'Per request & aggregate' },
    { icon: <Bot size={18} />, label: 'Usage by model', desc: 'GPT-4, Claude, etc.' },
    { icon: <Users size={18} />, label: 'Usage by user', desc: 'Track consumption' },
    { icon: <Workflow size={18} />, label: 'Usage by agent chain', desc: 'End-to-end flows' },
  ]

  return (
    <div className="metrics-grid">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          className="metrics-grid__item"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="metrics-grid__icon">
            {metric.icon}
          </div>
          <div className="metrics-grid__content">
            <h4>{metric.label}</h4>
            <p>{metric.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Confidence Chain Visual
function ConfidenceChainVisual() {
  const chain = [
    { label: 'Visibility', icon: <Eye size={20} />, color: '#111' },
    { label: 'Confidence', icon: <Shield size={20} />, color: '#333' },
    { label: 'Adoption', icon: <Users size={20} />, color: '#555' },
    { label: 'Revenue', icon: <TrendingUp size={20} />, color: '#10B981' },
  ]

  return (
    <div className="confidence-chain">
      {chain.map((item, i) => (
        <motion.div
          key={i}
          className="confidence-chain__step"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: true }}
        >
          <div className="confidence-chain__icon" style={{ background: item.color }}>
            {item.icon}
          </div>
          <span className="confidence-chain__label">{item.label}</span>
          {i < chain.length - 1 && (
            <div className="confidence-chain__arrow">
              <span>=</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Future Capabilities Visual
function FutureCapabilitiesVisual() {
  const capabilities = [
    { icon: <AlertTriangle size={18} />, label: 'Intelligent alerts', desc: 'Know before users complain' },
    { icon: <Sparkles size={18} />, label: 'Self-healing prompts', desc: 'Auto-fix failing prompts' },
    { icon: <Scale size={18} />, label: 'Quality scoring', desc: 'Automated grading' },
    { icon: <LineChart size={18} />, label: 'Drift detection', desc: 'Catch degradation early' },
    { icon: <GitBranch size={18} />, label: 'A/B testing', desc: 'Safe experimentation' },
    { icon: <Workflow size={18} />, label: 'Workflow optimization', desc: 'Streamline agent flows' },
  ]

  return (
    <div className="future-capabilities">
      <div className="future-capabilities__header">
        <motion.div 
          className="future-capabilities__badge"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Rocket size={14} />
          <span>The Future is Proactive</span>
        </motion.div>
      </div>
      <div className="future-capabilities__grid">
        {capabilities.map((cap, i) => (
          <motion.div
            key={i}
            className="future-capabilities__item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="future-capabilities__icon">
              {cap.icon}
            </div>
            <h4>{cap.label}</h4>
            <p>{cap.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Cockpit Analogy Visual
function CockpitAnalogy() {
  return (
    <div className="cockpit-analogy">
      <motion.div 
        className="cockpit-analogy__content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="cockpit-analogy__left">
          <div className="cockpit-analogy__icon cockpit-analogy__icon--engine">
            <Cpu size={32} />
          </div>
          <span>AI is the Engine</span>
        </div>
        <div className="cockpit-analogy__equals">
          <ChevronRight size={24} />
        </div>
        <div className="cockpit-analogy__right">
          <div className="cockpit-analogy__icon cockpit-analogy__icon--dashboard">
            <LayoutDashboard size={32} />
          </div>
          <span>Dashboards are the Cockpit</span>
        </div>
      </motion.div>
    </div>
  )
}

// Table of Contents sections for Dashboard Blog
const dashboardSections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'hidden-visible', label: 'Hidden → Visible' },
  { id: 'single-source', label: 'Single Source of Truth' },
  { id: 'debugging', label: 'Faster Debugging' },
  { id: 'cost-waste', label: 'Cost Optimization' },
  { id: 'confidence', label: 'Building Confidence' },
  { id: 'future', label: 'The Future' },
]

// Table of Contents for Dashboard Blog
function DashboardTableOfContents() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    dashboardSections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="toc">
      <h4 className="toc__title">
        <BookOpen size={14} />
        Contents
      </h4>
      <ul className="toc__list">
        {dashboardSections.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`toc__link ${activeSection === id ? 'toc__link--active' : ''}`}
              onClick={() => scrollToSection(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// MCP Sections for Table of Contents
const mcpSections = [
  { id: 'mcp-intro', label: 'The Problem' },
  { id: 'mcp-why', label: 'Why MCP?' },
  { id: 'mcp-solution', label: 'The Solution' },
  { id: 'mcp-integration', label: 'Integration' },
  { id: 'mcp-features', label: 'Features' },
  { id: 'mcp-validation', label: 'Validation' },
  { id: 'mcp-future', label: 'The Future' },
]

// Table of Contents for MCP Blog
function MCPTableOfContents() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    mcpSections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="toc">
      <h4 className="toc__title">
        <BookOpen size={14} />
        Contents
      </h4>
      <ul className="toc__list">
        {mcpSections.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`toc__link ${activeSection === id ? 'toc__link--active' : ''}`}
              onClick={() => scrollToSection(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Traditional Obs Pain Points Visual - Matching Vibehack Deck Layout
function TraditionalObsPainPoints() {
  return (
    <motion.div 
      className="mcp-traditional-layout"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="mcp-traditional-problems">
        <h3>Traditional Observability Pain Points</h3>
        <div className="mcp-problem-list">
          <div className="mcp-problem-item">
            <BarChart3 size={20} />
            <span>Proprietary dashboards</span>
          </div>
          <div className="mcp-problem-item">
            <MousePointer size={20} />
            <span>Click-heavy navigation</span>
          </div>
          <div className="mcp-problem-item">
            <ExternalLink size={20} />
            <span>Away from dev environment</span>
          </div>
          <div className="mcp-problem-item">
            <RefreshCw size={20} />
            <span>Vicious debugging cycle</span>
          </div>
        </div>
      </div>
      
      <div className="mcp-vicious-cycle">
        <h4>The Vicious Cycle</h4>
        <div className="mcp-cycle-circular">
          {/* SVG for connecting arrows */}
          <svg className="mcp-cycle-arrows" viewBox="0 0 320 320">
            <defs>
              <marker id="mcp-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            {/* Clockwise arrows connecting nodes */}
            <polyline points="200,40 264,40 264,68" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#mcp-arrowhead)" />
            <polyline points="264,132 264,188" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#mcp-arrowhead)" />
            <polyline points="264,252 264,280 200,280" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#mcp-arrowhead)" />
            <polyline points="120,280 56,280 56,252" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#mcp-arrowhead)" />
            <polyline points="56,188 56,132" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#mcp-arrowhead)" />
            <polyline points="56,68 56,40 120,40" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#mcp-arrowhead)" />
          </svg>
          
          {/* Cycle nodes */}
          <div className="mcp-cycle-node mcp-cycle-node--pm">
            <Users size={20} />
            <span>Built for PMs</span>
          </div>
          <div className="mcp-cycle-node mcp-cycle-node--alert">
            <AlertTriangle size={20} />
            <span>Alert to Dev</span>
          </div>
          <div className="mcp-cycle-node mcp-cycle-node--dashboard">
            <MonitorPlay size={20} />
            <span>Go to Dashboard</span>
          </div>
          <div className="mcp-cycle-node mcp-cycle-node--click">
            <MousePointer size={20} />
            <span>Click Chaos</span>
          </div>
          <div className="mcp-cycle-node mcp-cycle-node--overwhelm">
            <AlertCircle size={20} />
            <span>Info Overload</span>
          </div>
          <div className="mcp-cycle-node mcp-cycle-node--fix">
            <Wrench size={20} />
            <span>Difficulty Fixing</span>
          </div>

          {/* Center label */}
          <div className="mcp-cycle-center">
            <RefreshCw size={24} />
            <span>Repeat</span>
          </div>
        </div>
        <p className="mcp-cycle-caption">Developers waste hours context-switching instead of fixing</p>
        <ul className="mcp-cycle-subpoints">
          <li>Transmission loss from CXOs to Devs</li>
          <li>Information lost upon convey</li>
          <li>Hours of back and forth</li>
        </ul>
      </div>
    </motion.div>
  )
}

// Vicious Cycle Visual for MCP Blog (keeping for backward compatibility, but using the combined layout above)
function ViciousCycleVisual() {
  return null // Now integrated into TraditionalObsPainPoints
}

// MCP Integration Flow Visual
function MCPIntegrationFlow() {
  const tools = [
    { name: 'Langfuse', highlight: true },
    { name: 'aiobs', highlight: true },
    { name: 'Portkey', highlight: false },
    { name: 'Datadog', highlight: false },
    { name: 'Any Tool', highlight: false },
  ]

  const ides = [
    { name: 'Cursor', highlight: true },
    { name: 'Claude Code', highlight: true },
    { name: 'Windsurf', highlight: true },
    { name: 'Emergent', highlight: true },
    { name: 'Any MCP IDE', highlight: true },
  ]

  return (
    <div className="mcp-integration-flow">
      <div className="mcp-integration-flow__column">
        <h4>Observability Tools</h4>
        <div className="mcp-integration-flow__items">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              className={`mcp-integration-flow__item ${tool.highlight ? 'mcp-integration-flow__item--highlight' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Eye size={16} />
              <span>{tool.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mcp-integration-flow__center">
        <motion.div
          className="mcp-integration-flow__bridge"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="mcp-integration-flow__bridge-icon">
            <Plug size={24} />
          </div>
          <span>Shepherd-MCP</span>
        </motion.div>
        <div className="mcp-integration-flow__arrows">
          <Workflow size={20} />
        </div>
      </div>

      <div className="mcp-integration-flow__column">
        <h4>AI-Powered IDEs</h4>
        <div className="mcp-integration-flow__items">
          {ides.map((ide, i) => (
            <motion.div
              key={ide.name}
              className={`mcp-integration-flow__item ${ide.highlight ? 'mcp-integration-flow__item--highlight' : ''}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Terminal size={16} />
              <span>{ide.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Time Savings Visual
function TimeSavingsVisual() {
  return (
    <div className="mcp-time-savings">
      <motion.div
        className="mcp-time-savings__before"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Clock size={24} />
        <div className="mcp-time-savings__content">
          <span className="mcp-time-savings__value">3-5 hours</span>
          <span className="mcp-time-savings__label">Traditional debugging</span>
        </div>
      </motion.div>

      <motion.div
        className="mcp-time-savings__arrow"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
      >
        <ArrowRight size={24} />
      </motion.div>

      <motion.div
        className="mcp-time-savings__after"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Zap size={24} />
        <div className="mcp-time-savings__content">
          <span className="mcp-time-savings__value">30-50 min</span>
          <span className="mcp-time-savings__label">With Shepherd-MCP</span>
        </div>
      </motion.div>
    </div>
  )
}

// MCP Features Grid
function MCPFeaturesGrid() {
  const features = [
    {
      icon: <Search size={20} />,
      title: 'Trace-Back Analysis',
      description: 'If a problem is identified, Shepherd-MCP can trace the root cause across different data sources—Datadog logs, Langfuse traces, and more.',
      badge: 'Core Feature'
    },
    {
      icon: <Workflow size={20} />,
      title: 'End-to-End AI Performance',
      description: 'From development to production, seamlessly integrate with your existing observability tools for comprehensive model monitoring.',
      badge: null
    },
    {
      icon: <Eye size={20} />,
      title: 'Total Model Visibility',
      description: 'Get a single view of your entire AI ecosystem. Bring together insights from Langfuse, AIobs, Langsmith, Datadog, and more.',
      badge: null
    },
    {
      icon: <Lightbulb size={20} />,
      title: 'Enhanced Explainability',
      description: 'Visualize traces and key metrics to understand why specific decisions or outputs were generated, improving model trust.',
      badge: null
    },
  ]

  return (
    <div className="mcp-features-grid">
      {features.map((feature, i) => (
        <motion.div
          key={i}
          className="mcp-feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mcp-feature-card__header">
            <div className="mcp-feature-card__icon">
              {feature.icon}
            </div>
            {feature.badge && (
              <span className="mcp-feature-card__badge">{feature.badge}</span>
            )}
          </div>
          <h4 className="mcp-feature-card__title">{feature.title}</h4>
          <p className="mcp-feature-card__desc">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  )
}

// Validation Quotes
function ValidationQuotes() {
  const quotes = [
    {
      company: 'Fenmo AI',
      role: 'Founder',
      quote: "Devs have to do frequent context-switching to move to dashboards...",
      insight: "Need a solution that fits in well",
      tool: "Uses Langfuse",
      color: '#F97316'
    },
    {
      company: 'Nurix.ai',
      role: 'Developers',
      quote: "Looking through Agentic trace containing 50 LLM calls + 20 tool dispatch...",
      insight: "Pain, chore, bloat—cut it down with agentic coding",
      tool: "Building AI Agents",
      color: '#3B82F6'
    },
    {
      company: 'AgnostAI',
      role: 'Founders',
      quote: "Analytics is for management. Real work is done by developers.",
      insight: "Building on top of analytics engine may significantly speedup developer pace",
      tool: "Analytics Platform",
      color: '#111111'
    }
  ]

  return (
    <div className="mcp-validation-quotes">
      {quotes.map((q, i) => (
        <motion.div
          key={i}
          className="mcp-quote-card"
          style={{ '--quote-color': q.color }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: true }}
        >
          <div className="mcp-quote-card__header">
            <div className="mcp-quote-card__company">
              <span className="mcp-quote-card__name">{q.company}</span>
              <span className="mcp-quote-card__role">{q.role}</span>
            </div>
            <span className="mcp-quote-card__tool">{q.tool}</span>
          </div>
          <blockquote className="mcp-quote-card__quote">"{q.quote}"</blockquote>
          <p className="mcp-quote-card__insight">
            <Lightbulb size={14} />
            {q.insight}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// AI IDEs Stats
function AIIDEsStats() {
  const stats = [
    { name: 'Cursor', metric: '5M+', label: 'Daily Active Users', growth: '+400%' },
    { name: 'Windsurf', metric: '1M+', label: 'Downloads', growth: 'New' },
    { name: 'GitHub Copilot', metric: '1.3M+', label: 'Paid Subscribers', growth: '+35%' },
  ]

  return (
    <div className="mcp-ide-stats">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.name}
          className="mcp-ide-stat"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <span className="mcp-ide-stat__name">{stat.name}</span>
          <span className="mcp-ide-stat__value">{stat.metric}</span>
          <span className="mcp-ide-stat__label">{stat.label}</span>
          <span className="mcp-ide-stat__growth">{stat.growth}</span>
        </motion.div>
      ))}
    </div>
  )
}

// Shepherd-MCP Blog Article Content
function ShepherdMCPBlogArticle() {
  return (
    <article className="blog-article">
      {/* Hero */}
      <motion.header 
        className="blog-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="blog-hero__meta" variants={fadeInUp}>
            <span className="blog-hero__tag blog-hero__tag--mcp">MCP</span>
            <span className="blog-hero__separator">•</span>
            <span className="blog-hero__date">
              <Calendar size={14} />
              December 18, 2025
            </span>
            <span className="blog-hero__separator">•</span>
            <span className="blog-hero__read-time">
              <Clock size={14} />
              12 min read
            </span>
          </motion.div>
          
          <motion.h1 className="blog-hero__title" variants={fadeInUp}>
            Shepherd-MCP: Observability Meets Agentic Coding
          </motion.h1>
          
          <motion.p className="blog-hero__subtitle" variants={fadeInUp}>
            Bringing AI Observability Directly Into Your IDE
          </motion.p>

          <motion.div className="blog-hero__author" variants={fadeInUp}>
            <div className="blog-hero__author-avatar">
              <User size={20} />
            </div>
            <div className="blog-hero__author-info">
              <span className="blog-hero__author-name">Shepherd Team</span>
              <span className="blog-hero__author-role">Engineering</span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="blog-content">
        <div className="container">
          <div className="blog-content__wrapper">
            <MCPTableOfContents />
            
            <div className="blog-content__main">
              {/* Introduction */}
              <motion.section 
                className="blog-section"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.p className="blog-lead" variants={fadeInUp}>
                  The history of observability tools over the past couple of decades has been about a pretty simple concept: <strong>how do we make terabytes of heterogeneous telemetry data comprehensible to human beings?</strong>
                </motion.p>

                <motion.p variants={fadeInUp}>
                  But here's the thing—in the age of AI, we see the death of this paradigm. It's already real. It's already here. It's going to fundamentally change the way we approach systems design and operation.
                </motion.p>

                <QuoteBlock>
                  The world has moved to Agentic Coding. Observability is yet to catch up.
                </QuoteBlock>

                <motion.p variants={fadeInUp}>
                  That's why we built <strong>Shepherd-MCP</strong>—a tool that bridges the gap between observability platforms and AI-powered coding environments, bringing traces directly into Cursor, Windsurf, Claude Code, and any MCP-compatible IDE.
                </motion.p>
              </motion.section>

              {/* The Problem */}
              <motion.section 
                id="mcp-intro"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">01</span>
                  The Problem with Traditional Observability
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Yet another observability tool? <strong>No.</strong> Traditional observability comes with serious pain points that developers face every day:
                </motion.p>

                <TraditionalObsPainPoints />

                <KeyInsight icon={<AlertTriangle size={18} />}>
                  Traditional observability tools were built for product managers and executives—not for the developers who actually fix the bugs.
                </KeyInsight>
              </motion.section>

              {/* Why MCP */}
              <motion.section 
                id="mcp-why"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">02</span>
                  Why MCP? Why Now?
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  AI coding assistants are exploding. Developers live inside their IDEs. Why are we still leaving to debug?
                </motion.p>

                <motion.div variants={fadeInUp}>
                  <AIIDEsStats />
                </motion.div>

                <motion.p variants={fadeInUp}>
                  <strong>Model Context Protocol (MCP)</strong> is the bridge that makes this possible. It's an open standard that allows AI models to connect with external tools and data sources—meaning your AI coding assistant can now read, understand, and act on your observability data.
                </motion.p>

                <KeyInsight icon={<BrainCircuit size={18} />}>
                  Developers already use AI to write code. Why not to <strong>debug</strong> it too?
                </KeyInsight>

                <motion.p variants={fadeInUp}>
                  This is the paradigm shift. Instead of humans interpreting dashboards, we let AI agents do the heavy lifting—isolating issues, conducting root cause analysis, and even suggesting or applying fixes.
                </motion.p>
              </motion.section>

              {/* The Solution */}
              <motion.section 
                id="mcp-solution"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">03</span>
                  How Shepherd-MCP Cuts Turnaround Time
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  With Shepherd-MCP, the workflow becomes radically simpler:
                </motion.p>

                <motion.div className="mcp-solution-columns" variants={fadeInUp}>
                  {/* Left Column - Workflow */}
                  <div className="mcp-solution-column mcp-solution-column--workflow">
                    <h4>With Shepherd-MCP</h4>
                    <div className="mcp-workflow-steps-vertical">
                      <div className="mcp-workflow-step mcp-workflow-step--highlight">
                        <Bot size={16} />
                        <span>Offload to Cursor/Windsurf</span>
                      </div>
                      <div className="mcp-workflow-arrow-down">↓</div>
                      <div className="mcp-workflow-step mcp-workflow-step--highlight">
                        <Search size={16} />
                        <span>AI Isolates & RCA</span>
                      </div>
                      <div className="mcp-workflow-arrow-down">↓</div>
                      <div className="mcp-workflow-step mcp-workflow-step--highlight">
                        <Wrench size={16} />
                        <span>Fix in Same Tool</span>
                      </div>
                    </div>
                    <span className="mcp-workflow-time mcp-workflow-time--fast">Minutes</span>
                  </div>

                  {/* Right Column - Time Savings */}
                  <div className="mcp-solution-column mcp-solution-column--savings">
                    <h4>Time Saved</h4>
                    <div className="mcp-time-savings-vertical">
                      <div className="mcp-time-savings__before">
                        <Clock size={20} />
                        <span className="mcp-time-savings__value">3-5 hours</span>
                        <span className="mcp-time-savings__label">Traditional debugging</span>
                      </div>
                      <div className="mcp-time-savings__arrow-down">↓</div>
                      <div className="mcp-time-savings__after">
                        <Zap size={20} />
                        <span className="mcp-time-savings__value">30-50 min</span>
                        <span className="mcp-time-savings__label">With Shepherd-MCP</span>
                      </div>
                    </div>
                    <div className="mcp-time-savings__benefits-vertical">
                      <div className="mcp-time-savings__benefit">
                        <CheckCircle2 size={16} />
                        <span>Zero information loss in conveyance</span>
                      </div>
                      <div className="mcp-time-savings__benefit">
                        <TrendingUp size={16} />
                        <span><strong>Over 10x time saved</strong> for CXOs, PMs, EMs</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <KeyInsight icon={<Rocket size={18} />}>
                  Let AI isolate issues, conduct RCA, and fix—all without leaving your IDE.
                </KeyInsight>
              </motion.section>

              {/* Integration */}
              <motion.section 
                id="mcp-integration"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">04</span>
                  Works with What You Already Use
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Shepherd-MCP is designed to integrate with your existing observability stack. Whether you use Langfuse, aiobs, Portkey, Datadog, or any other tool—it all flows through MCP into your IDE.
                </motion.p>

                <motion.div variants={scaleIn}>
                  <MCPIntegrationFlow />
                </motion.div>

                <motion.div className="mcp-integration-result" variants={fadeInUp}>
                  <Zap size={24} />
                  <p><strong>And bam!</strong> Your AI can read, analyze, and fix production issues.</p>
                </motion.div>

                <motion.p variants={fadeInUp}>
                  Simply add Shepherd-MCP to your IDE's MCP configuration, connect your observability tools, and you're ready to go. The AI agent in your IDE now has full context of your production traces.
                </motion.p>

                <CodeBlock filename="mcp_config.json" language="json">
{`{
  "mcpServers": {
    "shepherd": {
      "command": "uvx",
      "args": ["shepherd-mcp"],
      "env": {
        "AIOBS_API_KEY": "aiobs_sk_xxxx",
        "LANGFUSE_PUBLIC_KEY": "pk-lf-xxxx",
        "LANGFUSE_SECRET_KEY": "sk-lf-xxxx"
      }
    }
  }
}`}
                </CodeBlock>
              </motion.section>

              {/* Features */}
              <motion.section 
                id="mcp-features"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">05</span>
                  Key Features
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Shepherd-MCP brings powerful capabilities to your AI coding assistant:
                </motion.p>

                <motion.div variants={fadeInUp}>
                  <MCPFeaturesGrid />
                </motion.div>

                <motion.p variants={fadeInUp}>
                  With native integration into platforms like <strong>Emergent</strong>, this becomes even more seamless—just a click of a button to enable full observability context in your coding sessions.
                </motion.p>
              </motion.section>

              {/* Validation */}
              <motion.section 
                id="mcp-validation"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">06</span>
                  Do Teams Really Want This?
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Before building Shepherd-MCP, we talked to teams to understand if this is real—or yet another cool AI feature. Here's what we heard:
                </motion.p>

                <motion.div variants={fadeInUp}>
                  <ValidationQuotes />
                </motion.div>

                <motion.div className="mcp-validation-verdict" variants={fadeInUp}>
                  <CheckCircle2 size={24} />
                  <span>Guess what? <strong>They want it.</strong></span>
                </motion.div>
              </motion.section>

              {/* The Future */}
              <motion.section 
                id="mcp-future"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">07</span>
                  The Intersection of Observability and Agentic Coding
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  We're at an inflection point. The observability market is massive—<strong>$50B+ by 2030</strong>. AI developer tools are the fastest growing segment. Every AI agent needs observability.
                </motion.p>

                <motion.div className="mcp-market-stats" variants={fadeInUp}>
                  <div className="mcp-market-stat">
                    <Globe size={24} />
                    <span className="mcp-market-stat__value">$50B+</span>
                    <span className="mcp-market-stat__label">Observability / AI Agent Market by 2030</span>
                  </div>
                  <div className="mcp-market-stat">
                    <Users size={24} />
                    <span className="mcp-market-stat__value">30M+</span>
                    <span className="mcp-market-stat__label">Developers worldwide</span>
                  </div>
                </motion.div>

                <QuoteBlock>
                  The intersection of observability and agentic coding is where we play.
                </QuoteBlock>

                <motion.p variants={fadeInUp}>
                  Shepherd-MCP is just the beginning. As MCP adoption grows and AI coding assistants become the default, the need for seamless observability integration will only increase.
                </motion.p>

                <KeyInsight icon={<Rocket size={18} />}>
                  Shepherd-MCP: Bringing observability into the age of agentic coding.
                </KeyInsight>
              </motion.section>

              {/* Final Word */}
              <motion.section 
                className="blog-section blog-section--final"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  Getting Started
                </motion.h2>

                <motion.p className="blog-lead" variants={fadeInUp}>
                  Ready to bring observability into your IDE? Setting up Shepherd-MCP takes just a few minutes:
                </motion.p>

                <motion.ol className="blog-list blog-list--numbered" variants={fadeInUp}>
                  <li>Install the Shepherd-MCP package</li>
                  <li>Configure your observability tool credentials</li>
                  <li>Add to your IDE's MCP configuration</li>
                  <li>Start debugging with AI</li>
                </motion.ol>

                <motion.p variants={fadeInUp}>
                  Check out our <a href="https://github.com/neuralis-ai/shepherd-mcp" target="_blank" rel="noopener noreferrer">GitHub repository</a> for detailed setup instructions and examples.
                </motion.p>
              </motion.section>

              {/* CTA */}
              <motion.div 
                className="blog-cta"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="blog-cta__title">Ready to debug with AI?</h3>
                <p className="blog-cta__text">Try Shepherd-MCP and bring observability directly into your coding workflow.</p>
                <div className="blog-cta__buttons">
                  <a 
                    href="https://github.com/neuralis-ai/shepherd-mcp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                  >
                    <Github size={16} />
                    View on GitHub
                  </a>
                  <Link to="/playground" className="btn btn--secondary">
                    <PlayCircle size={16} />
                    Try the Playground
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// Dashboard Blog Article Content
function DashboardBlogArticle() {
  return (
    <article className="blog-article">
      {/* Hero */}
      <motion.header 
        className="blog-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="blog-hero__meta" variants={fadeInUp}>
            <span className="blog-hero__tag">Observability</span>
            <span className="blog-hero__separator">•</span>
            <span className="blog-hero__date">
              <Calendar size={14} />
              December 9, 2025
            </span>
            <span className="blog-hero__separator">•</span>
            <span className="blog-hero__read-time">
              <Clock size={14} />
              10 min read
            </span>
          </motion.div>
          
          <motion.h1 className="blog-hero__title" variants={fadeInUp}>
            Why dashboards are the power center of AI observability.
          </motion.h1>
          
          <motion.p className="blog-hero__subtitle" variants={fadeInUp}>
            The Control Room for AI You Can Actually Trust
          </motion.p>

          <motion.div className="blog-hero__author" variants={fadeInUp}>
            <div className="blog-hero__author-avatar">
              <User size={20} />
            </div>
            <div className="blog-hero__author-info">
              <span className="blog-hero__author-name">Shepherd Team</span>
              <span className="blog-hero__author-role">Engineering</span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="blog-content">
        <div className="container">
          <div className="blog-content__wrapper">
            <DashboardTableOfContents />
            
            <div className="blog-content__main">
              {/* Introduction */}
              <motion.section 
                id="introduction"
                className="blog-section"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">01</span>
                  Introduction
                </motion.h2>

                <motion.p className="blog-lead" variants={fadeInUp}>
                  In today's AI-driven world, your models aren't just running code—they're creating reasoning paths, making decisions, calling tools, fetching context, and influencing user experience at scale.
                </motion.p>

                <motion.p variants={fadeInUp}>
                  But here's the truth few teams admit:
                </motion.p>

                <QuoteBlock>
                  If you can't see what your AI is doing, you can't trust what your AI is doing.
                </QuoteBlock>

                <motion.p variants={fadeInUp}>
                  That's why dashboards are not an optional add-on for observability platforms. They are the <strong>power center</strong>, the <strong>control room</strong>, and often the deciding factor between AI that quietly drifts into chaos… and AI that consistently delivers value.
                </motion.p>

                <motion.div variants={scaleIn}>
                  <DashboardVisual />
                </motion.div>

                <motion.p variants={fadeInUp}>
                  Let's break down why dashboards matter so much—and why every serious AI team needs them.
                </motion.p>
              </motion.section>

              {/* Section 2: Hidden to Visible */}
              <motion.section 
                id="hidden-visible"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">02</span>
                  Dashboards turn hidden AI behavior into visible insights
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  AI systems generate <strong>massive activity</strong> behind the scenes:
                </motion.p>

                <motion.div variants={fadeInUp}>
                  <AIActivityItems />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <ChaosVsClarityVisual />
                </motion.div>

                <KeyInsight icon={<Eye size={18} />}>
                  Without a dashboard, this behavior remains buried in logs. With one, it becomes beautifully visible—trends, spikes, anomalies, regressions—everything that impacts reliability and user trust.
                </KeyInsight>

                <motion.p className="blog-emphasis" variants={fadeInUp}>
                  <strong>Dashboards make the invisible, visible.</strong>
                </motion.p>
              </motion.section>

              {/* Section 3: Single Source of Truth */}
              <motion.section 
                id="single-source"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">03</span>
                  They give product, engineering, and leadership a single source of truth
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  AI touches multiple parts of the business. Everyone wants answers:
                </motion.p>

                <motion.div className="questions-grid" variants={fadeInUp}>
                  {[
                    { q: 'Why did this response fail?', icon: <XCircle size={18} /> },
                    { q: 'Which model version performs better?', icon: <GitBranch size={18} /> },
                    { q: 'Is our cost increasing because of prompt drift?', icon: <TrendingUp size={18} /> },
                    { q: 'Did yesterday\'s deploy break anything?', icon: <AlertTriangle size={18} /> },
                  ].map((item, i) => (
                    <div key={i} className="questions-grid__item">
                      <span className="questions-grid__icon">{item.icon}</span>
                      <span>{item.q}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.p variants={fadeInUp}>
                  Dashboards unify all these questions under <strong>one lens</strong>.
                </motion.p>

                <motion.div className="benefits-pills" variants={fadeInUp}>
                  <span className="benefits-pill">
                    <Users size={14} />
                    They align teams
                  </span>
                  <span className="benefits-pill">
                    <Zap size={14} />
                    They accelerate decisions
                  </span>
                  <span className="benefits-pill">
                    <Target size={14} />
                    They eliminate guesswork
                  </span>
                </motion.div>

                <KeyInsight icon={<Lightbulb size={18} />}>
                  Because when the numbers are on the screen, the conversation shifts from <strong>opinions → outcomes</strong>.
                </KeyInsight>
              </motion.section>

              {/* Section 4: Debugging */}
              <motion.section 
                id="debugging"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">04</span>
                  Dashboards reduce debugging time from days to minutes
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  When AI misbehaves, teams often scramble with backfilled logs, manual experiments, and inconsistent test prompts.
                </motion.p>

                <motion.div variants={scaleIn}>
                  <DebuggingComparison />
                </motion.div>

                <motion.p variants={fadeInUp}>
                  Dashboards remove friction instantly. You can pinpoint failing traces, tool-call bottlenecks, long reasoning paths, hallucination hotspots, and version-level regressions.
                </motion.p>

                <KeyInsight icon={<Rocket size={18} />}>
                  What used to take hours of detective work becomes <strong>a few clicks</strong>. Your team moves from <strong>firefighting → forward momentum</strong>.
                </KeyInsight>
              </motion.section>

              {/* Section 5: Cost Optimization */}
              <motion.section 
                id="cost-waste"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">05</span>
                  Dashboards expose cost waste—and unlock optimization
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Most teams underestimate how much money leaks through inefficient AI operations:
                </motion.p>

                <motion.div variants={scaleIn}>
                  <CostBreakdownVisual />
                </motion.div>

                <motion.p variants={fadeInUp}>
                  Dashboards surface this in real time:
                </motion.p>

                <motion.div variants={fadeInUp}>
                  <DashboardMetricsGrid />
                </motion.div>

                <KeyInsight icon={<DollarSign size={18} />}>
                  When cost clarity goes up, <strong>cost burn goes down</strong>.
                </KeyInsight>
              </motion.section>

              {/* Section 6: Building Confidence */}
              <motion.section 
                id="confidence"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">06</span>
                  They build confidence—internally and externally
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Leaders, stakeholders, and customers all want to know:
                </motion.p>

                <motion.ul className="blog-list" variants={fadeInUp}>
                  <li>Is this AI stable?</li>
                  <li>Can we trust the outputs?</li>
                  <li>How do we know nothing broke?</li>
                </motion.ul>

                <motion.p variants={fadeInUp}>
                  Dashboards give teams the confidence to:
                </motion.p>

                <motion.div className="confidence-actions" variants={fadeInUp}>
                  <div className="confidence-action">
                    <Rocket size={20} />
                    <span>Ship faster</span>
                  </div>
                  <div className="confidence-action">
                    <FlaskConical size={20} />
                    <span>Experiment more</span>
                  </div>
                  <div className="confidence-action">
                    <TrendingUp size={20} />
                    <span>Scale without fear</span>
                  </div>
                </motion.div>

                <motion.div variants={scaleIn}>
                  <ConfidenceChainVisual />
                </motion.div>
              </motion.section>

              {/* Section 7: The Future */}
              <motion.section 
                id="future"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">07</span>
                  Dashboards unlock the next era of AI automation
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Dashboards don't just show what happened. They enable <strong>what comes next</strong>:
                </motion.p>

                <motion.div variants={scaleIn}>
                  <FutureCapabilitiesVisual />
                </motion.div>

                <KeyInsight icon={<Sparkles size={18} />}>
                  The future of AI observability is <strong>proactive, not reactive</strong>. Dashboards lay that foundation.
                </KeyInsight>
              </motion.section>

              {/* Final Word */}
              <motion.section 
                className="blog-section blog-section--final"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  Final Word: If AI is the engine, dashboards are the cockpit
                </motion.h2>

                <motion.div variants={scaleIn}>
                  <CockpitAnalogy />
                </motion.div>

                <motion.p className="blog-lead" variants={fadeInUp}>
                  Every high-performing AI team understands this simple truth:
                </motion.p>

                <QuoteBlock>
                  You can't scale what you can't see.
                </QuoteBlock>

                <motion.p variants={fadeInUp}>
                  Dashboards transform scattered AI activity into a <strong>control environment</strong> where teams can monitor, tune, and evolve their systems with confidence.
                </motion.p>

                <motion.p variants={fadeInUp}>
                  This is why modern AI products—LLM apps, agents, copilots, and decision systems—are increasingly built on top of observability dashboards that provide <strong>clarity, stability, and trust</strong>.
                </motion.p>
              </motion.section>

              {/* CTA */}
              <motion.div 
                className="blog-cta"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="blog-cta__title">Ready to see what your AI is really doing?</h3>
                <p className="blog-cta__text">Start observing your AI agents with Shepherd today. Beautiful dashboards, powerful insights.</p>
                <div className="blog-cta__buttons">
                  <Link to="/api-keys" className="btn btn--primary">
                    Get Started Free
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/playground" className="btn btn--secondary">
                    <PlayCircle size={16} />
                    Try the Playground
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// Main Blog Article Content (Self-Healing Prompts)
function BlogArticle() {
  return (
    <article className="blog-article">
      {/* Hero */}
      <motion.header 
        className="blog-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="blog-hero__meta" variants={fadeInUp}>
            <span className="blog-hero__tag">AI Systems</span>
            <span className="blog-hero__separator">•</span>
            <span className="blog-hero__date">
              <Calendar size={14} />
              December 2, 2025
            </span>
            <span className="blog-hero__separator">•</span>
            <span className="blog-hero__read-time">
              <Clock size={14} />
              15 min read
            </span>
          </motion.div>
          
          <motion.h1 className="blog-hero__title" variants={fadeInUp}>
            How Self-Healing Prompts Will Work
          </motion.h1>
          
          <motion.p className="blog-hero__subtitle" variants={fadeInUp}>
            A Simple, Intuitive Guide to the Future of AI Reliability
          </motion.p>

          <motion.div className="blog-hero__author" variants={fadeInUp}>
            <div className="blog-hero__author-avatar">
              <User size={20} />
            </div>
            <div className="blog-hero__author-info">
              <span className="blog-hero__author-name">Shepherd Team</span>
              <span className="blog-hero__author-role">Engineering</span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="blog-content">
        <div className="container">
          <div className="blog-content__wrapper">
            <TableOfContents />
            
            <div className="blog-content__main">
              {/* Introduction */}
              <motion.section 
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.p className="blog-lead" variants={fadeInUp}>
                  AI systems today behave a bit like talented but unpredictable interns — brilliant one moment, confusing the next.
                </motion.p>

                <motion.div variants={fadeInUp}>
                  <AIFailureTypes />
                </motion.div>

                <motion.p variants={fadeInUp}>
                  The surprising part? <strong>These failures usually happen silently, without any alert or visibility.</strong>
                </motion.p>

                <motion.p variants={fadeInUp}>
                  As companies deploy more AI into real workflows — customer support, agents, automations, copilots — reliability becomes the biggest bottleneck.
                </motion.p>

                <KeyInsight>
                  <strong>This is where self-healing prompts come in.</strong> Self-healing prompts create an automated feedback loop that learns from real-world usage and continuously improves the instructions given to AI models.
                </KeyInsight>
              </motion.section>

              {/* The Intuition */}
              <motion.section 
                id="intuition"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">01</span>
                  The Intuition
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Imagine every time your AI makes a mistake, someone quietly takes notes:
                </motion.p>

                <motion.ul className="blog-list" variants={fadeInUp}>
                  <li>What the AI was asked</li>
                  <li>What it replied</li>
                  <li>Why the reply was wrong</li>
                  <li>What "good" should look like</li>
                </motion.ul>

                <motion.p variants={fadeInUp}>
                  After enough examples accumulate, another system steps in and says:
                </motion.p>

                <QuoteBlock>
                  "Let me rewrite the instructions so the AI stops repeating these mistakes."
                </QuoteBlock>

                <motion.p variants={fadeInUp}>
                  It then tests the new instructions, compares them with the old version, and deploys the improved one — <strong>automatically</strong>.
                </motion.p>

                <motion.div variants={scaleIn}>
                  <SelfHealingLoopDiagram />
                </motion.div>

                <motion.p className="blog-caption" variants={fadeInUp}>
                  This entire cycle happens in the background: <strong>Observe → Evaluate → Learn → Improve → Deploy</strong>
                </motion.p>

                <motion.p variants={fadeInUp}>
                  That's a self-healing prompt.
                </motion.p>
              </motion.section>

              {/* Why This Matters */}
              <motion.section 
                id="why-matters"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">02</span>
                  Why This Matters
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Right now, prompts are <strong>static text written once and never updated</strong> — even though:
                </motion.p>

                <motion.div className="reasons-grid" variants={fadeInUp}>
                  {[
                    { icon: <RefreshCw size={20} />, text: 'Models change every few months' },
                    { icon: <Users size={20} />, text: 'User behavior evolves' },
                    { icon: <Target size={20} />, text: 'Product requirements shift' },
                    { icon: <AlertTriangle size={20} />, text: 'Edge cases appear' },
                    { icon: <XCircle size={20} />, text: 'New failure modes emerge' },
                  ].map((reason, i) => (
                    <div key={i} className="reason-item">
                      <span className="reason-item__icon">{reason.icon}</span>
                      <span>{reason.text}</span>
                    </div>
                  ))}
                </motion.div>

                <KeyInsight icon={<AlertTriangle size={18} />}>
                  Without a feedback loop, prompts decay over time.
                </KeyInsight>

                <motion.p variants={fadeInUp}>
                  Self-healing prompts turn prompts into <strong>living pieces of the system</strong> — always adapting, always improving.
                </motion.p>
              </motion.section>

              {/* How It Works - Technical */}
              <motion.section 
                id="how-works"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">03</span>
                  How Self-Healing Prompts Actually Work
                </motion.h2>

                <motion.p className="blog-section__intro" variants={fadeInUp}>
                  Although the idea sounds simple, the engineering behind it has <strong>5 carefully designed stages</strong>.
                </motion.p>

                <div className="process-steps">
                  <ProcessStep 
                    number="1" 
                    icon={<Database size={20} />} 
                    title="Collect Traces Automatically"
                    color="#111"
                  >
                    <p>Every LLM interaction generates a trace, which includes:</p>
                    
                    <CodeBlock filename="trace_example.json" language="json">
{`{
  "trace_id": "abc123",
  "provider": "openai",
  "api": "chat.completions",
  "request": {
    "model": "gpt-4",
    "messages": [...],
    "temperature": 0.7
  },
  "response": {
    "choices": [...],
    "usage": { "prompt_tokens": 142, "completion_tokens": 856 }
  },
  "duration_ms": 1842,
  "callsite": "agents/rag.py:67",
  "function_name": "rag_query"
}`}
                    </CodeBlock>

                    <p className="process-step__note">These traces accumulate silently in the background — no developer effort needed. This is the fuel for self-healing.</p>
                  </ProcessStep>

                  <ProcessStep 
                    number="2" 
                    icon={<Eye size={20} />} 
                    title="Evaluate Each Output"
                    color="#333"
                  >
                    <p>Each trace is run through an evaluation pipeline consisting of:</p>
                    <EvaluationPipeline />
                    
                    <motion.div variants={fadeInUp}>
                      <h4 className="process-step__subtitle">Example evaluation checks:</h4>
                      <CodeBlock filename="evaluation_checks.py" language="python">
{`# Custom evaluation rules
def check_json_format(output: str) -> bool:
    """Ensure output is valid JSON"""
    try:
        json.loads(output)
        return True
    except:
        return False

def check_required_fields(output: dict) -> bool:
    """Verify all required fields are present"""
    required = ["summary", "confidence", "sources"]
    return all(field in output for field in required)

# Built-in aiobs metrics
aiobs.relevance      # Semantic relevance to input
aiobs.coherence      # Logical flow and consistency  
aiobs.faithfulness   # Grounded in provided context
aiobs.conciseness    # Appropriate length
aiobs.toxicity       # Safety check`}
                      </CodeBlock>
                    </motion.div>
                    
                    <p className="process-step__note">Human feedback becomes even more valuable than automated evaluations.</p>
                  </ProcessStep>

                  <ProcessStep 
                    number="3" 
                    icon={<Layers size={20} />} 
                    title="Build an Evaluation Dataset"
                    color="#444"
                  >
                    <p>As evaluations come in, the system stores structured examples:</p>
                    
                    <EvalSetVisualization />

                    <p>Once enough examples accumulate for a specific prompt — say <strong>500 traces</strong> — the system finally has statistically meaningful evidence of what's working and what's not.</p>
                    
                    <KeyInsight icon={<Database size={18} />}>
                      This threshold is configurable. When reached, it triggers the self-healing process.
                    </KeyInsight>
                  </ProcessStep>

                  <ProcessStep 
                    number="4" 
                    icon={<Sparkles size={20} />} 
                    title="Optimize the Prompt Using GEPA (or DSPy)"
                    color="#555"
                  >
                    <p>With a rich dataset in hand, the system:</p>
                    <ul className="blog-list blog-list--compact">
                      <li>Calculates the baseline score from current prompt</li>
                      <li>Feeds traces + feedback into the GEPA optimizer</li>
                      <li>Generates candidate improved prompts</li>
                      <li>Compiles them into LLM-ready form</li>
                      <li>Tests them against the evaluation dataset</li>
                    </ul>

                    <CodeBlock filename="optimizer_flow.py" language="python">
{`import dspy
from shepherd.optimizer import GEPA

# Create DSPy dataset from eval_set
dataset = [
    dspy.Example(
        input=trace.input,
        system_prompt=trace.system_prompt,
        output=trace.output,
        # Evaluation scores
        relevance=trace.evals["aiobs.relevance"],
        coherence=trace.evals["aiobs.coherence"],
        faithfulness=trace.evals["aiobs.faithfulness"],
        # Human or LLM feedback
        feedback=trace.manual_feedback or trace.llm_feedback
    )
    for trace in eval_set.get_traces(limit=500)
]

# Get current baseline score
baseline_score = evaluate_prompt(current_prompt, dataset)
print(f"Baseline score: {baseline_score:.2f}")

# Run GEPA optimizer
optimizer = GEPA(
    metric=combined_score,  # Weighted combination of evals
    num_candidates=10,
    max_iterations=50
)

optimized_prompt = optimizer.compile(
    current_prompt,
    trainset=dataset[:400],
    valset=dataset[400:]
)

# Test new prompt
new_score = evaluate_prompt(optimized_prompt, dataset)
print(f"Optimized score: {new_score:.2f}")
print(f"Improvement: +{(new_score - baseline_score) * 100:.1f}%")`}
                    </CodeBlock>
                    
                    <KeyInsight icon={<Code size={18} />}>
                      For engineers: This is essentially <strong>gradient-free policy optimization</strong> over prompt space, guided by evaluator rewards.
                    </KeyInsight>
                  </ProcessStep>

                  <ProcessStep 
                    number="5" 
                    icon={<GitBranch size={20} />} 
                    title="A/B Test and Safely Deploy"
                    color="#10B981"
                  >
                    <p>Before replacing your production prompt:</p>
                    <ul className="blog-list blog-list--compact">
                      <li>The old prompt and new prompt run side-by-side</li>
                      <li>On the same evaluation set</li>
                      <li>With identical metrics</li>
                      <li>Producing a measurable lift or drop</li>
                    </ul>
                    
                    <CodeBlock filename="ab_testing.py" language="python">
{`from shepherd.testing import ABTest

# Configure A/B test
ab_test = ABTest(
    control=current_prompt,
    treatment=optimized_prompt,
    traffic_split=0.1,  # 10% to new prompt initially
    min_samples=100,
    significance_level=0.05
)

# Run test
results = ab_test.run(eval_dataset)

print(f"""
A/B Test Results:
─────────────────
Control Score:   {results.control_score:.3f}
Treatment Score: {results.treatment_score:.3f}
Lift:            {results.lift:+.1%}
P-value:         {results.p_value:.4f}
Significant:     {'✓ Yes' if results.is_significant else '✗ No'}
""")

# Deploy if significant improvement
if results.is_significant and results.lift > 0.05:
    shepherd.deploy_prompt(optimized_prompt)
    print("✓ New prompt deployed!")`}
                    </CodeBlock>
                    
                    <p className="process-step__note">If the new prompt reliably performs better — only then is it recommended for deployment. This prevents regressions and keeps the system stable.</p>
                  </ProcessStep>
                </div>
              </motion.section>

              {/* Shepherd's Specific Approach */}
              <motion.section 
                id="shepherd-approach"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">04</span>
                  Shepherd's Approach
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Here's exactly how Shepherd implements self-healing prompts:
                </motion.p>

                <motion.div variants={scaleIn}>
                  <ArchitectureDiagram />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h3 className="blog-subsection__title">Step 1: Instrument Your Code</h3>
                  <p>Use the <InlineCode>@observe</InlineCode> decorator from <strong>aiobs</strong> (our open-source Python SDK) to enable prompt enhancement:</p>
                  
                  <CodeBlock filename="agents/rag.py" language="python">
{`from aiobs import observer, observe
import aiobs

# Initialize observer with your API key
observer.observe(api_key="aiobs_sk_xxx")

@observe(
    enh_prompt=True,  # Enable self-healing for this function
    eval=[
        aiobs.relevance,    # Built-in: semantic relevance
        aiobs.coherence,    # Built-in: logical consistency
        aiobs.faithfulness, # Built-in: grounded in context
        check_json_format,  # Custom: your own evaluator
        check_required_fields,
    ]
)
def rag_query(question: str, context: list[str]) -> str:
    """
    RAG function that will automatically:
    1. Trace every openai.chat_completions call
    2. Run evaluation on outputs
    3. Store results in eval_set
    4. Trigger optimization when threshold reached
    """
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Context: {context}\\n\\nQuestion: {question}"}
        ]
    )
    return response.choices[0].message.content

# Don't forget to flush traces
observer.end()
observer.flush()`}
                  </CodeBlock>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h3 className="blog-subsection__title">Step 2: Automatic Trace Collection</h3>
                  <p>With <InlineCode>enh_prompt=True</InlineCode>, Shepherd automatically:</p>
                  
                  <ul className="blog-list">
                    <li>Captures every <InlineCode>openai.chat_completions</InlineCode> call inside the decorated function</li>
                    <li>Runs all specified evaluators on each output</li>
                    <li>Adds an LLM-as-judge feedback score</li>
                    <li>Stores everything in the <InlineCode>eval_set</InlineCode> database</li>
                  </ul>

                  <CodeBlock filename="eval_set_schema.sql" language="sql">
{`-- Shepherd's eval_set table structure
CREATE TABLE eval_set (
    id              UUID PRIMARY KEY,
    trace_id        UUID REFERENCES traces(id),
    function_name   VARCHAR(255),
    provider_event  VARCHAR(100),  -- e.g., 'openai.chat_completions'
    
    -- Core trace data
    input           TEXT,
    system_prompt   TEXT,
    output          TEXT,
    
    -- Evaluation results (JSONB for flexibility)
    eval_results    JSONB,  -- {"aiobs.relevance": 0.92, "custom.format": 1.0, ...}
    
    -- Feedback
    llm_feedback    TEXT,           -- LLM-as-judge reasoning
    llm_score       FLOAT,          -- LLM-as-judge score
    manual_feedback TEXT,           -- Human annotation (from playground)
    manual_label    VARCHAR(50),    -- 'correct' | 'incorrect' | 'partial'
    
    -- Metadata
    created_at      TIMESTAMP DEFAULT NOW(),
    model           VARCHAR(100),
    latency_ms      INTEGER,
    token_count     INTEGER
);

-- Index for fast threshold checks
CREATE INDEX idx_eval_set_function_event 
ON eval_set(function_name, provider_event);`}
                  </CodeBlock>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h3 className="blog-subsection__title">Step 3: Human Labeling in Playground</h3>
                  <p>On the Shepherd Playground, you can review traces and add human feedback:</p>
                  
                  <div className="playground-preview">
                    <div className="playground-preview__header">
                      <div className="playground-preview__dots">
                        <span></span><span></span><span></span>
                      </div>
                      <span>Shepherd Playground - Human Labeling</span>
                    </div>
                    <div className="playground-preview__content">
                      <div className="playground-preview__trace">
                        <div className="playground-preview__label">Input</div>
                        <p>"What are the benefits of using RAG?"</p>
                      </div>
                      <div className="playground-preview__trace">
                        <div className="playground-preview__label">Output</div>
                        <p>"RAG provides accurate, up-to-date responses by..."</p>
                      </div>
                      <div className="playground-preview__evals">
                        <span className="playground-preview__eval playground-preview__eval--pass">relevance: 0.92</span>
                        <span className="playground-preview__eval playground-preview__eval--pass">coherence: 0.88</span>
                        <span className="playground-preview__eval playground-preview__eval--warn">faithfulness: 0.76</span>
                      </div>
                      <div className="playground-preview__actions">
                        <button className="playground-preview__btn playground-preview__btn--correct">
                          <ThumbsUp size={16} />
                          Correct
                        </button>
                        <button className="playground-preview__btn playground-preview__btn--incorrect">
                          <ThumbsDown size={16} />
                          Incorrect
                        </button>
                        <button className="playground-preview__btn playground-preview__btn--partial">
                          <MessageSquare size={16} />
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p>Human labels are stored as <InlineCode>manual_feedback</InlineCode> and take precedence over automated LLM feedback during optimization.</p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h3 className="blog-subsection__title">Step 4: Threshold Trigger & Optimization</h3>
                  <p>When the configured threshold is reached (e.g., 500 traces for <InlineCode>rag_query</InlineCode> + <InlineCode>openai.chat_completions</InlineCode>), Shepherd:</p>

                  <CodeBlock filename="shepherd_optimization.py" language="python">
{`# Shepherd's internal optimization trigger
class PromptOptimizer:
    def check_threshold(self, function_name: str, event: str):
        count = self.db.count_eval_set(
            function_name=function_name,
            provider_event=event
        )
        
        threshold = self.config.get_threshold(function_name)
        
        if count >= threshold:
            self.trigger_optimization(function_name, event)
    
    def trigger_optimization(self, function_name: str, event: str):
        # 1. Fetch traces from eval_set
        traces = self.db.get_eval_set(
            function_name=function_name,
            provider_event=event,
            limit=self.config.threshold
        )
        
        # 2. Create DSPy-compatible dataset
        dataset = self.create_dspy_dataset(traces)
        
        # 3. Calculate baseline score
        baseline = self.evaluate_current_prompt(dataset)
        
        # 4. Run GEPA optimizer
        optimized = self.gepa.optimize(
            current_prompt=self.get_current_prompt(function_name),
            dataset=dataset,
            metric=self.combined_metric
        )
        
        # 5. A/B test
        ab_results = self.run_ab_test(
            control=self.get_current_prompt(function_name),
            treatment=optimized,
            dataset=dataset
        )
        
        # 6. Render results on dashboard
        self.dashboard.show_optimization_results(
            function_name=function_name,
            baseline_score=baseline,
            optimized_score=ab_results.treatment_score,
            lift=ab_results.lift,
            new_prompt=optimized if ab_results.is_significant else None
        )`}
                  </CodeBlock>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h3 className="blog-subsection__title">Step 5: Review & Deploy</h3>
                  <p>The final DSPy dataset used for optimization looks like:</p>

                  <CodeBlock filename="final_dataset_structure.json" language="json">
{`{
  "examples": [
    {
      "input": "What are the benefits of using RAG?",
      "system_prompt": "You are a helpful assistant...",
      "output": "RAG provides accurate, up-to-date responses by...",
      "eval_scores": {
        "aiobs.relevance": 0.92,
        "aiobs.coherence": 0.88,
        "aiobs.faithfulness": 0.76,
        "custom.format_check": 1.0,
        "custom.required_fields": 1.0
      },
      "feedback": "correct",  // manual_feedback if available, else llm_feedback
      "feedback_source": "human"  // or "llm"
    },
    // ... 499 more examples
  ],
  "metadata": {
    "function_name": "rag_query",
    "provider_event": "openai.chat_completions",
    "threshold": 500,
    "baseline_score": 0.82,
    "human_labeled_count": 127,
    "auto_labeled_count": 373
  }
}`}
                  </CodeBlock>
                </motion.div>
              </motion.section>

              {/* The Feedback Loop */}
              <motion.section 
                id="feedback-loop"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">05</span>
                  The Closed-Loop Feedback Cycle
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  When you put all pieces together, self-healing prompts form a continuous loop:
                </motion.p>

                <motion.div className="loop-flow" variants={scaleIn}>
                  {['Collect traces', 'Evaluate', 'Build dataset', 'Optimize prompt', 'A/B test', 'Deploy', 'Repeat'].map((step, i) => (
                    <div key={i} className="loop-flow__item">
                      <span className="loop-flow__step">{step}</span>
                      {i < 6 && <ChevronRight size={16} className="loop-flow__arrow" />}
                    </div>
                  ))}
                </motion.div>

                <KeyInsight icon={<Repeat size={18} />}>
                  This transforms the prompt from a <strong>fixed string</strong> into an <strong>adaptive system component</strong> — improving itself using real-world data.
                </KeyInsight>
              </motion.section>

              {/* Why This Will Become Standard */}
              <motion.section 
                id="future"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">06</span>
                  Why This Will Become Standard in AI Systems
                </motion.h2>

                <motion.p variants={fadeInUp}>
                  Three big shifts make self-healing prompts inevitable:
                </motion.p>

                <motion.div className="shifts-grid" variants={fadeInUp}>
                  <div className="shift-card">
                    <div className="shift-card__number">1</div>
                    <h4>AI systems are stochastic, not deterministic</h4>
                    <p>They behave differently across calls and model versions.</p>
                  </div>
                  <div className="shift-card">
                    <div className="shift-card__number">2</div>
                    <h4>Manual prompt tuning doesn't scale</h4>
                    <p>Engineering teams cannot inspect thousands of daily outputs.</p>
                  </div>
                  <div className="shift-card">
                    <div className="shift-card__number">3</div>
                    <h4>Reliability is now the bottleneck</h4>
                    <p>Production agents, copilots, and LLM apps need predictable behavior.</p>
                  </div>
                </motion.div>

                <QuoteBlock>
                  Just as modern software has CI/CD, monitoring, and error reporting… AI systems will have automated prompt healing.
                </QuoteBlock>
              </motion.section>

              {/* Who Benefits */}
              <motion.section 
                id="benefits"
                className="blog-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  <span className="blog-section__number">07</span>
                  Who Benefits Most
                </motion.h2>

                <motion.div variants={fadeInUp}>
                  <BenefitsSection />
                </motion.div>
              </motion.section>

              {/* Final Thoughts */}
              <motion.section 
                className="blog-section blog-section--final"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="blog-section__title" variants={fadeInUp}>
                  Final Thoughts
                </motion.h2>

                <motion.p className="blog-lead" variants={fadeInUp}>
                  Self-healing prompts turn prompts from static instructions into a <strong>learning artifact that improves every week</strong>.
                </motion.p>

                <motion.p variants={fadeInUp}>
                  Instead of waiting for failures, the system actively fixes itself.
                </motion.p>

                <KeyInsight icon={<Sparkles size={18} />}>
                  This is the future of AI reliability — AI systems that grow more accurate the longer they run.
                </KeyInsight>
              </motion.section>

              {/* CTA */}
              <motion.div 
                className="blog-cta"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="blog-cta__title">Ready to make your AI agents reliable?</h3>
                <p className="blog-cta__text">Start tracing your agents with Shepherd today. Self-healing prompts coming soon.</p>
                <div className="blog-cta__buttons">
                  <Link to="/api-keys" className="btn btn--primary">
                    Get Started Free
                    <ArrowRight size={16} />
                  </Link>
                  <a 
                    href="https://github.com/neuralis-in/aiobs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn--secondary"
                  >
                    <Github size={16} />
                    View aiobs on GitHub
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// Blog Footer
function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="container blog-footer__container">
        <span>© Shepherd, 2025</span>
        <div className="blog-footer__links">
          <Link to="/">Home</Link>
          <Link to="/pricing">Pricing</Link>
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer">Docs</a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer">GitHub</a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

// Single Blog Post Page
function BlogPost() {
  const location = useLocation()
  const slug = location.pathname.replace('/blog/', '')
  
  // Determine which article to render based on the slug
  const renderArticle = () => {
    switch (slug) {
      case 'shepherd-mcp-observability-meets-agentic-coding':
        return <ShepherdMCPBlogArticle />
      case 'dashboards-power-center-ai-observability':
        return <DashboardBlogArticle />
      case 'self-healing-prompts':
      default:
        return <BlogArticle />
    }
  }
  
  return (
    <div className="blog-page">
      <BlogHeader />
      <main>
        {renderArticle()}
      </main>
      <BlogFooter />
    </div>
  )
}

// Main Blog Page (Router)
export default function Blog() {
  const location = useLocation()
  
  // If we're at /blog exactly, show the list
  // Otherwise show the article
  if (location.pathname === '/blog' || location.pathname === '/blog/') {
    return <BlogList />
  }
  
  return <BlogPost />
}
