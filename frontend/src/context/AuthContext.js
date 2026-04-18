import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/supabaseClient';

const AuthContext = createContext(null);

function normalizeAuthError(error) {
  if (!error) {
    return 'Authentication failed. Please try again.';
  }

  if (typeof error === 'string') {
    return error;
  }

  const message = error?.message || '';

  if (!message) {
    return error?.message || 'Authentication failed. Please try again.';
  }

  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }

  if (lower.includes('email not confirmed')) {
    return 'Please verify your email before logging in.';
  }

  if (lower.includes('already registered') || lower.includes('already been registered')) {
    return 'This email is already registered.';
  }

  if (lower.includes('password') && lower.includes('6')) {
    return 'Password should be at least 6 characters.';
  }

  return message;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setUser(data?.session?.user ?? null);
        setLoading(false);
      }
    };

    initialize();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const ensureSupabaseEnabled = () => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env.');
    }
  };

  const signup = async ({ name, email, password }) => {
    try {
      ensureSupabaseEnabled();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || '',
            display_name: name || ''
          }
        }
      });

      if (error) {
        throw error;
      }

      return data?.user || null;
    } catch (error) {
      throw new Error(normalizeAuthError(error));
    }
  };

  const login = async ({ email, password }) => {
    try {
      ensureSupabaseEnabled();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      return data?.user || null;
    } catch (error) {
      throw new Error(normalizeAuthError(error));
    }
  };

  const loginWithGoogle = async () => {
    try {
      ensureSupabaseEnabled();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        throw error;
      }

      return data || null;
    } catch (error) {
      throw new Error(normalizeAuthError(error));
    }
  };

  const logout = async () => {
    try {
      ensureSupabaseEnabled();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error(normalizeAuthError(error));
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isConfigured: isSupabaseConfigured,
      authMode: 'supabase',
      signup,
      login,
      loginWithGoogle,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
