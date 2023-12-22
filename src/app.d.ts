// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types.js';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			supabase: SupabaseClient<Database>;
		}
	}
}

export {};
