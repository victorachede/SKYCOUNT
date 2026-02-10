"use client";
import React, { useState } from 'react';
import { Users, UserCheck, Baby, Zap, Battery, Signal, Search } from 'lucide-react';
import { FloorMap } from '@/components/heatmap/FloorMap';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const allStats = [
    { label: 'Total Count', val: '1,284', icon: Users, color: 'text-white' },
    { label: 'Adults', val: '842', icon: UserCheck, color: 'text-zinc-400' },
    { label: 'Youth/Kids', val: '442', icon: Baby, color: 'text-zinc-400' },
    { label: 'Inference Speed', val: '12ms', icon: Zap, color: 'text-cyan-500' },
  ];

  const filteredStats = allStats.filter(stat => 
    stat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* SINGLE MASTER SEARCH */}
      <div className="relative max-w-xl mx-auto lg:mx-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          type="text"
          placeholder="Search stats or coordinates (e.g. 'Adults', 'A5', 'High')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-2xl transition-all"
        />
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filteredStats.map((stat) => (
          <div key={stat.label} className="p-6 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* MAP & HARDWARE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Live Spatial Distribution</h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-bold">ACTIVE_VIEW</span>
          </div>
          <FloorMap highlightQuery={searchQuery} />
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Hardware Status</h3>
          <div className="space-y-3">
             {/* Battery & Signal bars as before... */}
             <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Battery size={14} className="text-emerald-500" />
                  <span className="text-xs font-medium uppercase text-zinc-400">UAV Battery</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-500">82%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}