<script>
	import { page } from '$app/stores';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import UserNav from '$lib/components/user-nav.svelte';

	export let data;
	let { user } = data;
	$: ({ user } = data);

	let credits = 0;

	$: {
		credits = user?.credits ?? 0;
	}
</script>

<div class="antialiased flex flex-col lg:block w-full">
	<div class="sticky top-0 bg-white z-30 px-4 flex items-center justify-between py-2 border-b">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">📝 cvAI</h1>
		{#if $page.data.session}
			<div class="flex items-center justify-end">
				<Button variant="link" href="/history" class="hidden sm:block">History</Button>
				<Button variant="link">{credits} credit{credits > 1 ? 's' : ''} left</Button>
				<UserNav />
			</div>
		{:else}
			<a class={buttonVariants({ size: 'default' })} href="/signin">Sign in</a>
		{/if}
	</div>
	<div class="flex-1 min-h-[calc(100svh-51px)] flex flex-col"></div>
</div>
