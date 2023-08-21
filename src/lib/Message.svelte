<script lang="ts">
	export let count = 0;
	export let message;
	export let blur = () => {};
	export let reload = () => {};
	export let num;

	import { marked } from 'marked';
	import { slide } from 'svelte/transition';

	function deleteMessage(e) {
		message.role = 'deleted';
	}
	function handleReturn(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			event.target.blur();
		}
	}
</script>

<div id="message_{count}" class="message snap-start" transition:slide>
	<div class="float-right bottom-0">
		<button id={num} title="Regenerate the conversation from this point down." on:click={reload}
			>♻️</button
		>
		<button title="Delete this line" on:click={deleteMessage}>❌</button>
	</div>

	<div class="role">{message.role == 'user' ? 'You' : 'GPT'}</div>
	<div
		class="content flex flex-col"
		class:text-right={message.role == 'user'}
		contenteditable="true"
		on:keypress={handleReturn}
		on:blur={blur}
	>
		<div class="justify-end place-content-end text-left">
			{#if message.role == 'user'}
				{message.content}
			{:else}
				{@html marked(message.content)}
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.message {
		@apply p-4 border shadow-inner whitespace-normal break-words shrink;
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
