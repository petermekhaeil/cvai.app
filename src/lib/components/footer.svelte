<script>
	import { Button } from '$lib/components/ui/button';
	import { ExternalLink } from 'lucide-svelte';
</script>

<div
	class="sticky bottom-0 left-0 right-0 w-full border-t h-[64px] -mt-16 bg-zinc-50 z-30 px-4 lg:px-6 flex items-center justify-between py-2"
>
	<div class="space-x-2 flex items-center">
		<slot />
	</div>
	<div>
		<Button
			href="https://github.com/petermekhaeil/cvai.app/issues/new?template=feature_request.yml"
			variant="link"
			target="_blank"
			class="inline-flex items-center text-zinc-500"
		>
			<span>Feature Request</span>
			<ExternalLink class="ml-1 h-3 w-3" />
		</Button>
		<Button
			href="https://github.com/petermekhaeil/cvai.app"
			variant="link"
			target="_blank"
			class="items-center text-zinc-500 hidden md:inline-flex"
		>
			<span>Source code</span>
			<ExternalLink class="ml-1 h-3 w-3" />
		</Button>
		<Button
			href="https://twitter.com/petermekh"
			variant="link"
			target="_blank"
			class="items-center text-zinc-500 hidden md:inline-flex"
		>
			<span>By Peter Mekhaeil</span>
			<ExternalLink class="ml-1 h-3 w-3" />
		</Button>
	</div>
</div>
