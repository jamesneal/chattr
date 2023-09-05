<!-- This does the openai "chat" service. -->
<script>
	import PersonalityModule from '$lib/PersonalityModule.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { conversations, uuid } from '$lib/conversations.js';
	import { options } from '$lib/optionsstore.js';
	import Conversations from '$lib/Conversations.svelte';
	import Chat from '$lib/Chat.svelte';
	import { v4 as uuidv4 } from 'uuid';

	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';

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
</style>
