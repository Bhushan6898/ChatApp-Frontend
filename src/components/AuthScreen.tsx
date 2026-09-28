import { useState, type FormEvent } from 'react'
import { ArrowRight, LockKeyhole, MessageCircle, ShieldCheck } from 'lucide-react'

type DemoAccount = {
  name: string
  email: string
  password: string
}

type AuthScreenProps = {
  accountExists: boolean
  onLogin: (email: string, password: string) => boolean
  onRegister: (account: DemoAccount) => void
}

export function AuthScreen({ accountExists, onLogin, onRegister }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function changeMode(nextMode: 'login' | 'register') {
    setMode(nextMode)
    setError('')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()

    if (mode === 'register') {
      onRegister({ name: name.trim(), email: normalizedEmail, password })
      return
    }

    if (!onLogin(normalizedEmail, password)) {
      setError(accountExists
        ? 'That email and password do not match.'
        : 'No account is registered in this session yet.')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="ChatApplication messaging">
        <div className="auth-brand"><span className="auth-brand-mark">C<span>.</span></span> ChatApplication</div>
        <div className="auth-story-content">
          <p className="auth-kicker"><span /> A little more room to think</p>
          <h1>Good work<br />starts with<br /><em>good conversation.</em></h1>
          <p className="auth-story-copy">A calm place for the ideas, people, and small moments that move your work forward.</p>
          <div className="auth-message-note">
            <span className="auth-note-icon"><MessageCircle size={18} strokeWidth={1.7} /></span>
            <div><strong>Make space for the good stuff.</strong><span>Your conversations, all in one place.</span></div>
            <span className="auth-note-spark">✳</span>
          </div>
        </div>
        <p className="auth-story-footer"><ShieldCheck size={14} /> A thoughtful space for your team</p>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <p className="auth-mobile-brand">C<span>.</span> ChatApplication</p>
          <p className="auth-form-kicker">WELCOME TO CHATAPPLICATION</p>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-form-intro">{mode === 'login' ? 'Sign in to pick up where you left off.' : 'A good conversation is just around the corner.'}</p>

          <div className="auth-mode-switch" role="group" aria-label="Choose sign-in or registration">
            <button type="button" aria-pressed={mode === 'login'} className={mode === 'login' ? 'is-selected' : ''} onClick={() => changeMode('login')}>Log in</button>
            <button type="button" aria-pressed={mode === 'register'} className={mode === 'register' ? 'is-selected' : ''} onClick={() => changeMode('register')}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && (
              <label className="auth-field">
                <span>Name</span>
                <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
              </label>
            )}
            <label className="auth-field">
              <span>Email</span>
              <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={mode === 'register' ? 8 : undefined} required />
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit">
              {mode === 'login' ? 'Log in to ChatApplication' : 'Create account'} <ArrowRight size={17} />
            </button>
          </form>

          <p className="auth-switch-copy">
            {mode === 'login' ? 'New to ChatApplication?' : 'Already have an account?'}{' '}
            <button type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Create an account' : 'Log in'}
            </button>
          </p>
          <p className="auth-demo-note"><LockKeyhole size={13} /> Demo sign-in only. Your details stay in this session.</p>
        </div>
      </section>
    </main>
  )
}
