<script lang="ts">
	let headingPrimary = '';
	let headingSecondary = '';
	let headingTertiary = '';
	let headingPrimaryClass = '';
	let headingSecondaryClass = '';
	let roundedClass = '';
	let headingTertiaryClass = '';
	export {
		headingPrimary,
		headingSecondary,
		headingTertiary,
		headingPrimaryClass,
		headingSecondaryClass,
		roundedClass,
		headingTertiaryClass
	};
</script>

<div
	class={`flex  items-center text-[10px] font-normal text-body sm:mb-1 sm:border-none sm:pb-0 sm:text-xs ${$$props.class}`}
>
	<slot name="categoryNameIcon" />
	{#if headingPrimary}
		<span class="mr-2 whitespace-normal {headingPrimaryClass}">{headingPrimary}</span>
	{/if}
	{#if headingPrimary && headingSecondary}
		<span class="mr-2 h-1 w-1 rounded bg-body {roundedClass}" />
	{/if}
	{#if headingSecondary}
		<span class="mr-2 whitespace-normal {headingSecondaryClass}">{headingSecondary}</span>
	{/if}

	{#if headingTertiary}
		<span class="mr-2 h-1 w-1 rounded bg-body {roundedClass}" />
		<span class="mr-5 whitespace-normal {headingTertiaryClass}"> {headingTertiary}</span>
	{/if}
</div>
