import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing"
  );
}

declare global {
  var __wealthosSupabase:
    | SupabaseClient
    | undefined;
}

export const supabase =
  globalThis.__wealthosSupabase ??
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalThis.__wealthosSupabase =
    supabase;
}