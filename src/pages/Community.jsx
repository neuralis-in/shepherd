import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Mail,
  User,
  Building,
  MessageSquare,
  Send,
  Loader2,
  AlertCircle,
  Check,
  Zap,
  Users,
  Layers,
  GitBranch,
  Rocket,
  Sparkles,
  Code,
  BarChart3,
  Activity,
  ArrowRight,
  Linkedin,
  Link2,
  Flame,
  Target,
  Key,
  Bird,
  Dog
} from 'lucide-react'
import './Community.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
}

// Floating observability tool logos - positioned around the edges
const observabilityTools = [
  { name: 'LangSmith', position: { top: '12%', left: '8%' }, delay: 0, icon: 'link' },
  { name: 'Langfuse', position: { top: '18%', right: '10%' }, delay: 0.2, icon: 'flame' },
  { name: 'Arize AI', position: { top: '35%', left: '5%' }, delay: 0.4, icon: 'target' },
  { name: 'Maximai', position: { top: '45%', right: '6%' }, delay: 0.6, icon: 'zap' },
  { name: 'Dynatrace', position: { bottom: '35%', left: '10%' }, delay: 0.8, icon: 'activity' },
  { name: 'Datadog', position: { bottom: '30%', right: '8%' }, delay: 1.0, icon: 'dog' },
  { name: 'Portkey', position: { bottom: '18%', left: '6%' }, delay: 1.2, icon: 'key' },
  { name: 'Phoenix', position: { bottom: '22%', right: '12%' }, delay: 1.4, icon: 'bird' },
]

const roleCards = [
  { icon: <Code size={24} />, title: 'Vibe-Coders', desc: 'Building with the latest AI tools' },
  { icon: <Zap size={24} />, title: 'Developers', desc: 'Shipping AI-powered apps daily' },
  { icon: <BarChart3 size={24} />, title: 'Product Managers', desc: 'Driving AI product strategy' },
  { icon: <Activity size={24} />, title: 'ML Engineers', desc: 'Training and deploying models' },
  { icon: <Layers size={24} />, title: 'Data Practitioners', desc: 'Making sense of AI data' },
]

const hashtags = [
  'AIObservability', 'LLMOps', 'AIOps', 'MLOps', 'LangSmith', 
  'Langfuse', 'ArizeAI', 'Datadog', 'Dynatrace', 'Portkey', 'Maximai', 'ShepherdAI'
]

function CommunityHeader() {
  return (
    <header className="community-header">
      <div className="container community-header__container">
        <Link to="/" className="community-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="community-header__logo">
          <svg viewBox="0 0 32 32" className="community-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        <nav className="community-header__nav">
          <a href="https://github.com/neuralis-in/shepherd-cli" target="_blank" rel="noopener noreferrer" className="community-header__link">
            <Github size={16} />
          </a>
          <a href="https://www.linkedin.com/company/neuralis-shepherd" target="_blank" rel="noopener noreferrer" className="community-header__link">
            <Linkedin size={16} />
          </a>
        </nav>
      </div>
    </header>
  )
}

function FloatingTools() {
  const getIcon = (iconName) => {
    const icons = {
      link: <Link2 size={14} />,
      flame: <Flame size={14} />,
      target: <Target size={14} />,
      zap: <Zap size={14} />,
      activity: <Activity size={14} />,
      dog: <Dog size={14} />,
      key: <Key size={14} />,
      bird: <Bird size={14} />,
    }
    return icons[iconName] || <Layers size={14} />
  }

  return (
    <div className="floating-tools">
      {observabilityTools.map((tool, i) => (
        <motion.div
          key={tool.name}
          className="floating-tool"
          style={{ 
            ...tool.position,
            '--delay': `${tool.delay}s`
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + tool.delay, duration: 0.6, ease: "easeOut" }}
        >
          <span className="floating-tool__icon">
            {getIcon(tool.icon)}
          </span>
          <span className="floating-tool__name">{tool.name}</span>
        </motion.div>
      ))}
    </div>
  )
}

function ConnectForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    tools: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const WEB3FORMS_ACCESS_KEY = 'b5090d55-66a0-4e7d-959a-4f90c5eb722d'
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `🤝 Shepherd Community Connect - ${formData.name} (${formData.role})`,
          from_name: 'Shepherd Community Page',
          name: formData.name,
          email: formData.email,
          role: formData.role,
          observability_tools: formData.tools,
          message: formData.message || 'Interested in connecting!'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', role: '', tools: '', message: '' })
      } else {
        setError(result.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError('Failed to send. Please try again or reach out on LinkedIn.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div 
        className="connect-form__success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="connect-form__success-icon">
          <Check size={32} />
        </div>
        <h3>Let's Connect! 🤝</h3>
        <p>Thanks for reaching out! We're excited to learn from your experience with AI observability. We'll be in touch soon.</p>
        <button 
          className="btn btn--primary" 
          onClick={() => setIsSubmitted(false)}
        >
          Share Another Response
        </button>
      </motion.div>
    )
  }

  return (
    <form className="connect-form" onSubmit={handleSubmit}>
      <div className="connect-form__row">
        <div className="connect-form__field">
          <label htmlFor="name">
            <User size={14} />
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="connect-form__field">
          <label htmlFor="email">
            <Mail size={14} />
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            required
          />
        </div>
      </div>

      <div className="connect-form__row">
        <div className="connect-form__field">
          <label htmlFor="role">
            <Building size={14} />
            Your Role *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select your role...</option>
            <option value="Developer">Developer</option>
            <option value="ML Engineer">ML Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Engineering Manager">Engineering Manager</option>
            <option value="DevOps/Platform Engineer">DevOps/Platform Engineer</option>
            <option value="Founder/CTO">Founder/CTO</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="connect-form__field">
          <label htmlFor="tools">
            <Layers size={14} />
            Observability Tools You Use
          </label>
          <input
            type="text"
            id="tools"
            name="tools"
            value={formData.tools}
            onChange={handleChange}
            placeholder="e.g., LangSmith, Langfuse, Datadog"
          />
        </div>
      </div>

      <div className="connect-form__field connect-form__field--full">
        <label htmlFor="message">
          <MessageSquare size={14} />
          What challenges are you facing? (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your experience with LLM observability, challenges you've faced, or what you'd like to see improved..."
          rows={4}
        />
      </div>

      {error && (
        <div className="connect-form__error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn--primary connect-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="connect-form__spinner" />
            Sending...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Let's Connect
          </>
        )}
      </button>
    </form>
  )
}

function ValueProposition() {
  return (
    <div className="value-prop">
      <div className="value-prop__visual">
        <div className="value-prop__stack">
          <div className="value-prop__layer value-prop__layer--existing">
            <span>Your Existing Stack</span>
            <div className="value-prop__tools">
              <span>LangSmith</span>
              <span>Langfuse</span>
              <span>Arize</span>
              <span>...</span>
            </div>
          </div>
          <div className="value-prop__connector">
            <GitBranch size={16} />
          </div>
          <div className="value-prop__layer value-prop__layer--shepherd">
            <Rocket size={20} />
            <span>Shepherd</span>
            <small>Self-improving AI</small>
          </div>
        </div>
      </div>
      <div className="value-prop__content">
        <h3>Shepherd sits on top of your existing observability stack</h3>
        <p>
          We help teams turn their traces into <strong>self-improving AI systems</strong>. 
          No need to rip and replace — Shepherd enhances what you already have.
        </p>
        <ul className="value-prop__benefits">
          <li><Check size={16} /> Works with your existing tools</li>
          <li><Check size={16} /> Turn traces into actionable insights</li>
          <li><Check size={16} /> Build self-healing prompts & agents</li>
        </ul>
      </div>
    </div>
  )
}

export default function Community() {
  return (
    <div className="community-page">
      <CommunityHeader />
      
      <main className="community-main">
        {/* Hero Section */}
        <section className="community-hero">
          <div className="community-hero__bg">
            <FloatingTools />
          </div>
          <div className="container">
            <motion.div 
              className="community-hero__content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div className="community-hero__badge" variants={fadeInUp}>
                <span className="community-hero__badge-dot"></span>
                <span>Looking to Connect</span>
              </motion.div>
              
              <motion.h1 className="heading-xl community-hero__title" variants={fadeInUp}>
                Are you working with<br />
                AI Observability tools?
              </motion.h1>
              
              <motion.p className="text-lg community-hero__subtitle" variants={fadeInUp}>
                Shepherd is looking to connect with teams using AI observability platforms. 
                If you're navigating the challenges of monitoring LLM apps and agents, 
                let's share insights and collaborate.
              </motion.p>

              <motion.div className="community-hero__roles" variants={fadeInUp}>
                {roleCards.map((role, i) => (
                  <motion.div 
                    key={role.title}
                    className="community-hero__role"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="community-hero__role-icon">{role.icon}</div>
                    <div className="community-hero__role-info">
                      <strong>{role.title}</strong>
                      <span>{role.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="community-value section">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="community-value__header" variants={fadeInUp}>
                <h2 className="heading-lg">What is Shepherd?</h2>
                <p className="text-lg">
                  We're building the layer that turns observability data into self-improving AI systems.
                </p>
              </motion.div>
              
              <motion.div variants={scaleIn}>
                <ValueProposition />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Connect Form Section */}
        <section className="community-connect section section--subtle">
          <div className="container">
            <motion.div 
              className="community-connect__wrapper"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="community-connect__header" variants={fadeInUp}>
                <h2 className="heading-lg">Let's Share Insights 🤝</h2>
                <p className="text-lg">
                  We'd love to learn from your experience with AI observability. 
                  Fill out the form below and let's start a conversation.
                </p>
              </motion.div>

              <motion.div className="community-connect__form-wrapper" variants={fadeInUp}>
                <ConnectForm />
              </motion.div>

              <motion.div className="community-connect__alternative" variants={fadeInUp}>
                <span>Prefer to connect on social?</span>
                <div className="community-connect__social">
                  <a 
                    href="https://www.linkedin.com/company/neuralis-shepherd" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="community-connect__social-link"
                  >
                    <Linkedin size={18} />
                    LinkedIn
                  </a>
                  <a 
                    href="https://github.com/neuralis-in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="community-connect__social-link"
                  >
                    <Github size={18} />
                    GitHub
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Hashtags Section */}
        <section className="community-hashtags">
          <div className="container">
            <motion.div 
              className="community-hashtags__content"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="community-hashtags__list">
                {hashtags.map((tag, i) => (
                  <motion.span 
                    key={tag}
                    className="community-hashtag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="community-cta section">
          <div className="container container--narrow">
            <motion.div 
              className="community-cta__content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="heading-md">Want to see Shepherd in action?</h2>
              <p className="text-base">
                Check out our playground or explore the open-source CLI.
              </p>
              <div className="community-cta__buttons">
                <Link to="/playground" className="btn btn--primary">
                  Try Playground <ArrowRight size={16} />
                </Link>
                <a 
                  href="https://github.com/neuralis-in/shepherd-cli" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn--secondary"
                >
                  <Github size={16} />
                  Shepherd CLI
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="community-footer">
        <div className="container community-footer__container">
          <span>© Shepherd, 2025</span>
          <div className="community-footer__links">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact">Contact</Link>
            <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

