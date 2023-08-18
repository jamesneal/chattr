<script>
	import { conversations } from './conversations.js';
	export let selected;

	function removeConversation(event) {
		const key = event.target.id;
		console.log('removing conversation', key);
		conversations.update((obj) => {
			delete obj[key];
			return obj;
		});
	}
</script>

<div class="w-full border-purple-500 border-2 rounded-sm">
	<div class="justify-between flex flex-row">
		<div class="text-bold border-b-2 flex-grow">Conversations</div>
	</div>
	{#each Object.keys($conversations) as key}
		{#if $conversations[key].messages.length >= 0}
			<div class="flex flex-row">
				<div class="cursor-pointer flex-grow" on:click={() => (selected = $conversations[key])}>
					{$conversations[key].title || $conversations[key].uuid} ({$conversations[key].messages
						.length})
				</div>
				<div class="flex-shrink">
					<button id={key} on:click={removeConversation} class="align-right">🗑️</button>
				</div>
			</div>
		{/if}
	{/each}
</div>
