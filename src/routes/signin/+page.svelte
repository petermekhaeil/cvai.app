<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
</script>

<div class="antialiased flex flex-col w-full min-h-screen">
	<div class="sticky top-0 bg-white z-30 px-4 flex items-center justify-between py-2 border-b">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight"><a href="/">📝 cvAI</a></h1>
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
			<Auth
				supabaseClient={data.supabase}
				providers={['github', 'google']}
				redirectTo={`${data.url}/auth/callback`}
				onlyThirdPartyProviders={true}
				appearance={{
					theme: ThemeSupa
				}}
				theme="light"
			/>
		</div>
	</main>
</div>
