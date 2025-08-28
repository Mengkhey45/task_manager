import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Browser / client-side Supabase instance — uses the public anon key.
// Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to be set.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	// In production this should be configured; warn in development to help debugging.
	// We avoid throwing so client bundles can still build, but any call will fail without keys.
	// eslint-disable-next-line no-console
	console.warn('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. Supabase client will be non-functional.');
}

export const supabaseClient: SupabaseClient = createClient(
	SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY ?? ''
);

export default supabaseClient;
