<script lang="ts">
	import CrossBackIcon from '$lib/images/icons/CrossBackIcon.svelte';

	interface keysTypes {
		label: string;
		value: number | null;
	}

	const keys: Array<keysTypes> = [];

	for (let i = 1; i <= 9; i++) {
		keys.push({
			label: `${i}`,
			value: i
		});

		if (i === 9) {
			keys.push({
				label: '',
				value: null
			});

			keys.push({
				label: '0',
				value: 0
			});

			keys.push({
				label: `x`,
				value: -1
			});
		}
	}

	export let number = '';
	export let maxNumberLimit: number = Number.MAX_SAFE_INTEGER;

	const handleKeyClick = (val: number | null) => {
		const value = val?.toString();

		if (value && value?.length) {
			if (!number?.length) {
				number = '0';
			}

			if (value === '-1') {
				if (number?.length && parseInt(number) > 0) {
					number = number.substring(0, number?.length - 1);

					if (!number?.length) {
						number = '';
					}
				} else {
					number = '';
				}
			} else {
				number = `${parseInt(number) * 10 + parseInt(value)}`;

				if (parseInt(number) > maxNumberLimit) {
					number = number.substring(0, number?.length - 1);
				}
			}
		}
	};
</script>

<article class={$$props?.class}>
	<div class="flex flex-wrap items-center justify-evenly bg-white">
		{#each keys as key, index}
			<button
				type="button"
				on:click={() => handleKeyClick(key.value)}
				class={`my-[1px] flex w-[30%] justify-center rounded py-2 text-xl font-medium text-black-key ${
					typeof key.value === 'number' ? 'active:bg-gray-100' : ''
				}`}
			>
				{#if key.value === -1}
					<CrossBackIcon />
				{:else}
					{key.label}
				{/if}
			</button>
		{/each}
	</div>
</article>
