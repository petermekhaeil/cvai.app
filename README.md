# cvAI

AI-powered resume and cover letter builder.

Visit: [www.cvai.app](https://www.cvai.app/)

## How it works

This site uses OpenAI’s new [GPT-4 with Vision](https://platform.openai.com/docs/guides/vision) model.
It first converts the PDF to an image, constructs a prompt based on the resume and the job description, sends it to GPT-4 API, then streams the response back to the application.

- [Supabase](https://supabase.com/) - Auth
- [SvelteKit](https://kit.svelte.dev/) - Framework
- [Svelte port of Shadcn UI](https://www.shadcn-svelte.com/) - UI
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - AI Streaming
- [Vercel KV](https://vercel.com/storage/kv) - Rate Limiting

## Running Locally

After cloning the repo, go to [OpenAI](https://platform.openai.com/api-keys) to make an account and put your API key in a file called `.env.local`.

```
OPENAI_API_KEY=
```

Use [pnpm](https://pnpm.io/) to install the dependencies and run the application.

```bash
pnpm install
pnpm run dev
```
