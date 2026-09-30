'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import { Building2, ArrowRight, ShieldCheck, Code2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { currentOrg, signIn, signUp } = useFlow();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          router.push(`/app/org/${currentOrg.slug}/overview`);
        }
      } else {
        const res = await signUp(email, password, fullName);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Account registered successfully. You can now sign in or proceed to onboarding.');
          setMode('signin');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#EDF2F7]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2.5 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded bg-[#1A73E8] flex items-center justify-center text-white shadow-sm font-bold text-base">
            F
          </div>
          <span className="tracking-wider text-base font-semibold">FLOW CONSOLE</span>
        </Link>
        <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight mt-2">
          {mode === 'signin' ? 'Sign in to your organization' : 'Create your Flow account'}
        </h2>
        <p className="text-xs text-[#9AA0A6]">
          {mode === 'signin'
            ? 'Authenticate using your verified Supabase credentials'
            : 'Get started with an authoritative enterprise workspace'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-[#202637]">
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[#202637] text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                mode === 'signin'
                  ? 'border-[#1A73E8] text-[#8AB4F8] font-semibold'
                  : 'border-transparent text-[#9AA0A6] hover:text-[#EDF2F7]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'border-[#1A73E8] text-[#8AB4F8] font-semibold'
                  : 'border-transparent text-[#9AA0A6] hover:text-[#EDF2F7]'
              }`}
            >
              Register
            </button>
          </div>

          <CardContent className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded bg-[#D93025]/15 border border-[#D93025]/40 text-xs text-[#EA4335] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded bg-[#0D904F]/15 border border-[#0D904F]/40 text-xs text-[#81C995] flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <Input
                  label="Full Name"
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}

              <Input
                label="Corporate Email"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full justify-center mt-2"
              >
                <span>{mode === 'signin' ? 'Sign In to Console' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-0 pb-6 px-6 justify-center text-xs text-[#9AA0A6]">
            {mode === 'signin' ? (
              <span>
                Need to create a new organization?{' '}
                <Link href="/onboarding" className="text-[#8AB4F8] hover:underline font-medium ml-1">
                  Start onboarding
                </Link>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-[#8AB4F8] hover:underline font-medium ml-1 cursor-pointer"
                >
                  Sign in instead
                </button>
              </span>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
