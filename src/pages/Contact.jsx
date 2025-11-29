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
  MapPin,
  Clock
} from 'lucide-react'
import './Contact.css'

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

function ContactHeader() {
  return (
    <header className="contact-header">
      <div className="container contact-header__container">
        <Link to="/" className="contact-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="contact-header__logo">
          <svg viewBox="0 0 32 32" className="contact-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        <nav className="contact-header__nav">
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="contact-header__link">
            Docs <ExternalLink size={12} />
          </a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer" className="contact-header__link">
            <Github size={16} />
          </a>
        </nav>
      </div>
    </header>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
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
          subject: `Shepherd Contact: ${formData.subject || 'General Inquiry'} - ${formData.name}`,
          from_name: 'Shepherd Contact Form',
          name: formData.name,
          email: formData.email,
          company: formData.company || 'Not provided',
          message: formData.message
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', company: '', subject: '', message: '' })
      } else {
        setError(result.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError('Failed to send. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div 
        className="contact-form__success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="contact-form__success-icon">
          <Check size={32} />
        </div>
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out. We'll get back to you within 24-48 hours.</p>
        <button 
          className="btn btn--primary" 
          onClick={() => setIsSubmitted(false)}
        >
          Send Another Message
        </button>
      </motion.div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="name">
            <User size={14} />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="contact-form__field">
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
            placeholder="john@company.com"
            required
          />
        </div>
      </div>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="company">
            <Building size={14} />
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Acme Inc."
          />
        </div>

        <div className="contact-form__field">
          <label htmlFor="subject">
            <MessageSquare size={14} />
            Subject *
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select a topic...</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Enterprise Sales">Enterprise Sales</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Partnership">Partnership</option>
            <option value="Feedback">Feedback</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="contact-form__field contact-form__field--full">
        <label htmlFor="message">
          <MessageSquare size={14} />
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us how we can help..."
          rows={5}
          required
        />
      </div>

      {error && (
        <div className="contact-form__error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn--primary contact-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="contact-form__spinner" />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}

function ContactInfo() {
  return (
    <div className="contact-info">
      <h3 className="contact-info__title">Other Ways to Reach Us</h3>
      
      <div className="contact-info__items">
        <div className="contact-info__item">
          <div className="contact-info__icon">
            <Github size={20} />
          </div>
          <div className="contact-info__content">
            <h4>GitHub</h4>
            <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer">
              neuralis-in/aiobs
            </a>
          </div>
        </div>

        <div className="contact-info__item">
          <div className="contact-info__icon">
            <Clock size={20} />
          </div>
          <div className="contact-info__content">
            <h4>Response Time</h4>
            <p>We typically respond within 24-48 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <div className="contact-page">
      <ContactHeader />
      
      <main className="contact-main">
        <div className="container">
          <motion.div 
            className="contact-hero"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 className="heading-xl contact-hero__title" variants={fadeInUp}>
              Get in Touch
            </motion.h1>
            <motion.p className="text-lg contact-hero__subtitle" variants={fadeInUp}>
              Have a question about Shepherd? Want to explore enterprise features? We'd love to hear from you.
            </motion.p>
          </motion.div>

          <motion.div 
            className="contact-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="contact-content__form" variants={fadeInUp}>
              <ContactForm />
            </motion.div>
            <motion.div className="contact-content__info" variants={fadeInUp}>
              <ContactInfo />
            </motion.div>
          </motion.div>
        </div>
      </main>

      <footer className="contact-footer">
        <div className="container contact-footer__container">
          <span>© Shepherd, 2025</span>
          <div className="contact-footer__links">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/privacy">Privacy</Link>
            <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

