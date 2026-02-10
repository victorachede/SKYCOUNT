"use client";
import React, { useState, useEffect } from 'react';

export const FloorMap = ({ highlightQuery }: { highlightQuery: string }) => {
  const [cells, setCells] = useState<{id: string, intensity: number}[]>([]);
  const [status, setStatus] = useState("Connecting...");

  // ... (Keep your existing useEffect for WebSocket logic here) ...

  return (
    <div className="space-y-4"> 
      <div className="relative w-full aspect-[16/10] bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        {/* Connection Status Tag */}
        <div className="absolute top-4 right-4 z-20">
          <span className={`text-[8px] font-mono px-2 py-1 rounded border ${
            status.includes("Active") ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" : "bg-red-500/10 border-red-500/50 text-red-500"
          }`}>
            {status}
          </span>
        </div>

        {/* The Grid */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1 p-2">
          {cells.map((cell) => {
            const isHighlighted = highlightQuery && (
              cell.id.toLowerCase() === highlightQuery.toLowerCase() ||
              (highlightQuery.toLowerCase() === 'high' && cell.intensity > 80)
            );

            return (
              <div
                key={cell.id}
                className={`rounded-sm transition-all duration-300 relative group ${
                  isHighlighted ? 'ring-2 ring-white scale-110 z-10 shadow-lg opacity-100' : 'opacity-60'
                }`}
                style={{
                  backgroundColor: 
                    cell.intensity > 85 ? '#ef4444' : // High
                    cell.intensity > 60 ? '#f59e0b' : // Medium
                    cell.intensity > 30 ? '#10b981' : '#27272a' // Low / Empty
                }}
              />
            );
          })}
        </div>
      </div>

      {/* --- THE HEATMAP LEGEND --- */}
      <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]"></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Critical (85%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Moderate (60%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Safe (30%+)</span>
          </div>
        </div>
        
        <div className="hidden md:block">
           <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">
             Spatial Data Updated via YOLOv8
           </span>
        </div>
      </div>
    </div>
  );
};