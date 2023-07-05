<script>
	export let message;
	export let send = () => {};
	let loading = false;
	let loading_message = 'Loading...';
	let textentrybox;

	function handleKeypress(event) {}
</script>

<div class="w-full flex flex-row border-t-2">
	<form class="w-full flex flex-row">
		<textarea
			autofocus
			placeholder={loading ? loading_message : ''}
			readonly={loading}
			id="textentrybox"
			class:readonly={loading}
			on:keypress={handleKeypress}
			bind:value={message.content}
			bind:this={textentrybox}
			class="block p-2.5 w-full input rounded-none"
		/>
		<button
			type="submit"
			on:click={send}
			class="button align-middletext-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
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
	</form>
</div>

<style lang="postcss">
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

	.button {
		@apply pulse px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400;
		@apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
	}
	.debug > * {
		border: 1px solid red;
	}
</style>
