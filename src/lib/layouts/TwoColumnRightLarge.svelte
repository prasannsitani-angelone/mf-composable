<script lang="ts">
	import Overlay from '$components/Overlay.svelte';

	export let searchFocused = false;
</script>

<!-- page body -->
<main class="scroll-lock w-full flex-grow overflow-auto px-2 py-2 lg:pb-20" id="main-container">
	{#if searchFocused}
		<Overlay containerClass="!z-60" />
	{/if}
	<section class="m-auto flex max-w-8xl flex-wrap justify-center">
		<section class="w-full lg:pt-3 xl:w-4/5">
			<slot />
		</section>
	</section>
</main>
