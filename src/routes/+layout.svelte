<script>
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.css';
</script>

<slot />

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
