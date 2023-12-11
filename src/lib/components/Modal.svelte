<script lang="ts">
	import Overlay from './Overlay.svelte';
	import { page } from '$app/stores';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	let isModalOpen = false;
	let closeModal: (() => void) | null = null;
	let preventBackDropClick = false;
	$: deviceType = $page?.data?.deviceType;

	const backDropClicked = (event: Event) => {
		event.stopPropagation();
		dispatch('backdropclicked', event);
		if (!preventBackDropClick) {
			closeModal?.();
		}
	};

	onMount(() => {
		dispatch('modalMounted');
	});

	export { closeModal, isModalOpen, preventBackDropClick };
</script>

{#if isModalOpen}
	<Overlay>
		{#if deviceType?.isMobile}
			<div
				class="modal modal-open modal-bottom !bg-transparent sm:modal-middle {$$props.class}"
				on:keydown|self={backDropClicked}
				on:click|self={backDropClicked}
			>
				<slot />
			</div>
		{:else}
			<div
				class="modal modal-open modal-bottom !bg-transparent sm:modal-middle {$$props.class}"
				on:keydown|self={backDropClicked}
				on:click|self={backDropClicked}
			>
				<slot />
			</div>
		{/if}
	</Overlay>
{/if}
