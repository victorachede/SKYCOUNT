'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LiveCounter() {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    // 1. Get the latest number immediately
    const fetchLatest = async () => {
      const { data } = await supabase
        .from('occupancy_logs')
        .select('count')
        .order('created_at', { ascending: false })
        .limit(1)
      if (data && data.length > 0) setCount(data[0].count)
    }
    fetchLatest()

    // 2. Listen for "Realtime" updates (whenever you run your python script)
    const channel = supabase
      .channel('live-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'occupancy_logs' }, 
        (payload) => {
          setCount(payload.new.count)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div style={{ padding: '20px', textAlign: 'center', border: '2px solid #00ff00', borderRadius: '10px' }}>
      <h2>Live Occupancy</h2>
      <p style={{ fontSize: '72px', fontWeight: 'bold' }}>{count}</p>
    </div>
  )
}
