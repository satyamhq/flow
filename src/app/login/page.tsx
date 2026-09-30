'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import { supabase } from '@/lib/supabase/client';
import { ShieldCheck, AlertCircle, ArrowRight, Sun, Moon, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoadingAuth, currentOrg, organizations, signIn, theme, setTheme } = useFlow();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoadingAuth) return;
    if (isAuthenticated) {
      const orgSlug = currentOrg?.slug || organizations[0]?.slug;
      if (orgSlug) {
        router.replace(`/app/org/${orgSlug}/overview`);
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isAuthenticated, isLoadingAuth, currentOrg, organizations, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setIsLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      }
      // Auth state listener in FlowProvider will trigger redirect
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address to receive password reset instructions.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        setErrorMsg(error.message);
      } else {
        setInfoMsg(`Password recovery link sent to ${email}. Check your inbox.`);
        setIsResetMode(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send recovery link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 text-[var(--color-text)] transition-colors">
      {/* Top Header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white shadow-sm font-bold text-base transition-transform group-hover:scale-105">
            F
          </div>
          <span className="tracking-wider text-[15px] font-semibold">Flow</span>
        </Link>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FBBC04]" /> : <Moon className="w-4 h-4 text-[#5F6368]" />}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <Card className="border-[var(--color-border)] shadow-xl bg-[var(--color-surface)]">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1.5 text-center">
              <h1 className="text-xl font-bold tracking-tight text-[var(--color-text)]">
                {isResetMode ? 'Reset your password' : 'Sign in to your account'}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {isResetMode
                  ? 'Enter your email address to receive reset instructions'
                  : 'Access your company operating system'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-[rgba(234,67,53,0.08)] border border-[rgba(234,67,53,0.25)] flex items-start space-x-2 text-xs text-[#EA4335]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {infoMsg && (
              <div className="p-3 rounded-lg bg-[rgba(52,168,83,0.08)] border border-[rgba(52,168,83,0.25)] flex items-start space-x-2 text-xs text-[#34A853]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{infoMsg}</span>
              </div>
            )}

            {!isResetMode ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setErrorMsg('');
                        setInfoMsg('');
                      }}
                      className="text-xs text-[#1A73E8] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full text-xs px-3 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-[var(--color-text)] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]/20 transition-colors pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center h-10 mt-2 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                />

                <div className="flex items-center space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => {
                      setIsResetMode(false);
                      setErrorMsg('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send reset link'}
                  </Button>
                </div>
              </form>
            )}

            {/* Separator */}
            {!isResetMode && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[var(--color-border)]" />
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">OR</span>
                  <div className="flex-1 h-px bg-[var(--color-border)]" />
                </div>

                {/* OAuth buttons */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={async () => {
                      await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: { redirectTo: `${window.location.origin}/app` },
                      });
                    }}
                    className="w-full flex items-center justify-center space-x-2.5 px-4 py-2.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] text-xs font-medium transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await supabase.auth.signInWithOAuth({
                        provider: 'github',
                        options: { redirectTo: `${window.location.origin}/app` },
                      });
                    }}
                    className="w-full flex items-center justify-center space-x-2.5 px-4 py-2.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] text-xs font-medium transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>Continue with GitHub</span>
                  </button>
                </div>
              </>
            )}

            <div className="pt-4 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#1A73E8] hover:underline font-semibold">
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center space-x-2 mt-6 text-[11px] text-[var(--color-text-secondary)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34A853]" />
          <span>Protected by Supabase Auth with Row Level Security</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[var(--color-text-secondary)]">
        &copy; {new Date().getFullYear()} Flow Systems Inc. All rights reserved.
      </div>
    </div>
  );
}
