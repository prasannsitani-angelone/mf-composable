<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { WMSIcon } from 'wms-ui-component';
	let translateX = 0;
	let currentIndex = 0;
	let loop = false;
	let slidesPerView = 1;
	let spaceBetween = 0;
	let navigation = false;
	let pagination = true;
	let totalElements = 0;
	let containerClass = '';
	let touchPosition: number | null = null;
	let dispatch = createEventDispatcher();
	$: childrens = totalElements;
	$: nextButtonDisabled = false;
	$: prevButtonDisabled = !loop;
	const nextSlide = () => {
		if (currentIndex >= childrens - Math.round(slidesPerView) && loop) {
			currentIndex = 0;
			translateX = 0;
		} else {
			if (currentIndex < childrens - Math.round(slidesPerView)) {
				translateX -=
					document.querySelector(`.carousel-active-${currentIndex}`)?.offsetWidth + spaceBetween ||
					0;
				currentIndex++;
			}
		}
		checkNextButton(currentIndex);
		checkPrevButton(currentIndex);
		dispatch('onIndexChange', { index: currentIndex });
	};

	const prevSlide = () => {
		if (currentIndex === 0 && loop) {
			currentIndex = childrens - Math.round(slidesPerView);
			translateX -=
				(document.querySelector(`.carousel-active-${currentIndex}`)?.offsetWidth + spaceBetween) *
					currentIndex || 0;
		} else {
			if (currentIndex > 0) {
				currentIndex--;
				translateX +=
					document.querySelector(`.carousel-active-${currentIndex}`)?.offsetWidth + spaceBetween ||
					0;
			}
		}
		checkNextButton(currentIndex);
		checkPrevButton(currentIndex);
		dispatch('onIndexChange', { index: currentIndex });
	};

	onMount(() => {
		childrens = document?.querySelectorAll('.carousel-item')?.length;
		document?.querySelectorAll('.carousel-item').forEach((node) => {
			node.addEventListener('touchstart', handleTouchStart, { passive: true });
			node.addEventListener('touchmove', handleTouchMove, { passive: true });
			node.style.width = `${100 / slidesPerView}%`;
			node.style.marginRight = `${spaceBetween}px`;
		});
		document.querySelector('.carousel-next')?.addEventListener('click', nextSlide);
		document.querySelector('.carousel-prev')?.addEventListener('click', prevSlide);
		return () => {
			document?.querySelectorAll('.carousel-item').forEach((node) => {
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchmove', handleTouchMove);
			});
			document.querySelector('.carousel-next')?.removeEventListener('click', nextSlide);
			document.querySelector('.carousel-prev')?.removeEventListener('click', prevSlide);
		};
	});

	const goToSlide = (index: number) => {
		const jumps = Math.abs(index - currentIndex) || 1;
		if (index > currentIndex) {
			translateX -=
				(document.querySelector(`.carousel-active-${index}`)?.offsetWidth + spaceBetween) * jumps ||
				0;
			currentIndex = index;
		} else if (index < currentIndex) {
			translateX +=
				(document.querySelector(`.carousel-active-${index}`)?.offsetWidth + spaceBetween) * jumps ||
				0;
			currentIndex = index;
		}
		checkNextButton(currentIndex);
		checkPrevButton(currentIndex);
	};

	const handleTouchStart = (e: Event) => {
		const touchDown = e?.touches[0]?.clientX;
		touchPosition = touchDown;
	};

	const checkNextButton = (index: number) => {
		if (index === childrens - Math.round(slidesPerView) && !loop) {
			nextButtonDisabled = true;
		} else {
			nextButtonDisabled = false;
		}
	};

	const checkPrevButton = (index: number) => {
		if (index === 0 && !loop) {
			prevButtonDisabled = true;
		} else {
			prevButtonDisabled = false;
		}
	};

	const handleTouchMove = (e: Event) => {
		const touchDown = touchPosition;

		if (touchDown === null) {
			return;
		}

		const currentTouch = e?.touches[0]?.clientX;
		const diff = touchDown - currentTouch;

		if (diff > 5) {
			nextSlide();
		}

		if (diff < -5) {
			prevSlide();
		}

		touchPosition = null;
	};

	export { navigation, slidesPerView, spaceBetween, pagination, totalElements, loop };
</script>

<div class="flex w-full flex-row items-center {$$props?.class || ''}">
	{#if navigation}
		<slot name="prev-arrow">
			<WMSIcon
				width={40}
				name="arrow-expand"
				class="carousel-prev mb-10 ml-4 mr-1 rotate-90 cursor-pointer {prevButtonDisabled &&
					'pointer-events-none  opacity-50'}"
			/>
		</slot>
	{/if}
	<div class="carousel-container {containerClass} relative overflow-hidden">
		<div
			class="relative box-content flex h-full w-full transition-transform ease-in-out"
			style="transform: translateX({translateX}px); transition-duration: 500ms;"
		>
			<slot />
		</div>
		{#if pagination}
			{@const totalNoOfElements = childrens - (Math.round(slidesPerView) - 1)}
			<div class="my-4 flex items-center justify-center gap-2">
				{#each Array(totalNoOfElements) as page, index (index)}
					{#if currentIndex === index}
						<WMSIcon width={16} height={4} name="rectangle" />
					{:else}
						<WMSIcon
							width={4}
							height={4}
							class="cursor-pointer"
							name="eclipse"
							on:click={() => goToSlide(index)}
						/>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
	{#if navigation}
		<slot name="next-arrow">
			<WMSIcon
				width={40}
				name="arrow-collapse"
				class="carousel-next mb-10 mr-4 ml-1 rotate-90 cursor-pointer {nextButtonDisabled &&
					'pointer-events-none  opacity-50'}"
			/>
		</slot>
	{/if}
</div>
