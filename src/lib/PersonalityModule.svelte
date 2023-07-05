<script>
	// import the persoanlities store
	import { liveQuery } from 'dexie';
	import { db } from '$lib/personalities.js';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let personalities = liveQuery(() => db.personalities.toArray());

	export let message = { content: '', role: 'system' };
	export let temperature = 0.9;
	export let selected = 'default';
	let hidden = false;

	let newpersonalityname = '';
	async function changePersonality(event) {
		const name = event.target.value;
		if (name === 'default') {
			message.content = '';
			temperature = 0.5;
			return;
		} else {
			const personality = $personalities.find((p) => p.id === Number(name));
			message.content = personality.message;
			temperature = personality.temperature;
		}
	}
	async function savePersonality() {
		if (newpersonalityname === '') {
			alert('Please enter a name for this personality');
			return;
		}
		const personality = {
			name: newpersonalityname,
			message: message.content,
			temperature: temperature
		};
		const id = await db.personalities.add(personality);
		selected = id;
		console.log('saved personality', id);
		newpersonalityname = '';
	}

	function updatePersonality() {
		const personality = $personalities.find((p) => p.id === Number(selected));
		personality.message = message.content;
		personality.temperature = temperature;
		db.personalities.update(personality.id, personality);
	}

	function deletePersonality() {
		const personality = $personalities.find((p) => p.id === Number(selected));
		db.personalities.delete(personality.id);
		selected = 'default';
	}
</script>

<div class="flex flex-col border-2 border-purple-500 rounded">
	<div class="border-b-2 text-center text-white border-white cursor-pointer">
		≡ Personality Module (beta)
	</div>
	<div class="m-2" class:hidden>
		<textarea
			id="personality"
			bind:value={message.content}
			placeholder="You are a friendly and helpful chat AI.  You like telling jokes. "
		/><br />
		<label for="temperature">Temperature (how "creative" the response is)</label>
		<input type="range" class="w-full" min="0" max="1" step="0.1" bind:value={temperature} />
		<div class="text-white text-center">{temperature}</div>
		<div class="text-white flex flex-row text-center">
			<div><button on:click={savePersonality} class="button">Save</button></div>
			<div class="w-full">
				<input
					class="textinput"
					bind:value={newpersonalityname}
					type="text"
					placeholder="Name this personality"
					name="name"
				/>
			</div>
		</div>
		<div class="personalitieslist w-full">
			<!-- A dropdown list of all the personalities in the store -->
			<select bind:value={selected} class="w-full" on:change={changePersonality}>
				<option value="default">Select a personality</option>
				{#if $personalities}
					{#each $personalities as personality}
						<option value={personality.id}>{personality.name}</option>
					{/each}
				{/if}
			</select>
		</div>
		<!-- Update a personality -->
		{#if selected !== 'default'}
			<div class="text-white text-center flex flex-row">
				<div class="w-full mr-2">
					<button on:click={deletePersonality} class="button w-full">Delete</button>
				</div>
				<div class="w-full">
					<button on:click={updatePersonality} class="button w-full">Update</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	textarea {
		width: 100%;
		height: 100px;
	}
	label {
		display: block;
		color: #fff;
	}
	.textinput {
		@apply bg-purple-800 font-bold py-2 px-4 w-full rounded;
	}
	.textinput::placeholder {
		color: #fff;
		font-size: small;
	}
	.button {
		@apply bg-blue-500 h-full text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150;
	}
	textarea {
		width: 100%;
		background-color: theme(colors.purple.900);
		color: theme(colors.white);
		@apply p-4 border border-red-700 shadow-inner;
	}
</style>
