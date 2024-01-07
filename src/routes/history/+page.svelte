<script>
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';

	export let data;
	let { user } = data;
	$: ({ user } = data);

	let credits = 0;

	$: {
		credits = user?.credits ?? 0;
	}
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
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										aria-hidden="true"
										class="w-4 h-4 stroke-2 stroke-zinc-500"
										><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"
										></path>
									</svg>
									New Cover Letter
								</a>
							</div>
							<div class="flex-1 px-3 space-y-4 overflow-auto">
								<div>
									<div class="space-y-1">
										<div class="relative h-8">
											<a
												class="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-200 transition-colors w-full rounded-md"
												href="#"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													aria-hidden="true"
													class="flex-shrink-0 w-4 h-4 stroke-2 stroke-zinc-400"
													><path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
													></path>
												</svg>
												<div class="text-sm truncate">...</div>
											</a>
										</div>
										<div class="relative h-8">
											<a
												class="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-200 transition-colors w-full rounded-md"
												href="#"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													aria-hidden="true"
													class="flex-shrink-0 w-4 h-4 stroke-2 stroke-zinc-400"
													><path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
													></path>
												</svg>
												<div class="text-sm truncate">...</div>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						class="md:divide-x md:divide-y-0 divide-y border-t md:border-t-0 md:border-l bg-zinc-50 flex flex-col md:flex-row h-full w-full"
					>
						<div class="flex md:min-w-[465px] md:flex-1 md:flex-grow w-full">
							<div class="py-6 px-4 lg:px-6 flex-grow w-full">...</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	</div>
</div>
