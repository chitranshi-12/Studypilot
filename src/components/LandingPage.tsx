import React, { useState } from 'react';
import { loginWithGoogle, loginWithEmail, signUpWithEmail, loginAsDemo } from '../services/firebase';
import { UserProfile } from '../types';
import { BookOpen, Sparkles, Brain, CheckCircle2, ArrowRight, ShieldCheck, Mail, Lock, User, FileText, Moon, Sun } from 'lucide-react';

interface LandingPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  isDark?: boolean;
  toggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess, isDark, toggleTheme }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const user = await loginWithGoogle();
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }
    try {
      setLoading(true);
      setErrorMsg(null);
      let user: UserProfile;
      if (authMode === 'signup') {
        user = await signUpWithEmail(email, password, name);
      } else {
        user = await loginWithEmail(email, password);
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const user = await loginAsDemo();
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500/20">
      {/* Top Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                StudyPilot
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Smart PDF Exam Preparation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          )}

          <button
            onClick={handleDemoLogin}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white/80 dark:bg-slate-900/80 transition-all cursor-pointer shadow-xs"
          >
            <span>Explore Demo Mode</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Hero & Auth Split */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Left Column: Value Prop */}
        <div className="flex-1 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI-Powered Active Recall Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Master any exam syllabus{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              in half the time.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Upload any course PDF, scanned handout, or lecture slide. StudyPilot instantly creates concise notes, visual diagrams, intuitive worked examples, and adaptive test sessions.
          </p>

          {/* Three Feature Bullets */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  High-Yield Micro Notes
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                  Laser-focused topics with 25-word bullets, vocabulary term flashcards, and high-yield exam traps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 mt-0.5">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Visual Diagrams & Mnemonics
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                  Flowcharts, concept mind maps, comparative tables, and real-life examples on demand for any tricky topic.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Interactive Exam Practice
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                  Adaptive MCQs derived strictly from your document with instant rationale feedback and progress metrics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Card */}
        <div className="w-full max-w-md">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-500/5 dark:shadow-none">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {authMode === 'signin' ? 'Sign in to StudyPilot' : 'Create your student account'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your private exam prep hub with personal Firestore storage
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold tracking-wider">
                  or with email
                </span>
              </div>
            </div>

            {/* Email + Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Student"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-60 mt-1"
              >
                {loading
                  ? 'Verifying account…'
                  : authMode === 'signin'
                  ? 'Sign In to StudyPilot'
                  : 'Create Student Account'}
              </button>
            </form>

            {/* Toggle sign in / sign up */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                {authMode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already registered? Sign in'}
              </button>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant 1-Click Demo Login</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-600">
        StudyPilot • Powered by Gemini AI • Structured Exam Preparation
      </footer>
    </div>
  );
};
