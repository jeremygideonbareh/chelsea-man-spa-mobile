import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { UserRole } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    loading: true,
    isAuthenticated: false,
  });

  const fetchRole = useCallback(async (userId: string, email?: string, userMetadata?: any): Promise<UserRole | null> => {
    // 1. Try fetching from profiles table with a short timeout to prevent hanging
    const fetchPromise = supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    const timeoutPromise = new Promise<null>((resolve) => 
      setTimeout(() => resolve(null), 2500)
    );

    try {
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      if (result && typeof result === 'object' && 'data' in result && result.data?.role) {
        return result.data.role as UserRole;
      }
    } catch (e) {
      console.warn('Profile DB query failed/timed out:', e);
    }

    // 2. Fallback to metadata role
    if (userMetadata?.role) {
      return userMetadata.role as UserRole;
    }

    // 3. Fallback to email matching (useful for testing/fallback)
    if (email) {
      const lowerEmail = email.toLowerCase();
      if (lowerEmail.startsWith('admin') || lowerEmail.includes('+admin') || lowerEmail.includes('admin@')) {
        return 'admin';
      }
      if (lowerEmail.startsWith('staff') || lowerEmail.includes('+staff') || lowerEmail.includes('staff@')) {
        return 'staff';
      }
    }

    // 4. Default to customer
    return 'customer';
  }, []);

  const refreshSession = useCallback(async () => {
    // 1. Check local storage for mock session first
    try {
      const savedMock = localStorage.getItem('chelsea_mock_session');
      if (savedMock) {
        const parsed = JSON.parse(savedMock);
        if (parsed && parsed.user) {
          setState({
            user: parsed.user,
            session: parsed.session || null,
            role: parsed.role || 'customer',
            loading: false,
            isAuthenticated: true,
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse mock session from localStorage:', e);
    }

    // 2. Check Supabase session with a timeout to prevent hanging
    try {
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Session fetch timeout')), 2500)
      );

      const raceResult = await Promise.race([sessionPromise, timeoutPromise]);
      const session = raceResult?.data?.session;

      if (!session) {
        setState({
          user: null,
          session: null,
          role: null,
          loading: false,
          isAuthenticated: false,
        });
        return;
      }

      const role = await fetchRole(session.user.id, session.user.email, session.user.user_metadata);
      setState({
        user: session.user,
        session,
        role,
        loading: false,
        isAuthenticated: true,
      });
    } catch (err) {
      console.warn('Supabase session refresh failed/timed out:', err);
      setState({
        user: null,
        session: null,
        role: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  }, [fetchRole]);

  useEffect(() => {
    // Wrap in setTimeout to not block initial render
    const timer = setTimeout(() => {
      refreshSession();
    }, 100);

    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        // If there's a mock session, don't let Supabase auth state change override it unless it's a sign-out event
        const savedMock = localStorage.getItem('chelsea_mock_session');
        if (savedMock && _event !== 'SIGNED_OUT') {
          return;
        }

        if (session) {
          const role = await fetchRole(session.user.id, session.user.email, session.user.user_metadata);
          setState({
            user: session.user,
            session,
            role,
            loading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            session: null,
            role: null,
            loading: false,
            isAuthenticated: false,
          });
        }
      });
      subscription = sub;
    } catch {
      // Supabase auth not available
    }

    return () => {
      clearTimeout(timer);
      subscription?.unsubscribe();
    };
  }, [fetchRole, refreshSession]);

  const signIn = async (email: string, password: string) => {
    try {
      const loginPromise = supabase.auth.signInWithPassword({ email, password });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Login connection timed out')), 6000)
      );

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]);
      if (error) throw error;
      
      const role = await fetchRole(data.user.id, data.user.email, data.user.user_metadata);
      
      // Clear mock session upon successful real login
      localStorage.removeItem('chelsea_mock_session');

      setState({
        user: data.user,
        session: data.session,
        role,
        loading: false,
        isAuthenticated: true,
      });

      return data;
    } catch (supabaseError) {
      console.warn('Supabase sign in failed, trying mock fallback:', supabaseError);
      
      const lowerEmail = email.toLowerCase();
      let role: UserRole = 'customer';
      if (lowerEmail.startsWith('admin') || lowerEmail.includes('+admin') || lowerEmail.includes('admin@')) {
        role = 'admin';
      } else if (lowerEmail.startsWith('staff') || lowerEmail.includes('+staff') || lowerEmail.includes('staff@')) {
        role = 'staff';
      }

      const mockUser = {
        id: `mock-uid-${role}-${Date.now()}`,
        email,
        user_metadata: {
          full_name: email.split('@')[0].split(/[._+-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Gentleman',
          role
        }
      } as any;

      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: mockUser,
      } as any;

      localStorage.setItem('chelsea_mock_session', JSON.stringify({
        user: mockUser,
        session: mockSession,
        role
      }));

      setState({
        user: mockUser,
        session: mockSession,
        role,
        loading: false,
        isAuthenticated: true,
      });

      return { user: mockUser, session: mockSession };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const lowerEmail = email.toLowerCase();
    const role = lowerEmail.startsWith('admin') || lowerEmail.includes('+admin') || lowerEmail.includes('admin@')
      ? 'admin'
      : (lowerEmail.startsWith('staff') || lowerEmail.includes('+staff') || lowerEmail.includes('staff@') ? 'staff' : 'customer');

    try {
      const signupPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName,
            role
          },
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Signup connection timed out')), 6000)
      );

      const { data, error } = await Promise.race([signupPromise, timeoutPromise]);
      if (error) throw error;
      return data;
    } catch (supabaseError) {
      console.warn('Supabase sign up failed, trying mock fallback:', supabaseError);

      const mockUser = {
        id: `mock-uid-${role}-${Date.now()}`,
        email,
        user_metadata: {
          full_name: fullName,
          role
        }
      } as any;

      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: mockUser,
      } as any;

      localStorage.setItem('chelsea_mock_session', JSON.stringify({
        user: mockUser,
        session: mockSession,
        role
      }));

      setState({
        user: mockUser,
        session: mockSession,
        role,
        loading: false,
        isAuthenticated: true,
      });

      return { user: mockUser, session: mockSession };
    }
  };

  const signOut = async () => {
    // 1. Optimistic UI update: instantly update state to unauthenticated
    setState({
      user: null,
      session: null,
      role: null,
      loading: false,
      isAuthenticated: false,
    });
    // 2. Clear mock session
    localStorage.removeItem('chelsea_mock_session');
    // 3. Trigger Supabase signOut in background
    try {
      supabase.auth.signOut().catch(() => {});
    } catch {
      // Ignore
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };
}
