<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import Overlay from './Overlay.svelte';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let isModalOpen = false;
	let closeModal: (() => void) | null = null;
	let animationDuration = 500;
	let preventBackDropClick = false;
	$: deviceType = $page?.data?.deviceType;

	const backDropClicked = (event: Event) => {
		event.stopPropagation();
		dispatch('backdropclicked', event);
		if (!preventBackDropClick) {
			closeModal?.();
		}
	};

	export { closeModal, isModalOpen, preventBackDropClick, animationDuration };
</script>

{#if isModalOpen}
	<Overlay>
		{#if deviceType?.isMobile}
			<div
				class="modal modal-open modal-bottom !bg-transparent sm:modal-middle {$$props.class}"
				in:fly={{ y: 1000, duration: animationDuration }}
				on:keydown|self={backDropClicked}
				on:click|self={backDropClicked}
			>
				<slot />
			</div>
		{:else}
			<div
				class="modal modal-open modal-bottom !bg-transparent sm:modal-middle {$$props.class}"
				in:fade={{ duration: animationDuration }}
				on:keydown|self={backDropClicked}
				on:click|self={backDropClicked}
			>
				<slot />
			</div>
		{/if}
	</Overlay>
{/if}
