<!-- This does the openai "chat" service. -->
<script>
	// Import marked
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	// Define the JSDoc type for the messages variable.  It's an array of objects.
	/**
	 * @type {Array<{content: string, role: string}>}
	 */
	let messages = [];

	// Define the JSDoc type for the messagebox variable.  It's an object.
	/**
	 * @type {Object}
	 */
	let messagebox;

	let textentrybox;

	/**
	 * @type {{content: string, role: string}}
	 */
	let message = { content: '', role: 'user' };
	let loading = false;
	function scrollToBottom() {
		if (messagebox) {
			console.log({ message: 'Oh yes! Scrolling!', messagebox: messagebox });

			messagebox.scrollIntoView(false);
			textentrybox.focus();
		}
	}

	$: if (!loading) {
		scrollToBottom();
	}

	onMount(() => {
		scrollToBottom();
	});

	function postMessage() {
		messages = [...messages, message];
		console.log(messages);

		message = { content: '', role: 'user' };
		message.content = '';
		loading = true;

		// Use fetch to send a POST request to the server.
		fetch('/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				messages: JSON.stringify(messages)
			})
		})
			.then((response) => response.json())
			.then((data) => {
				var resp = JSON.parse(data.data);
				messages = [...messages, { content: resp[3], role: resp[2] }];
				console.log(messages);
				loading = false;
			});
	}
</script>

<!-- A "chat" is a list of messages from the server, and messages from the user. -->
<div class="flex flex-col content-center">
	{#each messages as message}
		<div class="message">
			<div class="role">{message.role == 'user' ? 'You' : 'GPT'}</div>
			<div class="content">{@html marked(message.content)}</div>
		</div>
	{/each}
	<div class:loading bind:this={messagebox} class="textentry-row w-full">
		<textarea
			placeholder={loading ? 'Loading....' : ''}
			readonly={loading}
			class:readonly={loading}
			bind:value={message.content}
			bind:this={textentrybox}
		/>
		<button class="button" on:click={postMessage}>Send</button>
		<button class="button bg-red-300 ml-4" on:click={() => (messages = [])}>Clear</button>
	</div>
</div>

<style lang="postcss">
	.message {
		@apply p-4 border border-red-700 shadow-inner;
		color: theme(colors.white);
	}
	.role {
		@apply text-sm font-bold;
	}
	.content {
		@apply text-lg;
		white-space: pre-wrap;
	}
	textarea {
		width: 100%;
		background-color: theme(colors.purple.900);
		color: theme(colors.white);
		@apply p-4 border border-red-700 shadow-inner;
	}
	textarea:read-only {
		color: theme(colors.gray.500);
	}
	.button {
		@apply pulse px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400;
		@apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
	}
	.textentry {
		@apply bg-purple-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
	}
	.textentry-row {
		/* Div should be Full width */
		@apply flex flex-row drop-shadow-2xl;
	}

	/* Add some text to the top of the readonly textarea */
	.readonly {
		background-color: theme(colors.gray.500);
	}

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
</style>
