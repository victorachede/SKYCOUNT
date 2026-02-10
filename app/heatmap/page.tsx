"use client";
import React, { useEffect, useState, useRef } from 'react';
import { LayoutGrid, Info, Layers, Maximize2, Map as MapIcon, Video } from 'lucide-react';

export default function HeatmapPage() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [hoveredSector, setHoveredSector] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'video'>('heatmap');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = Array.from({ length: 64 }, (_, i) => ({
      id: i,
      intensity: Math.floor(Math.random() * 100),
      label: `Sector ${String.fromCharCode(65 + Math.floor(i / 8))}${i % 8 + 1}`,
      occupancy: Math.floor(Math.random() * 45)
    }));
    setSectors(data);
  }, []);

  // Fullscreen Logic
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-3">
            <MapIcon className="text-zinc-400" size={24} />
            Spatial Density Analytics
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {viewMode === 'heatmap' ? 'Generating density grid...' : 'Live UAV stream enabled'} • <span className="text-emerald-500">Active</span>
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* Layer Toggle Button */}
          <button 
            onClick={() => setViewMode(viewMode === 'heatmap' ? 'video' : 'heatmap')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${
              viewMode === 'video' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Toggle View Mode"
          >
            {viewMode === 'heatmap' ? <Video size={18} /> : <LayoutGrid size={18} />}
            <span className="text-xs font-medium uppercase tracking-wider">{viewMode === 'heatmap' ? 'Video' : 'Map'}</span>
          </button>

          {/* Fullscreen Button */}
          <button 
            onClick={toggleFullscreen}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-md border border-zinc-800 text-zinc-400 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3" ref={containerRef}>
          <div className="relative aspect-square md:aspect-video w-full bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            
            {viewMode === 'heatmap' ? (
              /* Heatmap View */
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-px bg-zinc-800/50 p-1 animate-in fade-in zoom-in-95 duration-500">
                {sectors.map((sector) => (
                  <div 
                    key={sector.id}
                    onMouseEnter={() => setHoveredSector(sector)}
                    onMouseLeave={() => setHoveredSector(null)}
                    className="relative transition-all duration-500 cursor-crosshair"
                    style={{
                      backgroundColor: 
                        sector.intensity > 80 ? '#7f1d1d' : 
                        sector.intensity > 50 ? '#92400e' : 
                        sector.intensity > 20 ? '#064e3b' : '#09090b'
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Video View Placeholder */
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 animate-in fade-in duration-500">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                    <Video className="text-zinc-600 animate-pulse" size={32} />
                  </div>
                  <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Awaiting UAV_01 Stream Link...</p>
                </div>
              </div>
            )}

            {/* Subtle Overlay (Fullscreen Mode Only) */}
            <div className="absolute top-4 left-4 pointer-events-none">
               <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10">
                  <p className="text-[10px] font-mono text-emerald-500 tracking-tighter">REC ● 1080P_UAV_01</p>
               </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar (Remains functional) */}
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} />
              Sector Details
            </h3>
            {hoveredSector ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-1">
                <div>
                  <p className="text-2xl font-bold text-white">{hoveredSector.label}</p>
                  <p className="text-xs text-zinc-500">Intensity: {hoveredSector.intensity}%</p>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 uppercase">Est. Persons</p>
                  <p className="text-lg font-mono text-emerald-500">{hoveredSector.occupancy}</p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-zinc-600 italic">Select sector for telemetry</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}