import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const config = {
	runtime: 'edge'
};

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

export async function POST({ request }) {
	const { data, messages } = await request.json();

	const currentMessage = messages[messages.length - 1];
	const jobDescription = currentMessage.content;

	const dataApiKey = data.apiKey || '';
	const dataImageUrl = data.imageUrl
	const apiKey = dataApiKey !== '' ? dataApiKey : OPENAI_API_KEY;

	const openai = new OpenAI({
		apiKey
	});

	try {
		const response = await openai.chat.completions.create({
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
						{
							type: 'image_url',
							image_url: { url: dataImageUrl, detail: 'high' }
						}
					]
				}
			]
		});

		const stream = OpenAIStream(response);
		return new StreamingTextResponse(stream);
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			const { name, status, headers, message } = error;
			throw json({ name, status, headers, message }, { status });
		} else {
			throw error;
		}
	}
}
