<script>
	import { Modal, WMSIcon } from 'svelte-components';
	import CarouselNative from '$components/Carousel/CarouselNative.svelte';
	import CarouselItem from '$components/Carousel/CarouselItem.svelte';

	export let isModalOpen = true;
	let onBackDropClicked = () => {
		isModalOpen = false;
	};

	export let carouselItems = [];
</script>

<Modal {isModalOpen}>
	<div class="flex h-full w-full flex-col justify-center {$$props.class}">
		<WMSIcon
			name="cross-close"
			stroke="white"
			width={24}
			height={24}
			class="mx-4 mb-4 p-1 sm:mr-[500px] sm:cursor-pointer sm:self-center"
			on:click={onBackDropClicked}
		/>
		<CarouselNative
			class="w-full justify-center px-4"
			indicatorClass="sm:!justify-center sm:mx-0 !justify-start !mx-2"
		>
			<div slot="activeIndicator" class="h-2 w-8 rounded bg-white" />
			<div slot="inActiveIndicator" class="h-2 w-2 rounded bg-grey-disabled" />
			{#each carouselItems as { component, props }, index}
				<CarouselItem {index} class="mb-2">
					<svelte:component this={component} {...props} />
				</CarouselItem>
			{/each}
		</CarouselNative>
	</div>
</Modal>
