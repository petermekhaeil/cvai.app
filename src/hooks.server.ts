import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { sequence } from '@sveltejs/kit/hooks';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHubProvider from '@auth/sveltekit/providers/github';
import GoogleProvider from '@auth/sveltekit/providers/google';

import {
	AUTH_GITHUB_ID,
	AUTH_GITHUB_SECRET,
	AUTH_GOOGLE_CLIENT_ID,
	AUTH_GOOGLE_CLIENT_SECRET,
	AUTH_SECRET,
	SUPABASE_SERVICE_ROLE_KEY,
	SUPABASE_JWT_SECRET
} from '$env/static/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { createServerClient } from '@supabase/ssr';
import { SignJWT, type JWTPayload } from 'jose';
import type { Database } from '$lib/database.types';

export async function sign(payload: JWTPayload, secret: string): Promise<string> {
	const iat = Math.floor(Date.now() / 1000);
	const exp = iat + 60 * 60; // one hour

	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setExpirationTime(exp)
		.setIssuedAt(iat)
		.setNotBefore(iat)
		.sign(new TextEncoder().encode(secret));
}

const auth = SvelteKitAuth({
	providers: [
		GitHubProvider({ clientId: AUTH_GITHUB_ID, clientSecret: AUTH_GITHUB_SECRET }),
		GoogleProvider({ clientId: AUTH_GOOGLE_CLIENT_ID, clientSecret: AUTH_GOOGLE_CLIENT_SECRET })
	],
	adapter: SupabaseAdapter({
		url: PUBLIC_SUPABASE_URL,
		secret: SUPABASE_SERVICE_ROLE_KEY
	}),
	secret: AUTH_SECRET,
	trustHost: true,
	callbacks: {
		async session({ session, user }) {
			const signingSecret = SUPABASE_JWT_SECRET;

			if (signingSecret) {
				const payload = {
					aud: 'authenticated',
					exp: Math.floor(new Date(session.expires).getTime() / 1000),
					sub: user.id,
					email: user.email,
					role: 'authenticated'
				};
				session.supabaseAccessToken = await sign(payload, signingSecret);
			}

			session!.user!.id = user.id;
			return session;
		}
	}
});

const db: Handle = async ({ event, resolve }) => {
	const {
		locals: { getSession }
	} = event;
	const session = await getSession();

	if (!session?.user) {
		return await resolve(event);
	}

	const { supabaseAccessToken } = session;

	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get: (key) => event.cookies.get(key),
				set: (key, value, options) => event.cookies.set(key, value, { ...options, path: '/' }),
				remove: (key, options) => event.cookies.delete(key, { ...options, path: '/' })
			},
			global: {
				headers: {
					Authorization: `Bearer ${supabaseAccessToken}`
				}
			}
		}
	);

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

export const handle = building ? undefined : sequence(auth, db);
