'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import { ShieldCheck, AlertCircle, ArrowRight, Sun, Moon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isAuthenticated, currentOrg, theme, setTheme } = useFlow();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to active dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/app/org/${currentOrg.slug}/overview`);
    }
  }, [isAuthenticated, currentOrg.slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(false);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUp(email, password, fullName);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        // Proceed directly to organization onboarding
        router.push('/onboarding');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create account.');
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

      {/* Main Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <Card className="border-[var(--color-border)] shadow-xl bg-[var(--color-surface)]">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1 text-center">
              <h1 className="text-xl font-bold tracking-tight text-[var(--color-text)]">
                Create your Flow account
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Initialize your enterprise organization and access control
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded bg-[rgba(234,67,53,0.1)] border border-[rgba(234,67,53,0.3)] flex items-start space-x-2 text-xs text-[#EA4335]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Satyam"
              />

              <Input
                label="Work Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center h-10 mt-2 font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </Button>
            </form>

            <div className="pt-4 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#1A73E8] hover:underline font-semibold">
                Sign in
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
