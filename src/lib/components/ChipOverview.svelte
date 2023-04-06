<script lang="ts">
	let categoryName = '';
	let subCategoryName = '';
	let reInvestmentPlan = '';
	let clazz = '';
	export { categoryName, subCategoryName, reInvestmentPlan, clazz as class };
</script>

<div
	class={`flex  items-center text-[10px] text-sm font-medium text-grey-body sm:border-none ${clazz}`}
>
	<slot name="categoryNameIcon" />
	{#if categoryName}
		<span class="mr-2 truncate text-[10px] sm:text-base">{categoryName}</span>
	{/if}
	{#if categoryName && subCategoryName}
		<span class="mr-2 h-1 w-1 rounded bg-grey-body" />
	{/if}
	{#if subCategoryName}
		<span class="mr-2 truncate text-[10px] sm:text-base">{subCategoryName}</span>
	{/if}

	{#if reInvestmentPlan}
		<span class="mr-2 h-1 w-1 rounded bg-grey-body" />
		<span class="mr-5 truncate text-[10px] sm:text-base"> {reInvestmentPlan}</span>
	{/if}
</div>
