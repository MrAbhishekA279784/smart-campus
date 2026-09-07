import React, { useState } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface FloatingAiCopilotProps {
  onOpenAction?: (action: string) => void;
}

export const FloatingAiCopilot: React.FC<FloatingAiCopilotProps> = ({ onOpenAction }) => {
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string; sources?: string[] }[]>([
    {
      sender: 'bot',
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm your AI Campus Copilot for Sathaye College. Ask me about your timetable, attendance percentage, canteen menu, pending assignments, or campus room navigation!`,
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'What is my next class?',
    'What is my attendance?',
    'Show Canteen menu specials',
    'Where is Lab 3 located?',
  ];

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || inputVal).trim();
    if (!q) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: q }];
    setMessages(newMsgs);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await api.ai.chat(
        q,
        user?.id || 'db49e49e-6575-47ce-8c4e-77fbe86c5284',
        user?.name || 'Abhishek Gupta'
      );
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.reply,
          sources: res.sources
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `I'm having a little trouble reaching the campus server. Please try again in a moment.`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      id="floating-ai-campus-copilot"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto"
    >
      {/* Expanded Floating Chat Panel */}
      {chatOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Panel Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">AI Campus Copilot</h4>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Sathaye Live Intelligence
                </p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 max-h-72 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-1.5 pt-1 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="font-medium">Source:</span> {m.sources.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400 italic">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 animate-spin" />
                </div>
                <span>Checking live campus database...</span>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[11px] text-slate-600 border border-slate-200/60 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about timetable, rooms, canteen..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
            <button
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Assistant Trigger & Greeting Bubble */}
      <div className="flex items-center gap-3">
        {!chatOpen && (
          <div
            onClick={() => setChatOpen(true)}
            className="cursor-pointer bg-white rounded-2xl py-3 px-4 shadow-xl border border-slate-200/90 text-left relative max-w-xs transition-transform hover:scale-[1.02] active:scale-95 group"
          >
            <p className="text-xs font-bold text-slate-900 leading-tight">
              Hi! I'm your AI Campus Copilot.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Ask me anything about Sathaye College
            </p>

            {/* Little speech bubble triangular pointer */}
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-slate-200/90 rotate-45" />
          </div>
        )}

        {/* 3D Robot / Orb Avatar with Glowing Rings */}
        <button
          id="ai-copilot-bubble-btn"
          onClick={() => setChatOpen(!chatOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white border-2 border-white transition-transform hover:scale-105 active:scale-95 group cursor-pointer"
          aria-label="Toggle AI Campus Copilot"
        >
          <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-7 h-5 rounded-md bg-slate-950 flex items-center justify-around px-1 shadow-inner border border-blue-400/40">
              <span className="w-1 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform animate-pulse" />
              <span className="w-1 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform animate-pulse" />
            </div>
            <Sparkles className="w-3 h-3 text-cyan-300 absolute -top-1.5 -right-1.5" />
          </div>
        </button>
      </div>
    </div>
  );
};
