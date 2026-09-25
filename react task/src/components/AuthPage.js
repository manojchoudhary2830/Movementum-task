import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else if (mode === 'signup') {
        await signUp(email, password);
        setMsg({ type: 'success', text: 'Account created. You are now signed in.' });
      } else if (mode === 'reset') {
        await resetPassword(email);
        setMsg({ type: 'success', text: 'Password reset email sent.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message.replace('Firebase: ', '') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Momentum</h2>
        <p className="auth-sub">
          {mode === 'signin' && 'Sign in to manage your tasks'}
          {mode === 'signup' && 'Create your account'}
          {mode === 'reset' && 'Reset your password'}
        </p>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {mode !== 'reset' && (
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>
        )}

        {msg && (
          <p role="alert" className={`auth-msg ${msg.type}`}>
            {msg.text}
          </p>
        )}

        <button className="btn btn-primary" disabled={busy} type="submit">
          {busy
            ? 'Please wait…'
            : mode === 'signin'
            ? 'Sign in'
            : mode === 'signup'
            ? 'Sign up'
            : 'Send reset email'}
        </button>

        <div className="auth-links">
          {mode !== 'signin' && (
            <button type="button" className="link" onClick={() => setMode('signin')}>
              Sign in
            </button>
          )}
          {mode !== 'signup' && (
            <button type="button" className="link" onClick={() => setMode('signup')}>
              Create account
            </button>
          )}
          {mode !== 'reset' && (
            <button type="button" className="link" onClick={() => setMode('reset')}>
              Forgot password?
            </button>
          )}
        </div>
      </form>
    </div>
  );
}