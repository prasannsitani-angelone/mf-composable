<script>
	import { Modal, WMSIcon } from 'svelte-components';
	import CarouselNative from '$components/Carousel/CarouselNative.svelte';
	import CarouselItem from '$components/Carousel/CarouselItem.svelte';
	import { afterUpdate, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let isModalOpen = true;

	export let preventBackDropClick = true;

	let onBackDropClicked = () => {
		dispatch('cueCardClose');

		isModalOpen = false;
	};

	export let carouselItems = [];

	const handleCueCardLoad = (index = 0) => {
		dispatch('cueCardLoad', { index });
	};

	const handleOnIndexChange = (e) => {
		const index = e?.detail?.index || 0;
		handleCueCardLoad(index);
	};

	afterUpdate(() => {
		handleCueCardLoad();
	});
	const handleBackDropClicked = () => {
		if (!preventBackDropClick) {
			onBackDropClicked();
		}
	};
</script>

<Modal {isModalOpen}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="flex h-full w-full flex-col" on:click={handleBackDropClicked}>
		<div
			class="my-auto flex w-full flex-col justify-center {$$props.class}"
			on:click|stopPropagation
		>
			<WMSIcon
				name="cross-close"
				stroke="white"
				width={24}
				height={24}
				class="mx-4 mb-4 p-1 sm:mr-[450px] sm:cursor-pointer sm:self-center"
				on:click={onBackDropClicked}
			/>
			<CarouselNative
				class="w-full justify-center px-4"
				indicatorClass="sm:!justify-center sm:mx-0 !justify-start !mx-2"
				on:onIndexChange={handleOnIndexChange}
			>
				<div slot="activeIndicator" class="h-2 w-8 rounded bg-background-alt" />
				<div slot="inActiveIndicator" class="h-2 w-2 rounded bg-disabled sm:cursor-pointer" />
				{#each carouselItems as { component, props }, index}
					<CarouselItem {index} class="mb-2">
						<svelte:component this={component} {...props} />
					</CarouselItem>
				{/each}
			</CarouselNative>
		</div>

		<slot name="bottomsticky" />
	</div>
</Modal>
