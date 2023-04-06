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
	export { clazz as class, sortable, isHorizontalSort, sortField, wrapperClass };
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
	class={`border-b border-grey-line bg-white pl-5 pt-4 pb-4 pr-6 font-medium text-grey-body ${clazz}`}
>
	{#if sortable}
		<Button
			class={`!m-auto flex items-center !p-0 !text-xs !font-medium text-grey-body ${
				wrapperClass || ''
			}`}
			onClick={initiateSort}
			variant="text"
		>
			<slot />
			<THSorting {isHorizontalSort} />
		</Button>
	{:else}
		<div class={`flex items-center text-grey-body  ${wrapperClass || ''}`}>
			<slot />
		</div>
	{/if}
</th>
