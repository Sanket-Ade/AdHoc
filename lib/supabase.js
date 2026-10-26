import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const isSupabaseConfigured = Boolean(supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('example'));
let supabaseInstance = null;
if (isSupabaseConfigured) {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
    catch (error) {
        console.warn('Failed to initialize Supabase client:', error);
    }
}
export const supabase = supabaseInstance;
