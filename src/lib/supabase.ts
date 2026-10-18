import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite or Next.js environment or user settings
export const getSupabaseConfig = () => {
  const envUrl = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    '';
  const envKey = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    '';

  const userStored = localStorage.getItem('rc_custom_supabase_config');
  if (userStored) {
    try {
      const parsed = JSON.parse(userStored);
      return {
        url: parsed.url || envUrl,
        anonKey: parsed.anonKey || envKey,
      };
    } catch (e) {
      // ignore
    }
  }

  return { url: envUrl, anonKey: envKey };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (url && anonKey && url.startsWith('http')) {
    if (!supabaseInstance) {
      supabaseInstance = createClient(url, anonKey);
    }
    return supabaseInstance;
  }
  return null;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http') && !url.includes('placeholder'));
};

// Direct export of supabase instance with proxy fallback so imports like `import { supabase } from '../lib/supabase'` work seamlessly
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) {
      const fallback = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
      return (fallback as any)[prop];
    }
    return (client as any)[prop];
  }
});

export const saveCustomSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem('rc_custom_supabase_config', JSON.stringify({ url, anonKey }));
  supabaseInstance = null; // reset instance
};
