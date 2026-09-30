'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import { Check, ArrowRight, ArrowLeft, Building2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function OnboardingPage() {
  const router = useRouter();
  const { createOrganization, theme, setTheme } = useFlow();

  const [step, setStep] = useState(1);
  const totalSteps = 10;

  // Onboarding state
  const [orgName, setOrgName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('Startup');
  const [teamSize, setTeamSize] = useState('1-10');
  const [role, setRole] = useState('Founder');
  const [goals, setGoals] = useState<string[]>([]);
  const [teamInvites, setTeamInvites] = useState('');
  const [workspaceConfig, setWorkspaceConfig] = useState('Enterprise Multi-Department (Engineering, Sales, Finance, AI)');

  const stages = ['Idea', 'Pre-launch', 'Startup', 'Growth', 'Scale-up', 'Enterprise'];
  const roles = [
    'Founder', 'CEO', 'Co-Founder', 'CTO', 'COO', 'CMO', 'CFO',
    'Product', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations', 'HR', 'Designer', 'Other'
  ];
  const goalOptions = [
    'Scale ARR',
    'Accelerate Engineering Velocity',
    'Unify Company Operations',
    'Improve Gross Margins & Runway',
    'SOC-2 / ISO Enterprise Compliance',
    'Automate Recurring Workflows',
  ];

  const toggleGoal = (g: string) => {
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const created = await createOrganization({
        name: orgName.trim() || 'My Organization',
        industry: industry.trim() || 'Technology',
        stage: (stage as any) || 'Startup',
        teamSize: teamSize || '1-10',
        description: description.trim(),
      });
      router.push(`/app/org/${created.slug}/overview`);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between p-6 sm:p-12 text-[var(--color-text)] transition-colors">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-semibold tracking-wider text-sm">Flow Console</span>
        </div>
        <div className="text-xs font-mono text-[var(--color-text-secondary)]">
          Step <span className="text-[#1A73E8] font-bold">{step}</span> of {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto w-full my-4">
        <div className="w-full h-1 bg-[var(--color-surface)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1A73E8] rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Card */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center py-6">
        <Card className="border-[var(--color-border)]">
          <CardContent className="p-8 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <Badge variant="info">Step 1 • Identity</Badge>
                <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">What is your company or organization name?</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">This will be the root tenant for your company workspace and resource graph.</p>
                <Input
                  autoFocus
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme AI, TravelTree, Linear"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Badge variant="info">Step 2 • Web Domain</Badge>
                <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight">What is your primary company website?</h2>
                <p className="text-xs text-[#9AA0A6]">Used for verified corporate domain authorization and brand asset fetching.</p>
                <Input
                  type="url"
                  autoFocus
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Badge variant="info">Step 3 • Mission</Badge>
                <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight">What does your company do?</h2>
                <p className="text-xs text-[#9AA0A6]">Flow AI uses this description to calibrate strategic insights and resource priorities.</p>
                <textarea
                  rows={3}
                  autoFocus
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your core product, target audience, and business model..."
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[#1A73E8] resize-none"
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Badge variant="info">Step 4 • Industry</Badge>
                <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight">Select your industry category</h2>
                <Input
                  autoFocus
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Artificial Intelligence, B2B SaaS, FinTech, HealthTech"
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <Badge variant="info">Step 5 • Stage</Badge>
                <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight">What stage is your company at?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stages.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStage(s)}
                      className={`p-3 rounded-md border text-xs font-medium text-left transition-colors cursor-pointer ${
                        stage === s
                          ? 'border-[#1A73E8] bg-[#1A73E8]/20 text-[var(--color-text)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[#1A73E8]/40'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <Badge variant="info">Step 6 • Scale</Badge>
                <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight">What is your current team size?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['1-10', '10-25', '25-50', '50-100', '100-500', '500+'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setTeamSize(sz)}
                      className={`p-3 rounded-md border text-xs font-medium text-left transition-colors cursor-pointer ${
                        teamSize === sz
                          ? 'border-[#1A73E8] bg-[#1A73E8]/20 text-[var(--color-text)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[#1A73E8]/40'
                      }`}
                    >
                      {sz} employees
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                <Badge variant="info">Step 7 • Role</Badge>
                <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight">What is your role within the company?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-2 rounded-md border text-[11px] font-medium transition-colors cursor-pointer ${
                        role === r
                          ? 'border-[#1A73E8] bg-[#1A73E8]/20 text-[var(--color-text)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[#1A73E8]/40'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-4">
                <Badge variant="info">Step 8 • Priorities</Badge>
                <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight">Select your company&apos;s primary goals</h2>
                <div className="space-y-2">
                  {goalOptions.map((g) => {
                    const isChecked = goals.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGoal(g)}
                        className={`w-full p-3 rounded-md border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isChecked
                            ? 'border-[#1A73E8] bg-[#1A73E8]/20 text-[var(--color-text)]'
                            : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[#1A73E8]/40'
                        }`}
                      >
                        <span>{g}</span>
                        {isChecked && <Check className="w-4 h-4 text-[#8AB4F8]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="space-y-4">
                <Badge variant="info">Step 9 • Collaboration</Badge>
                <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight">Invite your leadership & team members</h2>
                <p className="text-xs text-[#9AA0A6]">Comma-separated emails. Invitations will be dispatched with single-click OAuth entry.</p>
                <textarea
                  rows={3}
                  value={teamInvites}
                  onChange={(e) => setTeamInvites(e.target.value)}
                  placeholder="cto@company.com, headofproduct@company.com"
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[#1A73E8] resize-none font-mono"
                />
              </div>
            )}

            {step === 10 && (
              <div className="space-y-4">
                <Badge variant="info">Step 10 • Configuration</Badge>
                <h2 className="text-xl font-semibold text-[#EDF2F7] tracking-tight">Choose your workspace layout</h2>
                <div className="space-y-2">
                  {[
                    'Enterprise Multi-Department (Engineering, Sales, Finance, AI)',
                    'Product-Led Tech Startup (Product, Dev, GTM)',
                    'Strategic Executive Suite (Goals, OKRs, Financials, Audits)',
                  ].map((conf) => (
                    <button
                      key={conf}
                      type="button"
                      onClick={() => setWorkspaceConfig(conf)}
                      className={`w-full p-3 rounded-md border text-xs font-medium flex items-center justify-between text-left transition-colors cursor-pointer ${
                        workspaceConfig === conf
                          ? 'border-[#1A73E8] bg-[#1A73E8]/20 text-[var(--color-text)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[#1A73E8]/40'
                      }`}
                    >
                      <span>{conf}</span>
                      {workspaceConfig === conf && <Check className="w-4 h-4 text-[#8AB4F8]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
              <Button
                type="button"
                variant="secondary"
                disabled={step === 1}
                onClick={handleBack}
                size="sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                size="sm"
              >
                <span>{step === totalSteps ? 'Launch Operating System' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto w-full text-center text-[11px] text-[var(--color-text-secondary)] font-mono">
        Flow Enterprise Multi-Tenant Infrastructure • Encrypted in Transit & at Rest
      </div>
    </div>
  );
}
