<script lang="ts">
	import Overlay from './Overlay.svelte';
	import { page } from '$app/stores';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();
	let isModalOpen = false;
	let closeModal: (() => void) | null = null;
	let animationDuration = 500;
	let isModalClosed = false;
	let delay = 250;
	let preventBackDropClick = false;
	let animation = false;
	$: deviceType = $page?.data?.deviceType;

	const backDropClicked = (event: Event) => {
		event.stopPropagation();
		if (!preventBackDropClick) {
			visible = false;
			onCloseFunction(event);
		}
	};

	let visible = false;

	const onCloseFunction = (event: Event) => {
		if (!animation) {
			closeModal?.();
			dispatch('backdropclicked', event);
			return;
		}
		setTimeout(() => {
			closeModal?.();
			dispatch('backdropclicked', event);
		}, animationDuration);
	};

	const showingModal = async () => {
		if (!isModalOpen) {
			visible = false;
			return;
		}
		if (!animation) {
			visible = true;
			return;
		}
		if (isModalOpen) {
			await tick();
			visible = true;
		}
	};

	const closingModal = async () => {
		if (isModalClosed) {
			visible = false;
			return;
		}
	};

	onMount(() => {
		dispatch('modalMounted');
	});

	$: isModalOpen, showingModal();
	$: isModalClosed, closingModal();

	export {
		closeModal,
		isModalOpen,
		isModalClosed,
		preventBackDropClick,
		animationDuration,
		delay,
		animation
	};
</script>

{#if isModalOpen}
	<Overlay>
		{#if deviceType?.isMobile && visible}
			<div
				transition:fly={{ delay: delay, duration: animationDuration, y: '100%' }}
				class="modal modal-open modal-bottom !bg-transparent sm:modal-middle {$$props.class}"
				on:keydown|self={backDropClicked}
				on:click|self={backDropClicked}
			>
				<slot />
			</div>
		{:else if visible}
			<div
				transition:fly={{ delay: delay, duration: animationDuration, y: '100%' }}
				class="modal modal-open modal-bottom !bg-transparent sm:modal-middle {$$props.class}"
				on:keydown|self={backDropClicked}
				on:click|self={backDropClicked}
			>
				<slot />
			</div>
		{/if}
	</Overlay>
{/if}
