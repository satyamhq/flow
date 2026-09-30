'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import { supabase } from '@/lib/supabase/client';
import { ShieldCheck, AlertCircle, ArrowRight, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { currentOrg, signIn, isAuthenticated, theme, setTheme } = useFlow();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/app/org/${currentOrg.slug}/overview`);
    }
  }, [isAuthenticated, currentOrg.slug, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setIsLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        router.push(`/app/org/${currentOrg.slug}/overview`);
      }
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
        setInfoMsg(`Password recovery link dispatched to ${email}. Check your inbox.`);
        setIsResetMode(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to dispatch recovery link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 text-[var(--color-text)] transition-colors">
      {/* Top Header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center space-x-2.5 font-bold text-base tracking-tight">
          <div className="w-8 h-8 rounded bg-[#1A73E8] flex items-center justify-center text-white shadow-sm font-bold text-base">
            F
          </div>
          <span className="tracking-wider text-base font-semibold">FLOW</span>
        </Link>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FBBC04]" /> : <Moon className="w-4 h-4 text-[#5F6368]" />}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <Card className="border-[var(--color-border)] shadow-xl bg-[var(--color-surface)]">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1 text-center">
              <h1 className="text-xl font-bold tracking-tight text-[var(--color-text)]">
                {isResetMode ? 'Reset your password' : 'Sign in to your account'}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {isResetMode
                  ? 'Enter your verified email address to receive reset instructions'
                  : 'Enter your credentials to access your company operating system'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded bg-[rgba(234,67,53,0.1)] border border-[rgba(234,67,53,0.3)] flex items-start space-x-2 text-xs text-[#EA4335]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {infoMsg && (
              <div className="p-3 rounded bg-[rgba(52,168,83,0.1)] border border-[rgba(52,168,83,0.3)] flex items-start space-x-2 text-xs text-[#34A853]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{infoMsg}</span>
              </div>
            )}

            {!isResetMode ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
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
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-[var(--color-text)] focus:outline-none focus:border-[#1A73E8] transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center h-10 mt-2 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Sign in'}
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
