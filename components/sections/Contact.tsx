'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

/* ─── Animation CSS ──────────────────────────────────────────────────── */
const CONTACT_CSS = `
@keyframes ct-float {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  33%     { transform: translateY(-18px) rotate(5deg); }
  66%     { transform: translateY(-8px) rotate(-3deg); }
}
@keyframes ct-blob {
  0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
  50%     { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
}
@keyframes ct-shimmer {
  0%   { transform: translateX(-200%) skewX(-15deg); }
  100% { transform: translateX(300%)  skewX(-15deg); }
}
@keyframes ct-available-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
  50%     { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
}
@keyframes ct-border-spin {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes ct-ring-out {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(2.0); opacity: 0;   }
}
@keyframes ct-card-glow {
  0%,100% { opacity: 0.4; }
  50%     { opacity: 0.9; }
}
`

/* ─── Data ───────────────────────────────────────────────────────────── */
const socials = [
  {
    name: 'Email',
    value: 'ajaypatil8eight@gmail.com',
    color: '#ff6b6b',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=ajaypatil8eight@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect.',
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
  { icon: '📍', label: 'Location',      value: 'Palus, Dist. Sangli, Maharashtra, India', color: '#ff6b6b' },
  { icon: '🎓', label: 'Education',     value: 'BCA 3rd Year — Shivaji University',        color: '#4ecdc4' },
  { icon: '💼', label: 'Looking for',   value: 'Java / Full Stack Jobs & Internships',     color: '#a855f7' },
  { icon: '⚡', label: 'Response time', value: 'Usually within 24 hours',                  color: '#fbbf24' },
]

/* ─── Floating particles ─────────────────────────────────────────────── */
function Particles() {
  const ps = Array.from({ length: 12 }, (_, i) => ({
    id: i, size: 2 + (i % 3),
    x: (i * 8.5) % 100, y: (i * 13) % 100,
    delay: (i * 0.7) % 7, dur: 7 + (i % 5),
    color: ['#4ecdc4','#ff6b6b','#a855f7','#fbbf24'][i % 4],
  }))
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {ps.map(p => (
        <div key={p.id} className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            backgroundColor: p.color, opacity: 0.2,
            animation: `ct-float ${p.dur}s ${p.delay}s ease-in-out infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Floating label input ───────────────────────────────────────────── */
function Field({ label, type = 'text', placeholder, value, onChange, required, textarea }: {
  label: string; type?: string; placeholder: string; value: string
  onChange: (v: string) => void; required?: boolean; textarea?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  const baseStyle: React.CSSProperties = {
    backgroundColor: focused ? 'var(--bg-card-hover)' : 'var(--bg-card)',
    border: `1px solid ${focused ? 'rgba(78,205,196,0.5)' : 'var(--border)'}`,
    color: 'var(--text-primary)',
    transition: 'border-color 0.2s, background-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(78,205,196,0.10), 0 0 20px rgba(78,205,196,0.06)' : 'none',
  }
  const cls = 'w-full px-4 pt-6 pb-2 rounded-xl text-sm focus:outline-none'

  return (
    <div className="relative">
      {/* Animated focus indicator line */}
      {focused && (
        <motion.div
          className="absolute bottom-0 inset-x-4 h-[1.5px] rounded-full z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #4ecdc4, #a855f7)' }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }} transition={{ duration: 0.25 }}
        />
      )}
      <label
        className="absolute left-4 text-xs font-medium pointer-events-none transition-all duration-200 z-10"
        style={{
          top: active ? '8px' : (textarea ? '16px' : '50%'),
          transform: active || textarea ? 'none' : 'translateY(-50%)',
          color: focused ? '#4ecdc4' : 'var(--text-muted)',
          fontSize: active ? '0.65rem' : '0.8rem',
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea required={required} rows={5} placeholder={focused ? placeholder : ''}
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className={`${cls} resize-none`} style={baseStyle}
        />
      ) : (
        <input type={type} required={required} placeholder={focused ? placeholder : ''}
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className={cls} style={baseStyle}
        />
      )}
    </div>
  )
}

/* ─── Copy button ────────────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <motion.button onClick={copy}
      className="ml-auto flex-shrink-0 p-1.5 rounded-lg"
      style={{
        color: copied ? '#4ade80' : 'var(--text-muted)',
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`,
      }}
      whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} title="Copy"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.svg key="ck" className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </motion.svg>
        ) : (
          <motion.svg key="cp" className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/* ─── Contact Section ────────────────────────────────────────────────── */
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) { setStatus('sent'); setForm({ name:'', email:'', subject:'', message:'' }) }
      else setStatus('error')
    } catch { setStatus('error') }
    setTimeout(() => setStatus('idle'), 5000)
  }, [form])

  const btnLabel    = { idle:'Send Message →', sending:'Sending…', sent:'✅ Message Sent!', error:'❌ Failed — try again' }[status]
  const btnGradient = status === 'error'
    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
    : 'linear-gradient(135deg, #4ecdc4, #60a5fa, #a855f7)'

  return (
    <section
      id="contact"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))' }}
    >
      <style>{CONTACT_CSS}</style>
      <Particles />

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:'absolute', top:'10%', left:'5%', width:520, height:520,
          transform:'translate(-18%,-18%)',
          background:'radial-gradient(circle, rgba(78,205,196,0.13) 0%, transparent 65%)',
          animation:'ct-blob 14s ease-in-out infinite', willChange:'transform' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'5%', width:560, height:560,
          transform:'translate(18%,18%)',
          background:'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 65%)',
          animation:'ct-blob 18s 5s ease-in-out infinite', willChange:'transform' }} />
        <div style={{ position:'absolute', top:'50%', left:'50%', width:380, height:380,
          transform:'translate(-50%,-50%)',
          background:'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)',
          animation:'ct-blob 12s 3s ease-in-out infinite', willChange:'transform' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <motion.p
            className="text-sm font-mono tracking-widest uppercase mb-4"
            style={{ color: '#4ecdc4' }}
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.1em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            Let&apos;s work together
          </motion.p>

          <h2
            className="font-heading font-bold mb-4"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', color: 'var(--text-primary)' }}
          >
            Get in{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Touch
            </span>
          </h2>

          <p className="text-sm max-w-md mx-auto mb-5" style={{ color: 'var(--text-muted)' }}>
            Actively looking for my first job or internship in Java / Full Stack development.
            If you have an opportunity, let&apos;s talk!
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-2">
            <motion.div className="h-px rounded-full" style={{ background:'linear-gradient(90deg,transparent,#4ecdc4)', width:80 }} initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ delay:0.3 }} />
            <div className="flex gap-1">
              {['#ff6b6b','#4ecdc4','#a855f7'].map((c,i)=>(
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:c }} initial={{ scale:0 }} whileInView={{ scale:1 }} viewport={{ once:true }} transition={{ delay:0.35+i*0.06, type:'spring' }} />
              ))}
            </div>
            <motion.div className="h-px rounded-full" style={{ background:'linear-gradient(90deg,#a855f7,transparent)', width:80 }} initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ delay:0.3 }} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {/* Terminal header */}
            <div
              className="rounded-t-2xl px-5 py-3 flex items-center gap-2 relative overflow-hidden"
              style={{
                backgroundColor: theme==='light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderBottom: 'none',
              }}
            >
              {/* Animated gradient top strip */}
              <div
                className="absolute top-0 inset-x-0 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, #4ecdc4, #60a5fa, #a855f7, #ff6b6b, #4ecdc4)',
                  backgroundSize: '200% 100%',
                  animation: 'ct-border-spin 3s linear infinite',
                }}
              />
              {['#ff5f56','#ffbd2e','#27c93f'].map(c=>(
                <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor:c }} />
              ))}
              <span className="ml-2 text-xs font-mono" style={{ color:'var(--text-muted)' }}>
                contact-form.tsx
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation:'ct-available-pulse 2s ease-in-out infinite' }} />
                <span className="text-xs font-mono text-green-400">open</span>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-3 rounded-b-2xl p-6 relative overflow-hidden"
              style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)' }}
            >
              {/* Subtle ambient glow */}
              <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
                style={{ background:'radial-gradient(circle, rgba(78,205,196,0.05) 0%, transparent 70%)', transform:'translate(-20%,-20%)' }} />

              <div className="grid grid-cols-2 gap-3">
                <Field label="Your Name"  placeholder="Recruiter Name"        value={form.name}    onChange={set('name')}    required />
                <Field label="Email" type="email" placeholder="you@company.com" value={form.email}   onChange={set('email')}   required />
              </div>
              <Field label="Subject"  placeholder="Job / Internship / Collaboration"  value={form.subject} onChange={set('subject')} required />
              <Field label="Message"  placeholder="Tell me about the role or opportunity…" value={form.message} onChange={set('message')} required textarea />

              <motion.button
                type="submit"
                disabled={status==='sending'}
                className="w-full py-4 text-white rounded-xl font-semibold text-sm disabled:opacity-60 relative overflow-hidden"
                style={{ background:btnGradient, transition:'background 0.3s' }}
                whileHover={{ scale: status==='sending' ? 1 : 1.015, boxShadow:'0 0 28px rgba(78,205,196,0.3)' }}
                whileTap={{ scale: status==='sending' ? 1 : 0.985 }}
              >
                {status==='idle' && (
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{ background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
                    initial={{ x:'-130%' }} whileHover={{ x:'130%' }} transition={{ duration:0.48 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {status==='sending' && (
                    <motion.span
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
                    />
                  )}
                  {btnLabel}
                </span>
              </motion.button>

              <AnimatePresence>
                {(status==='sent'||status==='error') && (
                  <motion.div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{
                      backgroundColor: status==='sent' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${status==='sent' ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`,
                      color: status==='sent' ? '#4ade80' : '#f87171',
                    }}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  >
                    {status==='sent'
                      ? "✅ Sent! I'll reply within 24 hours."
                      : '❌ Something went wrong — please email me directly.'}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* ── Info Panel ── */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {/* Available card */}
            <motion.div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ backgroundColor:'var(--bg-card)', border:'1px solid rgba(74,222,128,0.22)' }}
              whileHover={{ borderColor:'rgba(74,222,128,0.4)', y:-3, transition:{ duration:0.2 } }}
            >
              <motion.div
                className="absolute top-0 inset-x-0 h-[2px]"
                style={{ background:'linear-gradient(90deg, transparent, #4ade80, transparent)' }}
                initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ delay:0.2, duration:0.6 }}
              />
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{ background:'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.08) 0%, transparent 60%)' }}
              />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                </span>
                <span className="text-green-400 font-bold">Currently Available</span>
              </div>
              <p className="text-sm leading-relaxed relative z-10" style={{ color:'var(--text-secondary)' }}>
                Actively looking for my{' '}
                <strong style={{ color:'var(--text-primary)' }}>first job or internship</strong>{' '}
                in Java backend, Spring Boot, or full-stack development. Quick learner,
                highly motivated, and ready to contribute from day one.
              </p>
            </motion.div>

            {/* Quick info */}
            <motion.div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)' }}
              whileHover={{ borderColor:'rgba(78,205,196,0.25)', y:-3, transition:{ duration:0.2 } }}
            >
              <motion.div
                className="absolute top-0 inset-x-0 h-[2px]"
                style={{ background:'linear-gradient(90deg, #4ecdc4, #a855f7, transparent)' }}
                initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ delay:0.25, duration:0.6 }}
              />
              <p className="text-xs font-mono uppercase tracking-widest mb-4 relative z-10" style={{ color:'var(--text-muted)' }}>
                Quick Info
              </p>
              <div className="space-y-3 relative z-10">
                {quickInfo.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ backgroundColor:'var(--bg-card-hover)' }}
                    initial={{ opacity:0, x:16 }}
                    whileInView={{ opacity:1, x:0 }}
                    viewport={{ once:true }}
                    transition={{ delay:0.15+i*0.07 }}
                    whileHover={{ x:4, transition:{ duration:0.18 } }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor:`${item.color}14`, fontSize:'1rem' }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs" style={{ color:'var(--text-muted)' }}>{item.label}</div>
                      <div className="text-sm font-medium" style={{ color:'var(--text-primary)' }}>{item.value}</div>
                    </div>
                    <div className="ml-auto w-1.5 h-8 rounded-full" style={{ backgroundColor:`${item.color}30` }}>
                      <motion.div
                        className="w-full rounded-full"
                        style={{ backgroundColor:item.color }}
                        initial={{ height:0 }}
                        whileInView={{ height:'100%' }}
                        viewport={{ once:true }}
                        transition={{ delay:0.3+i*0.08, duration:0.5 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Socials */}
            <motion.div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)' }}
              whileHover={{ borderColor:'rgba(168,85,247,0.25)', y:-3, transition:{ duration:0.2 } }}
            >
              <motion.div
                className="absolute top-0 inset-x-0 h-[2px]"
                style={{ background:'linear-gradient(90deg, transparent, #a855f7, #ff6b6b, transparent)' }}
                initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ delay:0.3, duration:0.6 }}
              />
              <p className="text-xs font-mono uppercase tracking-widest mb-4 relative z-10" style={{ color:'var(--text-muted)' }}>
                Find Me Online
              </p>
              <div className="space-y-2.5 relative z-10">
                {socials.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <motion.a
                      href={s.href} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl flex-1 min-w-0 relative overflow-hidden group"
                      style={{ backgroundColor:'var(--bg-card-hover)', border:`1px solid transparent` }}
                      whileHover={{ x:4, borderColor:`${s.color}30`, boxShadow:`0 0 16px ${s.color}14` }}
                      initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
                      viewport={{ once:true }} transition={{ delay:i*0.08 }}
                    >
                      {/* Shimmer on hover */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background:`linear-gradient(90deg, transparent, ${s.color}10, transparent)` }}
                        initial={{ x:'-130%' }} whileHover={{ x:'130%' }} transition={{ duration:0.45 }}
                      />
                      <div style={{ color:s.color, flexShrink:0 }}>{s.icon}</div>
                      <div className="flex-1 min-w-0 relative z-10">
                        <div className="text-sm font-medium" style={{ color:'var(--text-primary)' }}>{s.name}</div>
                        <div className="text-xs truncate" style={{ color:'var(--text-muted)' }}>{s.value}</div>
                      </div>
                      <svg className="w-4 h-4 flex-shrink-0 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color:'var(--text-muted)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.a>
                    {s.name==='Email' && <CopyButton text={s.value} />}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
