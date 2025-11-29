import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  Mail,
  FileText
} from 'lucide-react'
import './Privacy.css'

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

function PrivacyHeader() {
  return (
    <header className="privacy-header">
      <div className="container privacy-header__container">
        <Link to="/" className="privacy-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="privacy-header__logo">
          <svg viewBox="0 0 32 32" className="privacy-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        <nav className="privacy-header__nav">
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="privacy-header__link">
            Docs <ExternalLink size={12} />
          </a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer" className="privacy-header__link">
            <Github size={16} />
          </a>
        </nav>
      </div>
    </header>
  )
}

function PrivacySection({ icon, title, children }) {
  return (
    <motion.section className="privacy-section" variants={fadeInUp}>
      <div className="privacy-section__header">
        <div className="privacy-section__icon">
          {icon}
        </div>
        <h2 className="privacy-section__title">{title}</h2>
      </div>
      <div className="privacy-section__content">
        {children}
      </div>
    </motion.section>
  )
}

export default function Privacy() {
  return (
    <div className="privacy-page">
      <PrivacyHeader />
      
      <main className="privacy-main">
        <div className="container">
          <motion.div 
            className="privacy-hero"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="privacy-hero__badge" variants={fadeInUp}>
              <Shield size={14} />
              Last updated: November 29, 2025
            </motion.div>
            <motion.h1 className="heading-xl privacy-hero__title" variants={fadeInUp}>
              Privacy Policy
            </motion.h1>
            <motion.p className="text-lg privacy-hero__subtitle" variants={fadeInUp}>
              At Shepherd, we take your privacy seriously. This policy explains how we collect, use, and protect your information.
            </motion.p>
          </motion.div>

          <motion.div 
            className="privacy-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <PrivacySection icon={<Eye size={20} />} title="Information We Collect">
              <p>We collect minimal information to provide our services:</p>
              <ul>
                <li><strong>Account Information:</strong> Your email address and organization name.</li>
                <li><strong>Enterprise Contact (Optional):</strong> Phone number, only if provided by enterprise customers.</li>
                <li><strong>Trace Metrics:</strong> We store the number of traces processed. We do not store the actual contents of your prompts, LLM responses, or any trace payload data.</li>
                <li><strong>Communication Data:</strong> When you contact us, we collect the information you provide in your messages.</li>
              </ul>
            </PrivacySection>

            <PrivacySection icon={<Database size={20} />} title="How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain Shepherd's services</li>
                <li>Track your trace quota and usage limits</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your questions and customer service requests</li>
              </ul>
            </PrivacySection>

            <PrivacySection icon={<Lock size={20} />} title="Data Security">
              <p>We implement security measures to protect your account data:</p>
              <ul>
                <li><strong>Encryption:</strong> All data is encrypted in transit using TLS.</li>
                <li><strong>Minimal Data:</strong> We only store account information (email, org name) and trace counts—never your actual trace contents.</li>
                <li><strong>Access Controls:</strong> We employ strict access controls and authentication mechanisms.</li>
              </ul>
              <p>Your trace data flows through Shepherd to your own cloud storage (GCP, AWS, Azure, or on-premise) and is never stored on our servers.</p>
            </PrivacySection>

            <PrivacySection icon={<Globe size={20} />} title="Data Sharing">
              <p>We do not sell your personal information. We may share information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> With vendors who assist us in providing our services (e.g., cloud hosting, analytics).</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, privacy, safety, or property.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information.</li>
              </ul>
            </PrivacySection>

            <PrivacySection icon={<FileText size={20} />} title="No Data Retention">
              <p>Shepherd does not retain your data:</p>
              <ul>
                <li><strong>Trace Data:</strong> We do not store your traces, prompts, or LLM responses. All trace data flows directly to your own cloud storage.</li>
                <li><strong>Account Deletion:</strong> You can request deletion of your account information at any time by contacting us.</li>
              </ul>
            </PrivacySection>

            <PrivacySection icon={<Shield size={20} />} title="Your Rights">
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete information.</li>
                <li><strong>Deletion:</strong> Request that we delete your personal information.</li>
                <li><strong>Export:</strong> Request a portable copy of your data in a standard format.</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications at any time.</li>
              </ul>
              <p>To exercise any of these rights, please <Link to="/contact">contact us</Link>.</p>
            </PrivacySection>

            <PrivacySection icon={<Globe size={20} />} title="Cookies & Tracking">
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our services</li>
                <li>Improve our website and services</li>
                <li>Provide personalized content</li>
              </ul>
              <p>You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our services.</p>
            </PrivacySection>

            <PrivacySection icon={<Mail size={20} />} title="Contact Us">
              <p>If you have any questions about this Privacy Policy or our data practices, please <Link to="/contact">contact us</Link>.</p>
              <p>We will respond to your inquiry within 30 days.</p>
            </PrivacySection>

            <motion.div className="privacy-updates" variants={fadeInUp}>
              <h3>Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <footer className="privacy-footer">
        <div className="container privacy-footer__container">
          <span>© Shepherd, 2025</span>
          <div className="privacy-footer__links">
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

