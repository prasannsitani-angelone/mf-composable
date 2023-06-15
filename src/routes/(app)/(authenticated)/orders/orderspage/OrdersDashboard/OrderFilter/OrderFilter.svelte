<script lang="ts">
	import { filterStore } from '$lib/stores/FilterStore';
	import type { IOrderFilter } from '$lib/types/IOrderFilter';
	import type { OrdersSummary } from '$lib/types/IInvestments';
	import { Checkbox } from 'wms-ui-component';
	let ordersSummary: OrdersSummary;

	const handleChange = (name: string) => {
		let filters = $filterStore;
		filters[name as keyof IOrderFilter] = !filters[name as keyof IOrderFilter];
		filterStore.updateStore(filters);
	};

	export { ordersSummary };
</script>

<section
	class="mb-3 flex flex-col rounded-none border-none bg-white px-4 py-3 md:rounded-lg md:border md:px-5 md:pt-4 md:pb-5"
>
	<article class="mb-3 text-1xs text-grey-body md:mb-5 md:text-xs">FILTER BY</article>
	<article class="flex justify-between md:flex-col">
		<Checkbox
			on:click={() => handleChange('inprogress')}
			class="ml-[-4px]"
			checked={$filterStore.inprogress}
			label={`In Progress (${ordersSummary.totalProcessingOrders})`}
		/>
		<Checkbox
			on:click={() => handleChange('completed')}
			class="ml-[-4px] md:mt-6"
			checked={$filterStore.completed}
			label={`Completed (${ordersSummary.totalCompletedOrders})`}
		/>
		<Checkbox
			on:click={() => handleChange('failed')}
			class="ml-[-4px] md:mt-6"
			checked={$filterStore.failed}
			label={`Failed (${ordersSummary.totalFailedOrders})`}
		/>
	</article>
</section>
