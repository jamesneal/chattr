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

<h1 class="text-3xl text-center font-bold">Chattr!</h1>
<p class="text-center">Welcome to Chattr, a simple chat app built with Svelte.</p>

<div class="flex justify-center border-red-700 text-black">
	<!-- Div that takes up 1/2 of the screen -->
	<div class="w-1/2">
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
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.purple.950);
		color: theme(colors.white);
	}
	:global(h1) {
		text-shadow: 0 0 0.5rem theme(colors.white);
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
</style>
