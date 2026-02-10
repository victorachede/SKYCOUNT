"use client";

import React, { useState } from 'react';
import { Cpu, Save, RefreshCcw, ShieldCheck, Check } from 'lucide-react';

export default function AIConfigPage() {
  const [confidence, setConfidence] = useState(75);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  const [toggles, setToggles] = useState({
    faceBlurring: true,
    heatmapGen: false,
    objectTracking: true
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-start border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">AI Model Configuration</h1>
          <p className="text-zinc-500 text-sm mt-1">Adjust detection parameters and model sensitivity.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
            saveStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
          }`}
        >
          {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : 
           saveStatus === 'success' ? <Check size={16} /> : <Save size={16} />}
          {isSaving ? 'Updating...' : saveStatus === 'success' ? 'Applied' : 'Save Changes'}
        </button>
      </div>

      <div className="grid gap-6">
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-sm text-zinc-300 font-medium">Confidence Threshold</label>
              <span className="text-sm font-mono text-emerald-500">{confidence}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(toggles).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-zinc-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <div 
                  onClick={() => handleToggle(key as keyof typeof toggles)}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-emerald-600' : 'bg-zinc-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${value ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}