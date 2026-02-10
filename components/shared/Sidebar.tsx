"use client";
import React from 'react';
import { LayoutDashboard, Map, Database, Cpu, Settings, Crosshair } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Overview', icon: LayoutDashboard, href: '/' },
  { name: 'Heatmap', icon: Map, href: '/heatmap' },
  { name: 'Logs', icon: Database, href: '/logs' },
  { name: 'AI Config', icon: Cpu, href: '/ai' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-zinc-900 border-r border-white/5 h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
            <Crosshair className="text-zinc-900 w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">SkyCount</span>
        </div>

        <nav className="space-y-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <link.icon size={16} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-white/5">
        <div className="text-[10px] font-mono text-zinc-600 uppercase mb-2">Connectivity</div>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>UAV_01</span>
          <span className="text-emerald-500 font-bold">Connected</span>
        </div>
      </div>
    </aside>
  );
};