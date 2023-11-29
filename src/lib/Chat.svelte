<script lang="ts">
	import { tick } from 'svelte';

	import { options } from '$lib/optionsstore.js';

	export let chat;
	export let personality;

	export let newChat = () => {};

	import Message from './Message.svelte';
	let message = { content: '', role: 'user' };
	let input: string = '';
	let loading = false;

	import { onMount, afterUpdate } from 'svelte';

	afterUpdate(() => {
		tick().then(() => {
			scrollToBottom();
		});
	});

	onMount(() => {
		console.log(chat);
	});

	const browser = import.meta.env.SSR === false;

	async function postRequest(messages, options) {
		loading = true;
		const response = await fetch('/chat', {
			method: 'POST',
			body: JSON.stringify({ messages, options }),
			headers: {
				'content-type': 'application/json'
			}
		});
		console.log('DAWG');
		console.log({ response });

		let text = '';
		const reader = response.body.getReader();
		const textDecoder = new TextDecoder();

		chat.messages = [...chat.messages, { role: 'assistant', content: 'Loading...' }];

		console.log(chat.messages[chat.messages.length - 1]);
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			text += textDecoder.decode(value, { stream: true });
			chat.messages[chat.messages.length - 1].content = text;
		}
		text += textDecoder.decode(); // Decode any remaining text
		chat.messages[chat.messages.length - 1].content = text;

		if (chat.messages.length == 4 || chat.messages.length == 5) {
			summarizeConversation();
		}
		loading = false;

		return text;
	}

	async function sendRequest() {
		console.log($options);

		if (input != '') {
			chat.messages = [...chat.messages, { role: 'user', content: input }];
			input = '';
		}

		const messages = [personality, ...chat.messages];

		postRequest(messages, $options);
	}

	let form;
	let messagebox: HTMLDivElement;

	function regenerate(event: SubmitEvent) {
		console.log(event.target.id);
		const index = event.target.id;
		console.log('Reloading from message ' + index);
		chat.messages = chat.messages.slice(0, index);
		postRequest(chat.messages, $options);
	}

	function handlePress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendRequest();
		}
	}
	function scrollToBottom() {
		if (!loading) return;
		messagebox.scrollTo(0, messagebox.scrollHeight);
	}

	$: chat.messages = chat.messages.filter(
		(message) => message.role != 'deleted' && message.content && message.content.trim() !== ''
	);

	$: messagebox && scrollToBottom();

	async function summarizeConversation() {
		const response = await fetch('/chat', {
			method: 'POST',
			body: JSON.stringify({
				options: {},
				messages: [
					personality,
					...chat.messages,
					{
						role: 'system',
						content:
							'Concisely summarize this conversation so far into a single sentence title. Be silly and sarcastic. No quotation marks.'
					}
				]
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		const text = await response.text();
		chat.title = text;
	}
</script>

<div
	class="w-full flex-grow border-2 rounded-xl flex flex-col h-full min-h-[90%] max-h-full resize overflow-auto"
>
	<div class="border-b-2 relative flex flex-row justify-between">
		<div class="mx-2 overflow-auto flex-grow" on:click={summarizeConversation}>{chat.title}</div>
		<div class="right-0 w-1/4 text-right">{chat.date.toLocaleString('en-US')}</div>
	</div>
	<div bind:this={messagebox} id="messagebox" class="overflow-scroll">
		{#each chat.messages as message, i}
			<Message num={i} bind:message reload={regenerate} />
		{/each}
		<!-- {#if loading}
			<Message message={{ role: 'assistant', content: 'Loading...' }} />
		{/if} -->
	</div>
	<div class="flex-grow" />
	<div class="w-full shrink border-t-2" id="chatbox">
		<form bind:this={form} class="m-2">
			<textarea
				autofocus
				bind:value={input}
				class="resize-none w-full bg-surface-700 text-white px-2 h-[5rem]"
				on:keypress={handlePress}
			/>
			<div class="flex flex-row">
				<button
					class="btn grow bg-surface-800 border-b-2 rounded-none rounded-b-xl rounded-r-none border-2"
					type="submit"
					on:click={sendRequest}>Send</button
				>
				<button
					class="btn grow bg-surface-800 border-b-2 rounded-none border-2"
					type="button"
					on:click={sendRequest}>Continue</button
				>

				<button
					class="btn bg-surface-800 border-red-700 border-2 rounded-none"
					type="button"
					on:click={() => newChat()}>New</button
				>
			</div>
		</form>
	</div>
</div>

<style lang="postcss">
</style>
