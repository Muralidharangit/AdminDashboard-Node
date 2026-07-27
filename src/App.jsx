import React, { useState, useEffect } from 'react'
import Dashboard from './Dashboard.jsx'

export default function App() {
  const [page, setPage]           = useState('login')   // 'login' | 'register' | 'dashboard'
  const [user, setUser]           = useState(null)

  /* ─── Login state ─── */
  const [loginEmail, setLoginEmail]       = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginMsg, setLoginMsg]           = useState({ text: '', type: '' })
  const [loginLoading, setLoginLoading]   = useState(false)

  /* ─── Register state ─── */
  const [regName, setRegName]           = useState('')
  const [regEmail, setRegEmail]         = useState('')
  const [regPassword, setRegPassword]   = useState('')
  const [regMsg, setRegMsg]             = useState({ text: '', type: '' })
  const [regLoading, setRegLoading]     = useState(false)

  /* ─── Check persisted session ─── */
  useEffect(() => {
    const token = localStorage.getItem('token')
    const saved = localStorage.getItem('user')
    if (token && saved) {
      setUser(JSON.parse(saved))
      setPage('dashboard')
    }
  }, [])

  /* ─── Handlers ─── */
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginMsg({ text: '', type: '' })
    setLoginLoading(true)
    try {
      const res  = await fetch('/api/users/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')

      localStorage.setItem('token', data.token)
      localStorage.setItem('user',  JSON.stringify(data.user))
      setLoginMsg({ text: '✓ Login successful – redirecting…', type: 'success' })

      setTimeout(() => {
        setUser(data.user)
        setPage('dashboard')
        setLoginLoading(false)
        setLoginEmail('')
        setLoginPassword('')
        setLoginMsg({ text: '', type: '' })
      }, 800)
    } catch (err) {
      setLoginMsg({ text: err.message, type: 'error' })
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegMsg({ text: '', type: '' })
    setRegLoading(true)
    try {
      const res  = await fetch('/api/users', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')

      setRegMsg({ text: '✓ Account created – please sign in.', type: 'success' })
      const prefill = regEmail
      setTimeout(() => {
        setPage('login')
        setRegName(''); setRegEmail(''); setRegPassword('')
        setRegLoading(false); setRegMsg({ text: '', type: '' })
        setLoginEmail(prefill)
      }, 1200)
    } catch (err) {
      setRegMsg({ text: err.message, type: 'error' })
      setRegLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    setPage('login')
  }

  /* ─── Dashboard view ─── */
  if (page === 'dashboard') {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  /* ─── Auth view ─── */
  const isLogin = page === 'login'

  return (
    <div className="min-h-screen w-full flex items-stretch bg-neutral-50">

      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-neutral-950 text-white px-14 py-12">
        <div>
          <div className="flex items-center gap-2.5 mb-16">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
              <svg className="h-4.5 w-4.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">AdminPanel</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-snug">Manage everything<br/>from one place.</h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              A powerful admin dashboard with contacts, products, gallery, and fine-grained role permissions built in.
            </p>
          </div>

          <div className="mt-14 space-y-3">
            {['Contacts & CRM', 'Product Inventory', 'Gallery & Assets', 'Roles & Permissions'].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-400"></div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-neutral-600 text-xs">© 2026 AdminPanel · All rights reserved</p>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px] space-y-6">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-md bg-black flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-base font-bold text-neutral-900">AdminPanel</span>
          </div>

          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {isLogin ? 'Sign in to your admin account.' : 'Register administrator credentials.'}
            </p>
          </div>

          {/* Alert message */}
          {(isLogin ? loginMsg : regMsg).text && (
            <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs ${
              (isLogin ? loginMsg : regMsg).type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {(isLogin ? loginMsg : regMsg).type === 'success'
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                }
              </svg>
              <span>{(isLogin ? loginMsg : regMsg).text}</span>
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">Email address</label>
                <input
                  id="login-email" type="email" required
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                  placeholder="admin@example.com"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">Password</label>
                <input
                  id="login-password" type="password" required
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                  placeholder="••••••••"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                />
              </div>
              <button
                type="submit" disabled={loginLoading}
                className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                {loginLoading
                  ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Sign In'}
              </button>
            </form>
          ) : (
          /* ── REGISTER FORM ── */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">Full Name</label>
                <input
                  id="reg-name" type="text" required
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                  placeholder="John Doe"
                  value={regName} onChange={e => setRegName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">Email address</label>
                <input
                  id="reg-email" type="email" required
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                  placeholder="admin@example.com"
                  value={regEmail} onChange={e => setRegEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">Password</label>
                <input
                  id="reg-password" type="password" required
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                  placeholder="••••••••"
                  value={regPassword} onChange={e => setRegPassword(e.target.value)}
                />
              </div>
              <button
                type="submit" disabled={regLoading}
                className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                {regLoading
                  ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Create Account'}
              </button>
            </form>
          )}

          {/* Toggle link */}
          <p className="text-center text-xs text-neutral-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setPage(isLogin ? 'register' : 'login')
                setLoginMsg({ text: '', type: '' })
                setRegMsg({ text: '', type: '' })
              }}
              className="text-neutral-900 font-semibold underline hover:text-neutral-600 bg-transparent border-none cursor-pointer"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}
