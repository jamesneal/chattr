<script lang="ts">
	export let fun;
	let open = true;
</script>

<button id="myBtn" on:click={() => (open = true)}>Open Modal</button>

<!-- The Modal -->
<dialog {open} class="absolute top-0 mt-20">
	<!-- Modal content -->
	<div class="modal-content">
		<span class="close" on:click={() => (open = false)}>&times;</span>

		<h1>Function</h1>
		<button value="cancel" formmethod="dialog">Close</button>

		<form class="">
			<label for="name">Name</label>
			<input id="name" bind:value={fun.name} />

			<label for="description">Description</label>
			<input id="description" bind:value={fun.description} />

			<label for="location">Location</label>
			<input id="location" bind:value={fun.parameters.properties.location.description} />

			<label for="unit">Unit</label>
			<select id="unit" bind:value={fun.parameters.properties.unit.type}>
				<option value="celsius">Celsius</option>
				<option value="fahrenheit">Fahrenheit</option>
			</select>
		</form>
	</div>
</dialog>

<style>
	form > input {
		display: block;
		margin-bottom: 1rem;
		color: #333;
	}
</style>
