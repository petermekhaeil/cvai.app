<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Toaster from '$lib/components/ui/toast/toaster.svelte';
	import '../app.pcss';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<slot />

<Toaster />

<svelte:head>
	<title>cvAI: AI-powered resume and cover letter builder</title>
	<meta name="description" content="AI-powered resume and cover letter builder." />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@petermekh" />
	<meta name="twitter:site" content="@petermekh" /><meta name="twitter:title" content="cvAI" />
	<meta name="twitter:description" content="AI-powered resume and cover letter builder." />
	<link rel="icon" href="https://fav.farm/📝" />
</svelte:head>
