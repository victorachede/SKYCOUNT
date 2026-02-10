"use client";
import React, { useState } from 'react';
import { 
  Globe, Shield, Bell, Smartphone, 
  ShieldCheck, Clock, Save, RefreshCw, Check
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pairingCode, setPairingCode] = useState("");
  const [toggles, setToggles] = useState({
    autoSave: true,
    twoFactor: true,
    systemDowntime: true,
    criticalCapacity: true,
    weeklyAnalytics: false
  });

  // Handle Save Simulation
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1200);
  };

  // Handle Pairing Code Generation
  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPairingCode(code);
  };

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">System Settings</h1>
          <p className="text-zinc-500 text-sm mt-1">Configure your SkyCount Pro environment and account security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 min-w-[140px] justify-center ${
            saveSuccess ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
          }`}
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : 
           saveSuccess ? <Check size={18} /> : <Save size={18} />}
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex flex-col gap-1.5">
          {[
            { name: 'General', icon: Globe },
            { name: 'Security', icon: Shield },
            { name: 'Notifications', icon: Bell },
            { name: 'Devices', icon: Smartphone },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.name 
                  ? 'bg-zinc-800 text-white shadow-lg ring-1 ring-zinc-700' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.name ? 'text-emerald-500' : ''} />
              {tab.name}
            </button>
          ))}
        </aside>

        {/* Content Section */}
        <div className="flex-1 max-w-3xl">
          
          {/* GENERAL TAB */}
          {activeTab === 'General' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
                <h3 className="text-lg font-semibold text-zinc-100">Profile Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase">Full Name</label>
                    <input type="text" placeholder="Enter name" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase">Organization</label>
                    <input type="text" placeholder="SkyCount Ltd" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>
              </section>

              <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-Save Logs</p>
                    <p className="text-xs text-zinc-500">Backup telemetry every 24 hours.</p>
                  </div>
                  <div 
                    onClick={() => toggleSwitch('autoSave')}
                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${toggles.autoSave ? 'bg-emerald-600' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toggles.autoSave ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'Security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <ShieldCheck size={28} className="text-emerald-500" />
                    <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                  </div>
                  <div 
                    onClick={() => toggleSwitch('twoFactor')}
                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${toggles.twoFactor ? 'bg-emerald-600' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toggles.twoFactor ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
                <p className="text-sm text-zinc-500">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'Notifications' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 animate-in fade-in duration-300">
              {['systemDowntime', 'criticalCapacity', 'weeklyAnalytics'].map((key) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <span className="text-sm text-zinc-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <input 
                    type="checkbox" 
                    checked={toggles[key as keyof typeof toggles]} 
                    onChange={() => toggleSwitch(key as keyof typeof toggles)}
                    className="w-5 h-5 rounded bg-zinc-800 border-zinc-700 accent-emerald-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* DEVICES TAB */}
          {activeTab === 'Devices' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center animate-in zoom-in-95 duration-300">
              {pairingCode ? (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Your Pairing Code</p>
                  <div className="text-5xl font-mono font-black text-white tracking-widest bg-zinc-950 py-6 rounded-xl border border-zinc-800">
                    {pairingCode}
                  </div>
                  <button onClick={() => setPairingCode("")} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Cancel</button>
                </div>
              ) : (
                <>
                  <Smartphone size={48} className="mx-auto text-zinc-700 mb-6" />
                  <h3 className="text-xl font-semibold">Connect Mobile App</h3>
                  <button onClick={generateCode} className="mt-8 px-8 py-3 bg-zinc-100 text-zinc-900 text-sm font-bold rounded-xl hover:bg-white transition-all active:scale-95 shadow-xl shadow-white/5">
                    Generate Code
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}