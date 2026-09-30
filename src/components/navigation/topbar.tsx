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
  Sun,
  Moon,
  Laptop,
  Inbox,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    theme,
    setTheme,
    signOut,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useFlow();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await signOut();
    router.push('/login');
  };

  return (
    <header className="h-12 bg-[var(--surface-header)] border-b border-[var(--border)] flex items-center justify-between px-3 sm:px-4 sticky top-0 z-40 select-none text-[var(--text-primary)] transition-colors">
      {/* Left: Mobile Menu Toggle + Brand Mark + Org Switcher */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile Hamburger (screens < 1024px) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 rounded-md hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
          title="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Brand Mark */}
        <Link
          href={`/app/org/${currentOrg.slug}/overview`}
          className="flex items-center space-x-2 font-semibold text-sm tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="w-6 h-6 rounded bg-[#1A73E8] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            F
          </div>
          <span className="font-bold tracking-wider text-xs hidden sm:inline-block">FLOW</span>
        </Link>

        <span className="text-[var(--border)] font-light text-xs hidden sm:inline-block">/</span>

        {/* Organization Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-2.5 py-1 rounded bg-[var(--surface-elevated)] hover:bg-[var(--surface-subtle)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span className="max-w-[100px] sm:max-w-[140px] truncate">{currentOrg.name}</span>
            <ChevronDown className="w-3 h-3 text-[var(--text-secondary)]" />
          </button>

          {isOrgDropdownOpen && (
            <div
              className="absolute left-0 mt-1 w-64 rounded-lg bg-[var(--surface-base)] border border-[var(--border)] shadow-xl py-1 z-50 text-xs animate-in fade-in"
              onMouseLeave={() => setIsOrgDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
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
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center text-[10px] text-[#1A73E8] font-bold">
                      {org.name.charAt(0)}
                    </div>
                    <span className="truncate">{org.name}</span>
                  </div>
                  {org.id === currentOrg.id && <Check className="w-3.5 h-3.5 text-[#1A73E8]" />}
                </button>
              ))}

              <div className="border-t border-[var(--border-subtle)] my-1" />

              <button
                onClick={() => {
                  setIsOrgDropdownOpen(false);
                  router.push('/onboarding');
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-[var(--surface-elevated)] text-[#1A73E8] font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create organization</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar (⌘K) */}
      <div className="flex-1 max-w-lg mx-2 sm:mx-6">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-[var(--surface-base)] border border-[var(--border)] hover:border-[#1A73E8] text-[var(--text-secondary)] text-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[#1A73E8] transition-colors flex-shrink-0" />
            <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] truncate">
              Search resources, commands...
            </span>
          </div>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--surface-elevated)] rounded border border-[var(--border)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Theme Selector, Quick Create, Shortcuts, Notifications, User Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Theme Selector (Light / Dark / System) */}
        <div className="relative">
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="p-1.5 rounded-md hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1"
            aria-label="Select color theme"
            title={`Current theme: ${theme}`}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-[#8AB4F8]" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-[#FBBC04]" />
            ) : (
              <Laptop className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
            <ChevronDown className="w-2.5 h-2.5 opacity-60 hidden sm:inline-block" />
          </button>

          {isThemeMenuOpen && (
            <div
              className="absolute right-0 mt-1.5 w-36 rounded-lg bg-[var(--surface-base)] border border-[var(--border)] shadow-xl py-1 z-50 text-xs animate-in fade-in"
              onMouseLeave={() => setIsThemeMenuOpen(false)}
            >
              <div className="px-3 py-1 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Theme
              </div>
              <button
                onClick={() => {
                  setTheme('light');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer ${
                  theme === 'light' ? 'text-[#1A73E8] font-semibold' : 'text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-[#FBBC04]" />
                  <span>Light</span>
                </div>
                {theme === 'light' && <Check className="w-3 h-3 text-[#1A73E8]" />}
              </button>

              <button
                onClick={() => {
                  setTheme('dark');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer ${
                  theme === 'dark' ? 'text-[#1A73E8] font-semibold' : 'text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5 text-[#8AB4F8]" />
                  <span>Dark</span>
                </div>
                {theme === 'dark' && <Check className="w-3 h-3 text-[#1A73E8]" />}
              </button>

              <button
                onClick={() => {
                  setTheme('system');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer ${
                  theme === 'system' ? 'text-[#1A73E8] font-semibold' : 'text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Laptop className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>System</span>
                </div>
                {theme === 'system' && <Check className="w-3 h-3 text-[#1A73E8]" />}
              </button>
            </div>
          )}
        </div>

        {/* Quick Create Action */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setCreateType('task');
            setIsCreateOpen(true);
          }}
          className="hidden sm:inline-flex"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span>Create</span>
        </Button>

        {/* Shortcuts Cheat Sheet */}
        <Button
          variant="icon"
          size="sm"
          onClick={() => setIsShortcutsOpen(true)}
          title="Keyboard Shortcuts (?)"
          className="hidden md:inline-flex"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </Button>

        {/* Notifications Popover */}
        <div className="relative">
          <Button
            variant="icon"
            size="sm"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
            )}
          </Button>

          {isNotificationsOpen && (
            <div
              className="absolute right-0 mt-1.5 w-80 rounded-lg bg-[var(--surface-base)] border border-[var(--border)] shadow-xl py-2 z-50 text-xs animate-in fade-in"
              onMouseLeave={() => setIsNotificationsOpen(false)}
            >
              <div className="flex items-center justify-between px-3 py-1 border-b border-[var(--border-subtle)] pb-2">
                <span className="font-semibold text-[var(--text-primary)]">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-[#1A73E8] cursor-pointer hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-[var(--border-subtle)] max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-secondary)] space-y-1">
                    <Inbox className="w-5 h-5 mx-auto text-[var(--text-muted)]" />
                    <p className="font-medium text-[var(--text-primary)]">You&apos;re all caught up.</p>
                    <p className="text-[10px] text-[var(--text-muted)]">No pending alerts</p>
                  </div>
                ) : (
                  notifications.map((n: any) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer flex items-start space-x-2 ${
                        !n.read ? 'bg-[var(--primary-subtle)]' : ''
                      }`}
                    >
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] mt-1 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-[var(--text-primary)] text-xs leading-snug">{n.title}</p>
                        <span className="text-[10px] text-[var(--text-muted)]">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-1.5 p-1 rounded hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-[#1A73E8] flex items-center justify-center text-white text-[10px] font-bold">
              {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
            </div>
            <ChevronDown className="w-3 h-3 text-[var(--text-secondary)]" />
          </button>

          {isProfileDropdownOpen && (
            <div
              className="absolute right-0 mt-1.5 w-64 rounded-lg bg-[var(--surface-base)] border border-[var(--border)] shadow-xl py-2 z-50 text-xs animate-in fade-in"
              onMouseLeave={() => setIsProfileDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                <p className="font-semibold text-[var(--text-primary)]">{currentUser.fullName}</p>
                <p className="text-[var(--text-secondary)] text-[11px] truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[var(--primary-subtle)] text-[#1A73E8] border border-[rgba(26,115,232,0.3)]">
                  {currentUser.title || 'Administrator'}
                </span>
              </div>

              {/* Theme option inside profile menu */}
              <div className="px-3 py-2 border-b border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                  Appearance
                </span>
                <div className="grid grid-cols-3 gap-1 bg-[var(--surface-elevated)] p-1 rounded-md border border-[var(--border)]">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-1 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                      theme === 'light' ? 'bg-[var(--surface-base)] text-[#1A73E8] font-bold shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-1 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                      theme === 'dark' ? 'bg-[var(--surface-base)] text-[#1A73E8] font-bold shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex items-center justify-center gap-1 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                      theme === 'system' ? 'bg-[var(--surface-base)] text-[#1A73E8] font-bold shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Laptop className="w-3 h-3" />
                    <span>Auto</span>
                  </button>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href={`/app/org/${currentOrg.slug}/my-work`}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>My work</span>
                </Link>
                <Link
                  href={`/app/org/${currentOrg.slug}/admin?tab=security`}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Security & IAM</span>
                </Link>
                <Link
                  href={`/app/org/${currentOrg.slug}/admin?tab=billing`}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Billing & Subscriptions</span>
                </Link>
                <Link
                  href={`/app/org/${currentOrg.slug}/settings`}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Settings & API Keys</span>
                </Link>
              </div>

              <div className="border-t border-[var(--border-subtle)] my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-1.5 text-[#EA4335] hover:bg-[rgba(234,67,53,0.1)] text-left cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
