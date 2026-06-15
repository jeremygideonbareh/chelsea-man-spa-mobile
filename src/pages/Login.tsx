import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { SignInPage, type AuthMode } from '@/components/ui/sign-in';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, role, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to={(role === 'admin' || role === 'staff') ? '/admin' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const data = await signIn(email, password);
        
        // Immediate redirection check
        let targetRoute = '/dashboard';
        const userMetadata = data?.user?.user_metadata;
        const lowerEmail = email.toLowerCase();
        const isEmailAdmin = lowerEmail.startsWith('admin') || lowerEmail.includes('+admin') || lowerEmail.includes('admin@') || ['princeraymondpaul911@gmail.com', 'cloudlyconfusing@gmail.com'].includes(lowerEmail);
        const isEmailStaff = lowerEmail.startsWith('staff') || lowerEmail.includes('+staff') || lowerEmail.includes('staff@');
        
        if (userMetadata?.role === 'admin' || userMetadata?.role === 'staff' || isEmailAdmin || isEmailStaff) {
          targetRoute = '/admin';
        }
        
        navigate(targetRoute);
      } else {
        await signUp(email, password, fullName);
        setMode('login');
        setError(null);
      }
    } catch (err) {
      console.error('Auth Error:', err instanceof Error ? err.message : err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

  return (
    <SignInPage
      mode={mode}
      onModeChange={handleModeChange}
      heroImageSrc="images/signin.jpg"
      onSignIn={handleSubmit}
      onBack={() => navigate('/')}
      loading={loading}
      error={error}
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      fullName={fullName}
      onFullNameChange={setFullName}
    />
  );
}
