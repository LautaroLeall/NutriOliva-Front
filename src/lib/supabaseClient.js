import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[NutriOliva] Faltan las variables de entorno de Supabase.\n' +
    'Copia .env.example como .env.local y completá los valores:\n' +
    '  VITE_SUPABASE_URL=tu-url\n' +
    '  VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)
