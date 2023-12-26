<script lang="ts">
	import AutomateSIPComponent from '$components/Tutorial/pages/AutomateSIPComponent.svelte';
	import StartFirstSipComponent from '$components/Tutorial/pages/StartFirstSipComponent.svelte';
	import WhatIsMFComponent from '$components/Tutorial/pages/WhatIsMFComponent.svelte';
	import WhatIsSIPComponent from '$components/Tutorial/pages/WhatIsSIPComponent.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { headerStore } from '$lib/stores/HeaderStore.js';
	import { page } from '$app/stores';
	import CarouselNative from '$components/Carousel/CarouselNative.svelte';
	import CarouselItem from '$components/Carousel/CarouselItem.svelte';
	import { WMSIcon } from 'svelte-components';
	import StartInvestmentComponent from '$components/Tutorial/pages/StartInvestmentComponent.svelte';

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	onMount(() => {
		if (isMobile || isTablet) {
			$headerStore.showMobileHeader = false;
		}
	});

	onDestroy(() => {
		if (isMobile || isTablet) {
			$headerStore.showMobileHeader = true;
		}
	});

	const carouselItems = [
		{ component: WhatIsMFComponent, reference: {} },
		{ component: WhatIsSIPComponent, reference: {} },
		{ component: StartFirstSipComponent, reference: {} },
		{ component: AutomateSIPComponent, reference: {} },
		{ component: StartInvestmentComponent, reference: {} }
	];

	let currentIndex = 0;

	const close = () => {
		history.back();
	};

	const handlePageChange = (index) => {
		const previousIndex = currentIndex;
		const previousComponent = carouselItems[previousIndex].reference;
		previousComponent?.onRemoved?.();

		currentIndex = index.detail.index;
		const currentComponent = carouselItems[currentIndex].reference;
		currentComponent?.onSelected?.();
	};
</script>

<div class="relative h-full">
	<div class="absolute left-0 right-0 top-0 z-100 my-auto flex flex-row gap-5 p-5">
		<WMSIcon
			width={18}
			height={18}
			class="self-center"
			name="cross-close"
			stroke={currentIndex < carouselItems.length - 1 ? `white` : `black`}
			on:click={close}
		/>
		<div class="flex flex-1 flex-row gap-3">
			{#each carouselItems as _, index}
				{@const isSelected = currentIndex < index}
				<div
					class="h-1 flex-1 self-center rounded
					{currentIndex < carouselItems.length - 1 ? `bg-white` : `bg-blue-primary`}
					{isSelected ? 'opacity-[0.5]' : 'opacity-[1]'}"
				/>
			{/each}
		</div>

		<p class={currentIndex < carouselItems.length - 1 ? `text-white` : `text-black`}>
			{currentIndex + 1}/{carouselItems.length}
		</p>
	</div>

	<CarouselNative
		class="absolute top-0"
		indicatorClass="hidden h-0 w-0"
		on:onIndexChange={handlePageChange}
	>
		<div slot="activeIndicator" class="hidden h-0 w-0" />
		<div slot="inActiveIndicator" class="hidden h-0 w-0" />
		{#each carouselItems as { component }, index}
			<CarouselItem {index} class="">
				<svelte:component this={component} bind:this={carouselItems[index].reference} />
			</CarouselItem>
		{/each}
	</CarouselNative>
</div>
