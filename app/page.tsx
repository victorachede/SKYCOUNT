"use client";
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Baby, Zap, Battery, Signal, Search } from 'lucide-react';
import { FloorMap } from '@/components/heatmap/FloorMap';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    adults: 0,
    kids: 0,
    inference: '12ms'
  });

  useEffect(() => {
    // 1. Initial Data Fetch (on page load)
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('occupancy_logs')
        .select('count, adults, kids')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Supabase Error:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setStats(prev => ({
          ...prev,
          total: data[0].count,
          adults: data[0].adults,
          kids: data[0].kids
        }));
      }
    };

    fetchInitialData();

    // 2. Real-time Subscription (listen for Python script inserts)
    const channel = supabase
      .channel('realtime_dashboard')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'occupancy_logs' },
        (payload) => {
          console.log('Real-time update received:', payload.new);
          setStats(prev => ({
            ...prev,
            total: payload.new.count,
            adults: payload.new.adults,
            kids: payload.new.kids
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const allStats = [
    { label: 'Total Count', val: stats.total.toLocaleString(), icon: Users, color: 'text-white', live: true },
    { label: 'Adults', val: stats.adults.toLocaleString(), icon: UserCheck, color: 'text-zinc-400', live: true },
    { label: 'Youth/Kids', val: stats.kids.toLocaleString(), icon: Baby, color: 'text-zinc-400', live: true },
    { label: 'Inference Speed', val: stats.inference, icon: Zap, color: 'text-cyan-500', live: false },
  ];

  const filteredStats = allStats.filter(stat => 
    stat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* SEARCH SECTION */}
      <div className="relative max-w-xl mx-auto lg:mx-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          type="text"
          placeholder="Search stats (e.g. 'Adults', 'Total')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-2xl transition-all"
        />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filteredStats.map((stat) => (
          <div key={stat.label} className="p-6 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <stat.icon size={16} className={`${stat.color} group-hover:scale-110 transition-transform`} />
            </div>
            <p className={`text-3xl font-bold tracking-tight ${stat.live ? 'text-white' : ''}`}>
              {stat.val}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* HEATMAP / FLOORPLAN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              Live Spatial Distribution
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-bold uppercase tracking-tighter">
              Active_Feed
            </span>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden p-2">
            <FloorMap highlightQuery={searchQuery} />
          </div>
        </div>

        {/* HARDWARE STATUS */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">System Vitals</h3>
          <div className="space-y-4">
            {/* UAV Battery Card */}
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

            {/* Signal Strength Card */}
            <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Signal size={14} className="text-cyan-500" />
                  <span className="text-xs font-medium uppercase text-zinc-400">Uplink Quality</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-500">94ms</span>
              </div>
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div key={bar} className={`flex-1 rounded-full ${bar <= 4 ? 'bg-cyan-500' : 'bg-white/5'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}