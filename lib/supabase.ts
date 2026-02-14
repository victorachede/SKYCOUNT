import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mimwpmgovpksdhdscnst.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbXdwbWdvdnBrc2RoZHNjbnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMjkyODMsImV4cCI6MjA4NjYwNTI4M30.f5KKCExSefD3KOSCO5XekUJupL4tkBXdK2JnBNPPFh4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
