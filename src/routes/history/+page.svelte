<script lang="ts">
	import { Copy, File, Plus } from 'lucide-svelte';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	import { addToast } from '$lib/components/ui/toast/toaster.svelte';
	import type { Database } from '$lib/database.types.js';

	type History = Database['public']['Tables']['history']['Row'];

	export let data;
	let { user } = data;
	$: ({ user } = data);

	let credits = 0;
	let selectedHistory: History | null = null;

	$: {
		credits = user?.credits ?? 0;
	}

	const handleCopy = () => {
		if (selectedHistory) {
			navigator.clipboard.writeText(selectedHistory.cv);

			addToast({
				title: 'Copied',
				description: 'Copied to clipboard',
				variant: 'default'
			});
		}
	};
</script>

<div class="antialiased flex flex-col lg:block w-full">
	<Header {credits} />
	<div class="flex-1 min-h-[calc(100svh-51px)] flex flex-col">
		<div class="flex-1 flex flex-col">
			<div class="flex-1 flex lg:justify-between">
				<div class="w-full flex flex-col md:flex-row">
					<div class="relative py-4 px-4 flex-initial flex flex-col md:w-[760px]">
						<div class="grid w-full items-center gap-4 overflow-hidden">
							<div class="w-full px-3">
								<a
									href="/"
									class="inline-flex items-center gap-1 w-full px-2.5 text-sm h-8 transition-all font-medium bg-zinc-50 border rounded-md border-zinc-300 hover:bg-zinc-200"
								>
									<Plus class="w-4 h-4 stroke-2 stroke-zinc-500" />
									New Cover Letter
								</a>
							</div>
							<div class="flex-1 px-3 space-y-4 overflow-auto">
								<div>
									<div class="space-y-1">
										{#if user}
											{#each user.history as history}
												<div class="relative h-8">
													<button
														on:click={() => {
															selectedHistory = history;
														}}
														type="button"
														class="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-200 transition-colors w-full rounded-md"
													>
														<File class="flex-shrink-0 w-4 h-4 stroke-2 stroke-zinc-400" />
														<div class="text-sm truncate">{history.job_description}</div>
													</button>
												</div>
											{/each}
										{/if}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						class="md:divide-x md:divide-y-0 divide-y border-t md:border-t-0 md:border-l bg-zinc-50 flex flex-col md:flex-row h-full w-full"
					>
						<div class="flex md:min-w-[465px] md:flex-1 md:flex-grow w-full">
							<div class="py-6 px-4 lg:px-6 flex-grow w-full">
								{#if selectedHistory}
									<div
										class="w-full text-black bg-zinc-50 border-none focus:ring-0 focus:border-black pb-16 px-0 rounded-lg resize-none whitespace-pre-wrap flex flex-col"
									>
										<div class="flex items-center justify-end pb-0.5 sticky top-0 bg-zinc-50">
											<button
												type="button"
												on:click={handleCopy}
												class="block p-1 text-sm font-semibold rounded-md cursor-default text-zinc-500 sm:leading-6 hover:bg-zinc-100 hover:text-zinc-900 disabled:text-zinc-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
											>
												<Copy />
											</button>
										</div>
										<div>
											{selectedHistory.cv}
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	</div>
</div>
