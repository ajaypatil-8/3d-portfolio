'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const socials = [
  {
    name: 'Email', value: 'aj9411979585@gmail.com', color: '#ff6b6b',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=aj9411979585@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect.',
    icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>),
  },
  {
    name: 'GitHub', value: 'github.com/ajaypatil-8', color: '#4ecdc4',
    href: 'https://github.com/ajaypatil-8',
    icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>),
  },
  {
    name: 'LinkedIn', value: 'linkedin.com/in/ajaypatil', color: '#a855f7',
    href: 'https://www.linkedin.com/in/ajaypatil-8sink/',
    icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>),
  },
]

const quickInfo = [
  { icon: '📍', label: 'Location',      value: 'Palus, Dist. Sangli, Maharashtra, India' },
  { icon: '🎓', label: 'Education',     value: 'BCA 3rd Year — Shivaji University, Kolhapur' },
  { icon: '💼', label: 'Looking for',   value: 'Java / Full Stack Jobs & Internships' },
  { icon: '⚡', label: 'Response time', value: 'Usually within 24 hours' },
]

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const res  = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.success) {
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    } else {
      alert('Email failed')
      setStatus('idle')
    }
    setTimeout(() => setStatus('idle'), 4000)
  }

  const fieldStyle = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }

  return (
    <section id="contact" className="relative min-h-screen py-24 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))' }}>

      <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: 'rgba(78,205,196,0.06)' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: 'rgba(96,165,250,0.06)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#4ecdc4' }}>
            Let's work together
          </p>
          <h2 className="text-4xl md:text-6xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
            Get in{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Touch</span>
          </h2>
          <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            I'm actively looking for my first job or internship in Java / Full Stack development.
            If you have an opportunity, let's talk!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Your Name</label>
                  <input type="text" required placeholder="Recruiter Name"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={fieldStyle} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                  <input type="email" required placeholder="you@company.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={fieldStyle} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                <input type="text" required placeholder="Job Opportunity / Internship / Collaboration"
                  value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={fieldStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Message</label>
                <textarea required rows={5} placeholder="Tell me about the role or opportunity..."
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                  style={fieldStyle} />
              </div>
              <motion.button type="submit" disabled={status === 'sending'}
                className="w-full py-4 text-white rounded-xl font-semibold text-sm disabled:opacity-60 cursor-hover"
                style={{ background: 'linear-gradient(to right, #4ecdc4, #60a5fa, #a855f7)' }}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                {status === 'sent' ? '✅ Message Sent!' : status === 'sending' ? 'Sending…' : 'Send Message →'}
              </motion.button>
            </form>
          </motion.div>

          {/* Info panel */}
          <motion.div className="space-y-5"
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>

            <div className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(74,222,128,0.25)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-bold">Currently Available</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                I'm actively looking for my{' '}
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>first job or internship</span>{' '}
                in Java backend, Spring Boot, or full-stack development. I'm a quick learner, highly motivated,
                and ready to contribute from day one.
              </p>
            </div>

            <div className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                Quick Info
              </p>
              <div className="space-y-4">
                {quickInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                Find Me Online
              </p>
              <div className="space-y-3">
                {socials.map((s, i) => (
                  <motion.a key={s.name} href={s.href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl cursor-hover group"
                    style={{ backgroundColor: 'var(--bg-card-hover)' }}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div style={{ color: s.color }}>{s.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.value}</div>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      style={{ color: 'var(--text-muted)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}