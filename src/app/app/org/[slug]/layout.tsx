import React from 'react';
import { Topbar } from '@/components/navigation/topbar';
import { Sidebar } from '@/components/navigation/sidebar';

export default function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070A0F] flex flex-col text-slate-100">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#070A0F] custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
