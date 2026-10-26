'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, X, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
export const FloatingAIAssistant = () => {
    const pathname = usePathname();
    const [isDismissed, setIsDismissed] = useState(false);
    // Don't show floating widget if already on the dedicated AI assistant page
    if (pathname === '/ai-assistant')
        return null;
    return (<aside aria-label="AI Assistant" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Floating Prompt Bubble */}
      {!isDismissed && (<div className="bg-white rounded-2xl shadow-lg border border-zinc-200 p-3.5 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300 relative group">
          <button onClick={() => setIsDismissed(true)} className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors cursor-pointer" aria-label="Dismiss message">
            <X className="w-3.5 h-3.5"/>
          </button>
          <div className="flex items-start gap-2.5 pr-4">
            <div className="w-8 h-8 rounded-xl bg-yellow-300 border border-yellow-400 flex items-center justify-center text-zinc-950 shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-zinc-950"/>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">Need Studio Matching?</p>
              <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">
                Draft a production brief in 60 seconds with AI.
              </p>
              <Link href="/ai-assistant" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-900 hover:underline">
                <span>Open Assistant</span>
                <ArrowRight className="w-3 h-3"/>
              </Link>
            </div>
          </div>
        </div>)}

      {/* Floating Action Button */}
      <Link href="/ai-assistant">
        <button className="h-12 px-4 rounded-full bg-zinc-900 hover:bg-black text-white shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-medium text-sm cursor-pointer border border-zinc-800" aria-label="Open AI Creative Assistant">
          <Bot className="w-4.5 h-4.5 text-yellow-300"/>
          <span className="font-semibold tracking-wide">AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
        </button>
      </Link>
    </aside>);
};
