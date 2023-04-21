<script lang="ts">
	let headingPrimary = '';
	let headingSecondary = '';
	let headingTertiary = '';
	let clazz = '';
	export { headingPrimary, headingSecondary, headingTertiary, clazz as class };
</script>

<div
	class={`flex  items-center text-[10px] font-medium text-grey-body sm:mb-1 sm:border-none sm:pb-0 sm:text-xs ${clazz}`}
>
	<slot name="categoryNameIcon" />
	{#if headingPrimary}
		<span class="mr-2 truncate">{headingPrimary}</span>
	{/if}
	{#if headingPrimary && headingSecondary}
		<span class="mr-2 h-1 w-1 rounded bg-grey-body" />
	{/if}
	{#if headingSecondary}
		<span class="mr-2 truncate">{headingSecondary}</span>
	{/if}

	{#if headingTertiary}
		<span class="mr-2 h-1 w-1 rounded bg-grey-body" />
		<span class="mr-5 truncate"> {headingTertiary}</span>
	{/if}
</div>
