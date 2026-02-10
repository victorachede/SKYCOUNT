"use client";
import React, { useEffect, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';

export const Header = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/5 transition-colors">
      <div className="flex items-center gap-4">
        {/* MOBILE MENU TOGGLE */}
        <button className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
          <Menu size={20} className="text-zinc-500 dark:text-zinc-400" />
        </button>
        
        <div className="hidden lg:block">
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">SkyCount Systems</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* LIVE STATUS INDICATOR */}
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 rounded-full border border-emerald-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-tighter">
            Inference Live
          </span>
        </div>

        <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-white/10 pl-4">
          {/* NOTIFICATION LINK */}
          <Link 
            href="/notifications" 
            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg relative transition-colors"
          >
            <Bell size={18} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-zinc-950"></span>
          </Link>
        </div>
      </div>
    </header>
  );
};