import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Layers,
  Zap,
  TrendingUp,
  Users,
  CheckCircle,
  Github,
  Activity,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Code,
  Star,
  MessageSquare,
  GitBranch,
  BarChart3,
  Bot,
  Monitor,
  ExternalLink,
  Rocket,
  Clock,
  Target,
  Play,
  PieChart,
  User,
  X,
  Sparkles,
  FlaskConical,
  Calendar,
  Crosshair,
  AlertTriangle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Database,
  Megaphone,
  Brain,
  Award,
  MousePointer,
  RefreshCw,
  MonitorPlay,
  Wrench,
  Search,
  DollarSign,
  Shield,
  FileText,
  Plug,
  CircleDollarSign,
  Package
} from 'lucide-react'
import './ShepherdProgress.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// Week definitions
const weeks = {
  week1: {
    id: 'week1',
    dateRange: 'December 5 – December 12, 2025',
    shortDate: 'Dec 5–12',
    slides: [
      { id: 'cover', title: 'Progress' },
      { id: 'recap', title: 'Recap' },
      { id: 'dev-updates', title: 'Development' },
      { id: 'traction', title: 'Traction' },
      { id: 'cli-wedge', title: 'CLI Wedge' },
      { id: 'why-cli-business', title: 'Why CLI' },
      { id: 'why-cli-solution', title: 'Solution' },
      { id: 'cli-demo', title: 'Demo' },
      { id: 'async-evals', title: 'Async Evals' },
      { id: 'next-week', title: "What's Next" },
    ],
    stats: {
      devUpdates: 2,
      tractionUpdates: 4,
      contributors: 5
    }
  },
  week2: {
    id: 'week2',
    dateRange: 'December 12 – December 18, 2025',
    shortDate: 'Dec 12–18',
    slides: [
      { id: 'cover', title: 'Progress' },
      { id: 'vicious-cycle', title: 'Problem' },
      { id: 'gtm-solution', title: 'Solution' },
      { id: 'dev-updates', title: 'Development' },
      { id: 'traction', title: 'Traction' },
      { id: 'pilot-feedback', title: 'Feedback' },
      { id: 'next-week', title: "What's Next" },
    ],
    stats: {
      devUpdates: 2,
      tractionUpdates: 3,
      pilotFeedback: 1
    }
  },
  week3: {
    id: 'week3',
    dateRange: 'December 19, 2025 – January 4, 2026',
    shortDate: 'Dec 19–Jan 4',
    slides: [
      { id: 'cover', title: 'Progress' },
      { id: 'dev-updates', title: 'Development' },
      { id: 'traction', title: 'Traction' },
      { id: 'strategic-thinking', title: 'Strategy' },
      { id: 'pricing-model', title: 'Pricing' },
      { id: 'trojan-horse', title: 'GTM' },
      { id: 'pilot-feedback', title: 'Feedback' },
      { id: 'whats-next', title: "What's Next" },
    ],
    stats: {
      devUpdates: 2,
      tractionUpdates: 3,
      strategicInsights: 2
    }
  }
}

// Order of weeks (newest first)
const weekOrder = ['week3', 'week2', 'week1']

function WeekSelector({ currentWeek, onWeekChange }) {
  return (
    <div className="progress-week-selector">
      <Calendar size={14} />
      <select 
        value={currentWeek} 
        onChange={(e) => onWeekChange(e.target.value)}
        className="progress-week-selector__dropdown"
      >
        {weekOrder.map((weekId) => (
          <option key={weekId} value={weekId}>
            {weeks[weekId].shortDate}
          </option>
        ))}
      </select>
    </div>
  )
}

function ProgressHeader({ currentSlide, onSlideChange, currentWeek, onWeekChange }) {
  const currentWeekData = weeks[currentWeek]
  
  return (
    <header className="pitch-header">
      <div className="pitch-header__container">
        <Link to="/pitch-deck" className="pitch-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="pitch-header__logo">
          <svg viewBox="0 0 32 32" className="pitch-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        
        <nav className="pitch-header__nav">
          {currentWeekData.slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`pitch-header__nav-item ${currentSlide === index ? 'active' : ''}`}
              onClick={() => onSlideChange(index)}
            >
              <span className="pitch-header__nav-dot" />
              <span className="pitch-header__nav-label">{slide.title}</span>
            </button>
          ))}
        </nav>

        <WeekSelector currentWeek={currentWeek} onWeekChange={onWeekChange} />

        <div className="pitch-header__badge pitch-header__badge--progress">
          Progress
        </div>
      </div>
    </header>
  )
}

function SlideNavigation({ currentSlide, totalSlides, onPrev, onNext }) {
  return (
    <div className="pitch-nav">
      <button 
        className="pitch-nav__btn" 
        onClick={onPrev}
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={20} />
      </button>
      <span className="pitch-nav__counter">
        {currentSlide + 1} / {totalSlides}
      </span>
      <button 
        className="pitch-nav__btn" 
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

// Cover Slide - Week 1
function CoverSlideWeek1() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--cover"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.div className="pitch-cover__logo" variants={fadeInUp}>
          <svg viewBox="0 0 32 32" className="pitch-cover__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.div>
        
        <motion.h1 className="pitch-cover__title" variants={fadeInUp}>
          Progress Report
        </motion.h1>
        
        <motion.p className="pitch-cover__tagline" variants={fadeInUp}>
          Building the observability layer for AI agents
        </motion.p>

        <motion.p className="pitch-cover__hook" variants={fadeInUp}>
          December 5 – December 12, 2025
        </motion.p>
        
        <motion.div className="pitch-cover__stats" variants={fadeInUp}>
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">2</span>
            <span className="pitch-cover__stat-label">Dev Updates</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">4</span>
            <span className="pitch-cover__stat-label">Traction Updates</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">5</span>
            <span className="pitch-cover__stat-label">aiobs Contributors</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Cover Slide - Week 2
function CoverSlideWeek2() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--cover"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.div className="pitch-cover__logo" variants={fadeInUp}>
          <svg viewBox="0 0 32 32" className="pitch-cover__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.div>
        
        <motion.h1 className="pitch-cover__title" variants={fadeInUp}>
          Progress Report
        </motion.h1>
        
        <motion.p className="pitch-cover__tagline" variants={fadeInUp}>
          Building the observability layer for AI agents
        </motion.p>

        <motion.p className="pitch-cover__hook" variants={fadeInUp}>
          December 12 – December 18, 2025
        </motion.p>
        
        <motion.div className="pitch-cover__stats" variants={fadeInUp}>
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">2</span>
            <span className="pitch-cover__stat-label">Dev Updates</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">3</span>
            <span className="pitch-cover__stat-label">Traction Updates</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">1</span>
            <span className="pitch-cover__stat-label">Pilot Feedback</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Recap Slide
function RecapSlide() {
  const keyPoints = [
    {
      icon: <Layers size={24} />,
      title: 'AI Agent Observability',
      description: 'Trace every LLM call, tool invocation, and decision in your agentic pipelines'
    },
    {
      icon: <Terminal size={24} />,
      title: 'CLI-First Approach',
      description: 'Built for AI-powered IDEs and coding agents, not just browser dashboards'
    },
    {
      icon: <Github size={24} />,
      title: 'Open Source Core',
      description: 'aiobs SDK is MIT licensed — full transparency and community-driven'
    },
    {
      icon: <Zap size={24} />,
      title: 'Simple Integration',
      description: 'Just 3 lines of code: observe(), end(), flush()'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--recap"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Quick Recap</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          What is Shepherd?
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Shepherd traces AI agents — so they don't fail. We provide full observability 
          for agentic pipelines, turning opaque agent behavior into debuggable timelines.
        </motion.p>

        <motion.div className="progress-recap-grid" variants={fadeInUp}>
          {keyPoints.map((point, i) => (
            <motion.div 
              key={i} 
              className="progress-recap-card"
              variants={fadeInUp}
            >
              <div className="progress-recap-card__icon">{point.icon}</div>
              <h4 className="progress-recap-card__title">{point.title}</h4>
              <p className="progress-recap-card__desc">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-recap-tagline" variants={fadeInUp}>
          <p>"Shepherd traces AI agents — <strong>so they don't fail.</strong>"</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Development Updates Slide
function DevUpdatesSlide() {
  const devUpdates = [
    {
      icon: <Star size={28} />,
      title: 'Shepherd CLI v0.0.1',
      description: 'Released first version of CLI for searching sessions, viewing traces, and debugging. CLI-first observability for agentic coding tools.',
      status: 'shipped',
      highlight: true,
      details: [
        'Session listing and search',
        'Trace tree visualization',
        'Session diff for debugging',
        'JSON output for AI IDEs'
      ]
    },
    {
      icon: <FlaskConical size={28} />,
      title: 'Asynchronous Evals Setup',
      description: 'Built infrastructure for running evaluations asynchronously on agent traces without blocking production.',
      status: 'completed',
      details: [
        'Non-blocking evaluation pipeline',
        'Correctness, latency, cost metrics',
        'Dashboard integration'
      ]
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--dev-updates"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>This Week</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <Code size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Development Updates
        </motion.h2>

        <motion.div className="progress-dev-grid" variants={fadeInUp}>
          {devUpdates.map((update, i) => (
            <motion.div 
              key={i}
              className={`progress-dev-card ${update.highlight ? 'progress-dev-card--highlight' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="progress-dev-card__header">
                <div className="progress-dev-card__icon">{update.icon}</div>
                <div className="progress-dev-card__title-section">
                  <h3>{update.title}</h3>
                  <span className={`progress-dev-card__status progress-dev-card__status--${update.status}`}>
                    {update.status === 'shipped' && <Rocket size={14} />}
                    {update.status === 'completed' && <CheckCircle size={14} />}
                    {update.status}
                  </span>
                </div>
              </div>
              <p className="progress-dev-card__desc">{update.description}</p>
              {update.details && (
                <ul className="progress-dev-card__details">
                  {update.details.map((detail, j) => (
                    <li key={j}>
                      <CheckCircle size={14} />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-dev-summary" variants={fadeInUp}>
          <p>
            <strong>Key Achievement:</strong> Shepherd CLI is now live — enabling AI-powered IDEs like Cursor and Windsurf 
            to debug agentic systems directly from the terminal.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Traction Updates Slide
function TractionSlide() {
  const tractionUpdates = [
    {
      icon: <MessageSquare size={24} />,
      company: 'Fenmo AI',
      title: 'Advancing to Pilot',
      description: 'Talked with Fenmo AI and advancing to pilot with Shepherd CLI for their agent infrastructure.',
      status: 'pilot',
      statusLabel: 'Pilot Stage'
    },
    {
      icon: <Activity size={24} />,
      company: 'Intraintel.ai',
      title: 'Active Integration',
      description: 'Intraintel.ai has started using Shepherd in their production traces for agent observability.',
      status: 'active',
      statusLabel: 'Using Shepherd'
    },
    {
      icon: <GitBranch size={24} />,
      company: 'LambdaTest',
      title: 'A/B Testing Discussions',
      description: 'Initiated talks with LambdaTest for A/B Testing integration and collaboration opportunities.',
      status: 'talks',
      statusLabel: 'In Talks'
    },
    {
      icon: <Users size={24} />,
      company: 'aiobs Community',
      title: 'Growing Contributors',
      description: 'Open source aiobs SDK community is growing with active contributors helping build the ecosystem.',
      status: 'growing',
      statusLabel: '5 Contributors'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--traction"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>This Week</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <TrendingUp size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Traction Updates
        </motion.h2>

        <motion.div className="progress-traction-grid" variants={fadeInUp}>
          {tractionUpdates.map((update, i) => (
            <motion.div 
              key={i}
              className="progress-traction-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="progress-traction-card__header">
                <div className="progress-traction-card__icon">{update.icon}</div>
                <div className="progress-traction-card__company">{update.company}</div>
                <span className={`progress-traction-card__status progress-traction-card__status--${update.status}`}>
                  {update.statusLabel}
                </span>
              </div>
              <h4 className="progress-traction-card__title">{update.title}</h4>
              <p className="progress-traction-card__desc">{update.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-traction-summary" variants={fadeInUp}>
          <p>"Real conversations, real momentum — building trust with early adopters."</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// CLI Commands data (outside component to prevent recreation on each render)
const cliCommands = [
  {
    cmd: 'shepherd sessions list -n 5',
    output: [
      { type: 'header', text: '╭────────────────────────────────────────────────╮' },
      { type: 'header', text: '│  📋 Recent Sessions                            │' },
      { type: 'header', text: '╰────────────────────────────────────────────────╯' },
      { type: 'info', text: '' },
      { type: 'label', text: '  sess_7x8k2m', value: 'travel_agent  ✓ 2.4s' },
      { type: 'error', text: '  sess_4h5j6k', value: 'order_bot     ✗ 4.1s' },
      { type: 'label', text: '  sess_2w3e4r', value: 'data_analyst  ✓ 3.2s' },
    ]
  },
  {
    cmd: 'shepherd sessions get sess_4h5j6k',
    output: [
      { type: 'header', text: '╭────────────────────────────────────────────────╮' },
      { type: 'header', text: '│  🌳 Trace Tree: sess_4h5j6k                    │' },
      { type: 'header', text: '╰────────────────────────────────────────────────╯' },
      { type: 'info', text: '' },
      { type: 'success', text: '  └─ order_bot.process', value: '4.1s' },
      { type: 'success', text: '      ├─ chat.completions', value: '890ms ✓' },
      { type: 'error', text: '      └─ set_price()', value: '3.0s ✗' },
    ]
  },
  {
    cmd: 'shepherd --provider langfuse sessions list',
    output: [
      { type: 'header', text: '╭────────────────────────────────────────────────╮' },
      { type: 'header', text: '│  🔥 Langfuse Sessions                          │' },
      { type: 'header', text: '╰────────────────────────────────────────────────╯' },
      { type: 'info', text: '' },
      { type: 'success', text: '  ✓ Connected to Langfuse' },
      { type: 'label', text: '  trace_abc123', value: 'chat_agent  ✓ 1.2s' },
      { type: 'label', text: '  trace_def456', value: 'qa_bot      ✓ 2.8s' },
    ]
  },
]

const currentProviders = [
  { name: 'Langfuse', status: 'supported', icon: '🔥' },
  { name: 'aiobs', status: 'supported', icon: '🐑' },
]

const plannedProviders = [
  { name: 'LangSmith', icon: '🦜' },
  { name: 'Portkey', icon: '🚪' },
  { name: 'Phoenix', icon: '🔶' },
  { name: 'OpenTelemetry', icon: '📡' },
]

// CLI Wedge Slide - Provider Agnostic with Terminal Demo
function CLIWedgeSlide() {
  const [activeCommand, setActiveCommand] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [displayedOutput, setDisplayedOutput] = useState([])

  useEffect(() => {
    const command = cliCommands[activeCommand]
    let outputIndex = 0
    setDisplayedOutput([])
    setIsTyping(true)

    const outputTimer = setInterval(() => {
      if (outputIndex < command.output.length) {
        // Capture the current output item to avoid closure issues
        const currentOutput = command.output[outputIndex]
        setDisplayedOutput(prev => [...prev, currentOutput])
        outputIndex++
      } else {
        setIsTyping(false)
        clearInterval(outputTimer)
      }
    }, 120)

    return () => clearInterval(outputTimer)
  }, [activeCommand])

  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setActiveCommand(prev => (prev + 1) % cliCommands.length)
    }, 6000)
    return () => clearInterval(cycleTimer)
  }, [])

  return (
    <motion.div 
      className="pitch-slide pitch-slide--cli-wedge"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Star of the Show</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          🐑 Shepherd CLI
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          <strong>Provider-agnostic observability CLI.</strong> Works with your existing tools — 
          no vendor lock-in, no migration needed.
        </motion.p>

        <motion.div className="progress-wedge-layout" variants={fadeInUp}>
          <div className="progress-wedge-terminal">
            <div className="progress-wedge-terminal__header">
              <div className="progress-wedge-terminal__dots">
                <span></span><span></span><span></span>
              </div>
              <span className="progress-wedge-terminal__title">Shepherd CLI</span>
              <div className="progress-wedge-terminal__tabs">
                {cliCommands.map((_, i) => (
                  <button
                    key={i}
                    className={`progress-wedge-terminal__tab ${activeCommand === i ? 'progress-wedge-terminal__tab--active' : ''}`}
                    onClick={() => setActiveCommand(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="progress-wedge-terminal__body">
              <div className="progress-wedge-terminal__prompt">
                <span className="progress-wedge-terminal__symbol">$</span>
                <motion.span 
                  className="progress-wedge-terminal__command"
                  key={activeCommand}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {cliCommands[activeCommand].cmd}
                </motion.span>
                {isTyping && <span className="progress-wedge-terminal__cursor">▋</span>}
              </div>
              <div className="progress-wedge-terminal__output">
                {displayedOutput.map((line, i) => (
                  line && (
                    <motion.div
                      key={`${activeCommand}-${i}`}
                      className={`progress-wedge-terminal__line progress-wedge-terminal__line--${line.type}`}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      {line.text}
                      {line.value && <span className="progress-wedge-terminal__value">{line.value}</span>}
                    </motion.div>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="progress-wedge-providers-section">
            <div className="progress-wedge-section">
              <h3 className="progress-wedge-section__title">
                <CheckCircle size={18} />
                Supported
              </h3>
              <div className="progress-wedge-providers">
                {currentProviders.map((provider, i) => (
                  <div key={i} className="progress-wedge-provider progress-wedge-provider--active">
                    <span className="progress-wedge-provider__icon">{provider.icon}</span>
                    <span className="progress-wedge-provider__name">{provider.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="progress-wedge-section">
              <h3 className="progress-wedge-section__title">
                <Rocket size={18} />
                Coming Soon
              </h3>
              <div className="progress-wedge-providers progress-wedge-providers--planned">
                {plannedProviders.map((provider, i) => (
                  <div key={i} className="progress-wedge-provider progress-wedge-provider--planned">
                    <span className="progress-wedge-provider__icon">{provider.icon}</span>
                    <span className="progress-wedge-provider__name">{provider.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-wedge-tagline" variants={fadeInUp}>
          <p><strong>One CLI, All Your Observability Tools</strong> — Switch providers with a single flag</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Why CLI - Business Case Slide
function WhyCLIBusinessSlide() {
  const stats = [
    { 
      value: '72%', 
      label: 'of developers now use AI-powered IDEs',
      source: 'Stack Overflow 2024'
    },
    { 
      value: '3M+', 
      label: 'Cursor users worldwide',
      source: 'Cursor Stats'
    },
    { 
      value: '50%', 
      label: 'of code written by AI assistants',
      source: 'GitHub Copilot'
    },
  ]

  const tools = [
    { name: 'Cursor', users: '3M+', growth: '↑ 400%' },
    { name: 'Windsurf', users: '500K+', growth: '↑ 200%' },
    { name: 'Claude Code', users: 'New', growth: '🚀' },
    { name: 'GitHub Copilot', users: '1.8M+', growth: '↑ 150%' },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--why-business"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Why CLI?</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          The Rise of Agentic Coding
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Developers have moved to AI-powered IDEs. The way we write and debug code has fundamentally changed.
        </motion.p>

        <motion.div className="progress-business-quote" variants={fadeInUp}>
          <p>"The future of coding is agentic — and debugging tools need to keep up."</p>
        </motion.div>

        <motion.div className="progress-business-stats" variants={fadeInUp}>
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              className="progress-business-stat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <span className="progress-business-stat__value">{stat.value}</span>
              <span className="progress-business-stat__label">{stat.label}</span>
              <span className="progress-business-stat__source">{stat.source}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-business-tools" variants={fadeInUp}>
          <h4>AI-Powered IDEs & Coding Agents</h4>
          <div className="progress-business-tools__grid">
            {tools.map((tool, i) => (
              <motion.div 
                key={i}
                className="progress-business-tool"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="progress-business-tool__name">{tool.name}</span>
                <span className="progress-business-tool__users">{tool.users}</span>
                <span className="progress-business-tool__growth">{tool.growth}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Why CLI - Solution Slide (Traditional vs New)
function WhyCLISolutionSlide() {
  const oldWay = [
    { icon: <PieChart size={20} />, text: "Proprietary dashboards", problem: "Can't be accessed by AI agents" },
    { icon: <User size={20} />, text: "Human-in-the-loop", problem: "Requires manual intervention" },
    { icon: <Monitor size={20} />, text: "Click-heavy workflows", problem: "No automation possible" },
    { icon: <Clock size={20} />, text: "Context switching", problem: "Leave IDE to debug" },
  ]

  const newWay = [
    { icon: <Terminal size={20} />, text: "CLI-first", benefit: "AI agents can query directly" },
    { icon: <Bot size={20} />, text: "Agent-friendly", benefit: "Automated debugging" },
    { icon: <Code size={20} />, text: "JSON output", benefit: "Parseable by any tool" },
    { icon: <Zap size={20} />, text: "In-flow", benefit: "Never leave your IDE" },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--why-solution"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Problem</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Traditional Observability Doesn't Fit
        </motion.h2>

        <motion.div className="progress-solution-comparison" variants={fadeInUp}>
          <div className="progress-solution-column progress-solution-column--old">
            <h3>
              <X size={20} />
              Traditional Observability
            </h3>
            <div className="progress-solution-list">
              {oldWay.map((item, i) => (
                <motion.div 
                  key={i}
                  className="progress-solution-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="progress-solution-item__icon">{item.icon}</div>
                  <div className="progress-solution-item__content">
                    <span className="progress-solution-item__text">{item.text}</span>
                    <span className="progress-solution-item__problem">{item.problem}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="progress-solution-arrow">
            <ArrowRight size={32} />
          </div>

          <div className="progress-solution-column progress-solution-column--new">
            <h3>
              <CheckCircle size={20} />
              Shepherd CLI
            </h3>
            <div className="progress-solution-list">
              {newWay.map((item, i) => (
                <motion.div 
                  key={i}
                  className="progress-solution-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="progress-solution-item__icon">{item.icon}</div>
                  <div className="progress-solution-item__content">
                    <span className="progress-solution-item__text">{item.text}</span>
                    <span className="progress-solution-item__benefit">{item.benefit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-solution-tagline" variants={fadeInUp}>
          <p><strong>Dashboards are for humans.</strong></p>
          <p><strong>CLI is for agents.</strong></p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// CLI Demo Slide
function CLIDemoSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--cli-demo"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>See It In Action</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Shepherd CLI Demo
        </motion.h2>

        <motion.div className="progress-demo-video" variants={scaleIn}>
          <div className="progress-demo-video__container">
            <iframe
              src="https://drive.google.com/file/d/1YdieuVpQ9vDeCppCZn_pqI8GfiiHlpi1/preview"
              width="100%"
              height="100%"
              allow="autoplay"
              allowFullScreen
              title="Shepherd CLI Demo"
              style={{ border: 'none', borderRadius: '12px' }}
            />
          </div>
        </motion.div>

        <motion.div className="progress-demo-cta" variants={fadeInUp}>
          <p>Try it yourself:</p>
          <div className="progress-demo-install">
            <code>pip install shepherd-cli</code>
          </div>
          <div className="progress-demo-buttons">
            <a 
              href="https://github.com/neuralis-in/shepherd-cli" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn--primary"
            >
              <Github size={16} />
              View on GitHub
            </a>
            <a 
              href="https://neuralis-in.github.io/shepherd-cli/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn--secondary"
            >
              <ExternalLink size={16} />
              Documentation
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Async Evals Slide
function AsyncEvalsSlide() {
  const evalTypes = [
    { name: 'Correctness', description: 'Validate agent outputs against expected results' },
    { name: 'Latency', description: 'Track response times across LLM calls' },
    { name: 'Cost', description: 'Monitor token usage and API costs' },
    { name: 'Safety', description: 'Check for harmful or unexpected behaviors' },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--evals"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>New Feature</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Asynchronous Evaluations
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Run evaluations on your agent traces without blocking production. 
          Get insights into correctness, latency, cost, and safety — all async.
        </motion.p>

        <motion.div className="progress-evals-grid" variants={fadeInUp}>
          <div className="progress-evals-diagram">
            <div className="progress-evals-flow">
              <div className="progress-evals-flow__step">
                <div className="progress-evals-flow__icon">
                  <Bot size={24} />
                </div>
                <span>Agent Run</span>
              </div>
              <div className="progress-evals-flow__arrow">→</div>
              <div className="progress-evals-flow__step">
                <div className="progress-evals-flow__icon">
                  <Layers size={24} />
                </div>
                <span>Trace Captured</span>
              </div>
              <div className="progress-evals-flow__arrow">→</div>
              <div className="progress-evals-flow__step progress-evals-flow__step--highlight">
                <div className="progress-evals-flow__icon">
                  <FlaskConical size={24} />
                </div>
                <span>Async Evals</span>
              </div>
              <div className="progress-evals-flow__arrow">→</div>
              <div className="progress-evals-flow__step">
                <div className="progress-evals-flow__icon">
                  <BarChart3 size={24} />
                </div>
                <span>Dashboard</span>
              </div>
            </div>
          </div>

          <div className="progress-evals-types">
            <h4>Evaluation Types</h4>
            <div className="progress-evals-types__grid">
              {evalTypes.map((evalType, i) => (
                <motion.div 
                  key={i}
                  className="progress-eval-type"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <CheckCircle size={16} />
                  <div>
                    <h5>{evalType.name}</h5>
                    <p>{evalType.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-evals-note" variants={fadeInUp}>
          <Sparkles size={18} />
          <p>Non-blocking evaluations = faster iteration cycles for your agents</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ========================================
// WEEK 2 SPECIFIC SLIDES
// ========================================

// Vicious Cycle Slide - Week 2 (The Problem)
function ViciousCycleSlideWeek2() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--traditional"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label progress-label--inline" variants={fadeInUp}>
          <Crosshair size={14} />
          <span>Major Positioning Change</span>
        </motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Yet another observability tool? <span className="pitch-highlight-red">No.</span>
        </motion.h2>
        
        <motion.div className="pitch-traditional-layout" variants={fadeInUp}>
          <div className="pitch-traditional-problems">
            <h3>Traditional Observability Pain Points</h3>
            <div className="pitch-problem-list-detailed">
              <div className="pitch-problem-item-detailed">
                <BarChart3 size={20} />
                <span>Proprietary dashboards built for CXOs, PMs, EMs</span>
              </div>
              <div className="pitch-problem-item-detailed">
                <MousePointer size={20} />
                <span>Click-heavy navigation, manual analysis</span>
              </div>
              <div className="pitch-problem-item-detailed">
                <ExternalLink size={20} />
                <span>Reactive — wait for alerts, then investigate</span>
              </div>
              <div className="pitch-problem-item-detailed">
                <RefreshCw size={20} />
                <span>Slow top-down feedback loops</span>
              </div>
            </div>
            <div className="progress-problem-insight">
              <p>Debugging today means <strong>long bug-to-fix cycles</strong>. As teams ship agentic pipelines to production, they need <strong>fast, continuous feedback</strong> — but observability has failed to evolve with AI-driven development.</p>
            </div>
          </div>
          
          <div className="pitch-vicious-cycle">
            <h4>The Vicious Cycle</h4>
            <div className="pitch-cycle-circular">
              <svg className="pitch-cycle-arrows" viewBox="0 0 320 320">
                <defs>
                  <marker id="pitch-arrowhead-w2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                </defs>
                <polyline points="200,40 264,40 264,68" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead-w2)" />
                <polyline points="264,132 264,188" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead-w2)" />
                <polyline points="264,252 264,280 200,280" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead-w2)" />
                <polyline points="120,280 56,280 56,252" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead-w2)" />
                <polyline points="56,188 56,132" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead-w2)" />
                <polyline points="56,68 56,40 120,40" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead-w2)" />
              </svg>
              
              <div className="pitch-cycle-node pitch-cycle-node--pm">
                <Users size={20} />
                <span>Built for PMs</span>
              </div>
              <div className="pitch-cycle-node pitch-cycle-node--alert">
                <AlertTriangle size={20} />
                <span>Alert to Dev</span>
              </div>
              <div className="pitch-cycle-node pitch-cycle-node--dashboard">
                <MonitorPlay size={20} />
                <span>Go to Dashboard</span>
              </div>
              <div className="pitch-cycle-node pitch-cycle-node--click">
                <MousePointer size={20} />
                <span>Click Chaos</span>
              </div>
              <div className="pitch-cycle-node pitch-cycle-node--overwhelm">
                <AlertCircle size={20} />
                <span>Info Overload</span>
              </div>
              <div className="pitch-cycle-node pitch-cycle-node--fix">
                <Wrench size={20} />
                <span>Difficulty Fixing</span>
              </div>

              <div className="pitch-cycle-center">
                <RefreshCw size={24} />
                <span>Repeat</span>
              </div>
            </div>
            <p className="pitch-cycle-caption">Developers waste hours context-switching instead of fixing</p>
            <ul className="pitch-cycle-subpoints">
              <li>Transmission loss from CXOs to Devs</li>
              <li>Information lost upon convey</li>
              <li>Hours of back and forth</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// GTM Solution Slide - Week 2 (Shepherd-MCP as Solution)
function GTMSolutionSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--gtm-solution"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Solution</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <span className="pitch-highlight-green">Shepherd-MCP</span> makes observability proactive
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Developer-native observability that enables faster, automated debugging directly where developers work.
        </motion.p>

        <motion.div className="progress-gtm-layout" variants={fadeInUp}>
          <div className="progress-gtm-solution-card">
            <div className="progress-gtm-solution-card__header">
              <Terminal size={28} />
              <h3>Shepherd-MCP</h3>
            </div>
            <div className="progress-gtm-solution-card__features">
              <div className="progress-gtm-feature">
                <Bot size={18} />
                <div>
                  <strong>Offload to AI IDEs</strong>
                  <span>Cursor, Windsurf, Claude Code</span>
                </div>
              </div>
              <div className="progress-gtm-feature">
                <Search size={18} />
                <div>
                  <strong>AI Isolates & RCA</strong>
                  <span>Automated root cause analysis</span>
                </div>
              </div>
              <div className="progress-gtm-feature">
                <Wrench size={18} />
                <div>
                  <strong>Fix in Same Tool</strong>
                  <span>No context switching</span>
                </div>
              </div>
            </div>
            <div className="progress-gtm-solution-card__time">
              <Clock size={16} />
              <span>3-5 hours → <strong>30-50 minutes</strong></span>
            </div>
          </div>

          <div className="progress-gtm-strategy">
            <h4>Go-to-Market Strategy</h4>
            <div className="progress-gtm-steps">
              <div className="progress-gtm-step">
                <div className="progress-gtm-step__num">1</div>
                <div className="progress-gtm-step__content">
                  <strong>Shepherd-MCP as Wedge</strong>
                  <span>Get into developer workflow through AI IDEs</span>
                </div>
              </div>
              <div className="progress-gtm-step__arrow">↓</div>
              <div className="progress-gtm-step">
                <div className="progress-gtm-step__num">2</div>
                <div className="progress-gtm-step__content">
                  <strong>Optimize aiobs × Shepherd-MCP</strong>
                  <span>Reduce latency, optimize token utilization</span>
                </div>
              </div>
              <div className="progress-gtm-step__arrow">↓</div>
              <div className="progress-gtm-step progress-gtm-step--highlight">
                <div className="progress-gtm-step__num">3</div>
                <div className="progress-gtm-step__content">
                  <strong>Drop-in Replacement</strong>
                  <span>Move to Shepherd with no/minimal code change vs existing obs tools</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-gtm-tagline" variants={fadeInUp}>
          <Zap size={20} />
          <p><strong>Over 10x time saved</strong> for CXOs, PMs, EMs — zero information loss in conveyance</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Dev Updates Slide - Week 2
function DevUpdatesSlideWeek2() {
  const devUpdates = [
    {
      icon: <Terminal size={28} />,
      title: 'Shepherd MCP',
      description: 'Model Context Protocol integration allowing AI IDEs to directly query and analyze traces. Works with Cursor, Windsurf, and Claude Code.',
      status: 'shipped',
      highlight: true,
      details: [
        'Direct trace querying from IDE',
        'AI-powered root cause analysis',
        'Works with existing observability tools'
      ]
    },
    {
      icon: <GitBranch size={28} />,
      title: 'A/B Testing Infrastructure',
      description: 'Infrastructure for comparing agent versions and prompt variations. Compare performance across different configurations.',
      status: 'completed',
      details: [
        'Prompt variation comparison',
        'Agent version testing',
        'Performance metrics tracking'
      ]
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--dev-updates"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>This Week</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <Code size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Development Updates
        </motion.h2>

        <motion.div className="progress-dev-grid" variants={fadeInUp}>
          {devUpdates.map((update, i) => (
            <motion.div 
              key={i}
              className={`progress-dev-card ${update.highlight ? 'progress-dev-card--highlight' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="progress-dev-card__header">
                <div className="progress-dev-card__icon">{update.icon}</div>
                <div className="progress-dev-card__title-section">
                  <h3>{update.title}</h3>
                  <span className={`progress-dev-card__status progress-dev-card__status--${update.status}`}>
                    {update.status === 'shipped' && <Rocket size={14} />}
                    {update.status === 'completed' && <CheckCircle size={14} />}
                    {update.status}
                  </span>
                </div>
              </div>
              <p className="progress-dev-card__desc">{update.description}</p>
              {update.details && (
                <ul className="progress-dev-card__details">
                  {update.details.map((detail, j) => (
                    <li key={j}>
                      <CheckCircle size={14} />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-dev-summary" variants={fadeInUp}>
          <p>
            <strong>Key Achievement:</strong> Shepherd-MCP enables AI-powered IDEs to debug agentic systems 
            without leaving the development environment.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Traction Slide - Week 2
function TractionSlideWeek2() {
  const tractionUpdates = [
    {
      icon: <Rocket size={24} />,
      company: 'Fenmo AI',
      title: 'Pilot Successfully Started',
      description: 'Fenmo AI pilot is now live. They are actively using Shepherd CLI and MCP for their agent infrastructure.',
      status: 'active',
      statusLabel: 'Pilot Active'
    },
    {
      icon: <Award size={24} />,
      company: 'Vibehack 2025',
      title: 'Second Prize Winner',
      description: 'Won 2nd prize at Vibehack 2025 — validated by Emergent, OpenAI, and Entrepreneur First.',
      status: 'award',
      statusLabel: '🥈 2nd Prize'
    },
    {
      icon: <Activity size={24} />,
      company: 'Intraintel.ai',
      title: 'Ongoing Production Use',
      description: 'Intraintel.ai continues using Shepherd in production. Positive feedback on debugging experience.',
      status: 'active',
      statusLabel: 'In Production'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--traction"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>This Week</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <TrendingUp size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Traction Updates
        </motion.h2>

        <motion.div className="progress-traction-grid progress-traction-grid--three" variants={fadeInUp}>
          {tractionUpdates.map((update, i) => (
            <motion.div 
              key={i}
              className={`progress-traction-card ${update.status === 'award' ? 'progress-traction-card--award' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="progress-traction-card__header">
                <div className="progress-traction-card__icon">{update.icon}</div>
                <div className="progress-traction-card__company">{update.company}</div>
                <span className={`progress-traction-card__status progress-traction-card__status--${update.status}`}>
                  {update.statusLabel}
                </span>
              </div>
              <h4 className="progress-traction-card__title">{update.title}</h4>
              <p className="progress-traction-card__desc">{update.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-traction-summary" variants={fadeInUp}>
          <p>"Real pilots, real validation — momentum is building."</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Pilot Feedback Slide - Week 2
function PilotFeedbackSlide() {
  const basePath = import.meta.env.BASE_URL
  
  return (
    <motion.div 
      className="pitch-slide pitch-slide--pilot-feedback"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Pilot Insights</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <MessageSquare size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Feedback from Pilots
        </motion.h2>

        <motion.div className="progress-feedback-card" variants={fadeInUp}>
          <div className="progress-feedback-card__header">
            <img src={`${basePath}intraintel.jpeg`} alt="Intraintel.ai" className="progress-feedback-card__logo" />
            <div>
              <h3>Intraintel.ai</h3>
              <span className="progress-feedback-card__status">Active Pilot</span>
            </div>
          </div>

          <div className="progress-feedback-sections">
            <div className="progress-feedback-section progress-feedback-section--positive">
              <h4>
                <ThumbsUp size={18} />
                What's Working
              </h4>
              <ul>
                <li>Shepherd playground is being used to track and debug very well</li>
                <li>Turnaround time for going back to client's problem is reduced</li>
                <li>Fixing issues has become faster</li>
                <li>Excited about Shepherd-MCP!</li>
              </ul>
            </div>

            <div className="progress-feedback-section progress-feedback-section--improvement">
              <h4>
                <ThumbsDown size={18} />
                Areas for Improvement
              </h4>
              <ul>
                <li>Playground can be simplified</li>
                <li>Database push-based instead of manual refresh</li>
              </ul>
            </div>

            <div className="progress-feedback-section progress-feedback-section--request">
              <h4>
                <Lightbulb size={18} />
                Feature Requests
              </h4>
              <ul>
                <li>Custom prompt A/B testing</li>
                <li>Model comparison testing</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-feedback-insight" variants={fadeInUp}>
          <p><strong>Key Insight:</strong> Pilots are validating the core value prop — faster debugging. 
          The feedback points to clear product improvements we can ship quickly.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Next Week Slide - Week 2
function NextWeekSlideWeek2() {
  const nextItems = [
    {
      icon: <Database size={24} />,
      title: 'Database Push-Based Playground',
      description: 'Real-time updates for Intraintel.ai — no more manual refresh',
      priority: 'high'
    },
    {
      icon: <Megaphone size={24} />,
      title: 'Increase Outreach',
      description: 'More company talks + client conversations',
      priority: 'high'
    },
    {
      icon: <Bot size={24} />,
      title: 'Shepherd Agent',
      description: 'AI agent that works alongside CLI to auto-diagnose failures',
      priority: 'medium'
    },
    {
      icon: <Code size={24} />,
      title: 'aiobs Development',
      description: 'Continue expanding SDK features and provider support',
      priority: 'medium'
    },
    {
      icon: <Brain size={24} />,
      title: 'Memory Integration',
      description: 'Explore memory integration for persistent agent context',
      priority: 'low'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--next"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Looking Ahead</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          What's Next?
        </motion.h2>
        
        <motion.div className="progress-next-grid" variants={fadeInUp}>
          {nextItems.map((item, i) => (
            <motion.div 
              key={i}
              className={`progress-next-card progress-next-card--${item.priority}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="progress-next-card__icon">{item.icon}</div>
              <div className="progress-next-card__content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <span className={`progress-next-card__priority progress-next-card__priority--${item.priority}`}>
                {item.priority === 'high' && <Target size={14} />}
                {item.priority}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-next-cta" variants={fadeInUp}>
          <Link to="/pitch-deck" className="btn btn--secondary">
            <ArrowLeft size={16} />
            Back to Pitch Deck
          </Link>
          <Link to="/contact" className="btn btn--primary">
            Get in Touch
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ========================================
// WEEK 3 SPECIFIC SLIDES
// ========================================

// Cover Slide - Week 3
function CoverSlideWeek3() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--cover"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.div className="pitch-cover__logo" variants={fadeInUp}>
          <svg viewBox="0 0 32 32" className="pitch-cover__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.div>
        
        <motion.h1 className="pitch-cover__title" variants={fadeInUp}>
          Progress Report
        </motion.h1>
        
        <motion.p className="pitch-cover__tagline" variants={fadeInUp}>
          Building the observability layer for AI agents
        </motion.p>

        <motion.div 
          className="progress-happy-new-year"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <span className="progress-happy-new-year__party progress-happy-new-year__party--left">🎉</span>
          <span className="progress-happy-new-year__text">Happy New Year 2026!</span>
          <span className="progress-happy-new-year__party progress-happy-new-year__party--right">🎊</span>
          
          {/* Confetti burst */}
          <span className="progress-confetti">
            <span className="progress-confetti__piece" style={{ '--delay': '0s', '--x': '-60px', '--y': '-40px' }}></span>
            <span className="progress-confetti__piece" style={{ '--delay': '0.1s', '--x': '70px', '--y': '-50px' }}></span>
            <span className="progress-confetti__piece" style={{ '--delay': '0.2s', '--x': '-80px', '--y': '20px' }}></span>
            <span className="progress-confetti__piece" style={{ '--delay': '0.3s', '--x': '90px', '--y': '10px' }}></span>
            <span className="progress-confetti__piece" style={{ '--delay': '0.4s', '--x': '-40px', '--y': '-70px' }}></span>
            <span className="progress-confetti__piece" style={{ '--delay': '0.5s', '--x': '50px', '--y': '-60px' }}></span>
            <span className="progress-confetti__piece" style={{ '--delay': '0.6s', '--x': '-100px', '--y': '-20px' }}></span>
            <span className="progress-confetti__piece" style={{ '--delay': '0.7s', '--x': '100px', '--y': '-30px' }}></span>
          </span>
        </motion.div>

        <motion.p className="pitch-cover__hook" variants={fadeInUp}>
          December 19, 2025 – January 4, 2026
        </motion.p>
        
        <motion.div className="pitch-cover__stats" variants={fadeInUp}>
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">2</span>
            <span className="pitch-cover__stat-label">Dev Updates</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">3</span>
            <span className="pitch-cover__stat-label">Traction Updates</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">🚀</span>
            <span className="pitch-cover__stat-label">Ready to Raise</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Dev Updates Slide - Week 3
function DevUpdatesSlideWeek3() {
  const devUpdates = [
    {
      icon: <Package size={28} />,
      title: 'aiobs TypeScript Package',
      description: 'TypeScript package for aiobs is now ready. Full type safety and seamless integration with Node.js/TypeScript projects.',
      status: 'shipped',
      highlight: true,
      details: [
        'Complete TypeScript support',
        'Type-safe trace capturing',
        'NPM package ready for distribution'
      ]
    },
    {
      icon: <Shield size={28} />,
      title: 'Improved Evals',
      description: 'Enhanced PII detection and hallucination evaluations for aiobs based on client feedback from pilots.',
      status: 'completed',
      details: [
        'Better PII detection accuracy',
        'Hallucination eval improvements',
        'Client feedback incorporated'
      ]
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--dev-updates"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>This Period</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <Code size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Development Updates
        </motion.h2>

        <motion.div className="progress-dev-grid" variants={fadeInUp}>
          {devUpdates.map((update, i) => (
            <motion.div 
              key={i}
              className={`progress-dev-card ${update.highlight ? 'progress-dev-card--highlight' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="progress-dev-card__header">
                <div className="progress-dev-card__icon">{update.icon}</div>
                <div className="progress-dev-card__title-section">
                  <h3>{update.title}</h3>
                  <span className={`progress-dev-card__status progress-dev-card__status--${update.status}`}>
                    {update.status === 'shipped' && <Rocket size={14} />}
                    {update.status === 'completed' && <CheckCircle size={14} />}
                    {update.status}
                  </span>
                </div>
              </div>
              <p className="progress-dev-card__desc">{update.description}</p>
              {update.details && (
                <ul className="progress-dev-card__details">
                  {update.details.map((detail, j) => (
                    <li key={j}>
                      <CheckCircle size={14} />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-dev-summary" variants={fadeInUp}>
          <p>
            <strong>Key Achievement:</strong> aiobs now supports both Python and TypeScript, 
            enabling broader adoption across different tech stacks.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Traction Slide - Week 3
function TractionSlideWeek3() {
  const tractionUpdates = [
    {
      icon: <MessageSquare size={24} />,
      company: 'QuickReply.ai',
      title: 'Pilot Discussions',
      description: 'Initiated talks with QuickReply.ai for pilot program. More progress expected in first week of January.',
      status: 'talks',
      statusLabel: 'In Talks'
    },
    {
      icon: <Bot size={24} />,
      company: 'SupatestAI',
      title: 'Pilot Discussions',
      description: 'Engaged with SupatestAI for potential pilot program. Follow-up scheduled for early January.',
      status: 'talks',
      statusLabel: 'In Talks'
    },
    {
      icon: <AlertCircle size={24} />,
      company: 'LambdaTest',
      title: 'No Updates',
      description: 'No progress from LambdaTest. Partnership appears to be almost closed at this point.',
      status: 'closed',
      statusLabel: 'Almost Closed'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--traction"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>This Period</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <TrendingUp size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Traction Updates
        </motion.h2>

        <motion.div className="progress-traction-grid progress-traction-grid--three" variants={fadeInUp}>
          {tractionUpdates.map((update, i) => (
            <motion.div 
              key={i}
              className={`progress-traction-card ${update.status === 'closed' ? 'progress-traction-card--muted' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="progress-traction-card__header">
                <div className="progress-traction-card__icon">{update.icon}</div>
                <div className="progress-traction-card__company">{update.company}</div>
                <span className={`progress-traction-card__status progress-traction-card__status--${update.status}`}>
                  {update.statusLabel}
                </span>
              </div>
              <h4 className="progress-traction-card__title">{update.title}</h4>
              <p className="progress-traction-card__desc">{update.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-traction-summary" variants={fadeInUp}>
          <p>"New conversations started — more progress expected in January."</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Strategic Thinking Slide - Week 3
function StrategicThinkingSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--strategic"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Strategic Thinking</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          What's the 10x reason to switch?
        </motion.h2>
        
        <motion.div className="progress-strategic-answer" variants={fadeInUp}>
          <div className="progress-strategic-problem">
            <h4>
              <AlertTriangle size={20} />
              Existing Tools
            </h4>
            <p>Dashboards that help <strong>humans debug</strong> LLM systems</p>
          </div>

          <div className="progress-strategic-arrow">
            <ArrowRight size={32} />
          </div>

          <div className="progress-strategic-solution">
            <h4>
              <Rocket size={20} />
              Shepherd
            </h4>
            <p>Turns debugging into an <strong>autonomous closed loop</strong></p>
          </div>
        </motion.div>

        <motion.div className="progress-strategic-details" variants={fadeInUp}>
          <div className="progress-strategic-detail">
            <Search size={20} />
            <span><strong>Detects failures</strong></span>
          </div>
          <div className="progress-strategic-detail">
            <Layers size={20} />
            <span><strong>Clusters root causes</strong></span>
          </div>
          <div className="progress-strategic-detail">
            <Lightbulb size={20} />
            <span><strong>Proposes fixes</strong></span>
          </div>
          <div className="progress-strategic-detail">
            <CheckCircle size={20} />
            <span><strong>Validates them</strong></span>
          </div>
        </motion.div>

        <motion.div className="progress-strategic-outcome" variants={fadeInUp}>
          <div className="progress-strategic-outcome__metric">
            <span className="progress-strategic-outcome__value">10x</span>
            <span className="progress-strategic-outcome__label">Reduction in MTTR</span>
          </div>
          <div className="progress-strategic-outcome__text">
            <p>Order-of-magnitude faster iteration <strong>without adding humans-in-the-loop</strong></p>
            <span>Humans = CXOs, EMs, PMs — not needed in the debugging loop anymore</span>
          </div>
        </motion.div>

        <motion.div className="progress-strategic-developer" variants={fadeInUp}>
          <Terminal size={24} />
          <div>
            <p><strong>All control to developers.</strong></p>
            <span>Without leaving their coding environment, they can get the work done.</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Pricing Model Slide - Week 3
function PricingModelSlide() {
  const icpMetrics = [
    { label: 'Traces / Session', value: '60' },
    { label: 'Sessions / Business / Day', value: '1,000' },
    { label: 'Implied Usage Unit / Business / Day', value: '10' },
    { label: 'Sessions / Usage Unit / Day', value: '10' },
  ]

  const pricingDetails = [
    { label: 'Pricing Type', value: 'B2B, Pay-as-you-go' },
    { label: 'Free Tier', value: 'First 100,000 traces / business' },
    { label: 'Paid Usage', value: '$7 / 100,000 traces' },
  ]

  const definitions = [
    { term: 'Trace', definition: 'Smallest billable unit generated by an agentic pipeline (LLM calls, tools, evals, dispatch, etc.)' },
    { term: 'Session', definition: 'One pipeline run (JSON event); contains multiple traces' },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--pricing"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Strategic Thinking</motion.span>
        
        <motion.h2 className="pitch-slide__title pitch-slide__title--inline" variants={fadeInUp}>
          <DollarSign size={32} />
          <span>Pricing Model Update</span>
        </motion.h2>

        <motion.div className="progress-pricing-definitions progress-pricing-definitions--top" variants={fadeInUp}>
          <h5>Definitions</h5>
          <div className="progress-pricing-definitions__grid">
            {definitions.map((item, i) => (
              <div key={i} className="progress-pricing-definition">
                <span className="progress-pricing-definition__term">{item.term}</span>
                <span className="progress-pricing-definition__desc">{item.definition}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="progress-pricing-columns" variants={fadeInUp}>
          <div className="progress-pricing-icp">
            <div className="progress-pricing-icp__header">
              <Users size={24} />
              <h3>Ideal Customer Profile</h3>
            </div>
            <div className="progress-pricing-icp__table progress-pricing-icp__table--vertical">
              {icpMetrics.map((item, i) => (
                <div key={i} className="progress-pricing-icp__row">
                  <span className="progress-pricing-icp__row-label">{item.label}</span>
                  <span className="progress-pricing-icp__row-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="progress-pricing-arrow-horizontal">
            <ArrowRight size={32} />
          </div>

          <div className="progress-pricing-card progress-pricing-card--primary">
            <h4>Pricing Structure</h4>
            <div className="progress-pricing-table">
              {pricingDetails.map((item, i) => (
                <div key={i} className="progress-pricing-row">
                  <span className="progress-pricing-row__label">{item.label}</span>
                  <span className="progress-pricing-row__value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Trojan Horse Slide - Week 3
function TrojanHorseSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--trojan"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Go-to-Market Strategy</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          What's the trojan horse to the platform?
        </motion.h2>

        <motion.div className="progress-trojan-columns" variants={fadeInUp}>
          <div className="progress-trojan-wedge">
            <div className="progress-trojan-wedge__icon">
              <Terminal size={32} />
            </div>
            <h3>Shepherd MCP</h3>
            <p>Our trojan horse that sits on top of <strong>whatever observability product teams already use</strong></p>
            <div className="progress-trojan-providers">
              <span>Works with:</span>
              <div className="progress-trojan-providers__list">
                <span>Langfuse</span>
                <span>LangSmith</span>
                <span>Phoenix</span>
                <span>etc.</span>
              </div>
            </div>
          </div>

          <div className="progress-trojan-arrow-horizontal">
            <ArrowRight size={32} />
          </div>

          <div className="progress-trojan-flow">
            <div className="progress-trojan-step">
              <div className="progress-trojan-step__num">1</div>
              <div className="progress-trojan-step__content">
                <strong>MCP becomes default debugging environment</strong>
                <span>Developers go to Shepherd MCP, not dashboards or raw logs</span>
              </div>
            </div>
            <div className="progress-trojan-flow__arrow">↓</div>
            <div className="progress-trojan-step">
              <div className="progress-trojan-step__num">2</div>
              <div className="progress-trojan-step__content">
                <strong>Deeply embedded in workflow</strong>
                <span>Strong position to sell Shepherd aiobs as primary observability layer</span>
              </div>
            </div>
            <div className="progress-trojan-flow__arrow">↓</div>
            <div className="progress-trojan-step progress-trojan-step--highlight">
              <div className="progress-trojan-step__num">3</div>
              <div className="progress-trojan-step__content">
                <strong>Drop-in replacement</strong>
                <span>Better debugging, lower cost, tighter integration with MCP</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-trojan-outcome" variants={fadeInUp}>
          <Plug size={20} />
          <p><strong>From tool on top of observability</strong> → <strong>Replace the observability layer</strong> → <strong>Own the full agent control plane</strong></p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Pilot Feedback Slide - Week 3
function PilotFeedbackSlideWeek3() {
  const basePath = import.meta.env.BASE_URL
  
  return (
    <motion.div 
      className="pitch-slide pitch-slide--pilot-feedback"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Pilot Insights</motion.span>
        
        <motion.h2 className="pitch-slide__title pitch-slide__title--inline" variants={fadeInUp}>
          <MessageSquare size={32} />
          <span>Feedback from Pilots</span>
        </motion.h2>

        <motion.div className="progress-feedback-card progress-feedback-card--single" variants={fadeInUp}>
          <div className="progress-feedback-card__header">
            <img src={`${basePath}fenmoai_logo.jpeg`} alt="FenmoAI" className="progress-feedback-card__logo" />
            <div>
              <h3>FenmoAI</h3>
              <span className="progress-feedback-card__status">Using Shepherd MCP</span>
            </div>
          </div>

          <div className="progress-feedback-main">
            <div className="progress-feedback-quote">
              <AlertTriangle size={24} />
              <blockquote>
                "MCP is consuming the context window too quickly."
              </blockquote>
            </div>

            <div className="progress-feedback-implications">
              <h5>Implications</h5>
              <ul>
                <li>Need to optimize token utilization in MCP responses</li>
                <li>Consider implementing context summarization</li>
                <li>Validates that teams are actively using the tool</li>
                <li>Clear product improvement opportunity</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-feedback-insight" variants={fadeInUp}>
          <p><strong>Key Insight:</strong> Real usage generates real feedback. 
          This is exactly the kind of feedback we need to improve the product.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// What's Next Slide - Week 3
function WhatsNextSlideWeek3() {
  const nextItems = [
    {
      icon: <Database size={24} />,
      title: 'Database Push-Based Playground',
      description: 'Real-time updates for Intraintel.ai — no more manual refresh',
      priority: 'medium'
    },
    {
      icon: <Megaphone size={24} />,
      title: 'Increase Outreach',
      description: 'More company talks + client conversations',
      priority: 'high'
    },
    {
      icon: <Zap size={24} />,
      title: 'MCP Context Window Optimisation',
      description: 'Reduce context consumption based on FenmoAI feedback',
      priority: 'medium'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--next"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Looking Ahead</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          What's Next?
        </motion.h2>
        
        <motion.div className="progress-next-grid" variants={fadeInUp}>
          {nextItems.map((item, i) => (
            <motion.div 
              key={i}
              className={`progress-next-card progress-next-card--${item.priority}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="progress-next-card__icon">{item.icon}</div>
              <div className="progress-next-card__content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <span className={`progress-next-card__priority progress-next-card__priority--${item.priority}`}>
                {item.priority === 'high' && <Target size={14} />}
                {item.priority}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-ready-to-raise-banner" variants={fadeInUp}>
          <Rocket size={24} />
          <span>Ready to Raise</span>
        </motion.div>

        <motion.div className="progress-next-cta" variants={fadeInUp}>
          <Link to="/pitch-deck" className="btn btn--secondary">
            <ArrowLeft size={16} />
            Back to Pitch Deck
          </Link>
          <Link to="/contact" className="btn btn--primary">
            Get in Touch
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Ready to Raise Slide - Week 3
function ReadyToRaiseSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--raise"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Milestone</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Now Ready to Raise! 🚀
        </motion.h2>

        <motion.div className="progress-raise-content" variants={fadeInUp}>
          <div className="progress-raise-milestone">
            <div className="progress-raise-milestone__icon">
              <FileText size={40} />
            </div>
            <div className="progress-raise-milestone__content">
              <h3>P&L Sheet Complete</h3>
              <p>Worked on financials and projections. Ready to share with investors.</p>
            </div>
            <div className="progress-raise-milestone__check">
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="progress-raise-ready">
            <div className="progress-raise-ready__badge">
              <Rocket size={32} />
              <span>Ready to Raise</span>
            </div>
            <p>All materials prepared for pre-seed discussions</p>
          </div>
        </motion.div>

        <motion.div className="progress-raise-cta" variants={fadeInUp}>
          <Link to="/pitch-deck" className="btn btn--secondary">
            <ArrowLeft size={16} />
            View Pitch Deck
          </Link>
          <Link to="/contact" className="btn btn--primary">
            Get in Touch
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ========================================
// WEEK 1 SPECIFIC SLIDES (kept for reference)
// ========================================

// Next Week Slide - Week 1
function NextWeekSlide() {
  const nextItems = [
    {
      icon: <GitBranch size={24} />,
      title: 'A/B Testing Setup',
      description: 'Infrastructure for comparing agent versions and prompt variations',
      priority: 'high'
    },
    {
      icon: <Bot size={24} />,
      title: 'Shepherd Agent',
      description: 'AI agent that works alongside CLI to auto-diagnose failures',
      priority: 'high'
    },
    {
      icon: <Code size={24} />,
      title: 'aiobs Development',
      description: 'Continue expanding SDK features and provider support',
      priority: 'medium'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--next"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Looking Ahead</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          What's Next?
        </motion.h2>
        
        <motion.div className="progress-next-grid" variants={fadeInUp}>
          {nextItems.map((item, i) => (
            <motion.div 
              key={i}
              className={`progress-next-card progress-next-card--${item.priority}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="progress-next-card__icon">{item.icon}</div>
              <div className="progress-next-card__content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <span className={`progress-next-card__priority progress-next-card__priority--${item.priority}`}>
                {item.priority === 'high' && <Target size={14} />}
                {item.priority}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-next-summary" variants={fadeInUp}>
          <h4>Coming Up</h4>
          <p>
            Building the foundation for A/B testing and introducing Shepherd Agent — 
            an AI-powered debugging assistant that pairs with the CLI to automatically 
            identify and suggest fixes for agent failures.
          </p>
        </motion.div>

        <motion.div className="progress-next-cta" variants={fadeInUp}>
          <Link to="/pitch-deck" className="btn btn--secondary">
            <ArrowLeft size={16} />
            Back to Pitch Deck
          </Link>
          <Link to="/contact" className="btn btn--primary">
            Get in Touch
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main component
export default function ShepherdProgress() {
  const { weekId } = useParams()
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef(null)

  // Determine current week (default to latest week if not specified)
  const currentWeek = weekId && weeks[weekId] ? weekId : weekOrder[0]
  const currentWeekData = weeks[currentWeek]

  // Reset slide when week changes
  useEffect(() => {
    setCurrentSlide(0)
  }, [currentWeek])

  const handleWeekChange = (newWeekId) => {
    navigate(`/pitch-deck/updates/${newWeekId}`)
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleNext = () => {
    if (currentSlide < currentWeekData.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handleSlideChange = (index) => {
    setCurrentSlide(index)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, currentWeekData.slides.length])

  const renderSlide = () => {
    const slideId = currentWeekData.slides[currentSlide]?.id

    // Week 3 slides
    if (currentWeek === 'week3') {
      switch (slideId) {
        case 'cover': return <CoverSlideWeek3 />
        case 'dev-updates': return <DevUpdatesSlideWeek3 />
        case 'traction': return <TractionSlideWeek3 />
        case 'strategic-thinking': return <StrategicThinkingSlide />
        case 'pricing-model': return <PricingModelSlide />
        case 'trojan-horse': return <TrojanHorseSlide />
        case 'pilot-feedback': return <PilotFeedbackSlideWeek3 />
        case 'whats-next': return <WhatsNextSlideWeek3 />
        default: return <CoverSlideWeek3 />
      }
    }

    // Week 2 slides
    if (currentWeek === 'week2') {
      switch (slideId) {
        case 'cover': return <CoverSlideWeek2 />
        case 'vicious-cycle': return <ViciousCycleSlideWeek2 />
        case 'gtm-solution': return <GTMSolutionSlide />
        case 'dev-updates': return <DevUpdatesSlideWeek2 />
        case 'traction': return <TractionSlideWeek2 />
        case 'pilot-feedback': return <PilotFeedbackSlide />
        case 'next-week': return <NextWeekSlideWeek2 />
        default: return <CoverSlideWeek2 />
      }
    }

    // Week 1 slides (default)
    switch (slideId) {
      case 'cover': return <CoverSlideWeek1 />
      case 'recap': return <RecapSlide />
      case 'dev-updates': return <DevUpdatesSlide />
      case 'traction': return <TractionSlide />
      case 'cli-wedge': return <CLIWedgeSlide />
      case 'why-cli-business': return <WhyCLIBusinessSlide />
      case 'why-cli-solution': return <WhyCLISolutionSlide />
      case 'cli-demo': return <CLIDemoSlide />
      case 'async-evals': return <AsyncEvalsSlide />
      case 'next-week': return <NextWeekSlide />
      default: return <CoverSlideWeek1 />
    }
  }

  return (
    <div className="pitch-deck" ref={containerRef}>
      <ProgressHeader 
        currentSlide={currentSlide} 
        onSlideChange={handleSlideChange}
        currentWeek={currentWeek}
        onWeekChange={handleWeekChange}
      />
      
      <main className="pitch-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentWeek}-${currentSlide}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="pitch-slide-container"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </main>

      <SlideNavigation 
        currentSlide={currentSlide}
        totalSlides={currentWeekData.slides.length}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}
