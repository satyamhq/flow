'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  Lock,
  Compass,
  CheckCircle2,
  DollarSign,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#EDF2F7] selection:bg-[#1A73E8] selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="h-16 border-b border-[#202637] bg-[#0E131F]/90 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#1A73E8] flex items-center justify-center text-white font-bold text-base shadow-sm">
            F
          </div>
          <span className="font-semibold tracking-wider text-base text-white">FLOW CONSOLE</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-[#9AA0A6]">
          <a href="#platform" className="hover:text-white transition-colors">Platform</a>
          <a href="#strategy" className="hover:text-white transition-colors">Strategy</a>
          <a href="#engineering" className="hover:text-white transition-colors">Engineering</a>
          <a href="#intelligence" className="hover:text-white transition-colors">Flow AI</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </nav>

        <div className="flex items-center space-x-3 text-xs">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-md hover:bg-[#161D2D] text-[#9AA0A6] hover:text-white font-medium transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/app/org/acme/overview"
            className="px-3.5 py-1.5 rounded bg-[#1A73E8] hover:bg-[#8AB4F8] text-white hover:text-[#0B0E14] font-medium shadow-sm transition-colors"
          >
            Explore Demo
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#161D2D] border border-[#202637] text-[11px] font-mono text-[#8AB4F8] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8AB4F8] animate-pulse" />
            <span>Flow v2.4 • The Enterprise Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            The operating system for modern companies.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#9AA0A6] font-normal leading-relaxed">
            Bring strategy, product, growth, operations, finance, and execution into one unified, intelligent console.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#1A73E8] hover:bg-[#8AB4F8] text-white hover:text-[#0B0E14] text-xs font-semibold shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>Start building</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/app/org/acme/overview"
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#111622] hover:bg-[#161D2D] border border-[#202637] text-[#EDF2F7] text-xs font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Demo (Acme AI)</span>
            </Link>
          </div>
        </section>

        {/* Product UI Demonstration Box */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="rounded-lg border border-[#202637] bg-[#111622] shadow-2xl overflow-hidden">
            {/* Fake OS Shell Header */}
            <div className="h-10 bg-[#0E131F] px-4 flex items-center justify-between border-b border-[#202637] text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D93025]/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E37400]/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0D904F]/70" />
                </div>
                <span className="font-mono text-[#9AA0A6] text-[11px]">console.flow.com/org/acme/overview</span>
              </div>
              <span className="text-[10px] font-mono text-[#8AB4F8] bg-[#161D2D] px-2 py-0.5 rounded border border-[#202637]">
                P95: 185ms • 99.98% SLA
              </span>
            </div>

            {/* Embedded Mini Dashboard Preview */}
            <div className="p-4 sm:p-6 space-y-4 bg-[#0B0E14]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Acme AI — Unified Company Operations</h3>
                  <span className="text-[11px] text-[#9AA0A6]">Observe → Understand → Decide → Execute → Measure</span>
                </div>
                <Badge variant="success">94% Health Index</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded bg-[#111622] border border-[#202637]">
                  <span className="text-[10px] uppercase font-mono text-[#9AA0A6]">Run-Rate ARR</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">$15,700,000</div>
                  <span className="text-[10px] text-[#81C995] font-semibold">+18.4% Outperformance</span>
                </div>

                <div className="p-3.5 rounded bg-[#111622] border border-[#202637]">
                  <span className="text-[10px] uppercase font-mono text-[#9AA0A6]">Net Retention Rate</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">134%</div>
                  <span className="text-[10px] text-[#8AB4F8] font-semibold">142 Enterprise Accounts</span>
                </div>

                <div className="p-3.5 rounded bg-[#111622] border border-[#202637]">
                  <span className="text-[10px] uppercase font-mono text-[#9AA0A6]">Autonomous Flow AI</span>
                  <div className="text-xs text-[#EDF2F7] mt-1 font-medium line-clamp-2">
                    &ldquo;Enterprise ACV expanded to $242k following the SOC-2 audit rollout.&rdquo;
                  </div>
                  <span className="text-[10px] text-[#8AB4F8] font-mono">98% Confidence</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="platform" className="max-w-6xl mx-auto px-6 py-16 border-t border-[#202637] space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Designed with the infrastructure rigor of an institutional cloud console.
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA0A6] max-w-xl mx-auto">
              Not another toy admin dashboard. A connected operating platform designed for high scale and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:border-[#8AB4F8]/40 transition-colors">
              <CardContent className="p-6 space-y-3">
                <Compass className="w-5 h-5 text-[#8AB4F8]" />
                <h3 className="text-sm font-semibold text-white">Strategy & Execution Graph</h3>
                <p className="text-xs text-[#9AA0A6] leading-relaxed">
                  Cascading company objectives directly connected to departmental OKRs, project milestones, and engineering pull requests.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[#8AB4F8]/40 transition-colors">
              <CardContent className="p-6 space-y-3">
                <Cpu className="w-5 h-5 text-[#8AB4F8]" />
                <h3 className="text-sm font-semibold text-white">Contextual Company AI</h3>
                <p className="text-xs text-[#9AA0A6] leading-relaxed">
                  Autonomous intelligence with real-time access to company telemetry, providing evidence-backed answers and unblocking execution.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[#8AB4F8]/40 transition-colors">
              <CardContent className="p-6 space-y-3">
                <ShieldCheck className="w-5 h-5 text-[#81C995]" />
                <h3 className="text-sm font-semibold text-white">Zero-Trust Isolation & RLS</h3>
                <p className="text-xs text-[#9AA0A6] leading-relaxed">
                  Supabase PostgreSQL Row Level Security enforces multi-tenant boundaries at the database kernel. Audit logs are immutable.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#202637] py-8 px-6 bg-[#0E131F] max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9AA0A6]">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-[#1A73E8] flex items-center justify-center text-white font-bold text-[10px]">
            F
          </div>
          <span className="font-semibold text-white">Flow</span>
          <span>— The operating system for modern companies.</span>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/login" className="hover:text-white">Login</Link>
          <Link href="/onboarding" className="hover:text-white">Create Org</Link>
          <Link href="/app/org/acme/overview" className="hover:text-white">Demo System</Link>
        </div>
      </footer>
    </div>
  );
}
