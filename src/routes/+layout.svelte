<script lang="ts">
	import Toaster from '$lib/components/ui/toast/toaster.svelte';
	import '../app.pcss';
</script>

<slot />

<Toaster />

<svelte:head>
	<title>cvAI: AI-powered resume and cover letter builder</title>
	<meta name="description" content="AI-powered resume and cover letter builder." />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@petermekh" />
	<meta name="twitter:site" content="@petermekh" />
	<meta name="twitter:title" content="📝 cvAI" />
	<meta name="twitter:description" content="AI-powered resume and cover letter builder." />
	<meta name="twitter:image" content="https://www.cvai.app/og.png" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="📝 cvAI" />
	<meta property="og:description" content="AI-powered resume and cover letter builder." />
	<meta property="og:url" content="https://www.cvai.app/" />
	<meta property="og:image" content="https://www.cvai.app/og.png" />
	<link rel="icon" href="https://fav.farm/📝" />
</svelte:head>
