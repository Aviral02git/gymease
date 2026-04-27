import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { useAuth } from '../../context/AuthContext';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: ''
};

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { signup, login, loginWithGoogle, isConfigured } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) {
    return null;
  }

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetAndClose = () => {
    setForm(INITIAL_FORM);
    setError('');
    onClose();
  };

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password || (isSignup && !form.name)) {
      setError('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignup) {
        await signup({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      } else {
        await login({ email: form.email.trim(), password: form.password });
      }

      resetAndClose();
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
      resetAndClose();
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        aria-label="Close auth dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={resetAndClose}
      />

      <div className="relative w-full max-w-md solid-card p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
              {isSignup ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="text-textMuted text-sm mt-1">
              {isSignup ? 'Sign up to unlock trials and reviews.' : 'Login to continue your fitness journey.'}
            </p>
          </div>
          <button
            className="text-textMuted hover:text-white"
            onClick={resetAndClose}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isConfigured && (
          <div className="mb-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-200">
            Supabase env vars are missing. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleEmailAuth}>
          {isSignup && (
            <Input
              label="Full name"
              placeholder="Aviral Mishra"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              autoComplete="name"
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting || !isConfigured}>
            {isSubmitting ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-textMuted uppercase tracking-wider">
          <div className="h-px flex-1 bg-white/10" />
          or continue with
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleAuth}
          disabled={isSubmitting || !isConfigured}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M44.5 20H24V28.5H35.8C34.5 33 30.7 36.2 24 36.2C16.6 36.2 10.6 30.2 10.6 22.8C10.6 15.4 16.6 9.4 24 9.4C27.2 9.4 30.1 10.5 32.3 12.4L38.4 6.3C34.6 2.9 29.7 0.8 24 0.8C11.4 0.8 1.2 11 1.2 23.6C1.2 36.2 11.4 46.4 24 46.4C37 46.4 46.1 37.4 46.1 24.6C46.1 23 45.9 21.4 45.6 20H44.5Z" fill="#FFC107"/>
            <path d="M6.4 14.8L13.5 20.1C15.4 15.4 19.3 12.3 24 12.3C27.2 12.3 30.1 13.4 32.3 15.3L38.4 9.2C34.6 5.8 29.7 3.7 24 3.7C15.2 3.7 7.6 8.8 3.9 16.2L6.4 14.8Z" fill="#FF3D00"/>
            <path d="M24 46.4C29.5 46.4 34.3 44.5 38.1 41.2L31.4 35.5C29.3 37 26.8 37.9 24 37.9C17.1 37.9 11.2 33.5 9.1 27.4L1.8 33C5.5 40.5 13.1 46.4 24 46.4Z" fill="#4CAF50"/>
            <path d="M46.1 24.6C46.1 23 45.9 21.4 45.6 20H24V28.5H35.8C35.2 30.8 33.8 32.8 31.7 34.2L38.4 39.9C42.2 36.4 46.1 31.6 46.1 24.6Z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </Button>

        <p className="mt-5 text-sm text-textMuted text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-primary font-semibold hover:text-white"
            onClick={() => {
              setMode(isSignup ? 'login' : 'signup');
              setError('');
            }}
            type="button"
          >
            {isSignup ? 'Login' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
