import type { Handle } from "@sveltejs/kit"
import { sequence } from '@sveltejs/kit/hooks';
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET } from "$env/static/private"
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { createClient } from "@supabase/supabase-js"
import {SignJWT, type JWTPayload} from 'jose';

export async function sign(payload: JWTPayload, secret: string): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60* 60; // one hour

  return new SignJWT({...payload})
      .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(new TextEncoder().encode(secret));
}

const auth = SvelteKitAuth({
  providers: [GitHub({ clientId: AUTH_GITHUB_ID, clientSecret: AUTH_GITHUB_SECRET })],
  adapter: SupabaseAdapter({
    url: PUBLIC_SUPABASE_URL,
    secret: SUPABASE_SERVICE_ROLE_KEY,
  }),
  callbacks: {
    async session({ session, user }) {
      const signingSecret = SUPABASE_JWT_SECRET;

      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        }
        session.supabaseAccessToken = await sign(payload, signingSecret)
      }

      session!.user!.id = user.id;
      return session;
    },
  },
})

const db: Handle = async ({ event, resolve }) => {
  const { locals: { getSession } } = event;
  const session = await getSession();

  if (!session?.user) {
    return await resolve(event);
  }

  const { supabaseAccessToken } = session;

  event.locals.supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  })

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    },
  })
}

export const handle = sequence(auth, db);
