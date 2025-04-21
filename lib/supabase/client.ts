import { createClient as supabaseCreateClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Konfigurační proměnné
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://etceznegcpihgqupaqvt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Y2V6bmVnY3BpaGdxdXBhcXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjMwMDAsImV4cCI6MjA1OTA5OTAwMH0.JI6328zzMt3DdKD_Pa_huPa_WW9iqKfXWgNnqAvUIjg';

// Funkce pro vytvoření klienta
export function createSupabaseClient() {
  console.log('Initializing Supabase client with URL:', supabaseUrl);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Chybí Supabase URL nebo Anon Key');
    throw new Error('Chybí Supabase URL nebo Anon Key');
  }

  try {
    console.log('Using Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

    // Vytvoříme reálného klienta bez dalších nastavení
    const client = supabaseCreateClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully');
    return client;
  } catch (err) {
    console.error('Chyba při vytváření Supabase klienta:', err);
    // Zobrazíme více informací o chybě
    if (err instanceof Error) {
      console.error('Detaily chyby:', err.message);
    }

    // Místo vyhazování chyby vrátíme fallback klienta
    console.warn('Používám fallback klienta pro vývoj');
    try {
      return supabaseCreateClient(
        'https://etceznegcpihgqupaqvt.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Y2V6bmVnY3BpaGdxdXBhcXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjMwMDAsImV4cCI6MjA1OTA5OTAwMH0.JI6328zzMt3DdKD_Pa_huPa_WW9iqKfXWgNnqAvUIjg'
      );
    } catch (fallbackErr) {
      console.error('Nelze vytvořit ani fallback klienta:', fallbackErr instanceof Error ? fallbackErr.message : 'Neznámá chyba');
      throw new Error(`Nelze vytvořit Supabase klienta: ${err instanceof Error ? err.message : 'Neznámá chyba'}`);
    }
  }
}

// Singleton instance pro server-side použití
let clientInstance: ReturnType<typeof supabaseCreateClient<Database>> | null = null;

// Exportujeme funkci pro vytvoření klienta
export function createClient() {
  // Pro client-side vždy vytvoříme novou instanci
  if (typeof window !== 'undefined') {
    return createSupabaseClient();
  }

  // Pro server-side použijeme singleton
  if (!clientInstance) {
    clientInstance = createSupabaseClient();
  }

  return clientInstance;
}
