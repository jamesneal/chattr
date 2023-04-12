<script>
	// Define the JSDoc type for the data variable.  It's an Object.
	/**
	 * @type {Object}
	 */
	export let form;
	/**
	 * @type {string}
	 */
	var textbox = form?.prompt || '';

	var loading = false;
	// If form changes, update the textbox.
</script>

<form method="POST">
	<textarea
		rows="20"
		placeholder="Enter your prompt here..."
		name="prompt"
		bind:value={textbox}
		readonly={loading}
	/><br />
	<button
		class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		on:click={() => (loading = true)}>Send</button
	>
	{#if loading}
		<div class="spinner">Loading....</div>
	{/if}
</form>

<style lang="postcss">
	textarea {
		width: 100%;
		background-color: theme(colors.purple.900);
		color: theme(colors.white);
		@apply p-4 border border-red-700 shadow-inner;
	}
	textarea:read-only {
		color: theme(colors.gray.500);
	}
</style>
