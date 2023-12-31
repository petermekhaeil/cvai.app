<script lang="ts">
	import { onMount } from 'svelte';
	import { useChat, type Message } from 'ai/svelte';
	import { Loader2, Copy, UploadCloud, HelpCircle, ExternalLink } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Dialog from '$lib/components/ui/dialog';
	import { addToast } from '$lib/components/ui/toast/toaster.svelte';
	import FileDrop from '$lib/components/file-drop.svelte';
	import ImageCarousel from '$lib/components/image-carousel.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';

	export let data;
	let { user, useOwnKey } = data;
	$: ({ user } = data);

	let convertedImages: string[] = [];
	let numPages = 0;
	let lastAssistantMessage: Message | null = null;
	let apiKey = '';
	let credits = 0;

	$: {
		credits = user?.credits ?? 0;
	}

	let pdfjs: typeof import('pdfjs-dist');

	onMount(async () => {
		const pdf = await import('pdfjs-dist');
		const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
		pdf.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

		pdfjs = pdf;
	});

	const { isLoading, input, handleSubmit, messages } = useChat({
		api: '/api/completion',
		clearInputOnSubmit: false,
		onError: (error) => {
			const errorMsg = JSON.parse(error.message) as { message: string };
			addToast({
				title: 'Error',
				description: errorMsg.message,
				variant: 'destructive'
			});
		},
		onResponse: () => {
			credits = Math.max(credits - 1, 0);
		},
		onFinish: (message) => {
			fetch('/api/save', {
				method: 'POST',
				body: JSON.stringify({ jd: $input, text: message.content })
			});
		}
	});

	$: {
		const reversedMessages = $messages.slice().reverse();
		lastAssistantMessage = reversedMessages.find((m) => m.role === 'assistant') || null;
	}

	const convertPdfToImage = (pdfData: ArrayBuffer) => {
		pdfjs
			.getDocument({ data: pdfData })
			.promise.then((pdfDoc) => {
				numPages = pdfDoc.numPages;
				const pagePromises = [];

				for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
					pagePromises.push(pdfDoc.getPage(pageNumber));
				}

				return Promise.all(pagePromises);
			})
			.then((pages) => {
				const imagePromises = pages.map((page) => {
					return new Promise((resolve) => {
						const canvas = document.createElement('canvas');
						const context = canvas.getContext('2d');
						const viewport = page.getViewport({ scale: 1 });
						canvas.width = viewport.width;
						canvas.height = viewport.height;

						if (context) {
							const renderTask = page.render({
								canvasContext: context,
								viewport
							});
							renderTask.promise.then(() => {
								const imgData = canvas.toDataURL('image/png');
								resolve(imgData);
							});
						} else {
							resolve('');
						}
					});
				});

				return Promise.all(imagePromises);
			})
			.then((imageDataArray) => {
				convertedImages = imageDataArray as string[];
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleGenerate = (e: SubmitEvent) => {
		if (convertedImages.length === 0) {
			addToast({
				title: 'Error',
				description: 'Please upload a PDF resume',
				variant: 'destructive'
			});
			return false;
		}

		if ($input === '') {
			addToast({
				title: 'Error',
				description: 'Please enter a job description',
				variant: 'destructive'
			});
			return false;
		}

		const data: Record<string, string> = {
			apiKey: apiKey
		};

		for (let i = 0; i < convertedImages.length; i++) {
			const image = convertedImages[i];
			const key = `page_${i + 1}`;
			data[key] = image;
		}

		data['totalPages'] = convertedImages.length.toString();

		handleSubmit(e, { data });
	};

	const handleStartOver = () => {
		convertedImages = [];
	};

	const handleFileSelect = (files: File[]) => {
		if (files && files.length > 0) {
			const file = files[0];

			if (file.type === 'application/pdf') {
				const reader = new FileReader();

				reader.onload = (e) => {
					const pdfData = e.target?.result as ArrayBuffer;

					if (pdfData) {
						convertPdfToImage(pdfData);
					}
				};

				reader.readAsArrayBuffer(file);
			} else {
				// should we support other file types?
				// or just show an error?
			}
		}
	};

	const handleCopy = () => {
		if (lastAssistantMessage) {
			navigator.clipboard.writeText(lastAssistantMessage.content);
		}
		addToast({
			title: 'Copied',
			description: 'Copied to clipboard',
			variant: 'default'
		});
	};
</script>

<div class="antialiased flex flex-col lg:block w-full">
	<Header {credits} />
	<div class="flex-1 min-h-[calc(100svh-51px)] flex flex-col">
		<form class="flex-1 flex flex-col" on:submit={handleGenerate}>
			<div class="flex-1 flex lg:justify-between">
				<div class="w-full flex flex-col md:flex-row">
					<div class="relative py-4 px-4 flex-initial flex flex-col md:w-[760px]">
						<div class="grid w-full items-center gap-4 overflow-hidden">
							{#if convertedImages.length > 0}
								<ImageCarousel images={convertedImages} />
							{:else}
								<FileDrop handleFiles={handleFileSelect} name="resume">
									<div class="flex items-center justify-center w-full">
										<label
											for="resume"
											class="flex flex-col items-center justify-center w-full h-64 border border-zinc-300 rounded-md cursor-pointer bg-zinc-50 hover:bg-zinc-200"
										>
											<div class="flex flex-col items-center justify-center pt-5 pb-6">
												<UploadCloud class="w-8 h-8 mb-4 text-gray-500" />
												<p class="mb-2 text-sm text-gray-500">
													<span class="font-semibold">Click to upload</span> or drag and drop
												</p>
												<p class="text-xs text-gray-500">Only PDF files are supported</p>
											</div>
										</label>
									</div>
								</FileDrop>
							{/if}
							<Textarea
								placeholder="Enter job description"
								id="jobDescription"
								rows={10}
								bind:value={$input}
								spellcheck="false"
								class="h-full min-h-[256px] rounded-md flex-1 sm:text-sm text-base bg-gray-50 border border-zinc-300 hover:border-zinc-300 resize-none scroll-m-2 transition-colors focus:border-gray-400 focus:ring-0 focus:outline-none pb-12 focus-visible:ring-0"
							/>
							{#if useOwnKey}
								<div class="flex gap-4">
									<Input
										type="text"
										placeholder="Your OpenAI API Key"
										bind:value={apiKey}
										class="bg-gray-50 border border-zinc-300 hover:border-zinc-300 focus-visible:ring-0 focus:border-gray-400 focus:ring-0 focus:outline-none"
									/>
									<Dialog.Root>
										<Dialog.Trigger>
											<HelpCircle />
										</Dialog.Trigger>
										<Dialog.Content class="md:min-w-[800px]">
											<Dialog.Header>
												<Dialog.Title>OpenAI API Key</Dialog.Title>
											</Dialog.Header>
											<div class="grid gap-4 py-4">
												<p class="mb-2 leading-normal text-muted-foreground">
													This site uses OpenAI’s new GPT-4 with Vision model. You will need to
													create an OpenAI account and get your API key from
													<a
														href="https://platform.openai.com"
														target="_blank"
														class="inline-flex flex-1 justify-center gap-1 leading-4 hover:underline"
													>
														<span>platform.openai.com</span>
														<ExternalLink class="h-3 w-3" />
													</a>.
												</p>
												<ul class="ml-6 list-decimal [&>li]:mt-2 text-muted-foreground">
													<li>
														Create an OpenAI account at
														<a
															href="https://platform.openai.com"
															target="_blank"
															class="inline-flex flex-1 justify-center gap-1 leading-4 hover:underline"
														>
															<span>platform.openai.com</span>
															<ExternalLink class="h-3 w-3" />
														</a>
													</li>
													<li>
														In your OpenAI API account, navigate to
														<a
															href="https://platform.openai.com/account/billing/overview"
															target="_blank"
															class="inline-flex flex-1 justify-center gap-1 leading-4 hover:underline"
														>
															<span>Settings > Billing</span>
															<ExternalLink class="h-3 w-3" />
														</a>
													</li>
													<li>Click Add to credit balance</li>
													<li>Add at least $5 to your account</li>
													<li>
														Navigate to
														<a
															href="https://platform.openai.com/api-keys"
															target="_blank"
															class="inline-flex flex-1 justify-center gap-1 leading-4 hover:underline"
														>
															<span>API Keys</span>
															<ExternalLink class="h-3 w-3" />
														</a>
													</li>
													<li>Click Create new secret key</li>
													<li>Copy the key to your clipboard.</li>
													<li>Back on cvai.app, paste the key into the API key text box</li>
												</ul>
												<p class="mb-2 leading-normal text-muted-foreground">
													This key is only used in your browser and is not stored on the server.
												</p>
												<p class="mb-2 leading-normal text-muted-foreground">
													Read the <a
														href="https://github.com/petermekhaeil/cvai.app"
														class="inline-flex flex-1 justify-center gap-1 leading-4 hover:underline"
													>
														<span>source code</span>
														<ExternalLink class="h-3 w-3" />
													</a> to see how your data is used.
												</p>
											</div>
										</Dialog.Content>
									</Dialog.Root>
								</div>
							{/if}
						</div>
					</div>
					<div
						class="md:divide-x md:divide-y-0 divide-y border-t md:border-t-0 md:border-l bg-zinc-50 flex flex-col md:flex-row h-full w-full"
					>
						<div class="flex md:min-w-[465px] md:flex-1 md:flex-grow w-full">
							<div class="py-6 px-4 lg:px-6 flex-grow w-full">
								{#if $messages.length > 0}
									<div
										class="w-full text-black bg-zinc-50 border-none focus:ring-0 focus:border-black pb-16 px-0 rounded-lg resize-none whitespace-pre-wrap flex flex-col"
									>
										<div class="flex items-center justify-end pb-0.5 sticky top-0 bg-zinc-50">
											{#if lastAssistantMessage}
												<button
													type="button"
													on:click={handleCopy}
													class="block p-1 text-sm font-semibold rounded-md cursor-default text-zinc-500 sm:leading-6 hover:bg-zinc-100 hover:text-zinc-900 disabled:text-zinc-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
												>
													<Copy />
												</button>
											{/if}
										</div>
										<div>
											{#if lastAssistantMessage}
												{lastAssistantMessage.content}
											{:else}
												<Loader2 class="h-5 w-5 animate-spin text-zinc-500" />
											{/if}
										</div>
									</div>
								{:else}
									<div class="pb-[200px] pt-4 md:pt-10">
										<div class="mx-auto max-w-2xl px-4">
											<div class="rounded-lg border bg-background p-8">
												<h1 class="mb-2 text-lg font-semibold">Welcome to cvAI</h1>
												<p class="mb-2 leading-normal text-muted-foreground">
													This tool will generate a cover letter that is tailored to the job
													description.
												</p>
												<p class="leading-normal text-muted-foreground">
													Start by uploading your resume and entering the job description you want
													to apply for.
												</p>
											</div>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer>
				<Button
					class="disabled:cursor-not-allowed"
					variant="default"
					type="submit"
					disabled={$isLoading}
				>
					{#if $isLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Generating
					{:else}
						Generate
					{/if}
				</Button>
				<Button variant="outline" on:click={handleStartOver} type="button">Start Over</Button>
			</Footer>
		</form>
	</div>
</div>
