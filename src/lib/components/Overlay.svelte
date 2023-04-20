<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

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
	class={`fixed inset-0 z-60 flex w-full flex-col items-center justify-end bg-black-title/80 sm:justify-center ${$$props?.class}`}
>
	<slot />
</div>
