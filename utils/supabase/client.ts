import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rrdinvpcklvdgrgytces.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZGludnBja2x2ZGdyZ3l0Y2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDc4MTYsImV4cCI6MjA2MzEyMzgxNn0._mUInSPCmy2jbW3zXMwUl3Vvnj3QGsY2P4yWhsXOJZI"

export const supabase = createClient(supabaseUrl, supabaseKey)

export { createClient }
