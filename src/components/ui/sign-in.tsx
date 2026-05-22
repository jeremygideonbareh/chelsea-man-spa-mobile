import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';

// --- TYPE DEFINITIONS ---

export type AuthMode = 'login' | 'register';

export interface SignInPageProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  heroImageSrc?: string;
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack?: () => void;
  loading?: boolean;
  error?: string | null;
  email: string;
  onEmailChange: (val: string) => void;
  password: string;
  onPasswordChange: (val: string) => void;
  fullName: string;
  onFullNameChange: (val: string) => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-white/10 bg-[#171717] backdrop-blur-sm transition-colors focus-within:border-[#D4AF37]/50 focus-within:bg-[#D4AF37]/5">
    {children}
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  mode,
  onModeChange,
  heroImageSrc,
  onSignIn,
  onBack,
  loading = false,
  error = null,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  fullName,
  onFullNameChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row w-[100dvw] bg-[#0A0A0A]">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-8 relative">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="signin-animate signin-delay-100 absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-[#A3A3A3] hover:text-white hover:border-[#D4AF37]/40 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="w-full max-w-md">
          <div className="flex flex-col gap-5">
            {/* Logo / Title */}
            <div className="text-center mb-2">
              <h1 className="signin-animate signin-delay-100 font-display italic text-4xl md:text-5xl font-bold gold-gradient-text leading-tight">
                Chelsea
              </h1>
              <p className="signin-animate signin-delay-200 text-[#A3A3A3] text-sm mt-2">
                {mode === 'login' ? 'Welcome back, gentleman' : 'Create your account'}
              </p>
            </div>

            {/* Mode Toggle */}
            <div
              className="signin-animate signin-delay-200 flex bg-[#171717] rounded-full p-1"
            >
              <button
                type="button"
                onClick={() => onModeChange('login')}
                className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-[#D4AF37] text-[#0A0A0A]'
                    : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onModeChange('register')}
                className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${
                  mode === 'register'
                    ? 'bg-[#D4AF37] text-[#0A0A0A]'
                    : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form className="space-y-4" onSubmit={onSignIn}>
              {/* Full Name (register only) */}
              {mode === 'register' && (
                <div className="signin-animate signin-delay-300">
                  <label className="text-[#A3A3A3] text-xs mb-1.5 block font-medium">Full Name</label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
                      <input
                        name="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => onFullNameChange(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full bg-transparent text-sm text-white p-3.5 pl-11 rounded-xl focus:outline-none placeholder:text-[#525252]"
                      />
                    </div>
                  </GlassInputWrapper>
                </div>
              )}

              {/* Email */}
              <div className="signin-animate signin-delay-300">
                <label className="text-[#A3A3A3] text-xs mb-1.5 block font-medium">Email Address</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
                    <input
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-transparent text-sm text-white p-3.5 pl-11 rounded-xl focus:outline-none placeholder:text-[#525252]"
                    />
                  </div>
                </GlassInputWrapper>
              </div>

              {/* Password */}
              <div className="signin-animate signin-delay-400">
                <label className="text-[#A3A3A3] text-xs mb-1.5 block font-medium">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => onPasswordChange(e.target.value)}
                      placeholder={mode === 'register' ? 'Min 6 characters' : 'Enter your password'}
                      required
                      minLength={6}
                      className="w-full bg-transparent text-sm text-white p-3.5 pl-11 pr-12 rounded-xl focus:outline-none placeholder:text-[#525252]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-[#A3A3A3] hover:text-white transition-colors" />
                      ) : (
                        <Eye className="w-4 h-4 text-[#A3A3A3] hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {/* Remember me / Reset (login only) */}
              {mode === 'login' && (
                <div className="signin-animate signin-delay-500 flex items-center justify-between text-sm">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      className="w-4 h-4 rounded border-white/20 bg-[#171717] accent-[#D4AF37] cursor-pointer"
                    />
                    <span className="text-[#A3A3A3] text-xs">Keep me signed in</span>
                  </label>
                  <button type="button" className="text-[#D4AF37] hover:underline text-xs transition-colors">
                    Reset password
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-400 text-xs text-center signin-animate">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="signin-animate signin-delay-600 gold-btn w-full h-14 rounded-2xl text-sm font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                    Please wait...
                  </span>
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="signin-animate signin-delay-700 relative flex items-center justify-center">
              <span className="w-full border-t border-white/10" />
              <span className="px-4 text-xs text-[#525252] bg-[#0A0A0A] absolute whitespace-nowrap">Or continue with</span>
            </div>

            {/* Google button */}
            <button className="signin-animate signin-delay-800 w-full flex items-center justify-center gap-3 border border-white/10 rounded-2xl py-3.5 text-sm text-[#A3A3A3] hover:text-white hover:border-[#D4AF37]/30 hover:bg-[#171717] transition-all">
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Footer */}
            <p className="signin-animate signin-delay-900 text-center text-[#525252] text-xs mt-2">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div
            className="signin-hero-slide absolute inset-4 rounded-3xl bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          >
            {/* Gradient overlay for branding */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/20" />

            {/* Bottom branding on the hero */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="glass-card rounded-2xl p-6">
                <p className="text-white font-display text-xl font-bold">Chelsea Man Spa</p>
                <p className="text-[#A3A3A3] text-sm mt-1">
                  Dubai's premier men's grooming destination — where tradition meets modern luxury.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <span className="gold-gradient-text text-sm font-bold">4.9</span>
                    <span className="text-[#D4AF37] text-xs">★★★★★</span>
                  </div>
                  <span className="text-[#525252] text-xs">|</span>
                  <span className="text-[#A3A3A3] text-xs">50K+ Happy Clients</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);
