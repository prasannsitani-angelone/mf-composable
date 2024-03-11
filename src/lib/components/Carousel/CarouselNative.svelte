<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import RectangleIcon from '$lib/images/RectangleIcon.svg';
	import EclipseIcon from '$lib/images/EclipseIcon.svg';

	let translateX = 0;
	let currentIndex = 0;
	let loop = false;
	let slidesPerView = 1;
	let spaceBetween = 0;
	let navigation = false;
	let autoplay = false;
	let pagination = true;
	let fixedWidth = false;
	let autoPlayTime = 3000;
	let autoplayTimer: ReturnType<typeof setInterval>;
	let totalElements = 0;
	let containerClass = '';
	let touchPosition: number | null = null;
	let indicatorClass = '';
	let id = '';
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
					document.querySelector(`.carousel-active-${currentIndex}-${id}`)?.offsetWidth +
						spaceBetween || 0;
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
				(document.querySelector(`.carousel-active-${currentIndex}-${id}`)?.offsetWidth +
					spaceBetween) *
					currentIndex || 0;
		} else {
			if (currentIndex > 0) {
				currentIndex--;
				translateX +=
					document.querySelector(`.carousel-active-${currentIndex}-${id}`)?.offsetWidth +
						spaceBetween || 0;
			}
		}
		checkNextButton(currentIndex);
		checkPrevButton(currentIndex);
		dispatch('onIndexChange', { index: currentIndex });
	};

	onMount(() => {
		let carouselContainer = document.querySelector(`.carousel-container-${id}`);
		let carouselItem = carouselContainer?.querySelectorAll(`.carousel-item-${id}`);
		let carouselNext = document?.querySelector(`.carousel-next-${id}`);
		let carouselPrev = document?.querySelector(`.carousel-prev-${id}`);
		let containerWidth =
			carouselContainer?.querySelector(`.carousel-container-${id}`)?.clientWidth || 0;
		let nodes: Array<Element> = [];
		childrens = carouselItem?.length || 0;

		carouselItem?.forEach((node) => {
			node.addEventListener('touchstart', handleTouchStart, { passive: true });
			node.addEventListener('touchmove', handleTouchMove, { passive: true });
			node.addEventListener('mousedown', (e) => handleTouchStart(e, true), { passive: true });
			node.addEventListener('mouseup', (e) => handleTouchMove(e, true), { passive: true });
			nodes.push(node);
		});

		if (!fixedWidth && slidesPerView > 1) {
			nodes?.forEach((node) => {
				node.style.width = `${containerWidth / slidesPerView}px`;
				node.style.marginRight = `${spaceBetween}px`;
			});
		}

		carouselNext?.addEventListener('click', nextSlide);
		carouselPrev?.addEventListener('click', prevSlide);
		if (autoplay) {
			loop = true;
			autoplayTimer = setInterval(() => {
				nextSlide();
			}, autoPlayTime);
		}
		return () => {
			carouselItem?.forEach((node) => {
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchmove', handleTouchMove);
			});
			clearInterval(autoplayTimer);
			carouselNext?.removeEventListener('click', nextSlide);
			carouselPrev?.removeEventListener('click', prevSlide);
		};
	});

	const goToSlide = (index: number) => {
		const jumps = Math.abs(index - currentIndex) || 1;
		if (index > currentIndex) {
			translateX -=
				(document.querySelector(`.carousel-active-${index}-${id}`)?.offsetWidth + spaceBetween) *
					jumps || 0;
			currentIndex = index;
		} else if (index < currentIndex) {
			translateX +=
				(document.querySelector(`.carousel-active-${index}-${id}`)?.offsetWidth + spaceBetween) *
					jumps || 0;
			currentIndex = index;
		}
		checkNextButton(currentIndex);
		checkPrevButton(currentIndex);
	};

	const handleTouchStart = (e: Event, isMouseEvent = false) => {
		// Add id='disable-swipe' to container, swipe will be disabled in the whole container
		const disableSwipContainer = document.getElementById('disable-swipe');

		if (disableSwipContainer?.contains(e.target)) return;

		const touchDown = isMouseEvent ? e?.clientX : e?.touches[0]?.clientX;
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

	const handleTouchMove = (e: Event, isMouseEvent = false) => {
		const touchDown = touchPosition;

		if (touchDown === null) {
			return;
		}

		const currentTouch = isMouseEvent ? e?.clientX : e?.touches[0]?.clientX;
		const diff = touchDown - currentTouch;

		if (diff > 5) {
			nextSlide();
		}

		if (diff < -5) {
			prevSlide();
		}

		touchPosition = null;
	};

	export {
		navigation,
		slidesPerView,
		spaceBetween,
		pagination,
		totalElements,
		loop,
		autoplay,
		autoPlayTime,
		fixedWidth,
		indicatorClass,
		id
	};
</script>

<div {id} class="flex w-full flex-row items-center {$$props?.class || ''}">
	{#if navigation}
		<slot name="prev-arrow">
			<div class="carousel-prev-{id}">
				<WMSIcon
					width={16}
					name="arrow-expand"
					class="mb-10 ml-4 mr-1 rotate-90 cursor-pointer {prevButtonDisabled &&
						'pointer-events-none  opacity-50'}"
				/>
			</div>
		</slot>
	{/if}
	<div class="carousel-container-{id} {containerClass} relative overflow-hidden">
		<div
			class="relative box-content flex h-full w-full transition-transform ease-in-out"
			style="transform: translateX({translateX}px); transition-duration: 500ms;"
		>
			<slot />
		</div>
		{#if pagination}
			{@const totalNoOfElements = childrens - (Math.round(slidesPerView) - 1)}
			<div class="my-4 flex items-center justify-center gap-2 {indicatorClass}">
				{#if totalNoOfElements > 0}
					{#each Array(totalNoOfElements) as page, index (index)}
						{#if currentIndex === index}
							<slot name="activeIndicator">
								<img
									src={RectangleIcon}
									decoding="async"
									alt="Carousel Swipe button active"
									width="16"
									height="4"
								/>
							</slot>
						{:else}
							<div on:click={() => goToSlide(index)}>
								<slot name="inActiveIndicator">
									<img
										src={EclipseIcon}
										class="h-1 w-1 cursor-pointer"
										decoding="async"
										alt="Carousel Swipe button inactive"
										width="4"
										height="4"
									/>
								</slot>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		{/if}
	</div>
	{#if navigation}
		<slot name="next-arrow">
			<div class="carousel-next-{id}">
				<WMSIcon
					width={16}
					name="arrow-collapse"
					class="mb-10 ml-1 mr-4 rotate-90 cursor-pointer {nextButtonDisabled &&
						'pointer-events-none  opacity-50'}"
				/>
			</div>
		</slot>
	{/if}
</div>
