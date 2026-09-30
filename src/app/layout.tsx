import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FlowProvider } from '@/context/flow-context';
import { CommandPalette } from '@/components/navigation/command-palette';
import { GlobalCreateModal } from '@/components/navigation/global-create-modal';
import { ShortcutsModal } from '@/components/navigation/shortcuts-modal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flow — The Operating System for Modern Companies',
  description:
    'Bring strategy, product, growth, operations, finance, and execution into one intelligent enterprise workspace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full bg-[#070A0F] text-slate-100 antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#070A0F]`}>
        <FlowProvider>
          {children}
          <CommandPalette />
          <GlobalCreateModal />
          <ShortcutsModal />
        </FlowProvider>
      </body>
    </html>
  );
}
