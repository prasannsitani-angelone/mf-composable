<script lang="ts">
	import { page } from '$app/stores';
	import Overlay from '$components/Overlay.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	$: pageMetaData = $page?.data?.layoutConfig;
	let layoutType = 'DEFAULT';
	export let searchFocused = false;

	let contentClass = '';
	let layoutClass = '';

	const commonStyle = 'w-full lg:pt-3 xl:w-4/5';

	const gridClassMap = {
		TWO_COLUMN_RIGHT_LARGE_TEMP: {
			contentClass: `${commonStyle} lg:grid lg:grid-cols-[34%_66%] lg:gap-5`,
			layoutClass: 'px-2 py-2 lg:pb-20'
		},
		TWO_COLUMN: {
			contentClass: `${commonStyle} grid w-full grid-cols-[100%] lg:grid-cols-[66%_34%] lg:gap-5 lg:gap-y-1 lg:pt-3 xl:w-4/5`,
			layoutClass: 'px-2 py-2 lg:pb-20'
		},
		TWO_COLUMN_REVERSE: {
			contentClass: `${commonStyle} grid w-full grid-cols-[100%] !gap-y-0 sm:grid-cols-[66%_34%] sm:gap-2 lg:gap-5 lg:pt-3 xl:w-4/5`,
			layoutClass: 'px-2 py-2 lg:pb-20'
		},
		TWO_COLUMN_RIGHT_LARGE: {
			contentClass: `${commonStyle} lg:grid lg:grid-cols-[34%_66%] lg:gap-5`,
			layoutClass: 'px-2 py-2 lg:pb-20'
		},
		FULL_HEIGHT_WITHOUT_PADDING: {
			contentClass: `${commonStyle} h-full`,
			layoutClass: 'p-0'
		},
		FULL_WIDTH: {
			contentClass: 'mx-4 h-full w-full',
			layoutClass: 'self-center'
		}
	};

	const updateGridClass = () => {
		contentClass = gridClassMap[layoutType]?.contentClass || commonStyle;
		layoutClass = gridClassMap[layoutType]?.layoutClass || 'px-2 py-2';
	};

	$: layoutType, updateGridClass();

	export { layoutType };

	beforeNavigate(() => {
		document.getElementById('main-container').style.overflow = 'hidden';
	});

	afterNavigate(() => {
		document.getElementById('main-container').style.overflow = 'auto';
		// workaround for an open bug https://github.com/sveltejs/kit/issues/2733
		document.getElementById('main-container').scrollTop = 0;
	});
</script>

<main
	class="scroll-lock w-full flex-grow overflow-auto {layoutClass} {pageMetaData?.layoutClass}"
	id="main-container"
>
	{#if searchFocused}
		<Overlay containerClass="!z-60" />
	{/if}
	<section class="m-auto flex max-w-8xl flex-wrap justify-center {pageMetaData?.layoutBodyClass}">
		<section class={contentClass}>
			<slot />
		</section>
	</section>
</main>
