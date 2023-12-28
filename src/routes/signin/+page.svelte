<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import IconGitHub from '$lib/components/icon-github.svelte';
	import IconGoogle from '$lib/components/icon-google.svelte';
	import { signIn } from '@auth/sveltekit/client';
</script>

<div class="antialiased flex flex-col w-full min-h-screen">
	<div class="sticky top-0 bg-white z-30 px-4 flex items-center justify-between py-2 border-b">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">
			<a href="/">📝 cvAI</a>
		</h1>
	</div>
	<main class="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4">
		<h1 class="mx-auto font-display text-4xl font-bold sm:text-6xl mb-5">
			Redesign your <span class="">CV</span> in seconds
		</h1>
		<div class="flex flex-col items-center space-y-6">
			<div class="max-w-lg leading-8 text-base">
				Sign in below to create a free account and redesign your CV today. You will get
				<b>5 generations</b> for free.
			</div>
			<Button variant="outline" type="button" on:click={() => signIn('github')}>
				<IconGitHub class="mr-2 h-5 w-5" /> Sign in with Github
			</Button>
			<Button variant="outline" type="button" on:click={() => signIn('google')}>
				<IconGoogle class="mr-2 h-5 w-5" /> Sign in with Google
			</Button>
		</div>
	</main>
</div>
