<script lang="ts">
	import { BtnSize, BtnVariant } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import type { CategoryOptionsEntity } from '$lib/types/IDiscoverFunds.js';
	import { exploreMFFilterTab } from '../../../routes/(app)/explorefunds/[slug]/analytics';

	export let categories: CategoryOptionsEntity[];
	export let selectedCategory: CategoryOptionsEntity;
	export let mainCategory: string;

	const activeLink = 'text-background-alt ';
	const inActiveLink = 'text-title ';

	const handleCategoryClick = (category: CategoryOptionsEntity) => {
		selectedCategory = category;
		exploreMFFilterTab({ type: 'tab', Category: selectedCategory.name, label: mainCategory });
	};
</script>

<section class="scrollbar-hide flex w-full gap-x-2 overflow-x-scroll px-5 ${$$props.class}">
	{#each categories as category}
		{@const isActive = category.name === selectedCategory.name}
		<ButtonMedium
			on:click={() => handleCategoryClick(category)}
			variant={isActive ? BtnVariant.Contained : BtnVariant.Outlined}
			text={{
				label: category.name,
				customClass: `min-w-fit font-normal text-xs normal-case ${
					isActive ? activeLink : inActiveLink
				}`
			}}
			size={BtnSize.SM}
			class="!border-border hover:border-border"
		/>
	{/each}
</section>
