<script lang="ts">
	export let handleFiles: (files: File[]) => void = () => {};
	export let disabled = false;
	export let name = '';

	let droppable = false;
	$: if (disabled) droppable = false;

	let input: HTMLInputElement;
	let inputFiles: FileList;

	function getAcceptedFiles(files: FileList | File[] = []) {
		let acceptedFiles = [];
		for (let i = 0; i < files.length; i++) {
			if (isAccepted(files[i])) {
				acceptedFiles.push(files[i]);
			}
		}

		// accept only one file
		acceptedFiles = acceptedFiles.slice(0, 1);

		return acceptedFiles;
	}

	function isAccepted(item: DataTransferItem | File): boolean {
		const file = item instanceof DataTransferItem ? item.getAsFile() : item;
		if (file?.name.endsWith('.pdf')) {
			return true;
		}
		return false;
	}

	function dragOver(e: DragEvent) {
		if (disabled) {
			return;
		}
		const items = Array.from(e.dataTransfer?.items || []);
		for (const item of items) {
			if (item.kind === 'file' && isAccepted(item)) {
				droppable = true;
				return;
			}
		}
	}

	function dragLeave() {
		droppable = false;
	}

	function drop(e: DragEvent) {
		if (disabled) {
			return;
		}
		const acceptedFiles = getAcceptedFiles(e.dataTransfer?.files);
		if (acceptedFiles.length > 0) {
			handleFiles(acceptedFiles);
		}
		droppable = false;
	}

	function handleChange() {
		const acceptedFiles = getAcceptedFiles(inputFiles);
		if (acceptedFiles && acceptedFiles.length > 0) {
			handleFiles(acceptedFiles);
		}
	}

	function keydown(e: KeyboardEvent) {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			input.click();
		}
	}
</script>

<div
	on:drop|preventDefault={drop}
	on:dragover|preventDefault={dragOver}
	on:dragenter|preventDefault={dragOver}
	on:dragleave|preventDefault={dragLeave}
	on:keydown={keydown}
	on:click={() => input.click()}
	role="button"
	aria-label="File Upload"
	tabindex="0"
>
	<slot {droppable} />
</div>
<input
	class="hidden"
	type="file"
	accept=".pdf"
	multiple={false}
	bind:files={inputFiles}
	on:change|preventDefault={handleChange}
	bind:this={input}
	{disabled}
	{name}
/>
