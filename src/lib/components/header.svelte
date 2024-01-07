<script>
	import { page } from '$app/stores';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import UserNav from './user-nav.svelte';

	export let credits = 0;
</script>

<div class="sticky top-0 bg-white z-30 px-4 flex items-center justify-between py-2 border-b">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">📝 cvAI</h1>
	{#if $page.data.session}
		<div class="flex items-center justify-end">
			<Button variant="link" href="/history" class="hidden sm:block">History</Button>
			<Button variant="link" href="/">{credits} credit{credits > 1 ? 's' : ''} left</Button>
			<UserNav />
		</div>
	{:else}
		<a class={buttonVariants({ size: 'default' })} href="/signin">Sign in</a>
	{/if}
</div>
