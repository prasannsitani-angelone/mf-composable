<script lang="ts">
	import { BtnSize, BtnVariant, Button } from 'svelte-components';
	import type { CategoryOptionsEntity } from '$lib/types/IDiscoverFunds.js';

	export let categories: CategoryOptionsEntity[];
	export let selectedCategory: CategoryOptionsEntity;

	const activeLink = 'text-white ';
	const inActiveLink = 'text-black-title ';
</script>

<section class="scrollbar-hide flex w-full gap-x-2 overflow-x-scroll px-5 ${$$props.class}">
	{#each categories as category}
		{@const isActive = category.name === selectedCategory.name}
		<Button
			on:click={() => (selectedCategory = category)}
			variant={isActive ? BtnVariant.Contained : BtnVariant.Outlined}
			text={{
				label: category.name,
				customClass: `font-medium text-xs normal-case ${isActive ? activeLink : inActiveLink}`
			}}
			size={BtnSize.SM}
			class="border-grey-line"
		/>
	{/each}
</section>
