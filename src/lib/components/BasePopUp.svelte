<script lang="ts">
	import { fly } from 'svelte/transition';
	import Overlay from '$lib/components/Overlay.svelte';
	let clazz = '';
	let onBackDropClicked: ((e: CustomEvent<any>) => void) | null = null;
	export { clazz as class, onBackDropClicked };
</script>

<Overlay on:backdropclicked={onBackDropClicked}>
	<div
		class={`fixed left-0 right-0 flex max-h-full max-w-full flex-col items-center justify-end rounded-t-3xl bg-white px-2  py-2 sm:justify-center ${clazz}`}
		in:fly={{ y: 1000, duration: 500 }}
	>
		<slot name="header" />
		<slot name="content" />
		<slot name="footer" />
	</div>
</Overlay>
