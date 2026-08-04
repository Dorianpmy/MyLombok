import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null | undefined;

export type SupabaseOAuthProvider = "apple" | "google";

const oauthProviders: Record<SupabaseOAuthProvider, boolean> = {
  apple: process.env.NEXT_PUBLIC_SUPABASE_APPLE_ENABLED === "true",
  google: process.env.NEXT_PUBLIC_SUPABASE_GOOGLE_ENABLED === "true",
};

export function isSupabaseOAuthProviderEnabled(provider: SupabaseOAuthProvider) {
  return oauthProviders[provider];
}

export function getSupabaseBrowserClient() {
  if (browserClient !== undefined) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  browserClient = url && key ? createClient(url, key) : null;
  return browserClient;
}
