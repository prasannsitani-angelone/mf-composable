<script lang="ts">
	import { BtnSize, BtnVariant, Button } from 'svelte-components';
	import type { CategoryOptionsEntity } from '$lib/types/IDiscoverFunds.js';
	import { topPicksCategoryImpressionEvent } from '$components/TopPicks/analytics';

	export let categories: CategoryOptionsEntity[];
	export let selectedCategory: CategoryOptionsEntity;

	const activeLink = 'text-white ';
	const inActiveLink = 'text-black-title ';

	const handleCategoryClick = (category: CategoryOptionsEntity) => {
		selectedCategory = category;
		topPicksCategoryImpressionEvent({ Type: category.name });
	};
</script>

<section class="scrollbar-hide flex w-full gap-x-2 overflow-x-scroll px-5 ${$$props.class}">
	{#each categories as category}
		{@const isActive = category.name === selectedCategory.name}
		<Button
			on:click={() => handleCategoryClick(category)}
			variant={isActive ? BtnVariant.Contained : BtnVariant.Outlined}
			text={{
				label: category.name,
				customClass: `min-w-fit font-normal text-xs normal-case ${
					isActive ? activeLink : inActiveLink
				}`
			}}
			size={BtnSize.SM}
			class="border-grey-line hover:border-grey-line"
		/>
	{/each}
</section>
