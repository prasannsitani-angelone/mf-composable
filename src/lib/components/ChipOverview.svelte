<script lang="ts">
	let categoryName = '';
	let subCategoryName = '';
	let reInvestmentPlan = '';

	export { categoryName, subCategoryName, reInvestmentPlan };
</script>

<div class="flex  items-center text-[10px] text-sm font-medium text-grey-body sm:border-none">
	<!-- <slot name="categoryNameIcon" /> -->
	{#if categoryName}
		<span class="mr-2 truncate ">{categoryName}</span>
	{/if}

	{#if subCategoryName}
		<span class="mr-2 h-1 w-1 rounded bg-grey-body " />
		<span class="mr-2 truncate">{subCategoryName}</span>
	{/if}

	{#if reInvestmentPlan}
		<span class="mr-2 h-1 w-1 rounded bg-grey-body" />
		<span class="mr-5 truncate"> {reInvestmentPlan}</span>
	{/if}
</div>
