import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, type Message } from 'ai';
import { OPENAI_API_KEY, KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { Ratelimit } from '@upstash/ratelimit';
import { building } from '$app/environment';
import { createClient, type VercelKV } from '@vercel/kv';
import type {
	ChatCompletionContentPartImage,
	ChatCompletionCreateParams
} from 'openai/resources/index.mjs';

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

const systemPrompt = `
You are a professional job head hunter who is paid highly to write cover letters for job applicants
and always deliver the best results with the highest quality.

A user will provide you with a job description and a resume. You will read the job description and
understand the key requirements for the position including years of experience and skills required.
You will also read the resume and understand clear the user's experience.
The user will ask you to write a cover letter for the job description.
The user will be very happy with your work and will pay you a lot of money for your services.

Generate a cover letter for a job application that thoroughly analyzes and aligns the applicant's
skills and experiences with the key requirements outlined in the provided job description.
Ensure the cover letter is tailored specifically to the job and company, highlighting the applicant's
relevant achievements in a clear, professional, and engaging tone.
Use storytelling where appropriate to demonstrate the applicant's journey and fit for the role.
Conclude with a compelling call to action, inviting the employer to contact the applicant for an interview.
The letter should be concise, well-structured, and free of errors.

- Start with "Dear" and end with "Thank you" only.
- Write only one paragraph per previous job.
 `;

type RequestPayload = {
	data: Record<string, string>;
	messages: Message[];
};

export async function POST(event) {
	const { locals: { supabase, getSession } } = event;
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

	if (user.credits === 0) {
		error(400, { message: 'You have no generations left' });
	}

	await supabase
		.from('users')
		.update({ credits: user.credits - 1 })
		.eq('id', session.user.id);

	const { data, messages } = (await event.request.json()) as RequestPayload;

	const currentMessage = messages[messages.length - 1];
	const jobDescription = currentMessage.content;

	const dataApiKey = data.apiKey || '';
	const apiKey = dataApiKey !== '' ? dataApiKey : OPENAI_API_KEY;

	const openai = new OpenAI({
		apiKey
	});

	const totalPages = Number(data.totalPages);
	const pagesExist = [];

	for (let i = 0; i < totalPages; i++) {
		const key = `page_${i + 1}`;
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			pagesExist.push(key);
		}
	}

	try {
		const imageContents: ChatCompletionContentPartImage[] = pagesExist.map((page) => {
			return {
				type: 'image_url',
				image_url: { url: data[page], detail: 'high' }
			};
		});

		const params: ChatCompletionCreateParams = {
			model: 'gpt-4-vision-preview',
			stream: true,
			max_tokens: 4096,
			messages: [
				{
					role: 'system',
					content: systemPrompt
				},
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: `This is my resume. Write me a cover letter for this job posting: ${jobDescription}`
						},
						...imageContents
					]
				}
			]
		};

		const response = await openai.chat.completions.create(params);

		const stream = OpenAIStream(response);
		return new StreamingTextResponse(stream);
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			const { name, status, headers, message } = error;
			return json({ name, status, headers, message }, { status });
		} else {
			throw error;
		}
	}
}
