import React from 'react';
import { AlertCircle, BatteryCharging, Users } from 'lucide-react';

export default function NotificationsPage() {
  const alerts = [
    { id: 1, title: 'Capacity Alert', desc: 'Main Hall at 92% capacity.', icon: Users, color: 'text-amber-500' },
    { id: 2, title: 'Hardware', desc: 'Drone battery low: 15% remaining.', icon: BatteryCharging, color: 'text-red-500' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">System Alerts</h1>
      <div className="space-y-4">
        {alerts.map((a) => (
          <div key={a.id} className="p-4 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 flex items-center gap-4">
            <a.icon className={a.color} size={24} />
            <div>
              <h3 className="font-semibold text-sm">{a.title}</h3>
              <p className="text-xs text-zinc-500">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}