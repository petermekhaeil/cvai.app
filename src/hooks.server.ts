import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import { GITHUB_ID, GITHUB_SECRET, SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private"
import { PUBLIC_SUPABASE_URL } from "$env/static/public"
import { SupabaseAdapter } from "@auth/supabase-adapter"

export const handle = SvelteKitAuth({
  providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
  adapter: SupabaseAdapter({
    url: PUBLIC_SUPABASE_URL,
    secret: SUPABASE_SERVICE_ROLE_KEY,
  }),
})