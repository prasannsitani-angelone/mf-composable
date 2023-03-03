<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	const dispatch = createEventDispatcher();
	const backDropClicked = () => dispatch('backdropclicked');

	export let clazz = '';

	onMount(() => {
		stopPageScrolling();
	});

	onDestroy(() => {
		resumePageScrolling();
	});

	const stopPageScrolling = () => {
		const body = document.getElementsByTagName('main');
		if (body.length) {
			body[0].style.overflow = 'hidden';
		}
	};

	const resumePageScrolling = () => {
		const body = document.getElementsByTagName('main');
		if (body.length) {
			body[0].style.overflow = 'auto';
		}
	};
</script>

<div
	class={`fixed inset-0 z-60 flex w-full flex-col items-center justify-end bg-black-title/80 sm:justify-center ${clazz}`}
	on:click|self={backDropClicked}
>
	<slot />
</div>
