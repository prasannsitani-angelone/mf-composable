<script lang="ts">
	import { page } from '$app/stores';
	import Overlay from '$components/Overlay.svelte';
	$: pageMetaData = $page?.data?.layoutConfig;
	export let searchFocused = false;
</script>

<main
	class="scroll-lock w-full flex-grow overflow-auto px-2 py-2 lg:pb-20 {pageMetaData?.layoutClass}"
>
	{#if searchFocused}
		<Overlay containerClass="!z-60" />
	{/if}
	<section class="m-auto flex max-w-8xl flex-wrap justify-center {pageMetaData?.layoutBodyClass}">
		<section class={`w-full lg:pt-3 xl:w-4/5`}>
			<slot />
		</section>
	</section>
</main>
