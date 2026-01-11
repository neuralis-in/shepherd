import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  AlertTriangle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  Users,
  Globe,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  BarChart3,
  Rocket,
  Bot,
  Terminal,
  Code,
  Eye,
  Quote,
  BrainCircuit,
  Database,
  Network,
  Search,
  Lightbulb,
  X,
  Check,
  FileText,
  Activity,
  GitBranch,
  Play,
  MessageSquare,
  ExternalLink,
  HardDrive,
  Container,
  Workflow,
  Share2,
  Brain,
  Settings,
  Lock,
  Unlock,
  Box
} from 'lucide-react'
import './EFDeck.css'

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
  { id: 'memlake', title: 'MemLake' },
  { id: 'belief', title: 'Belief' },
  { id: 'hunch1', title: 'Hunch 1' },
  { id: 'hunch2', title: 'Hunch 2' },
  { id: 'hunch3', title: 'Hunch 3' },
  { id: 'hunch4', title: 'Hunch 4' },
  { id: 'compliance', title: 'Compliance' },
  { id: 'pilots', title: 'Pilots' },
  { id: 'product', title: 'Product' },
  { id: 'demo', title: 'Demo' },
  { id: 'value-prop', title: 'Value Prop' },
  { id: 'thank-you', title: 'Thank You' },
]

function EFHeader({ currentSlide, onSlideChange }) {
  return (
    <header className="ef-header">
      <div className="ef-header__container">
        <Link to="/" className="ef-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="ef-header__logo">
          <svg viewBox="0 0 32 32" className="ef-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        
        <nav className="ef-header__nav">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`ef-header__nav-item ${currentSlide === index ? 'active' : ''}`}
              onClick={() => onSlideChange(index)}
            >
              <span className="ef-header__nav-dot" />
              <span className="ef-header__nav-label">{slide.title}</span>
            </button>
          ))}
        </nav>

        <div className="ef-header__badge">
          EF Deck
        </div>
      </div>
    </header>
  )
}

function SlideNavigation({ currentSlide, totalSlides, onPrev, onNext }) {
  return (
    <div className="ef-nav">
      <button 
        className="ef-nav__btn" 
        onClick={onPrev}
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={20} />
      </button>
      <span className="ef-nav__counter">
        {currentSlide + 1} / {totalSlides}
      </span>
      <button 
        className="ef-nav__btn" 
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

// Slide 1: Cover
function CoverSlide() {
  return (
    <motion.div 
      className="ef-slide ef-slide--cover"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content">
        <motion.div className="ef-cover__logo" variants={fadeInUp}>
          <svg viewBox="0 0 32 32" className="ef-cover__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.div>
        
        <motion.h1 className="ef-cover__title" variants={fadeInUp}>
          Shepherd
        </motion.h1>
        
        <motion.p className="ef-cover__tagline" variants={fadeInUp}>
          Observability layer for AI Agents
        </motion.p>

        <motion.p className="ef-cover__hook" variants={fadeInUp}>
          Making every agent decision, trace, and memory <span className="ef-cover__hook-emphasis">observable, auditable, and explainable.</span>
        </motion.p>
        
        <motion.div className="ef-cover__stats" variants={fadeInUp}>
          <div className="ef-cover__stat">
            <span className="ef-cover__stat-value">Open Source</span>
            <span className="ef-cover__stat-label">aiobs SDK</span>
          </div>
          <div className="ef-cover__stat-divider" />
          <div className="ef-cover__stat">
            <span className="ef-cover__stat-value">Pre-Seed</span>
            <span className="ef-cover__stat-label">Stage</span>
          </div>
          <div className="ef-cover__stat-divider" />
          <div className="ef-cover__stat">
            <span className="ef-cover__stat-value">2025</span>
            <span className="ef-cover__stat-label">Founded</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 2: MemLake - Observable Memory for Agents
function MemLakeSlide() {
  return (
    <motion.div 
      className="ef-slide ef-slide--memlake"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content">
        <motion.span className="ef-slide__label" variants={fadeInUp}>What We Built</motion.span>
        
        <motion.h2 className="ef-slide__title" variants={fadeInUp}>
          Shepherd <span className="ef-highlight">MemLake</span>
        </motion.h2>
        
        <motion.p className="ef-slide__subtitle" variants={fadeInUp}>
          Observable memory for AI agents — combining traces with knowledge graphs
        </motion.p>

        <motion.div className="ef-memlake-flow" variants={scaleIn}>
          {/* Shepherd Observability */}
          <div className="ef-memlake-node ef-memlake-node--shepherd">
            <div className="ef-memlake-node__icon">
              <Activity size={28} />
            </div>
            <h4>Shepherd</h4>
            <p>Dumps traces from your agentic pipelines</p>
          </div>

          {/* Flow Arrow 1 */}
          <div className="ef-memlake-flow__arrow">
            <div className="ef-memlake-flow__arrow-line">
              <div className="ef-memlake-flow__particle"></div>
            </div>
            <span>subscribe</span>
          </div>

          {/* MemLake */}
          <div className="ef-memlake-node ef-memlake-node--memlake">
            <div className="ef-memlake-node__icon">
              <Brain size={28} />
            </div>
            <h4>MemLake</h4>
            <p>Subscribes to traces & creates knowledge graphs</p>
            <div className="ef-memlake-node__graph">
              <svg viewBox="0 0 100 60" className="ef-memlake-graph">
                <circle cx="20" cy="30" r="8" fill="#10B981" opacity="0.8" />
                <circle cx="50" cy="15" r="6" fill="#3B82F6" opacity="0.8" />
                <circle cx="50" cy="45" r="6" fill="#8B5CF6" opacity="0.8" />
                <circle cx="80" cy="30" r="8" fill="#F59E0B" opacity="0.8" />
                <line x1="28" y1="28" x2="44" y2="17" stroke="#64748b" strokeWidth="1.5" />
                <line x1="28" y1="32" x2="44" y2="43" stroke="#64748b" strokeWidth="1.5" />
                <line x1="56" y1="17" x2="72" y2="28" stroke="#64748b" strokeWidth="1.5" />
                <line x1="56" y1="43" x2="72" y2="32" stroke="#64748b" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Flow Arrow 2 */}
          <div className="ef-memlake-flow__arrow">
            <div className="ef-memlake-flow__arrow-line">
              <div className="ef-memlake-flow__particle"></div>
            </div>
            <span>subscribe</span>
          </div>

          {/* Agentic Pipelines */}
          <div className="ef-memlake-node ef-memlake-node--pipelines">
            <div className="ef-memlake-node__icon">
              <Workflow size={28} />
            </div>
            <h4>Agentic Pipelines</h4>
            <p>Query knowledge graphs for enhanced context</p>
          </div>
        </motion.div>

        <motion.div className="ef-memlake-summary" variants={fadeInUp}>
          <div className="ef-memlake-summary__item">
            <Eye size={18} />
            <span>Full observability into memory operations</span>
          </div>
          <div className="ef-memlake-summary__item">
            <GitBranch size={18} />
            <span>Trace how memories affect LLM responses</span>
          </div>
          <div className="ef-memlake-summary__item">
            <Shield size={18} />
            <span>Auditable memory access patterns</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 3: Our Belief
function BeliefSlide() {
  return (
    <motion.div 
      className="ef-slide ef-slide--belief"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content ef-slide__content--centered">
        <motion.span className="ef-slide__label" variants={fadeInUp}>Foundation</motion.span>
        
        <motion.h2 className="ef-slide__title ef-slide__title--large" variants={fadeInUp}>
          Our Belief?
        </motion.h2>

        <motion.div className="ef-belief-statement" variants={fadeInUp}>
          <Quote size={40} className="ef-belief-quote-icon" />
          <p>The future of AI agents requires both <span className="ef-highlight">visibility</span> into their decisions and <span className="ef-highlight">memory</span> that evolves with user context.</p>
        </motion.div>

        <motion.div className="ef-belief-journey" variants={fadeInUp}>
          <p>Here's how we arrived at this conviction...</p>
          <ArrowRight size={24} />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 4: Hunch 1 - 74% failing
function Hunch1Slide() {
  const basePath = import.meta.env.BASE_URL
  
  return (
    <motion.div 
      className="ef-slide ef-slide--hunch"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content">
        <motion.span className="ef-slide__label" variants={fadeInUp}>Hypothesis 1</motion.span>
        
        <motion.h2 className="ef-slide__title" variants={fadeInUp}>
          <span className="ef-highlight-red">74%</span> of agentic systems are failing
        </motion.h2>
        
        <motion.p className="ef-slide__subtitle" variants={fadeInUp}>
          The major reason isn't poor engineering — it's <span className="ef-highlight">user experience</span>.
        </motion.p>

        <motion.div className="ef-hunch-content" variants={fadeInUp}>
          <div className="ef-hunch-research">
            <div className="ef-hunch-research__header">
              <div className="ef-hunch-research__logos">
                <svg viewBox="0 0 32 32" className="ef-hunch-research__logo">
                  <rect width="32" height="32" rx="6" fill="#111"/>
                  <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
                </svg>
                <span>×</span>
                <img src={`${basePath}exosphere.jpg`} alt="Exosphere" className="ef-hunch-research__logo-img" />
              </div>
              <h4>Shepherd × Exosphere</h4>
            </div>
            <p>Researching why agentic systems are failing since a month</p>
            
            <div className="ef-hunch-research__companies">
              <span>Talked with:</span>
              <div className="ef-hunch-research__company-list">
                <span className="ef-company-tag">Supatest AI</span>
                <span className="ef-company-tag">QuickReply.ai</span>
                <span className="ef-company-tag">TestSigma</span>
                <span className="ef-company-tag">+ more</span>
              </div>
            </div>
          </div>

          <div className="ef-hunch-insight">
            <Lightbulb size={24} />
            <div>
              <h4>Key Finding</h4>
              <p>The fundamental difference between companies getting agentic systems right is <strong>providing agents with extra context</strong>.</p>
            </div>
          </div>
        </motion.div>

        <motion.p className="ef-hunch-source" variants={fadeInUp}>
          Source: <a href="https://www.bcg.com/press/24october2024-ai-adoption-in-2024-74-of-companies-struggle-to-achieve-and-scale-value" target="_blank" rel="noopener noreferrer">BCG 2024</a>
        </motion.p>
      </div>
    </motion.div>
  )
}

// Slide 5: Hunch 2 - Evals
function Hunch2Slide() {
  const basePath = import.meta.env.BASE_URL
  
  return (
    <motion.div 
      className="ef-slide ef-slide--hunch"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content">
        <motion.span className="ef-slide__label" variants={fadeInUp}>Hypothesis 2</motion.span>
        
        <motion.h2 className="ef-slide__title" variants={fadeInUp}>
          To improve UX — get your <span className="ef-highlight">evals</span> right!
        </motion.h2>
        
        <motion.p className="ef-slide__subtitle" variants={fadeInUp}>
          But there's a catch...
        </motion.p>

        <motion.div className="ef-hunch-case-study" variants={fadeInUp}>
          <div className="ef-hunch-case-study__header">
            <img src={`${basePath}wbd.png`} alt="Warner Bros. Discovery" className="ef-hunch-case-study__logo" />
            <div>
              <h4>Warner Bros. Discovery</h4>
              <span>Real-world example</span>
            </div>
          </div>
          
          <div className="ef-hunch-case-study__flow">
            <div className="ef-case-step">
              <div className="ef-case-step__icon ef-case-step__icon--success">
                <Check size={18} />
              </div>
              <span>Set up right evals</span>
            </div>
            <ArrowRight size={20} className="ef-case-arrow" />
            <div className="ef-case-step">
              <div className="ef-case-step__icon ef-case-step__icon--success">
                <Check size={18} />
              </div>
              <span>QA checks passed</span>
            </div>
            <ArrowRight size={20} className="ef-case-arrow" />
            <div className="ef-case-step">
              <div className="ef-case-step__icon ef-case-step__icon--success">
                <Check size={18} />
              </div>
              <span>Model 1 → Model 2</span>
            </div>
            <ArrowRight size={20} className="ef-case-arrow" />
            <div className="ef-case-step">
              <div className="ef-case-step__icon ef-case-step__icon--error">
                <X size={18} />
              </div>
              <span>Users complained!</span>
            </div>
          </div>

          <div className="ef-hunch-case-study__conclusion">
            <AlertTriangle size={24} />
            <p>Benchmarked, QA passed, but end users started complaining Model 2 results weren't good.</p>
          </div>
        </motion.div>

        <motion.div className="ef-hunch-takeaway" variants={fadeInUp}>
          <X size={24} className="ef-hunch-takeaway__icon" />
          <p>You can't directly correlate <strong>evals</strong> × <strong>user experience</strong></p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 6: Hunch 3 - Memory Layer
function Hunch3Slide() {
  const competitors = [
    { name: 'Mem0', focus: 'Memory Management', origin: 'User memory focus' },
    { name: 'Zep.ai', focus: 'Long-term Memory', origin: 'Conversation history' },
    { name: 'Cognee', focus: 'Knowledge Graphs', origin: 'Structured memory' },
  ]

  return (
    <motion.div 
      className="ef-slide ef-slide--hunch"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content">
        <motion.span className="ef-slide__label" variants={fadeInUp}>Hypothesis 3</motion.span>
        
        <motion.h2 className="ef-slide__title" variants={fadeInUp}>
          Build something around <span className="ef-highlight">user data</span>
        </motion.h2>
        
        <motion.p className="ef-slide__subtitle" variants={fadeInUp}>
          Memory layer for AI agents — there's a competitive landscape
        </motion.p>

        <motion.div className="ef-hunch-competitors" variants={fadeInUp}>
          <h4>Competitive Landscape</h4>
          <div className="ef-competitors-grid">
            {competitors.map((comp, i) => (
              <motion.div 
                key={comp.name}
                className="ef-competitor-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <span className="ef-competitor-card__name">{comp.name}</span>
                <span className="ef-competitor-card__focus">{comp.focus}</span>
                <span className="ef-competitor-card__origin">{comp.origin}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="ef-hunch-red-flag" variants={fadeInUp}>
          <AlertCircle size={24} />
          <div>
            <h4>Big Red Flag</h4>
            <p>These solutions subscribe to <strong>"USER"</strong> data that doesn't directly correlate with your agentic pipelines.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 7: Hunch 4 - Observability + Memory
function Hunch4Slide() {
  return (
    <motion.div 
      className="ef-slide ef-slide--hunch4"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content ef-slide__content--centered">
        <motion.span className="ef-slide__label" variants={fadeInUp}>Hypothesis 4</motion.span>
        
        <motion.h2 className="ef-slide__title ef-slide__title--large" variants={fadeInUp}>
          <span className="ef-highlight">Observability</span> + <span className="ef-highlight">Memory</span>
        </motion.h2>
        
        <motion.p className="ef-slide__subtitle ef-slide__subtitle--centered" variants={fadeInUp}>
          is the place to bet
        </motion.p>

        <motion.div className="ef-hunch4-equation" variants={scaleIn}>
          <div className="ef-hunch4-card ef-hunch4-card--obs">
            <div className="ef-hunch4-card__icon">
              <Eye size={28} />
            </div>
            <h4>Observability</h4>
            <p>See what agents do</p>
          </div>
          
          <div className="ef-hunch4-operator">+</div>
          
          <div className="ef-hunch4-card ef-hunch4-card--memory">
            <div className="ef-hunch4-card__icon">
              <Brain size={28} />
            </div>
            <h4>Memory</h4>
            <p>Context that evolves</p>
          </div>
          
          <div className="ef-hunch4-operator">=</div>
          
          <div className="ef-hunch4-card ef-hunch4-card--result">
            <div className="ef-hunch4-card__icon">
              <Zap size={28} />
            </div>
            <h4>Shepherd MemLake</h4>
            <p>Trustworthy AI agents</p>
          </div>
        </motion.div>

        <motion.div className="ef-hunch4-insight" variants={fadeInUp}>
          <p>Neither alone is enough. Together, they create <strong>trustworthy agents</strong>.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 8: Compliance & Auditability
function ComplianceSlide() {
  return (
    <motion.div 
      className="ef-slide ef-slide--compliance"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content">
        <motion.span className="ef-slide__label" variants={fadeInUp}>Validation</motion.span>
        
        <motion.h2 className="ef-slide__title" variants={fadeInUp}>
          Domain expertise validates the thesis
        </motion.h2>

        <motion.div className="ef-compliance-content" variants={fadeInUp}>
          <div className="ef-compliance-domain">
            <div className="ef-compliance-domain__header">
              <Shield size={28} />
              <h4>Fintech</h4>
            </div>
            <p>Extensively spoken to stakeholders in fintech sector about their regulatory requirements.</p>
          </div>

          <div className="ef-compliance-finding">
            <Quote size={24} />
            <blockquote>
              Agents with memory alone providing results is <strong>not enough</strong>. 
              Auditability is a requirement for regulatory compliance.
            </blockquote>
          </div>
        </motion.div>

        <motion.div className="ef-compliance-requirements" variants={fadeInUp}>
          <h4>Enterprise Requirements</h4>
          <div className="ef-compliance-grid">
            <div className="ef-compliance-item">
              <FileText size={20} />
              <span>Audit trails</span>
            </div>
            <div className="ef-compliance-item">
              <Eye size={20} />
              <span>Decision transparency</span>
            </div>
            <div className="ef-compliance-item">
              <Lock size={20} />
              <span>Compliance records</span>
            </div>
            <div className="ef-compliance-item">
              <GitBranch size={20} />
              <span>Traceable reasoning</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 9: Pilots & Pain Points
function PilotsSlide() {
  const basePath = import.meta.env.BASE_URL
  
  const pilots = [
    { name: 'Fenmo.ai', logo: `${basePath}fenmoai_logo.jpeg` },
    { name: 'Intraintel.ai', logo: `${basePath}intraintel.jpeg` },
    { name: 'Verifast.ai', logo: `${basePath}verifast_tech_logo.jpeg` },
    { name: 'Nesti', logo: `${basePath}nesti.jpg` },
  ]

  const painPoints = [
    { icon: <EyeOff size={20} />, text: 'Memory is opaque', desc: 'No visibility into stored memories' },
    { icon: <Search size={20} />, text: 'Auditing memory', desc: 'How is memory affecting LLM response?' },
    { icon: <Lock size={20} />, text: 'Identity-based access', desc: 'Not present out of the box, needs engineering' },
    { icon: <Box size={20} />, text: 'Fabricated ecosystem', desc: 'Obs + memory are separate tools' },
  ]

  return (
    <motion.div 
      className="ef-slide ef-slide--pilots"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content">
        <motion.span className="ef-slide__label" variants={fadeInUp}>Pilot Programs</motion.span>
        
        <motion.h2 className="ef-slide__title" variants={fadeInUp}>
          Started talks with pilot companies
        </motion.h2>

        <motion.div className="ef-pilots-logos" variants={fadeInUp}>
          {pilots.map((pilot, i) => (
            <motion.div 
              key={pilot.name}
              className="ef-pilot-logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <img src={pilot.logo} alt={pilot.name} />
              <span>{pilot.name}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="ef-pilots-pain-points" variants={fadeInUp}>
          <h4>Pain points we identified with existing memory solutions:</h4>
          <div className="ef-pain-points-grid">
            {painPoints.map((point, i) => (
              <div key={i} className="ef-pain-point">
                <div className="ef-pain-point__icon">{point.icon}</div>
                <div className="ef-pain-point__content">
                  <strong>{point.text}</strong>
                  <span>{point.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="ef-pilots-highlight" variants={fadeInUp}>
          <CheckCircle size={20} />
          <span><strong>Shepherd's value:</strong> Observability + memory ecosystem on one control panel</span>
        </motion.div>

        <motion.div className="ef-pilots-rejection" variants={fadeInUp}>
          <X size={18} />
          <span><strong>Red flag:</strong> QuickReply.ai said NO — they don't need auditability</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 10: Product - Shepherd MemLake
function ProductSlide() {
  return (
    <motion.div 
      className="ef-slide ef-slide--product"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content ef-slide__content--centered">
        <motion.span className="ef-slide__label" variants={fadeInUp}>The Product</motion.span>
        
        <motion.h2 className="ef-slide__title" variants={fadeInUp}>
          Shepherd <span className="ef-highlight">MemLake</span>
        </motion.h2>
        
        <motion.p className="ef-slide__subtitle ef-slide__subtitle--centered" variants={fadeInUp}>
          Observable memory for AI agents
        </motion.p>

        <motion.div className="ef-product-statement" variants={fadeInUp}>
          <p>
            Shepherd helps teams ship agentic systems faster by making every agent decision, trace, and memory <strong>observable</strong>, <strong>auditable</strong>, and <strong>explainable</strong>.
          </p>
        </motion.div>

        <motion.div className="ef-product-features" variants={fadeInUp}>
          <div className="ef-product-feature">
            <Activity size={24} />
            <h4>Observable</h4>
            <p>Full visibility into agent decisions</p>
          </div>
          <div className="ef-product-feature">
            <FileText size={24} />
            <h4>Auditable</h4>
            <p>Complete audit trails for compliance</p>
          </div>
          <div className="ef-product-feature">
            <Lightbulb size={24} />
            <h4>Explainable</h4>
            <p>Understand why agents behave</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 11: Demo
function DemoSlide() {
  return (
    <motion.div 
      className="ef-slide ef-slide--demo"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content ef-slide__content--centered">
        <motion.span className="ef-slide__label" variants={fadeInUp}>Demo</motion.span>
        
        <motion.h2 className="ef-slide__title" variants={fadeInUp}>
          See it in action
        </motion.h2>

        <motion.div className="ef-demo-video" variants={scaleIn}>
          <div className="ef-demo-video__embed">
            <iframe
              src="https://drive.google.com/file/d/1MhxoOujhqpV7uQiOY0JjdenG4dE3r4_l/preview"
              allow="autoplay"
              allowFullScreen
              title="Shepherd MemLake Demo"
            />
          </div>
          <p className="ef-demo-video__caption">Shepherd MemLake demonstration</p>
        </motion.div>

        <motion.div className="ef-demo-note" variants={fadeInUp}>
          <Play size={20} />
          <span>Click to watch the full demo</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 12: Value Proposition
function ValuePropSlide() {
  return (
    <motion.div 
      className="ef-slide ef-slide--value"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content">
        <motion.span className="ef-slide__label" variants={fadeInUp}>Value Proposition</motion.span>
        
        <motion.h2 className="ef-slide__title" variants={fadeInUp}>
          Why Shepherd?
        </motion.h2>

        <motion.div className="ef-value-comparison" variants={fadeInUp}>
          <div className="ef-value-without">
            <h4><X size={20} /> Without Shepherd</h4>
            <ul>
              <li>Different observability provider</li>
              <li>Different memory provider</li>
              <li>Pipeline fails: debugging is a two-staged process</li>
              <li>Spend hours isolating where failure is caused</li>
              <li>Then fix it</li>
            </ul>
            <div className="ef-value-time ef-value-time--slow">
              <Clock size={18} />
              <span>3-5 hours debugging</span>
            </div>
          </div>

          <div className="ef-value-arrow">
            <ArrowRight size={32} />
          </div>

          <div className="ef-value-with">
            <h4><CheckCircle size={20} /> With Shepherd</h4>
            <ul>
              <li>Everything is traceable and unified</li>
              <li>One control panel for obs + memory</li>
              <li>Use Shepherd MCP in your IDE</li>
              <li>AI isolates and fixes issues</li>
            </ul>
            <div className="ef-value-time ef-value-time--fast">
              <Zap size={18} />
              <span>Minutes with Shepherd MCP</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="ef-value-savings" variants={fadeInUp}>
          <div className="ef-value-savings__stat">
            <span className="ef-value-savings__number">10×</span>
            <span className="ef-value-savings__label">time saved for CXOs, PMs, Devs</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Slide 13: Thank You
function ThankYouSlide() {
  return (
    <motion.div 
      className="ef-slide ef-slide--thankyou"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="ef-slide__content ef-slide__content--centered">
        <motion.div className="ef-thankyou__logo" variants={fadeInUp}>
          <svg viewBox="0 0 32 32" className="ef-thankyou__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.div>
        
        <motion.h1 className="ef-thankyou__title" variants={fadeInUp}>
          Thank You!
        </motion.h1>
        
        <motion.p className="ef-thankyou__tagline" variants={fadeInUp}>
          Shepherd MemLake — Observable memory for AI agents
        </motion.p>

        <motion.div className="ef-thankyou__qa" variants={fadeInUp}>
          <MessageSquare size={32} />
          <h3>Questions?</h3>
          <p>Let's discuss how Shepherd can help your agentic systems</p>
        </motion.div>

        <motion.div className="ef-thankyou__links" variants={fadeInUp}>
          <a href="https://github.com/neuralis-ai/shepherd" target="_blank" rel="noopener noreferrer" className="ef-thankyou__link">
            <Code size={18} />
            <span>GitHub</span>
          </a>
          <Link to="/playground" className="ef-thankyou__link">
            <Play size={18} />
            <span>Try Playground</span>
          </Link>
          <Link to="/contact" className="ef-thankyou__link">
            <MessageSquare size={18} />
            <span>Contact Us</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// EyeOff component for pain points
function EyeOff(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
      <line x1="2" y1="2" x2="22" y2="22"></line>
    </svg>
  )
}

// Main component
export default function EFDeck() {
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

  const renderSlide = () => {
    switch (slides[currentSlide].id) {
      case 'cover': return <CoverSlide />
      case 'memlake': return <MemLakeSlide />
      case 'belief': return <BeliefSlide />
      case 'hunch1': return <Hunch1Slide />
      case 'hunch2': return <Hunch2Slide />
      case 'hunch3': return <Hunch3Slide />
      case 'hunch4': return <Hunch4Slide />
      case 'compliance': return <ComplianceSlide />
      case 'pilots': return <PilotsSlide />
      case 'product': return <ProductSlide />
      case 'demo': return <DemoSlide />
      case 'value-prop': return <ValuePropSlide />
      case 'thank-you': return <ThankYouSlide />
      default: return <CoverSlide />
    }
  }

  return (
    <div className="ef-deck" ref={containerRef}>
      <EFHeader currentSlide={currentSlide} onSlideChange={handleSlideChange} />
      
      <main className="ef-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="ef-slide-container"
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
