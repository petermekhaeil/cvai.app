import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { Ratelimit } from '@upstash/ratelimit';
import { building } from '$app/environment';
import { createClient, type VercelKV } from '@vercel/kv';
let kv: VercelKV;
let ratelimit: Ratelimit;

if (!building && KV_REST_API_URL && KV_REST_API_TOKEN) {
	kv = createClient({
		url: KV_REST_API_URL,
		token: KV_REST_API_TOKEN
	});

	ratelimit = new Ratelimit({
		redis: kv,
		// rate limit to 5 requests per 10 seconds
		limiter: Ratelimit.slidingWindow(5, '10 s')
	});
}

type RequestPayload = {
	jd: string;
	text: string;
};

export async function POST(event) {
	const {
		locals: { supabase, getSession }
	} = event;
	const session = await getSession();

	if (!session?.user) {
		error(401, { message: 'Login required.' });
	}

	if (KV_REST_API_URL && KV_REST_API_TOKEN) {
		const ip = event.getClientAddress();

		const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

		if (!success) {
			return new Response(
				JSON.stringify({
					message: 'You have reached your request limit for the day.'
				}),
				{
					status: 429,
					headers: {
						'X-RateLimit-Limit': limit.toString(),
						'X-RateLimit-Remaining': remaining.toString(),
						'X-RateLimit-Reset': reset.toString()
					}
				}
			);
		}
	}

	const { data: user } = await supabase
		.from('users')
		.select('*')
		.eq('id', session.user.id)
		.single();

	if (!user) {
		error(400, { message: 'User not found.' });
	}

	const { jd, text } = (await event.request.json()) as RequestPayload;

	if (!jd || !text) {
		error(400, { message: 'Invalid request payload.' });
	}

	await supabase.from('history').insert({
		user_id: session.user.id,
		jd,
		text
	});

	return json({ success: true });
}
