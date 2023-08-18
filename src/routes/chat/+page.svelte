<!-- This does the openai "chat" service. -->
<script>
	import PersonalityModule from '$lib/PersonalityModule.svelte';
	import { onMount, afterUpdate, beforeUpdate, tick } from 'svelte';
	import { slide, fly } from 'svelte/transition';
	import { conversations, uuid } from '$lib/conversations.js';
	import { options } from '$lib/optionsstore.js';
	import Conversations from '$lib/Conversations.svelte';
	import Chat from '$lib/Chat.svelte';
	import { v4 as uuidv4 } from 'uuid';

	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';

	import { setContext } from 'svelte';
	function generateUUID() {
		return uuidv4();
	}

	/**
	 * @type {Array<{content: string, role: string}>}
	 */
	let messages = [];

	/**
	 * @type {Array<{content: string, role: string}>}
	 */
	let errors = [];

	let personality = { content: '', role: 'system' };

	/**
	 * @type {{content: string, role: string}}
	 */
	let message = { content: '', role: 'user' };
	let loading = false;
	let loading_message = 'Loading...';
	let title = '';
	let autoscroll;

	$: setContext('chatOptions', { options });

	function newChatObj(uuid = null) {
		return {
			messages: [],
			options: {},
			uuid: uuid || generateUUID(),
			title: new Date().toLocaleString('en-US'),
			date: new Date(),
			default_title: true
		};
	}
	let chat = newChatObj();

	onMount(() => {
		$uuid.uuid = generateUUID();
	});

	$: storeConversation(chat);

	function storeConversation(conv) {
		if (conv.messages.length === 0) return;
		console.log('storing conversation', conv);
		$conversations[conv.uuid] = conv;
	}

	let changed = [];

	// Remove all messages after this one from the messages array

	function newConversation() {
		$uuid.uuid = generateUUID();
		chat = $conversations[$uuid.uuid] = newChatObj($uuid.uuid);
		console.log('YEAHHH');
	}
	let hidden = false;
</script>

<Drawer>
	<div class="h-full w-[400px] bg-surface-3" transition:fly={{ x: -100 }}>
		<PersonalityModule bind:message={personality} />
		<div class="modelselect w-full border-2 border-purple-500 my-2 rounded-sm p-2">
			<label class="text-white" for="model">Model</label>
			<select class="w-full text-purple-950 font-bold" id="model" bind:value={$options.model}>
				<option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
				<option value="gpt-4">GPT4</option>
			</select>
		</div>
		<Conversations bind:selected={chat} />
	</div>
</Drawer>

<!-- The page has two columns. The left one is w-1/4 the right is w-3/4 and contains all the messages. -->
<div class="flex flex-row flex-wrap md:flex-no-wrap transition-all h-screen">
	<div
		class="w-5 text-white transition-all"
		class:rotate-90={hidden}
		on:click={() => {
			drawerStore.open({ width: 'w-[400px]' });
		}}
	>
		≡
	</div>
	<div class="h-full w-full md:w-4/6 flex-grow transition-all">
		<Chat bind:chat newChat={newConversation} bind:personality />
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

	/* Add some text to the top of the readonly textarea */
	.readonly {
		background-color: theme(colors.gray.500);
	}

	.appbox > * {
		@apply text-white;
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

	.messagebox {
		scroll-margin-bottom: 100px;
	}
</style>
