<script>
	export let count = 0;
	export let message = '';
	export let role = '';
	export let updateContent = () => {};
	export let onblur = () => {};
	export let reload = () => {};

	import { marked } from 'marked';

	import { slide } from 'svelte/transition';
</script>

<div id="message_{count}" class="message" transition:slide>
	<div class="float-right bottom-0">
		<button on:click={reload}>♻️</button>
	</div>

	<div class="role">{role == 'user' ? 'You' : 'GPT'}</div>
	<div class="content" contenteditable="true" on:blur={onblur}>
		{#if role == 'user'}
			{message}
		{:else}
			{@html marked(message)}
		{/if}
	</div>
</div>

<style lang="postcss">
	.message {
		@apply p-4 border border-red-700 shadow-inner whitespace-normal break-words;
		color: theme(colors.white);
	}
	.role {
		@apply text-sm font-bold;
	}
	.content {
		@apply text-lg;
		white-space: pre-wrap;
	}
</style>
