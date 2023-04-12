<!-- This does the openai "chat" service. -->
<script>
	// Import marked
	import { marked } from 'marked';

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

	/**
	 * @type {{content: string, role: string}}
	 */
	let message = { content: '', role: 'user' };

	function scrollToBottom() {
		if (messagebox) {
			console.log({ message: 'Oh yes! Scrolling!', messagebox: messagebox });

			messagebox.scrollIntoView(false);
		}
	}

	$: if (messagebox) {
		scrollToBottom();
	}

	function postMessage() {
		messages = [...messages, message];
		console.log(messages);

		message = { content: '', role: 'user' };
		message.content = '';

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
			});
	}
</script>

<!-- A "chat" is a list of messages from the server, and messages from the user. -->
<div class="border-white border-4">
	{#each messages as message}
		<div class="message">
			<div class="role">{message.role}</div>
			<div class="content">{@html marked(message.content)}</div>
		</div>
	{/each}
	<div bind:this={messagebox} class="textentry-row w-full">
		<textarea bind:value={message.content} />
		<button class="button" on:click={postMessage}>Send</button>
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
		@apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
	}
	.textentry {
		@apply bg-purple-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
	}
	.textentry-row {
		/* Div should be Full width */
		@apply flex flex-row;
	}
</style>
