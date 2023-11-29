<script lang="ts">
	export let functions = [];
	import FunctionCard from './FunctionCard.svelte';
	$: console.log({ functions });

	function defaultFunction() {
		return {
			name: 'get_current_weather',
			description: 'Get the current weather in a given location',
			parameters: {
				type: 'object',
				properties: {
					location: {
						type: 'string',
						description: 'The city and state, e.g. San Francisco, CA'
					},
					unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
				},
				required: ['location']
			}
		};
	}
</script>

<div class="function-module">
	{#each functions as fun}
		<FunctionCard bind:fun />
	{/each}
	<button class="add-function" on:click={() => (functions = [...functions, defaultFunction()])}
		>Add Function</button
	>
</div>
