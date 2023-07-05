<script>
	export let chat;
	export let newChat = () => {};
	import Message from './Message.svelte';
	import ChatBox from './ChatBox.svelte';
	import PdfDiv from './PdfDiv.svelte';

	let message = { content: '', role: 'user' };

	function newConversation() {
		console.log('new conversation');
		newChat();
	}
	function continueConversation() {
		console.log('continue conversation');
	}
	function sendMessage() {
		// Add a *copy* of the message to the chat.
		chat.messages = [...chat.messages, Object.assign({}, message)];
		message = { content: '', role: 'user' };
	}
</script>

<div class="h-full w-full flex flex-col rounded-md border-2">
	<div class="flex border-b-2">
		<div class="flex-grow-0">Title</div>
		<div class="flex-grow mx-2"><input bind:value={chat.title} class="input px-2" /></div>
	</div>
	<div class="h-full flex-grow overflow-scroll scroll-m-0 scroll-auto messages">
		{#each chat.messages as message, i}
			{#if message.role != 'deleted'}
				<Message bind:message />
			{/if}
		{/each}
	</div>
	<div><ChatBox bind:message send={sendMessage} /></div>
	<div>
		<button class="button" on:click={newConversation}>New!</button>
		<button class="button" id="continue" on:click={continueConversation}>Continue</button>
	</div>
</div>

<style lang="postcss">
	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}

		50% {
			transform: scale(1.05);
			opacity: 0.7;
		}

		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.pulse:hover {
		animation: pulse 2s ease-out infinite;
	}

	.button {
		@apply pulse px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400;
		@apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
	}

	.messages {
		scrollbar-width: thin;
		scrollbar-gutter: stable;
	}
</style>
