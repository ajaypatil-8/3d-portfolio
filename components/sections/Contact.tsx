'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

/* ─── Data ───────────────────────────────────────────────────────────── */

const socials = [
  {
    name: 'Email',
    value: 'aj9411979585@gmail.com',
    color: '#ff6b6b',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=aj9411979585@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    value: 'github.com/ajaypatil-8',
    color: '#4ecdc4',
    href: 'https://github.com/ajaypatil-8',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    value: 'linkedin.com/in/ajaypatil-8eight',
    color: '#a855f7',
    href: 'https://www.linkedin.com/in/ajaypatil-8eight/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
]

const quickInfo = [
  { icon: '📍', label: 'Location',      value: 'Palus, Dist. Sangli, Maharashtra, India' },
  { icon: '🎓', label: 'Education',     value: 'BCA 3rd Year — Shivaji University' },
  { icon: '💼', label: 'Looking for',   value: 'Java / Full Stack Jobs & Internships' },
  { icon: '⚡', label: 'Response time', value: 'Usually within 24 hours' },
]

/* ─── Floating label input ───────────────────────────────────────────── */

function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  textarea,
}: {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  textarea?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  const sharedStyle: React.CSSProperties = {
    backgroundColor: focused
      ? 'var(--bg-card-hover)'
      : 'var(--bg-card)',
    border: `1px solid ${focused ? 'rgba(78,205,196,0.5)' : 'var(--border)'}`,
    color: 'var(--text-primary)',
    transition: 'border-color 0.2s, background-color 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(78,205,196,0.08)' : 'none',
  }

  const sharedClass = 'w-full px-4 pt-6 pb-2 rounded-xl text-sm focus:outline-none'

  return (
    <div className="relative">
      <label
        className="absolute left-4 text-xs font-medium pointer-events-none transition-all duration-200 z-10"
        style={{
          top:       active ? '8px' : '50%',
          transform: active || textarea ? 'none' : 'translateY(-50%)',
          color:     focused ? '#4ecdc4' : 'var(--text-muted)',
          fontSize:  active ? '0.65rem' : '0.8rem',
          ...(textarea && active ? { top: '8px' } : {}),
          ...(textarea && !active ? { top: '16px', transform: 'none' } : {}),
        }}
      >
        {label}
      </label>

      {textarea ? (
        <textarea
          required={required}
          rows={5}
          placeholder={focused ? placeholder : ''}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${sharedClass} resize-none`}
          style={sharedStyle}
        />
      ) : (
        <input
          type={type}
          required={required}
          placeholder={focused ? placeholder : ''}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={sharedClass}
          style={sharedStyle}
        />
      )}
    </div>
  )
}

/* ─── Copy-to-clipboard button ───────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <motion.button
      onClick={copy}
      className="ml-auto flex-shrink-0 p-1.5 rounded-lg"
      style={{
        color:           copied ? '#4ade80' : 'var(--text-muted)',
        backgroundColor: 'var(--bg-card)',
        border:          `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Copy to clipboard"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.svg
            key="check"
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.18 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </motion.svg>
        ) : (
          <motion.svg
            key="copy"
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.18 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/* ─── Contact section ────────────────────────────────────────────────── */

type FormState = { name: string; email: string; subject: string; message: string }
type Status    = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const { theme } = useTheme()

  const [form, setForm]     = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const set = useCallback((key: keyof FormState) => (v: string) =>
    setForm(prev => ({ ...prev, [key]: v })), [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 5000)
  }, [form])

  const btnLabel = {
    idle:    'Send Message →',
    sending: 'Sending…',
    sent:    '✅ Message Sent!',
    error:   '❌ Failed — try again',
  }[status]

  const btnGradient = status === 'error'
    ? 'linear-gradient(to right, #ef4444, #dc2626)'
    : 'linear-gradient(to right, #4ecdc4, #60a5fa, #a855f7)'

  return (
    <section
      id="contact"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))' }}
    >
      {/* ambient blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: 'rgba(78,205,196,0.06)' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: 'rgba(96,165,250,0.06)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#4ecdc4' }}>
            Let's work together
          </p>
          <h2
            className="text-4xl md:text-6xl font-heading font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Get in{' '}
            <span style={{
              background:           'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              Touch
            </span>
          </h2>
          <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            I'm actively looking for my first job or internship in Java / Full Stack development.
            If you have an opportunity, let's talk!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Contact form ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {/* terminal-style card header */}
            <div
              className="rounded-t-2xl px-5 py-3 flex items-center gap-2"
              style={{
                backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
                border:          '1px solid var(--border)',
                borderBottom:    'none',
              }}
            >
              {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
                <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
              ))}
              <span className="ml-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                Contact form
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-3 rounded-b-2xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Your Name"
                  placeholder="Recruiter Name"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>

              <Field
                label="Subject"
                placeholder="Job Opportunity / Internship / Collaboration"
                value={form.subject}
                onChange={set('subject')}
                required
              />

              <Field
                label="Message"
                placeholder="Tell me about the role or opportunity…"
                value={form.message}
                onChange={set('message')}
                required
                textarea
              />

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 text-white rounded-xl font-semibold text-sm disabled:opacity-60 cursor-hover relative overflow-hidden"
                style={{ background: btnGradient, transition: 'background 0.3s' }}
                whileHover={{ scale: status === 'sending' ? 1 : 1.01 }}
                whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
              >
                {/* shimmer on idle */}
                {status === 'idle' && (
                  <motion.span
                    className="absolute inset-0 bg-white/15"
                    initial={{ x: '-100%', skewX: -15 }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {status === 'sending' && (
                    <motion.span
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  {btnLabel}
                </span>
              </motion.button>

              {/* Success / error toast inline */}
              <AnimatePresence>
                {(status === 'sent' || status === 'error') && (
                  <motion.div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{
                      backgroundColor: status === 'sent' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                      border:          `1px solid ${status === 'sent' ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`,
                      color:           status === 'sent' ? '#4ade80' : '#f87171',
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {status === 'sent'
                      ? '✅ Your message was sent successfully! I\'ll reply within 24 hours.'
                      : '❌ Something went wrong. Please try emailing me directly.'}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* ── Info panel ── */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {/* Available card */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                border:          '1px solid rgba(74,222,128,0.25)',
              }}
            >
              {/* gradient top border */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #4ade80, transparent)' }}
              />
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                </span>
                <span className="text-green-400 font-bold">Currently Available</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                I'm actively looking for my{' '}
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  first job or internship
                </span>{' '}
                in Java backend, Spring Boot, or full-stack development. I'm a quick learner,
                highly motivated, and ready to contribute from day one.
              </p>
            </div>

            {/* Quick info */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-muted)' }}
              >
                Quick Info
              </p>
              <div className="space-y-4">
                {quickInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Socials — with copy button on email */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-muted)' }}
              >
                Find Me Online
              </p>
              <div className="space-y-3">
                {socials.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <motion.a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl flex-1 min-w-0 group cursor-hover"
                      style={{ backgroundColor: 'var(--bg-card-hover)' }}
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div style={{ color: s.color, flexShrink: 0 }}>{s.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {s.name}
                        </div>
                        <div
                          className="text-xs truncate"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {s.value}
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: 'var(--text-muted)' }}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.a>

                    {/* copy button only for email */}
                    {s.name === 'Email' && <CopyButton text={s.value} />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}