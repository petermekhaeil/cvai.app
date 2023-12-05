# cvAI

AI-powered resume and cover letter builder.

## How it works

This site uses OpenAI’s new [GPT-4 with Vision](https://platform.openai.com/docs/guides/vision) model.

- [SvelteKit](https://kit.svelte.dev/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Svelte port of Shadcn UI](https://www.shadcn-svelte.com/)

## Running Locally

After cloning the repo, go to [OpenAI](https://beta.openai.com/account/api-keys) to make an account and put your API key in a file called `.env.local`.

```
OPENAI_API_KEY=
```

Use [pnpm](https://pnpm.io/) to install the dependencies and run the application.

```bash
pnpm install
pnpm run dev
```