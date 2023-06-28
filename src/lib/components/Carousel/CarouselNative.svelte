<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
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
		let carouselItem = document?.querySelectorAll('.carousel-item');
		let carouselNext = document.querySelector('.carousel-next');
		let carouselPrev = document.querySelector('.carousel-prev');
		let containerWidth = document?.querySelector('.carousel-container')?.clientWidth || 0;
		let nodes: Array<Element> = [];
		childrens = document?.querySelectorAll('.carousel-item')?.length;
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

	const handleTouchStart = (e: Event, isMouseEvent = false) => {
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
		fixedWidth
	};
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
