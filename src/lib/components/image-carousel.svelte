<script lang="ts">
	import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-svelte';

	export let images: string[] = [];
	export let currentSlideItem = 0;

	const nextImage = () => {
		currentSlideItem = (currentSlideItem + 1) % images.length;
	};

	const prevImage = () => {
		if (currentSlideItem != 0) {
			currentSlideItem = (currentSlideItem - 1) % images.length;
		} else {
			currentSlideItem = images.length - 1;
		}
	};
</script>

<div class="h-64 flex justify-center gap-4 relative">
	{#each [images[currentSlideItem]] as item (currentSlideItem)}
		<img class="h-full object-cover shadow-md" src={item} alt="" />
	{/each}
	<div class="absolute bottom-0 right-0">
		<button on:click={() => prevImage()} type="button"><ArrowLeftCircle /></button>
		<button on:click={() => nextImage()} type="button"><ArrowRightCircle /></button>
	</div>
</div>
