import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, CircleCheck, LoaderCircle, MessageCircle, ShieldCheck, WifiOff } from 'lucide-react'
import type { ApiConnectionStatus, RegisterInput } from '../types/auth'

type AuthScreenProps = {
  apiConnectionStatus: ApiConnectionStatus
  apiConnectionResponse: unknown
  onLogin: (credentials: { email: string; password: string }) => Promise<void>
  onRegister: (input: RegisterInput) => Promise<void>
}

export function AuthScreen({ apiConnectionStatus, apiConnectionResponse, onLogin, onRegister }: AuthScreenProps) {
  const [page, setPage] = useState<'login' | 'register'>(() => window.location.hash === '#/register' ? 'register' : 'login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ConnectionIcon = apiConnectionStatus === 'checking'
    ? LoaderCircle
    : apiConnectionStatus === 'connected'
      ? CircleCheck
      : WifiOff

  useEffect(() => {
    function syncPage() {
      setPage(window.location.hash === '#/register' ? 'register' : 'login')
      setError('')
    }

    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      if (page === 'register') {
        await onRegister({ name: name.trim(), email: normalizedEmail, password })
        setSuccess('Your account was created. You can now log in.')
      } else {
        await onLogin({ email: normalizedEmail, password })
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
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
          <p className="auth-form-kicker">{page === 'login' ? 'WELCOME TO CHATAPPLICATION' : 'JOIN CHATAPPLICATION'}</p>
          <h2>{page === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-form-intro">{page === 'login' ? 'Sign in to pick up where you left off.' : 'Create an account to start a conversation.'}</p>

          <form className="auth-form" onSubmit={(event) => void submit(event)}>
            {page === 'register' && (
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
              <input type="password" autoComplete={page === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={page === 'register' ? 8 : undefined} required />
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            {success && <p className="auth-success" role="status">{success}</p>}
            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : page === 'login' ? 'Log in to ChatApplication' : 'Create account'} {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="auth-switch-copy">
            {page === 'login' ? 'New to ChatApplication?' : 'Already have an account?'}{' '}
            <a href={page === 'login' ? '#/register' : '#/login'}>
              {page === 'login' ? 'Create an account' : 'Log in'}
            </a>
          </p>
          <p className={`auth-demo-note auth-demo-note--${apiConnectionStatus}`} role="status" aria-live="polite">
            <ConnectionIcon size={13} />
            {apiConnectionStatus === 'checking' && 'Connecting to the backend...'}
            {apiConnectionStatus === 'connected' && 'Backend connection is active.'}
            {apiConnectionStatus === 'unavailable' && 'Backend is unavailable. Login will retry the request.'}
          </p>
          {apiConnectionResponse !== null && apiConnectionResponse !== undefined && (
            <details className="auth-api-response">
              <summary>API response</summary>
              <pre>{typeof apiConnectionResponse === 'string'
                ? apiConnectionResponse
                : JSON.stringify(apiConnectionResponse, null, 2) ?? String(apiConnectionResponse)}</pre>
            </details>
          )}
        </div>
      </section>
    </main>
  )
}
