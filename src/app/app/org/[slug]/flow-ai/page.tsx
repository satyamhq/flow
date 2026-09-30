'use client';

import React, { useState } from 'react';
import { useFlow } from '@/context/flow-context';
import { Bot, Send, Sparkles, Shield, Cpu, RefreshCw, Database } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function FlowAIPage() {
  const { currentOrg, askFlowAI } = useFlow();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      content: `Hello Satyam. I am Flow AI, connected to the live operating telemetry of **${currentOrg.name}**. I have verified your role as **Founder & CEO** with full access to Strategy, Engineering, CRM, Customers, and Financial ledgers. How can I assist your executive operations today?`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'What is our current Run-Rate ARR and net margin?',
    'Which projects or tasks are currently at risk or blocked?',
    'Summarize our engineering release velocity and latency.',
    'Prepare an executive summary for this week.',
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askFlowAI(prompt);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        content: response,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col justify-between">
      <PageHeader
        breadcrumbs={[
          { label: 'Flow Console', href: '/app/org/acme' },
          { label: 'Intelligence & AI', href: '#' },
          { label: 'Flow AI' },
        ]}
        title="Flow Autonomous Intelligence"
        description="Unified enterprise knowledge reasoning across PostgreSQL tables, documents, financial ledgers, and telemetry."
        badge={<Badge variant="info">Provider: Google Gemini / Anthropic</Badge>}
        actions={
          <Badge variant="neutral">
            <Database className="w-3.5 h-3.5 mr-1 text-[#8AB4F8]" />
            Tenant Isolated (RLS)
          </Badge>
        }
      />

      {/* Chat Messages Feed */}
      <Card className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-3 text-xs leading-relaxed ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded bg-[#1A73E8]/20 border border-[#1A73E8]/40 flex items-center justify-center text-[#8AB4F8] flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-md shadow-sm space-y-1.5 ${
                m.sender === 'user'
                  ? 'bg-[#1A73E8] text-white rounded-br-none'
                  : 'bg-[var(--surface-base)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed font-sans">{m.content}</div>
              <span className={`block text-[10px] font-mono ${m.sender === 'user' ? 'text-blue-200' : 'text-[var(--text-secondary)]'}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-[#8AB4F8] py-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Flow AI is querying company telemetry and synthesizing response...</span>
          </div>
        )}
      </Card>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 pt-1">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-[11px] px-3 py-1.5 rounded bg-[var(--surface-base)] border border-[var(--border)] hover:border-[#8AB4F8]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2 bg-[var(--surface-base)] border border-[var(--border)] rounded-md p-2 focus-within:border-[#1A73E8] transition-colors"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Flow AI about revenue, engineering blockers, strategy, or customers..."
          className="flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder-[#5F6368] px-3 py-1.5 focus:outline-none"
        />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={!input.trim() || loading}
          className="h-8 px-3"
        >
          <Send className="w-3.5 h-3.5 mr-1" />
          Send
        </Button>
      </form>
    </div>
  );
}
