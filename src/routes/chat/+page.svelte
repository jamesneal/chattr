<!-- This does the openai "chat" service. -->
<script>
	// Import marked
	import PersonalityModule from '$lib/PersonalityModule.svelte';
	import Message from '$lib/Message.svelte';
	import { marked } from 'marked';
	import { onMount, afterUpdate, beforeUpdate } from 'svelte';
	import { slide } from 'svelte/transition';
	import axios from 'axios';
	import axiosRetry from 'axios-retry';

	/**
	 * @type {Array<{content: string, role: string}>}
	 */
	let messages = [];

	/**
	 * @type {Array<{content: string, role: string}>}
	 */
	let errors = [];

	// Define the JSDoc type for the messagebox variable.  It's an object.
	/**
	 * @type {Object}
	 */
	let scrolltarget;
	let messagelist;

	/**
	 * @type {Object}
	 */
	let textentrybox;

	let personality = { content: '', role: 'system' };

	let selectedpersonality = 'default';

	/**
	 * @type {{content: string, role: string}}
	 */
	let message = { content: '', role: 'user' };
	let loading = false;
	let loading_message = 'Loading...';

	let autoscroll;

	onMount(() => {
		textentrybox.focus();
	});

	beforeUpdate(() => {
		if (messagelist) {
			autoscroll =
				messagelist &&
				messagelist.offsetHeight + messagelist.scrollTop > messagelist.scrollHeight - 20;
		}
	});

	afterUpdate(() => {
		if (autoscroll) messagelist.scrollTo(0, messagelist.scrollHeight);
	});

	function handleKeypress(event) {
		if (event.metaKey && event.keyCode === 13) {
			// Command+Enter was pressed
			myFunction();
		}
	}

	function myFunction() {
		console.log('Command+Enter was pressed');
		// Insert your desired function here
	}

	function clearMessages() {
		messages = [];
	}

	function scrollToBottom() {
		if (scrolltarget) {
			messagelist.scroll({
				top: messagelist.scrollHeight,
				behavior: 'smooth'
			});

			textentrybox.focus();
		}
	}

	onMount(() => {
		textentrybox.focus();
	});

	function fetchMessages(outgoing_messages) {
		loading = true;
		loading_message = 'Loading...';
		const data = new URLSearchParams({
			messages: JSON.stringify(outgoing_messages)
		});
		axiosRetry(axios, {
			retries: 5,
			retryDelay: axiosRetry.exponentialDelay,
			onRetry: () => {
				console.log('Retrying...');
				loading_message = 'Retrying...';
			},
			retryCondition: (error) => {
				return true;
			}
		});
		axios
			.post('/chat', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
			.then((response) => {
				var resp = JSON.parse(response.data.data);
				if (resp.error) {
					message.content = messages[messages.length - 1].content;

					messages = [...messages, { content: resp.error, role: 'error' }];
					loading = false;
					return;
				}
				messages = [...messages, { content: resp[3], role: resp[2] }];
				loading = false;
			})
			.catch((error) => {
				console.error('Error:', error);
				errors = [{ content: error, role: 'error' }];
				loading = false;
				message.content = messages[messages.length - 1].content;
				// remove the last message
				messages = messages.slice(0, -1);
			});
	}

	function postMessage() {
		errors = [];
		let messages_to_send = [];
		if (personality.content !== '') {
			messages_to_send = [personality, ...messages, message];
		} else {
			messages_to_send = [...messages, message];
		}
		messages = [...messages, message];

		message = { content: '', role: 'user' };
		message.content = '';
		changed = [];

		console.log('sending', messages_to_send);
		// Use fetch to send a POST request to the server.
		fetchMessages(messages_to_send);
	}

	let changed = [];

	function updateContent(event, message) {
		message.content = event.target.innerText;
		changed[messages.indexOf(message)] = true;
	}

	// Remove all messages after this one from the messages array
	function reload(index) {
		console.log('Reloading from message ' + index);
		messages = messages.slice(0, index);
		let mymessages = [];
		if (personality.content !== '') {
			mymessages = [personality, ...messages];
		} else {
			mymessages = [...messages];
		}
		fetchMessages(mymessages);
	}

	function continueConversation() {
		let mymessages = [];
		if (personality.content !== '') {
			mymessages = [personality, ...messages];
		} else {
			mymessages = [...messages];
		}
		fetchMessages(mymessages);
	}
</script>

<!-- The page has two columns. The left one is w-1/4 the right is w-3/4 and contains all the messages. -->
<div class="appbox flex flex-row flex-wrap md:flex-no-wrap">
	<div class="mr-4 w-full md:w-1/4">
		<PersonalityModule bind:message={personality} />
	</div>
	<div class="h-full w-full md:w-4/6">
		<div class="flex flex-col h-full relative w-full border-2 rounded">
			<div bind:this={messagelist} class="grow overflow-y-scroll content-center">
				{#each messages as message, i}
					<Message
						bind:message={message.content}
						bind:role={message.role}
						onblur={(event) => updateContent(event, message)}
						reload={() => reload(i)}
					/>
				{/each}
				{#each errors as error, i}
					<div id="error_{i}" class="message" transition:slide>
						<div class="role">{message.role == 'user' ? 'You' : 'GPT'}</div>
						<div class="error">{error.content}</div>
					</div>
				{/each}
				<div bind:this={scrolltarget} class="messagebox" />
			</div>
			<div class:loading class="textentry-row flex flex-row">
				<form class="w-full">
					<div class="grow">
						<textarea
							placeholder={loading ? loading_message : ''}
							readonly={loading}
							id="textentrybox"
							class:readonly={loading}
							on:keypress={handleKeypress}
							bind:value={message.content}
							bind:this={textentrybox}
							class="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						/>
					</div>
					<div>
						<button
							type="submit"
							on:click={postMessage}
							class="button align-middle p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
						>
							<svg
								aria-hidden="true"
								class="w-6 h-6 rotate-90"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
								><path
									d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
								/></svg
							>
							<span class="sr-only">Send message</span>
						</button>
						<button class="button bg-red-300 ml-4" on:click={clearMessages}>Clear</button>
						<button class="button ml-4" id="continue" on:click={continueConversation}
							>Continue</button
						>
					</div>
				</form>
			</div>
		</div>
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
		width: 100%;
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

	.messagewindow {
		height: 90vh;
	}

	.appbox {
		height: 90vh;
	}
</style>
