"use client";
import React, { useState, useMemo } from 'react';
import { Search, Download, Loader2, FileX } from 'lucide-react';

const mockLogs = [
  { id: 1, time: "2026-02-10 14:22", level: "Critical", message: "Maximum occupancy reached: Sector 4", location: "North Gate" },
  { id: 2, time: "2026-02-10 14:21", level: "Info", message: "Camera UAV_01: Sensor recalibrated", location: "System" },
  { id: 3, time: "2026-02-10 14:19", level: "Success", message: "Device handshake successful", location: "Drone-A1" },
  { id: 4, time: "2026-02-10 14:15", level: "Warning", message: "Low signal strength detected", location: "Sector 2" },
  { id: 5, time: "2026-02-10 13:05", level: "Info", message: "User 'Admin' logged in", location: "Web Portal" },
];

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("All Levels");
  const [isExporting, setIsExporting] = useState(false);

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      const matchesSearch = 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = filterLevel === "All Levels" || log.level === filterLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, filterLevel]);

  // CSV Export Engine
  const handleExport = () => {
    if (filteredLogs.length === 0) return;
    setIsExporting(true);

    // Prepare data
    const headers = ["Timestamp", "Level", "Event Message", "Location"];
    const csvRows = filteredLogs.map(log => [
      log.time,
      log.level,
      `"${log.message.replace(/"/g, '""')}"`, // Handle commas/quotes in messages
      log.location
    ]);

    const csvString = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    // Process Download
    setTimeout(() => {
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SkyCount_Logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">System Logs</h1>
          <p className="text-zinc-500 text-sm">Review and export device activity history</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting || filteredLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {isExporting ? "Generating..." : "Export CSV"}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by message or location..." 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
          />
        </div>
        <select 
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-zinc-700 cursor-pointer"
        >
          <option>All Levels</option>
          <option>Critical</option>
          <option>Warning</option>
          <option>Info</option>
          <option>Success</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-zinc-800/40 text-zinc-400 font-medium border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Timestamp</th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Level</th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Event Message</th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap font-mono">{log.time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        log.level === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        log.level === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        log.level === 'Success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300 leading-relaxed group-hover:text-white transition-colors">{log.message}</td>
                    <td className="px-6 py-4 text-zinc-500 font-medium whitespace-nowrap">{log.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-600">
                      <FileX size={40} strokeWidth={1.5} />
                      <p className="text-sm">No logs found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}