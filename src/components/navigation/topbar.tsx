'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/flow-context';
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  ChevronDown,
  Check,
  Building2,
  User,
  Shield,
  CreditCard,
  Key,
  LogOut,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Topbar() {
  const router = useRouter();
  const {
    currentOrg,
    organizations,
    currentUser,
    switchOrganization,
    setIsSearchOpen,
    setIsCreateOpen,
    setIsShortcutsOpen,
    setCreateType,
  } = useFlow();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Revenue milestone reached: $15.7M ARR', time: '10m ago', unread: true },
    { id: 2, title: 'Task assigned: Verify RLS partition policies', time: '1h ago', unread: true },
    { id: 3, title: 'Deployment #452 succeeded in 42s', time: '3h ago', unread: false },
  ];

  return (
    <header className="h-12 bg-[#0E131F] border-b border-[#202637] flex items-center justify-between px-4 sticky top-0 z-40 select-none text-[#EDF2F7]">
      {/* Left: Brand Mark & Org Switcher */}
      <div className="flex items-center space-x-3">
        <Link
          href={`/app/org/${currentOrg.slug}/overview`}
          className="flex items-center space-x-2 text-[#EDF2F7] font-semibold text-sm tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="w-6 h-6 rounded bg-[#1A73E8] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            F
          </div>
          <span className="font-bold tracking-wider text-xs">FLOW</span>
        </Link>

        <span className="text-[#303B54] font-light text-xs">/</span>

        {/* Organization Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#161D2D] hover:bg-[#1C2438] border border-[#202637] text-xs font-medium text-[#EDF2F7] transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#8AB4F8]" />
            <span className="max-w-[130px] truncate">{currentOrg.name}</span>
            <ChevronDown className="w-3 h-3 text-[#9AA0A6]" />
          </button>

          {isOrgDropdownOpen && (
            <div
              className="absolute left-0 mt-1 w-64 rounded-lg bg-[#111622] border border-[#202637] shadow-xl py-1 z-50 text-xs animate-in fade-in"
              onMouseLeave={() => setIsOrgDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[#9AA0A6] uppercase tracking-wider">
                Organizations
              </div>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    switchOrganization(org.slug);
                    setIsOrgDropdownOpen(false);
                    router.push(`/app/org/${org.slug}/overview`);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#161D2D] text-[#EDF2F7] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded bg-[#181E2E] border border-[#202637] flex items-center justify-center text-[10px] text-[#8AB4F8] font-bold">
                      {org.name.charAt(0)}
                    </div>
                    <span className="truncate">{org.name}</span>
                  </div>
                  {org.id === currentOrg.id && <Check className="w-3.5 h-3.5 text-[#1A73E8]" />}
                </button>
              ))}

              <div className="border-t border-[#181E2E] my-1" />

              <button
                onClick={() => {
                  setIsOrgDropdownOpen(false);
                  router.push('/onboarding');
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-[#161D2D] text-[#8AB4F8] font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create organization</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar (⌘K) */}
      <div className="flex-1 max-w-lg mx-6">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-[#111622] border border-[#202637] hover:border-[#303B54] text-[#9AA0A6] text-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-2.5">
            <Search className="w-3.5 h-3.5 text-[#9AA0A6] group-hover:text-[#8AB4F8] transition-colors" />
            <span className="text-[#9AA0A6] group-hover:text-[#EDF2F7]">Search resources, commands...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#9AA0A6] bg-[#0E131F] rounded border border-[#202637]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Create, Shortcuts, Notifications, Profile */}
      <div className="flex items-center space-x-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setCreateType('task');
            setIsCreateOpen(true);
          }}
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span>Create</span>
        </Button>

        <Button
          variant="icon"
          size="sm"
          onClick={() => setIsShortcutsOpen(true)}
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="icon"
            size="sm"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
          </Button>

          {isNotificationsOpen && (
            <div
              className="absolute right-0 mt-1.5 w-80 rounded-lg bg-[#111622] border border-[#202637] shadow-xl py-2 z-50 text-xs animate-in fade-in"
              onMouseLeave={() => setIsNotificationsOpen(false)}
            >
              <div className="flex items-center justify-between px-3 py-1 border-b border-[#181E2E] pb-2">
                <span className="font-semibold text-[#EDF2F7]">Notifications</span>
                <span className="text-[10px] text-[#8AB4F8] cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-[#181E2E] max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#161D2D] transition-colors cursor-pointer flex items-start space-x-2">
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] mt-1 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-[#EDF2F7] text-xs leading-snug">{n.title}</p>
                      <span className="text-[10px] text-[#9AA0A6]">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-1.5 p-1 rounded hover:bg-[#161D2D] transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-5 h-5 rounded-full border border-[#303B54] object-cover"
            />
            <ChevronDown className="w-3 h-3 text-[#9AA0A6]" />
          </button>

          {isProfileDropdownOpen && (
            <div
              className="absolute right-0 mt-1.5 w-60 rounded-lg bg-[#111622] border border-[#202637] shadow-xl py-2 z-50 text-xs animate-in fade-in"
              onMouseLeave={() => setIsProfileDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#181E2E]">
                <p className="font-semibold text-[#EDF2F7]">{currentUser.fullName}</p>
                <p className="text-[#9AA0A6] text-[11px] truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-[rgba(26,115,232,0.14)] text-[#8AB4F8] border border-[rgba(26,115,232,0.3)]">
                  {currentUser.title}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href={`/app/org/${currentOrg.slug}/my-work`}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-[#EDF2F7] hover:bg-[#161D2D]"
                >
                  <User className="w-3.5 h-3.5 text-[#9AA0A6]" />
                  <span>My work</span>
                </Link>
                <Link
                  href={`/app/org/${currentOrg.slug}/admin?tab=security`}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-[#EDF2F7] hover:bg-[#161D2D]"
                >
                  <Shield className="w-3.5 h-3.5 text-[#9AA0A6]" />
                  <span>Security & IAM</span>
                </Link>
                <Link
                  href={`/app/org/${currentOrg.slug}/admin?tab=billing`}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-[#EDF2F7] hover:bg-[#161D2D]"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#9AA0A6]" />
                  <span>Billing & Subscriptions</span>
                </Link>
                <Link
                  href={`/app/org/${currentOrg.slug}/settings`}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-[#EDF2F7] hover:bg-[#161D2D]"
                >
                  <Key className="w-3.5 h-3.5 text-[#9AA0A6]" />
                  <span>Settings & API Keys</span>
                </Link>
              </div>

              <div className="border-t border-[#181E2E] my-1" />

              <Link
                href="/login"
                className="flex items-center space-x-2 px-3 py-1.5 text-[#EA4335] hover:bg-[rgba(217,48,37,0.1)]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
