<script lang="ts">
	import { onMount } from 'svelte';
	import { jsPDF } from 'jspdf';

	let divRef: HTMLElement;
	export const ssr = false;

	onMount(() => {
		divRef.to_pdf = async () => {
			const pdf = new jsPDF({ format: 'letter', orientation: 'portrait', unit: 'px' });
			pdf.html(divRef, { callback: () => pdf.save('download.pdf'), width: 400, windowWidth: 400 });
		};
	});
</script>

<div bind:this={divRef} class="h-full relative">
	<button class="float-right z-50 top-0 right-0 absolute" on:click={() => divRef.to_pdf()}
		>Download PDF</button
	>
	<slot />
</div>
