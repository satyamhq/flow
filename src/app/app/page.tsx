'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';

export default function AppPage() {
  const router = useRouter();
  const { isAuthenticated, isLoadingAuth, currentOrg, organizations } = useFlow();

  useEffect(() => {
    if (isLoadingAuth) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (organizations.length === 0) {
      router.replace('/onboarding');
      return;
    }

    // Redirect to user's current (or first) organization
    const orgSlug = currentOrg?.slug || organizations[0]?.slug;
    if (orgSlug) {
      router.replace(`/app/org/${orgSlug}/overview`);
    } else {
      router.replace('/onboarding');
    }
  }, [isAuthenticated, isLoadingAuth, currentOrg, organizations, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded bg-[#1A73E8] flex items-center justify-center text-white font-bold text-sm animate-pulse">
          F
        </div>
        <span className="text-sm text-[var(--text-secondary)]">Loading your workspace...</span>
      </div>
    </div>
  );
}
