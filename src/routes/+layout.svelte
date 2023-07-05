<script>
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.css';
</script>

<h1 class="text-3xl text-center font-bold">Chattr!</h1>
<p class="text-center">Welcome to Chattr, a simple chat app built with Svelte.</p>

<div class="flex justify-center border-red-700 text-black">
	<!-- Div that takes up 1/2 of the screen -->
	<div class="w-full mx-2">
		<slot />
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
