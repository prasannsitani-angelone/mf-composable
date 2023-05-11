<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	onMount(() => {
		stopPageScrolling();
	});

	onDestroy(() => {
		if (browser) {
			resumePageScrolling();
		}
	});

	const dispatch = createEventDispatcher();

	const stopPageScrolling = () => {
		const body = document.getElementsByTagName('main');
		if (body.length) {
			body[0].style.overflow = 'hidden';
		}
	};
	let containerClass = '';
	const resumePageScrolling = () => {
		const body = document.getElementsByTagName('main');
		if (body.length) {
			body[0].style.overflow = 'auto';
		}
	};

	const onWrapperClick = () => {
		dispatch('backdropclicked');
	};
	export { containerClass };
</script>

<div
	class="fixed inset-0 z-60 flex w-full flex-col items-center justify-end sm:justify-center {containerClass}"
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class={`fixed inset-0 z-60 flex w-full flex-col items-center justify-end bg-black-title/80 sm:justify-center ${$$props?.class}`}
		on:click={onWrapperClick}
	/>
	<div class="relative z-100"><slot /></div>
</div>
