<script lang="ts">
	import DotLoader1 from '$lib/images/icons/DotLoader1.svelte';
	import DotLoader2 from '$lib/images/icons/DotLoader2.svelte';
	import DotLoader3 from '$lib/images/icons/DotLoader3.svelte';
	import { onDestroy, onMount } from 'svelte';

	let showLoader = 1;

	let loopInterval;

	const loopLoaders = () => {
		loopInterval = setInterval(() => {
			if (showLoader === 1) {
				showLoader = 2;
			} else if (showLoader === 2) {
				showLoader = 3;
			} else if (showLoader === 3) {
				showLoader = 1;
			}
		}, 200);
	};

	onMount(() => {
		loopLoaders();
	});

	onDestroy(() => {
		clearInterval(loopInterval);
	});
</script>

<article class={$$props?.class}>
	{#if showLoader === 1}
		<DotLoader1 />
	{:else if showLoader === 2}
		<DotLoader2 />
	{:else if showLoader === 3}
		<DotLoader3 />
	{/if}
</article>
