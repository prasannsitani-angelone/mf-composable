<script lang="ts">
	import { page } from '$app/stores';
	import Overlay from '$components/Overlay.svelte';
	$: pageMetaData = $page?.data?.layoutConfig;
	let layoutType = 'DEFAULT';
	export let searchFocused = false;
	let gridClass = '';
	if (layoutType === 'TWO_COLUMN_RIGHT_LARGE_TEMP') {
		gridClass = 'lg:grid lg:grid-cols-[34%_66%] lg:gap-5';
	}
	export { layoutType };
</script>

<main
	class="scroll-lock w-full flex-grow overflow-auto px-2 py-2 lg:pb-20 {pageMetaData?.layoutClass}"
	id="main-container"
>
	{#if searchFocused}
		<Overlay containerClass="!z-60" />
	{/if}
	<section class="m-auto flex max-w-8xl flex-wrap justify-center {pageMetaData?.layoutBodyClass}">
		<section class={`w-full lg:pt-3 xl:w-4/5 ${gridClass}`}>
			<slot />
		</section>
	</section>
</main>
