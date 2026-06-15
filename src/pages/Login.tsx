import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { SignInPage, type AuthMode } from '@/components/ui/sign-in';

function isAdminEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return lower.startsWith('admin') || lower.includes('+admin') || lower.includes('admin@') || ['princeraymondpaul911@gmail.com', 'cloudlyconfusing@gmail.com'].includes(lower);
}

function isStaffEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return lower.startsWith('staff') || lower.includes('+staff') || lower.includes('staff@');
}

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
        await signIn(email, password);
        // Navigate handled by useAuth state + the Navigate component above
        navigate(isAdminEmail(email) || isStaffEmail(email) ? '/admin' : '/dashboard');
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
