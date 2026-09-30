'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import { Building2, ArrowRight, ShieldCheck, Code2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { currentOrg } = useFlow();

  const [email, setEmail] = useState('satyam@acme.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/app/org/${currentOrg.slug}/overview`);
  };

  const handleDemoLogin = () => {
    router.push(`/app/org/acme/overview`);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#EDF2F7]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2.5 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded bg-[#1A73E8] flex items-center justify-center text-white shadow-sm font-bold text-base">
            F
          </div>
          <span className="tracking-wider text-base font-semibold">FLOW</span>
        </Link>
        <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight mt-2">Sign in to Flow Console</h2>
        <p className="text-xs text-[#9AA0A6]">Authenticate with enterprise credentials or SSO</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-[#202637]">
          {/* Quick Demo Access banner */}
          <div className="p-3.5 bg-[#161D2D]/60 border-b border-[#202637] flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-[#8AB4F8] block">Instant Demo Access</span>
              <span className="text-[11px] text-[#9AA0A6]">Preloaded with Acme AI ($15.7M ARR)</span>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={handleDemoLogin}
              className="h-7 text-xs"
            >
              Enter Demo
            </Button>
          </div>

          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Work Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#EDF2F7]">Password</label>
                  <span className="text-[11px] text-[#8AB4F8] hover:underline cursor-pointer">Forgot password?</span>
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-[#9AA0A6] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded bg-[#161D2D] border-[#202637] text-[#1A73E8] focus:ring-0"
                  />
                  <span>Remember active session</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center"
              >
                <span>Continue to Console</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </form>

            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#202637]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-[#111622] px-2 text-[#9AA0A6]">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDemoLogin}
                className="justify-center"
              >
                Google SSO
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDemoLogin}
                className="justify-center"
              >
                <Code2 className="w-3.5 h-3.5 mr-1" />
                GitHub
              </Button>
            </div>
          </CardContent>

          <CardFooter className="pt-0 pb-6 px-6 justify-center text-xs text-[#9AA0A6]">
            Don&apos;t have an organization account?{' '}
            <Link href="/onboarding" className="text-[#8AB4F8] hover:underline font-medium ml-1">
              Create organization
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
