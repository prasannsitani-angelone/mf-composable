<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import TickInsideSearchIcon from '$lib/images/icons/TickInsideSearchIcon.svelte';
	import StatusTile from '../StatusTile/StatusTile.svelte';
	import type { StatusHistoryItem } from '../type';

	export let statusHistoryItems: Array<StatusHistoryItem> = [];
	export let clazz = '';
	export let heading = '';
</script>

<AccordianCardComponent
	data={{ title: '' }}
	class={`!mt-0 !max-w-full !rounded ${clazz}`}
	headerClass="!px-4 !py-3"
>
	<div slot="titleIcon">
		<TickInsideSearchIcon />
	</div>
	<div slot="titleUserAction">
		<div class="mb-1 text-xs text-grey-body">Order Status</div>
		<div class="mb-1 text-sm font-normal text-black-title">{heading}</div>
		<div class="text-xs text-grey-body">Track progress for this order</div>
	</div>
	<div
		slot="accordionBody"
		class="flex flex-col border-t border-grey-line px-4 pb-1 pt-1 sm:flex-row sm:pb-3 sm:pt-3"
	>
		{#each statusHistoryItems as item, index}
			<StatusTile {item} {index} itemsCount={statusHistoryItems.length} />
		{/each}
	</div>
</AccordianCardComponent>
