<script>
	export let count = 0;
	export let message = '';
	export let role = '';
	export let blur = () => {};
	export let reload = () => {};

	import { marked } from 'marked';

	import { slide } from 'svelte/transition';
</script>

<div id="message_{count}" class="message snap-start" transition:slide>
	<div class="float-right bottom-0">
		<button title="Regenerate the conversation from this point down." on:click={reload}>♻️</button>
	</div>

	<div class="role">{role == 'user' ? 'You' : 'GPT'}</div>
	<div
		class="content flex flex-col"
		class:text-right={role == 'user'}
		contenteditable="true"
		on:blur={blur}
	>
		<div class="justify-end place-content-end text-left">
			{#if role == 'user'}
				{message}
			{:else}
				{@html marked(message)}
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.message {
		@apply p-4 border border-red-700 shadow-inner whitespace-normal break-words shrink;
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
