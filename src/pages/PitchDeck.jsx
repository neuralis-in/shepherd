import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Layers,
  AlertTriangle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  CheckCircle,
  Building2,
  Github,
  Cpu,
  Activity,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  BarChart3,
  Rocket,
  CircleDot,
  Bot,
  HardDrive,
  Database,
  Container,
  Terminal,
  Code,
  Crosshair,
  X,
  Check,
  MousePointer,
  ExternalLink,
  RefreshCw,
  MonitorPlay,
  Wrench,
  Eye,
  Quote,
  BrainCircuit,
  Workflow,
  Search,
  Lightbulb,
  Plug
} from 'lucide-react'
import './PitchDeck.css'

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

// Slide data
const slides = [
  { id: 'cover', title: 'Cover' },
  { id: 'problem', title: 'Problem' },
  { id: 'solution', title: 'Solution' },
  { id: 'how-it-works', title: 'How It Works' },
  { id: 'competitors-intro', title: 'Landscape' },
  { id: 'vicious-cycle', title: 'The Cycle' },
  { id: 'experience', title: 'Experience' },
  { id: 'market', title: 'Market' },
  { id: 'turnaround', title: 'Turnaround' },
  { id: 'paradigm', title: 'Paradigm' },
  { id: 'integration', title: 'Integration' },
  { id: 'validation', title: 'Validation' },
  { id: 'traction', title: 'Traction' },
  { id: 'partnerships', title: 'Partnerships' },
  { id: 'business-model', title: 'Business Model' },
  { id: 'roadmap', title: 'Roadmap' },
  { id: 'team', title: 'Team' },
  { id: 'ask', title: 'The Ask' },
]

function PitchHeader({ currentSlide, onSlideChange }) {
  return (
    <header className="pitch-header">
      <div className="pitch-header__container">
        <Link to="/" className="pitch-header__back">
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
          {slides.map((slide, index) => (
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

        <div className="pitch-header__badge">
          Investor Deck
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

// Slide Components
function CoverSlide() {
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
          Shepherd
        </motion.h1>
        
        <motion.p className="pitch-cover__tagline" variants={fadeInUp}>
          The observability layer for AI agents
        </motion.p>

        <motion.p className="pitch-cover__hook" variants={fadeInUp}>
          Shepherd traces AI agents—<span className="pitch-cover__hook-emphasis">so they don't fail.</span>
        </motion.p>
        
        <motion.div className="pitch-cover__meta" variants={fadeInUp}>
          <span className="pitch-cover__category">AI Infrastructure • DevTools • B2B SaaS</span>
        </motion.div>

        <motion.div className="pitch-cover__stats" variants={fadeInUp}>
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">Open Source</span>
            <span className="pitch-cover__stat-label">aiobs SDK</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">Pre-Seed</span>
            <span className="pitch-cover__stat-label">Stage</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">2025</span>
            <span className="pitch-cover__stat-label">Founded</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ProblemSlide() {
  const problems = [
    {
      icon: <AlertTriangle size={24} />,
      title: 'Silent Failures',
      description: 'AI agents fail without any visibility into what went wrong'
    },
    {
      icon: <Clock size={24} />,
      title: 'Hours of Debugging',
      description: 'Engineers spend countless hours trying to reproduce issues'
    },
    {
      icon: <Shield size={24} />,
      title: 'No Accountability',
      description: 'Production agents make decisions without audit trails'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Blind Scaling',
      description: 'Teams scale agents without understanding their behavior'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--problem"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Problem</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          AI agents are black boxes
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Enterprises are deploying AI agents in production, but have zero visibility 
          into their decision-making process. When they fail, debugging is nearly impossible.
        </motion.p>

        <motion.div className="pitch-problems" variants={fadeInUp}>
          {problems.map((problem, i) => (
            <motion.div 
              key={i} 
              className="pitch-problem-card"
              variants={fadeInUp}
            >
              <div className="pitch-problem-card__icon">{problem.icon}</div>
              <h4 className="pitch-problem-card__title">{problem.title}</h4>
              <p className="pitch-problem-card__desc">{problem.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="pitch-problem-stat" variants={fadeInUp}>
          <span className="pitch-problem-stat__value">74%</span>
          <span className="pitch-problem-stat__label">
            of companies struggle to achieve and scale value from AI Agents
          </span>
        </motion.div>

        <motion.p className="pitch-problem-source" variants={fadeInUp}>
          Source: <a href="https://www.bcg.com/press/24october2024-ai-adoption-in-2024-74-of-companies-struggle-to-achieve-and-scale-value" target="_blank" rel="noopener noreferrer">BCG 2024</a>
        </motion.p>
      </div>
    </motion.div>
  )
}

function SolutionSlide() {
  const features = [
    'Deterministic execution traces',
    'Full LLM call visibility',
    'Tool invocation tracking',
    'Error detection & alerting',
    'Cloud storage integration',
    'Self-healing prompts (coming soon)'
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--solution"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Solution</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Shepherd makes AI agents transparent
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          A lightweight SDK that instruments your AI agents with just 3 lines of code, 
          providing complete observability into every decision, tool call, and LLM interaction.
        </motion.p>

        <motion.div className="pitch-solution-grid" variants={fadeInUp}>
          <div className="pitch-solution-code">
            <div className="pitch-solution-code__header">
              <span className="pitch-solution-code__dots">
                <span></span><span></span><span></span>
              </span>
              <span className="pitch-solution-code__title">agent.py</span>
            </div>
            <pre className="pitch-solution-code__content">
              <code>
                <span className="keyword">from</span> aiobs <span className="keyword">import</span> observer{'\n\n'}
                observer.<span className="function">observe</span>(){'\n'}
                <span className="comment"># Your existing agent code</span>{'\n'}
                result = agent.<span className="function">run</span>(<span className="string">"Plan a trip to Tokyo"</span>){'\n'}
                observer.<span className="function">end</span>(){'\n'}
                observer.<span className="function">flush</span>()
              </code>
            </pre>
          </div>

          <div className="pitch-solution-features">
            <h4>What you get:</h4>
            <ul>
              {features.map((feature, i) => (
                <li key={i}>
                  <CheckCircle size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Architecture Diagram Component (from landing page)
function PitchWorkflowDiagram() {
  const basePath = import.meta.env.BASE_URL
  
  const agents = [
    { id: 1, platform: 'GKE' },
    { id: 2, platform: 'EC2' },
    { id: 3, platform: 'Cloud Run' },
    { id: 4, platform: 'Lambda' },
  ]

  return (
    <div className="architecture-diagram">
      {/* Section: Agents on Cloud Platforms */}
      <div className="arch-section arch-agents">
        <div className="arch-section-label">Your AI Agents</div>
        <div className="arch-agents-cloud">
          {agents.map((agent, i) => (
            <motion.div 
              key={agent.id}
              className="arch-agent-node"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4, type: "spring" }}
              style={{ '--delay': `${i * 0.5}s` }}
            >
              <div className="arch-agent-circle">
                <Bot size={20} />
              </div>
              <span className="arch-agent-platform">{agent.platform}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated Flow Lines */}
      <div className="arch-flow arch-flow-1">
        <div className="arch-flow-line">
          <div className="arch-flow-particle"></div>
        </div>
        <span className="arch-flow-label">observe()</span>
      </div>

      {/* Section: Shepherd Layer */}
      <motion.div 
        className="arch-section arch-shepherd"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="arch-shepherd-badge">
          <img src={`${basePath}shepherd.svg`} alt="Shepherd" className="arch-shepherd-logo" />
          <span>Shepherd</span>
        </div>
        <div className="arch-shepherd-features">
          <div className="arch-shepherd-feature">
            <Activity size={14} />
            <span>Trace Capture</span>
          </div>
          <div className="arch-shepherd-feature">
            <Layers size={14} />
            <span>LLM Events</span>
          </div>
          <div className="arch-shepherd-feature">
            <AlertCircle size={14} />
            <span>Error Detection</span>
          </div>
        </div>
      </motion.div>

      {/* Animated Flow Lines */}
      <div className="arch-flow arch-flow-2">
        <div className="arch-flow-line">
          <div className="arch-flow-particle"></div>
        </div>
        <span className="arch-flow-label">flush()</span>
      </div>

      {/* Section: Cloud Storage */}
      <motion.div 
        className="arch-section arch-storage"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="arch-section-label">Your Cloud</div>
        <div className="arch-storage-icons">
          <div className="arch-storage-item">
            <div className="arch-storage-icon">
              <HardDrive size={18} />
            </div>
            <span>S3 / GCS</span>
          </div>
          <div className="arch-storage-item">
            <div className="arch-storage-icon">
              <Database size={18} />
            </div>
            <span>BigQuery</span>
          </div>
          <div className="arch-storage-item">
            <div className="arch-storage-icon">
              <Container size={18} />
            </div>
            <span>Postgres</span>
          </div>
        </div>
        <div className="arch-storage-badge">JSON Traces</div>
      </motion.div>

      {/* Animated Flow Lines */}
      <div className="arch-flow arch-flow-3">
        <div className="arch-flow-line">
          <div className="arch-flow-particle"></div>
        </div>
        <span className="arch-flow-label">query</span>
      </div>

      {/* Section: Dashboard */}
      <motion.div 
        className="arch-section arch-dashboard"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="arch-section-label">Insights</div>
        <div className="arch-dashboard-preview">
          <div className="arch-dashboard-header">
            <div className="arch-dashboard-dots">
              <span></span><span></span><span></span>
            </div>
            <span className="arch-dashboard-title">Dashboard</span>
          </div>
          <div className="arch-dashboard-content">
            <div className="arch-dashboard-chart arch-chart-bar">
              <BarChart3 size={16} />
              <div className="arch-mini-bars">
                <div className="arch-bar" style={{ height: '60%' }}></div>
                <div className="arch-bar" style={{ height: '80%' }}></div>
                <div className="arch-bar" style={{ height: '45%' }}></div>
                <div className="arch-bar" style={{ height: '90%' }}></div>
                <div className="arch-bar" style={{ height: '70%' }}></div>
              </div>
            </div>
            <div className="arch-dashboard-chart arch-chart-line">
              <TrendingUp size={16} />
              <svg viewBox="0 0 60 30" className="arch-line-svg">
                <path d="M0,25 Q15,20 25,15 T45,10 T60,5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="arch-dashboard-stats">
              <div className="arch-stat">
                <span className="arch-stat-value">2.4k</span>
                <span className="arch-stat-label">Traces</span>
              </div>
              <div className="arch-stat">
                <span className="arch-stat-value">12ms</span>
                <span className="arch-stat-label">Avg Latency</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function HowItWorksSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--how"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>How It Works</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Simple integration, powerful insights
        </motion.h2>

        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Shepherd seamlessly instruments your agents and streams traces to your infrastructure.
        </motion.p>

        <motion.div className="pitch-how-diagram" variants={scaleIn}>
          <PitchWorkflowDiagram />
        </motion.div>
      </div>
    </motion.div>
  )
}

// NEW: Competitors Intro Slide - "Yet another observability tool? No."
function CompetitorsIntroSlide() {
  const competitors = [
    { name: 'LangSmith', focus: 'LLM Tracing', origin: 'LangChain ecosystem' },
    { name: 'Langfuse', focus: 'LLM Observability', origin: 'Open-source tracing' },
    { name: 'Arize AI', focus: 'ML Observability', origin: 'Model monitoring pivot' },
    { name: 'Dynatrace', focus: 'APM Giant', origin: 'Traditional APM + AI bolt-on' },
    { name: 'Portkey', focus: 'LLM Gateway', origin: 'API management focus' },
    { name: 'Datadog', focus: 'APM Giant', origin: 'Traditional APM + AI bolt-on' },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--competitors-intro"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Competitive Landscape</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Aren't others doing this? <span className="pitch-highlight-green">Yes.</span>
        </motion.h2>

        <motion.div className="pitch-competitors-centered" variants={fadeInUp}>
          <div className="pitch-competitors-list-centered">
            {competitors.map((comp, i) => (
              <motion.div 
                key={comp.name}
                className="pitch-competitor-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <span className="pitch-competitor-card__name">{comp.name}</span>
                <span className="pitch-competitor-card__focus">{comp.focus}</span>
                <span className="pitch-competitor-card__origin">{comp.origin}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Vicious Cycle Slide (from Vibehack)
function ViciousCycleSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--traditional"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Problem</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Yet another observability tool? <span className="pitch-highlight-red">No.</span>
        </motion.h2>
        
        <motion.div className="pitch-traditional-layout" variants={fadeInUp}>
          <div className="pitch-traditional-problems">
            <h3>Traditional Observability Pain Points</h3>
            <div className="pitch-problem-list-detailed">
              <div className="pitch-problem-item-detailed">
                <BarChart3 size={20} />
                <span>Proprietary dashboards</span>
              </div>
              <div className="pitch-problem-item-detailed">
                <MousePointer size={20} />
                <span>Click-heavy navigation</span>
              </div>
              <div className="pitch-problem-item-detailed">
                <ExternalLink size={20} />
                <span>Away from dev environment</span>
              </div>
              <div className="pitch-problem-item-detailed">
                <RefreshCw size={20} />
                <span>Vicious debugging cycle</span>
              </div>
            </div>
          </div>
          
          <div className="pitch-vicious-cycle">
            <h4>The Vicious Cycle</h4>
            <div className="pitch-cycle-circular">
              {/* SVG for connecting arrows - viewBox matches 320x320 container */}
              <svg className="pitch-cycle-arrows" viewBox="0 0 320 320">
                <defs>
                  <marker id="pitch-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                </defs>
                {/* L-shaped arrows with aligned axes - clockwise flow */}
                {/* PM → Alert: right on Y=40, then down to Alert */}
                <polyline points="200,40 264,40 264,68" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead)" />
                {/* Alert → Dashboard: down on X=224 (moved left) */}
                <polyline points="264,132 264,188" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead)" />
                {/* Dashboard → Click: down on X=264, then left on Y=280 */}
                <polyline points="264,252 264,280 200,280" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead)" />
                {/* Click → Overwhelm: left on Y=280, then up to Overwhelm */}
                <polyline points="120,280 56,280 56,252" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead)" />
                {/* Overwhelm → Fix: up on X=96 (moved right) */}
                <polyline points="56,188 56,132" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead)" />
                {/* Fix → PM: up on X=56, then right on Y=40 */}
                <polyline points="56,68 56,40 120,40" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#pitch-arrowhead)" />
              </svg>
              
              {/* Cycle nodes positioned in a circle */}
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

              {/* Center label */}
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

// Experience Slide (from Vibehack)
function ExperienceSlide() {
  const basePath = import.meta.env.BASE_URL
  
  return (
    <motion.div 
      className="pitch-slide pitch-slide--experience"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>First-Hand Experience</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          I've lived this problem.
        </motion.h2>
        
        <motion.div className="pitch-experience-cards" variants={fadeInUp}>
          <div className="pitch-exp-card">
            <div className="pitch-exp-card__header">
              <img src={`${basePath}wbd.png`} alt="Warner Bros. Discovery" className="pitch-exp-card__logo" />
              <div>
                <h4>Machine Learning Engineer</h4>
                <span className="pitch-exp-card__company">Warner Bros. Discovery</span>
              </div>
            </div>
            <p>Worked on ML systems at scale. Saw firsthand how observability tools fell short when debugging complex AI pipelines.</p>
          </div>
          
          <div className="pitch-exp-card">
            <div className="pitch-exp-card__header">
              <Users size={28} />
              <div>
                <h4>Led Agentic Solutions Teams</h4>
                <span className="pitch-exp-card__company">Consulting Companies</span>
              </div>
            </div>
            <p>Led teams developing agentic AI solutions for enterprises. The debugging pain was real—traces everywhere, fixes nowhere near.</p>
          </div>
        </motion.div>

        <motion.div className="pitch-experience-insight" variants={fadeInUp}>
          <Quote size={24} />
          <p>The tools weren't built for developers. They were built for dashboards.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Market Slide (combined from both decks)
function MarketSlide() {
  const marketData = [
    { year: '2024', value: 5.7, height: 30 },
    { year: '2026', value: 12.0, height: 60 },
    { year: '2028', value: 26.8, height: 110 },
    { year: '2030', value: 52.1, height: 160 },
  ]

  const stats = [
    { name: 'Cursor', metric: '5M+', label: 'Daily Active Users', growth: '+400%' },
    { name: 'Windsurf', metric: '1M+', label: 'Downloads', growth: 'New' },
    { name: 'GitHub Copilot', metric: '1.3M+', label: 'Paid Subscribers', growth: '+35%' },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--market"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Market Opportunity</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          AI agents are the next platform shift
        </motion.h2>

        <motion.div className="pitch-market-combined" variants={fadeInUp}>
          <div className="pitch-market-chart-section">
            <div className="pitch-market-chart">
              <div className="pitch-market-chart__header">
                <h4>AI Agent Market Size</h4>
                <span className="pitch-market-chart__cagr">45% CAGR</span>
              </div>
              <div className="pitch-market-chart__container">
                {marketData.map((item, i) => (
                  <div key={item.year} className="pitch-market-chart__bar-group">
                    <motion.span 
                      className="pitch-market-chart__value"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.15 }}
                      style={{ bottom: item.height + 8 }}
                    >
                      ${item.value}B
                    </motion.span>
                    <motion.div 
                      className="pitch-market-chart__bar"
                      initial={{ height: 0 }}
                      animate={{ height: item.height }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                ))}
              </div>
              <div className="pitch-market-chart__years">
                {marketData.map((item) => (
                  <span key={item.year} className="pitch-market-chart__year">{item.year}</span>
                ))}
              </div>
            </div>

            <div className="pitch-market-stats-side">
              <div className="pitch-market-stat-mini">
                <span className="pitch-market-stat-mini__value">$109.1B</span>
                <span className="pitch-market-stat-mini__label">U.S. Private AI Investment (2024)</span>
              </div>
              <div className="pitch-market-stat-mini">
                <span className="pitch-market-stat-mini__value">78%</span>
                <span className="pitch-market-stat-mini__label">Organizations using AI in 2024</span>
              </div>
              <div className="pitch-market-stat-mini">
                <span className="pitch-market-stat-mini__value">90%</span>
                <span className="pitch-market-stat-mini__label">AI models from industry (2024)</span>
              </div>
            </div>
          </div>

          <div className="pitch-ide-stats">
            <h4>AI IDEs Are Exploding</h4>
            <div className="pitch-ide-stats__grid">
              {stats.map((stat) => (
                <div key={stat.name} className="pitch-ide-stat">
                  <span className="pitch-ide-stat__name">{stat.name}</span>
                  <span className="pitch-ide-stat__value">{stat.metric}</span>
                  <span className="pitch-ide-stat__label">{stat.label}</span>
                  <span className="pitch-ide-stat__growth">{stat.growth}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p className="pitch-market-source" variants={fadeInUp}>
          Sources: <a href="https://hai.stanford.edu/ai-index/2025-ai-index-report" target="_blank" rel="noopener noreferrer">Stanford HAI 2025</a>, <a href="https://www.bcg.com/capabilities/artificial-intelligence/ai-agents" target="_blank" rel="noopener noreferrer">BCG AI Agents</a>
        </motion.p>
      </div>
    </motion.div>
  )
}

// Turnaround Slide (from Vibehack - Solution)
function TurnaroundSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--turnaround"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Solution</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          How can we cut the turnaround time?
        </motion.h2>

        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          That's where <span className="pitch-highlight">Shepherd-MCP</span> comes in.
        </motion.p>
        
        <motion.div className="pitch-solution-columns" variants={fadeInUp}>
          {/* Left Column - Workflow */}
          <div className="pitch-solution-column pitch-solution-column--workflow">
            <h4>With Shepherd-MCP</h4>
            <div className="pitch-workflow-steps-vertical">
              <div className="pitch-workflow-step pitch-workflow-step--highlight">
                <Bot size={16} />
                <span>Offload to Cursor/Windsurf</span>
              </div>
              <div className="pitch-workflow-arrow-down">↓</div>
              <div className="pitch-workflow-step pitch-workflow-step--highlight">
                <Search size={16} />
                <span>AI Isolates & RCA</span>
              </div>
              <div className="pitch-workflow-arrow-down">↓</div>
              <div className="pitch-workflow-step pitch-workflow-step--highlight">
                <Wrench size={16} />
                <span>Fix in Same Tool</span>
              </div>
            </div>
            <span className="pitch-workflow-time pitch-workflow-time--fast">Minutes</span>
          </div>

          {/* Right Column - Time Savings */}
          <div className="pitch-solution-column pitch-solution-column--savings">
            <h4>Time Saved</h4>
            <div className="pitch-time-savings-vertical">
              <div className="pitch-time-savings__before">
                <Clock size={20} />
                <span className="pitch-time-savings__value">3-5 hours</span>
                <span className="pitch-time-savings__label">Traditional debugging</span>
              </div>
              <div className="pitch-time-savings__arrow-down">↓</div>
              <div className="pitch-time-savings__after">
                <Zap size={20} />
                <span className="pitch-time-savings__value">30-50 min</span>
                <span className="pitch-time-savings__label">With Shepherd-MCP</span>
              </div>
            </div>
            <div className="pitch-time-savings__benefits-vertical">
              <div className="pitch-time-savings__benefit">
                <CheckCircle size={16} />
                <span>Zero information loss in conveyance</span>
              </div>
              <div className="pitch-time-savings__benefit">
                <TrendingUp size={16} />
                <span><strong>Over 10x time saved</strong> for CXOs, PMs, EMs</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p className="pitch-solution-punchline" variants={fadeInUp}>
          Let AI isolate issues, conduct RCA, and fix—all without leaving your IDE.
        </motion.p>
      </div>
    </motion.div>
  )
}

// Paradigm Slide (from Vibehack - ShepherdMCPSlide)
function ParadigmSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--paradigm"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Paradigm Shift</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Why <span className="pitch-highlight">MCP</span>?
        </motion.h2>
        
        <motion.div className="pitch-mcp-insight" variants={fadeInUp}>
          <blockquote>
            "The history of observability tools over the past couple of decades have been about a pretty simple concept: <strong>how do we make terabytes of heterogeneous telemetry data comprehensible to human beings?</strong>"
          </blockquote>
        </motion.div>

        <motion.div className="pitch-mcp-death" variants={fadeInUp}>
          <div className="pitch-mcp-death__icon">
            <BrainCircuit size={40} />
          </div>
          <div className="pitch-mcp-death__content">
            <h3>In AI, I see the death of this paradigm.</h3>
            <p>It's already real. It's already here. It's going to fundamentally change the way we approach systems design and operation in the future.</p>
          </div>
        </motion.div>

        <motion.div className="pitch-mcp-catchup" variants={fadeInUp}>
          <Globe size={24} />
          <p><strong>The world has moved to Agentic Coding.</strong> Observability is yet to catch up.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Integration Slide (from Vibehack)
function IntegrationSlide() {
  const tools = [
    { name: 'Langfuse', icon: Eye, highlight: true },
    { name: 'aiobs', icon: BrainCircuit, highlight: true },
    { name: 'Portkey', icon: Shield, highlight: false },
    { name: 'Datadog', icon: BarChart3, highlight: false },
    { name: 'Any Tool', icon: Layers, highlight: false },
  ]

  const ides = [
    { name: 'Cursor', icon: Terminal, highlight: true },
    { name: 'Claude Code', icon: Code, highlight: true },
    { name: 'Emergent', icon: Rocket, highlight: true },
    { name: 'Windsurf', icon: Terminal, highlight: true },
    { name: 'Any MCP IDE', icon: Terminal, highlight: true },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--integration"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Universal Integration</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Works with what you already use.
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Simply integrate Shepherd-MCP to your IDE—whether you use Langfuse, aiobs, Portkey, Datadog, or any observability tool.
        </motion.p>

        <motion.div className="pitch-integration-flow" variants={fadeInUp}>
          <div className="pitch-integration-tools">
            {tools.map((tool, i) => (
              <motion.div 
                key={tool.name}
                className={`pitch-integration-tool ${tool.highlight ? 'pitch-integration-tool--highlight' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <tool.icon size={20} />
                <span>{tool.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="pitch-integration-arrow">
            <Workflow size={32} />
          </div>

          <div className="pitch-integration-mcp">
            <div className="pitch-integration-mcp__badge">
              <svg viewBox="0 0 32 32" className="pitch-integration-mcp__logo">
                <rect width="32" height="32" rx="6" fill="#111"/>
                <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
              </svg>
              <span>Shepherd-MCP</span>
            </div>
          </div>

          <div className="pitch-integration-arrow">
            <Zap size={32} />
          </div>

          <div className="pitch-integration-ides">
            {ides.map((ide, i) => (
              <motion.div 
                key={ide.name}
                className={`pitch-integration-ide ${ide.highlight ? 'pitch-integration-ide--highlight' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <ide.icon size={24} />
                <span>{ide.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="pitch-integration-bam" variants={fadeInUp}>
          <span>And bam!</span> Your AI can read, analyze, and fix production issues.
        </motion.div>
      </div>
    </motion.div>
  )
}

// Validation Slide (from Vibehack)
function ValidationSlide() {
  const basePath = import.meta.env.BASE_URL
  
  const quotes = [
    {
      company: 'Fenmo AI',
      logo: `${basePath}fenmoai_logo.jpeg`,
      role: 'Founder',
      quote: "Devs have to do frequent context-switching to move to dashboards...",
      insight: "Need a solution that fits in well",
      tool: "Uses Langfuse",
      color: '#F97316'
    },
    {
      company: 'Nurix.ai',
      logo: `${basePath}nurixai_logo.jpeg`,
      role: 'Developers',
      quote: "Looking through Agentic trace containing 50 LLM calls + 20 tool dispatch...",
      insight: "Pain, chore, bloat—cut it down with agentic coding",
      tool: "Building AI Agents",
      color: '#3B82F6'
    },
    {
      company: 'AgnostAI',
      logo: `${basePath}agnostai.jpeg`,
      role: 'Founders',
      quote: "Analytics is for management. Real work is done by developers.",
      insight: "Building on top of analytics engine may significantly speedup developer pace",
      tool: "Analytics Platform",
      color: '#8B5CF6'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--validation"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Market Validation</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Do teams really want this?
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          I've been talking with teams to understand if this is real—or yet another cool AI feature.
        </motion.p>

        <motion.div className="pitch-validation-quotes" variants={fadeInUp}>
          {quotes.map((q, i) => (
            <motion.div 
              key={q.company}
              className="pitch-quote-card"
              style={{ '--quote-color': q.color }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="pitch-quote-card__header">
                <div className="pitch-quote-card__company">
                  {q.logo && <img src={q.logo} alt={q.company} className="pitch-quote-card__logo" />}
                  <div>
                    <span className="pitch-quote-card__name">{q.company}</span>
                    <span className="pitch-quote-card__role">{q.role}</span>
                  </div>
                </div>
                <span className="pitch-quote-card__tool">{q.tool}</span>
              </div>
              <blockquote className="pitch-quote-card__quote">"{q.quote}"</blockquote>
              <p className="pitch-quote-card__insight">
                <Lightbulb size={14} />
                {q.insight}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="pitch-validation-verdict" variants={fadeInUp}>
          <CheckCircle size={24} />
          <span>Guess what? <strong>They want it.</strong></span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function BusinessModelSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--business"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Business Model</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Open-source core, enterprise monetization
        </motion.h2>

        <motion.div className="pitch-business-tiers" variants={fadeInUp}>
          <div className="pitch-business-tier">
            <div className="pitch-business-tier__header">
              <Github size={24} />
              <h4>Free / Open Source</h4>
            </div>
            <ul>
              <li>aiobs SDK (MIT licensed)</li>
              <li>10,000 traces/month</li>
              <li>7-day retention</li>
              <li>Community support</li>
            </ul>
            <div className="pitch-business-tier__price">
              <span className="pitch-business-tier__amount">$0</span>
              <span className="pitch-business-tier__period">/forever</span>
            </div>
          </div>

          <div className="pitch-business-tier pitch-business-tier--enterprise">
            <div className="pitch-business-tier__badge">Revenue Driver</div>
            <div className="pitch-business-tier__header">
              <Building2 size={24} />
              <h4>Enterprise</h4>
            </div>
            <ul>
              <li>Unlimited traces</li>
              <li>Advanced analytics</li>
              <li>SSO, RBAC, compliance</li>
              <li>On-premise deployment</li>
              <li>Self-healing prompts</li>
              <li>Dedicated support</li>
            </ul>
            <div className="pitch-business-tier__price">
              <span className="pitch-business-tier__amount">Custom</span>
              <span className="pitch-business-tier__period">/annual contract</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="pitch-business-model" variants={fadeInUp}>
          <div className="pitch-business-model__item">
            <DollarSign size={20} />
            <span><strong>Land:</strong> Developers adopt free SDK</span>
          </div>
          <div className="pitch-business-model__arrow">→</div>
          <div className="pitch-business-model__item">
            <Users size={20} />
            <span><strong>Expand:</strong> Teams upgrade for collaboration</span>
          </div>
          <div className="pitch-business-model__arrow">→</div>
          <div className="pitch-business-model__item">
            <Building2 size={20} />
            <span><strong>Enterprise:</strong> Org-wide deployment + support</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function TractionSlide() {
  const milestones = [
    { icon: '🚀', title: 'aiobs SDK', desc: 'Open source launch', date: 'Nov 2025' },
    { icon: '⚡', title: 'Shepherd', desc: 'Platform ready', date: 'Nov 2025' },
    { icon: '🥈', title: 'Vibehack', desc: '2nd Prize', date: 'Dec 2025' },
    { icon: '🤝', title: 'Pilots', desc: '2 signed', date: 'Dec 2025' },
    { icon: '🔬', title: 'Research', desc: 'Partnership', date: 'Dec 2025' },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--traction"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Early Traction</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Real conversations, real momentum
        </motion.h2>

        <motion.div className="pitch-traction-metrics-large" variants={fadeInUp}>
          <div className="pitch-traction-metric-large">
            <span className="pitch-traction-metric-large__value">2</span>
            <span className="pitch-traction-metric-large__label">Pilots</span>
          </div>
          <div className="pitch-traction-metric-large">
            <span className="pitch-traction-metric-large__value">1</span>
            <span className="pitch-traction-metric-large__label">PoC in Development</span>
          </div>
          <div className="pitch-traction-metric-large">
            <span className="pitch-traction-metric-large__value">1</span>
            <span className="pitch-traction-metric-large__label">Research Partnership</span>
          </div>
          <div className="pitch-traction-metric-large">
            <span className="pitch-traction-metric-large__value">1</span>
            <span className="pitch-traction-metric-large__label">Talks Initiated</span>
          </div>
        </motion.div>

        <motion.div className="pitch-traction-validation" variants={fadeInUp}>
          <div className="pitch-traction-validation__badge">
            <CheckCircle size={20} />
            <span>🥈 2nd Prize at Vibehack 2025</span>
          </div>
          <p>
            Idea validated by <strong>Entrepreneur First</strong>, <strong>OpenAI</strong>, and <strong>Emergent</strong>
          </p>
        </motion.div>

        <motion.div className="pitch-horizontal-timeline" variants={fadeInUp}>
          <div className="pitch-h-timeline">
            <div className="pitch-h-timeline__line" />
            {milestones.map((m, i) => (
              <motion.div 
                key={i}
                className="pitch-h-timeline__item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="pitch-h-timeline__dot" />
                <div className="pitch-h-timeline__card">
                  <span className="pitch-h-timeline__icon">{m.icon}</span>
                  <span className="pitch-h-timeline__title">{m.title}</span>
                  <span className="pitch-h-timeline__desc">{m.desc}</span>
                  <span className="pitch-h-timeline__date">{m.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function PartnershipsSlide() {
  const basePath = import.meta.env.BASE_URL
  
  const partnerships = [
    {
      company: 'Intraintel.ai',
      logo: `${basePath}intraintel.jpeg`,
      status: 'Pilot',
      statusColor: '#10B981',
      description: 'AI-powered enterprise solutions company. Deploying Shepherd for their agent infrastructure to gain visibility into production AI workflows.',
      useCase: 'Enterprise Agent Observability'
    },
    {
      company: 'Fenmo AI',
      logo: `${basePath}fenmoai_logo.jpeg`,
      status: 'Pilot',
      statusColor: '#10B981',
      description: 'Uses Langfuse for observability. Integrating Shepherd-MCP to bring traces directly into their development workflow.',
      useCase: 'IDE-Native Debugging'
    },
    {
      company: 'Verifast.ai',
      logo: `${basePath}verifast_tech_logo.jpeg`,
      status: 'PoC In Progress',
      statusColor: '#F59E0B',
      description: 'Building proof-of-concept for self-healing prompts — automatically detecting and fixing failing prompts in production.',
      useCase: 'Self-Healing Prompts'
    },
    {
      company: 'Exosphere.host',
      logo: `${basePath}exosphere.jpg`,
      status: 'Research Partner',
      statusColor: '#6366F1',
      description: 'Joint research initiative to understand why AI agents fail in production environments and how observability can prevent failures.',
      useCase: 'AI Agent Failure Research'
    },
    {
      company: 'Lambdatest',
      logo: `${basePath}lambdatest_logo.jpeg`,
      status: 'Talks Initiated',
      statusColor: '#3B82F6',
      description: 'Exploring collaboration for A/B testing capabilities in AI agent workflows — comparing agent performance across different configurations.',
      useCase: 'A/B Testing for AI Agents'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--partnerships"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Partnerships & Pilots</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Early adopters validating the vision
        </motion.h2>

        <motion.div className="pitch-partnerships-grid pitch-partnerships-grid--five" variants={fadeInUp}>
          {partnerships.map((partner, i) => (
            <motion.div 
              key={partner.company}
              className="pitch-partnership-card"
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
            >
              <div className="pitch-partnership-card__header">
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.company} className="pitch-partnership-card__logo" />
                ) : (
                  <div className="pitch-partnership-card__logo-placeholder">
                    {partner.company.charAt(0)}
                  </div>
                )}
                <div className="pitch-partnership-card__info">
                  <h4 className="pitch-partnership-card__company">{partner.company}</h4>
                  <span 
                    className="pitch-partnership-card__status"
                    style={{ background: `${partner.statusColor}20`, color: partner.statusColor }}
                  >
                    {partner.status}
                  </span>
                </div>
              </div>
              <p className="pitch-partnership-card__desc">{partner.description}</p>
              <div className="pitch-partnership-card__usecase">
                <Target size={14} />
                <span>{partner.useCase}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="pitch-partnerships-quote" variants={fadeInUp}>
          <p>"Understanding agent behavior in production is the #1 challenge for enterprise AI adoption."</p>
          <span>— Common theme from pilot conversations</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function RoadmapSlide() {
  const roadmap = [
    {
      quarter: '1',
      title: 'Foundation',
      items: ['Shepherd-MCP launch', 'IDE integrations', 'Cloud storage support']
    },
    {
      quarter: '2',
      title: 'SDK & Evals',
      items: ['aiobs evals framework', 'Multi-LLM providers', 'GSoC 2026 application']
    },
    {
      quarter: '3',
      title: 'Self-Healing',
      items: ['shepherd-cli launch', 'Prompt optimizer', 'Auto-fix implementation']
    },
    {
      quarter: '4',
      title: 'Growth',
      items: ['Pilot conversions', 'Enterprise features', 'A/B testing support']
    },
    {
      quarter: '5',
      title: 'Scale',
      items: ['Multi-agent support', 'Global expansion', 'Platform partnerships']
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--roadmap"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Roadmap</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Bringing observability into the age of agentic coding
        </motion.h2>

        <motion.div className="pitch-roadmap" variants={fadeInUp}>
          {roadmap.map((phase, i) => (
            <div key={i} className={`pitch-roadmap__phase ${i === 0 ? 'pitch-roadmap__phase--active' : ''}`}>
              <span className="pitch-roadmap__quarter">{phase.quarter}</span>
              <h4 className="pitch-roadmap__title">{phase.title}</h4>
              <ul className="pitch-roadmap__items">
                {phase.items.map((item, j) => (
                  <li key={j}><CircleDot size={12} /> {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

function TeamSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--team"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Team</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Built by engineers, for engineers
        </motion.h2>

        <motion.div className="pitch-team" variants={fadeInUp}>
          <div className="pitch-team__member">
            <div className="pitch-team__avatar">
              <Users size={32} />
            </div>
            <h4 className="pitch-team__name">Pranav Goswami</h4>
            <span className="pitch-team__role">Founder</span>
            <p className="pitch-team__bio">
              Machine Learning Engineer at Warner Bros. Discovery. 
              Maintainer at LFortran — open-source Fortran compiler. 
              Previously led teams to develop agentic solutions.
            </p>
          </div>
        </motion.div>

        <motion.div className="pitch-team-hiring" variants={fadeInUp}>
          <h4>We need people!</h4>
          <p>"Every Dream Needs a Team" — Mercedes AMG Petronas Formula 1</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function AskSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--ask"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Ask</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Help us in making AI agents trustworthy
        </motion.h2>

        <motion.div className="pitch-ask-details" variants={fadeInUp}>
          <div className="pitch-ask-amount">
            <span className="pitch-ask-amount__value">$400K</span>
            <span className="pitch-ask-amount__label">Pre-Seed Round</span>
          </div>

          <div className="pitch-ask-use">
            <h4>Use of Funds</h4>
            <div className="pitch-ask-use__grid">
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">40%</span>
                <span className="pitch-ask-use__label">Engineering</span>
              </div>
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">25%</span>
                <span className="pitch-ask-use__label">Go-to-Market</span>
              </div>
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">15%</span>
                <span className="pitch-ask-use__label">Cloud Infrastructure</span>
              </div>
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">10%</span>
                <span className="pitch-ask-use__label">Open Source</span>
              </div>
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">10%</span>
                <span className="pitch-ask-use__label">Operations</span>
              </div>
            </div>
          </div>

          <div className="pitch-ask-runway">
            <span className="pitch-ask-runway__value">14 months</span>
            <span className="pitch-ask-runway__label">Runway to Series A milestones</span>
          </div>
        </motion.div>

        <motion.div className="pitch-ask-cta" variants={fadeInUp}>
          <p>Let's discuss how we can work together.</p>
          <Link to="/contact" className="btn btn--primary btn--lg">
            Get in Touch
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main component
export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef(null)

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }, [currentSlide])

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }, [currentSlide])

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
  }, [handleNext, handlePrev])

  // Scroll wheel navigation - disabled to prevent accidental navigation
  // Users can navigate via arrow keys, nav dots, or bottom navigation buttons

  const renderSlide = () => {
    switch (slides[currentSlide].id) {
      case 'cover': return <CoverSlide />
      case 'problem': return <ProblemSlide />
      case 'solution': return <SolutionSlide />
      case 'how-it-works': return <HowItWorksSlide />
      case 'competitors-intro': return <CompetitorsIntroSlide />
      case 'vicious-cycle': return <ViciousCycleSlide />
      case 'experience': return <ExperienceSlide />
      case 'market': return <MarketSlide />
      case 'turnaround': return <TurnaroundSlide />
      case 'paradigm': return <ParadigmSlide />
      case 'integration': return <IntegrationSlide />
      case 'validation': return <ValidationSlide />
      case 'traction': return <TractionSlide />
      case 'partnerships': return <PartnershipsSlide />
      case 'business-model': return <BusinessModelSlide />
      case 'roadmap': return <RoadmapSlide />
      case 'team': return <TeamSlide />
      case 'ask': return <AskSlide />
      default: return <CoverSlide />
    }
  }

  return (
    <div className="pitch-deck" ref={containerRef}>
      <PitchHeader currentSlide={currentSlide} onSlideChange={handleSlideChange} />
      
      <main className="pitch-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
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
        totalSlides={slides.length}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}
