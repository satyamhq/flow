import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FlowProvider } from '@/context/flow-context';
import { CommandPalette } from '@/components/navigation/command-palette';
import { GlobalCreateModal } from '@/components/navigation/global-create-modal';
import { ShortcutsModal } from '@/components/navigation/shortcuts-modal';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#070A0F' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://flow.enterprise.io'),
  title: 'Flow — The Operating System for Modern Companies',
  description:
    'Flow brings projects, people, customers, operations, finance, analytics, AI, and integrations into one connected company operating system.',
  keywords: [
    'company operating system',
    'enterprise SaaS',
    'project management',
    'CRM',
    'financial telemetry',
    'Supabase PostgreSQL',
    'business intelligence',
    'Flow AI',
  ],
  authors: [{ name: 'Flow Systems Inc.' }],
  creator: 'Flow Core Engineering',
  publisher: 'Flow Systems Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Flow — The Operating System for Modern Companies',
    description:
      'Run your entire company from one place. Flow brings strategy, execution, finance, operations, and AI into one unified console.',
    url: 'https://flow.enterprise.io',
    siteName: 'Flow Enterprise Console',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flow — The Operating System for Modern Companies',
    description:
      'Run your entire company from one place. Projects, customers, finance, operations, and AI unified in one console.',
    creator: '@flow_os',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://flow.enterprise.io',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${inter.className} min-h-full flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors`}>
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
