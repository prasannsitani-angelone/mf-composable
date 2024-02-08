<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$components/Button.svelte';
	import THSorting from './THSorting.svelte';
	const dispatch = createEventDispatcher();
	let clazz = '';
	let sortable = false;
	let isHorizontalSort = false;
	let sortField = '';
	let wrapperClass = '';
	let thStyle = '';
	export { clazz as class, sortable, isHorizontalSort, sortField, wrapperClass, thStyle };
	let sortType = '';

	const initiateSort = () => {
		if (!sortable) return;
		sortType = sortType === '' || sortType === 'asc' ? 'dec' : 'asc';
		dispatch('initSort', {
			sortType,
			sortField
		});
	};
</script>

<th
	class={`h-12 border-b bg-background-alt py-0 pl-5 pr-6 font-normal text-body ${clazz}`}
	style={thStyle}
>
	{#if sortable}
		<Button
			size="xs"
			variant="transparent"
			class={`!m-auto flex items-center !p-0 !text-xs !font-normal !text-primary ${
				wrapperClass || ''
			}`}
			onClick={initiateSort}
		>
			<slot />
			<THSorting {isHorizontalSort} />
		</Button>
	{:else}
		<div class={`flex items-center text-body  ${wrapperClass || ''}`}>
			<slot />
		</div>
	{/if}
</th>
