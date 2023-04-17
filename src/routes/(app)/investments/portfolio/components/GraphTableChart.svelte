<script lang="ts">
	import type { TableDataTypes } from '$lib/types/IPortfolioDetails';
	import SplitGraph from './SplitGraph.svelte';
	import CompaniesTable from './CompaniesTable.svelte';
	import FilterItem from './FilterItem.svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let type: string;
	export let parentId: string;
	export let subLabel: string;
	export let nameColumnHeader: string;
	export let nameColumnHeaderForFunds: string;
	export let footerText: string;
	export let currentValue: number;
	export let chartsData: Array<TableDataTypes>;
	export let graphColors: Array<string>;
	export let filterTypes: Array<string>;
	export let filteredData: Array<TableDataTypes>;
	export let selectedFilterIndex: number;
	export let showColor: boolean;
	export let showCompaniesFooter: boolean;
	export let viewMoreFooter: boolean;
	export let showFundsFilterTable: boolean;

	const handleFilterChange = (type: string, index: number) => {
		dispatch('filterChange', { type, index });
	};

	const handleToggleFilterTable = (type: string) => {
		dispatch('toggleFilterTable', { type });
		handleFilterChange(type, 0); // reset selected filter index to 0 (zero) on show/hide table toggle
	};
</script>

<article
	class={`flex flex-col items-center justify-center border-b lg:flex-row lg:items-start lg:px-20 lg:py-8 ${$$props.class}`}
>
	<SplitGraph
		{parentId}
		aum={currentValue}
		graphColor={graphColors}
		holding={chartsData}
		{subLabel}
	/>
	{#if chartsData}
		<section class="flex flex-col rounded lg:ml-6 lg:border">
			<CompaniesTable
				graphColor={graphColors}
				holding={chartsData}
				{nameColumnHeader}
				{showColor}
				{showCompaniesFooter}
				{footerText}
				isCompaniesTableVisible={showFundsFilterTable}
				on:toggleFilterTable={() => handleToggleFilterTable(type)}
			/>
			{#if showFundsFilterTable}
				<section>
					<article class="mt-4 flex items-baseline justify-start px-5 py-4">
						<div class="hidden min-w-fit text-xs font-medium text-grey-body lg:block">
							FILTER BY
						</div>
						<section>
							<FilterItem
								filterList={filterTypes}
								selectedFilter={selectedFilterIndex}
								class="flex flex-wrap items-center justify-start lg:ml-2"
								on:filterChange={(e) => handleFilterChange(type, e.detail.index)}
							/>
						</section>
					</article>
					<CompaniesTable
						holding={filteredData}
						nameColumnHeader={nameColumnHeaderForFunds}
						{viewMoreFooter}
						class="border-t"
					/>
				</section>
			{/if}
		</section>
	{/if}
</article>
