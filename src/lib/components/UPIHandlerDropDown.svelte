<script lang="ts">
	import { upiHandlersStore } from '$lib/stores/UPIHandlers';
	import { onMount } from 'svelte';
	import BaseInput from './BaseInput.svelte';
	import { debounce } from '$lib/utils/helpers/debounce';

	export let inputText = '';
	export let onInputChange: (data: string) => void;
	export let inputError = '';

	let filteredHandlers = [];

	const getHandlersForUPIIdSuggestions = async () => {
		if (!upiHandlersStore.isLoaded()) {
			upiHandlersStore.fetchData();
		}
	};

	onMount(() => {
		getHandlersForUPIIdSuggestions();
	});

	const getFilteredHandlersList = debounce((data: string) => {
		const splitArr = data.split('@') || [];
		const searchText = splitArr[1] || '';
		const staticText = splitArr[0] || '';
		if (searchText) {
			filteredHandlers = upiHandlersStore.getSuggestions(`@${searchText}`, staticText);
		} else {
			filteredHandlers = [];
		}
	}, 300);

	const onChange = (data: string) => {
		onInputChange(data);
		getFilteredHandlersList(data);
	};

	const onItemDopDrownClick = (data: string) => {
		onInputChange(data);
		filteredHandlers = [];
	};
</script>

<div class="relative">
	<BaseInput
		id="inputID"
		value={inputText}
		{onChange}
		heading=""
		placeholder="Enter UPI Id"
		classes={{
			label: '',
			error: '',
			container: 'px-3 py-3 shadow-none !rounded-none !border',
			input: 'text-start',
			parent: 'flex-1 bg-white'
		}}
	/>
	{#if filteredHandlers?.length > 0}
		<div
			class="absolute left-0 right-0 flex flex-1 flex-col gap-2 border border-t-0 bg-white p-2.5 text-sm font-semibold text-black-title"
		>
			{#each filteredHandlers as item, index (index)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="w-full bg-white active:opacity-80" on:click={() => onItemDopDrownClick(item)}>
					{item}
				</div>
			{/each}
		</div>
	{/if}
	{#if inputError}
		<div class="text-xs font-medium text-red-sell">
			{inputError}
		</div>
	{/if}
</div>
