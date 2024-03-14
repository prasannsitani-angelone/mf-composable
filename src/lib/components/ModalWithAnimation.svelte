<script lang="ts">
	import Overlay from './Overlay.svelte';
	import { page } from '$app/stores';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();
	let isModalOpen = false;
	let showIconOnTop = false;
	let closeModal: (() => void) | null = null;
	let animationDuration = 500;
	let isModalClosed = false;
	let delay = 0;
	let preventBackDropClick = false;
	$: deviceType = $page?.data?.deviceType;

	let visible = false;

	const backDropClicked = (event: Event) => {
		event.stopPropagation();
		if (!preventBackDropClick) {
			visible = false;
			onCloseFunction(event);
		}
	};

	const onCloseFunction = (event: Event) => {
		setTimeout(() => {
			closeModal?.();
			dispatch('backdropclicked', event);
		}, animationDuration);
	};

	const showingModal = async () => {
		if (isModalOpen) {
			await tick();
			visible = true;
		} else {
			visible = false;
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

	$: isModalOpen, showingModal(); // if component is not unmounting then need to toggle visibility
	$: isModalClosed, closingModal(); // for indicating click outside modal

	export {
		closeModal,
		isModalOpen,
		isModalClosed,
		preventBackDropClick,
		animationDuration,
		delay,
		showIconOnTop
	};
</script>

{#if isModalOpen}
	<Overlay>
		{#if deviceType?.isMobile && visible}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				transition:fly={{ delay: delay, duration: animationDuration, y: '100%' }}
				class="modal modal-open modal-bottom !bg-transparent sm:modal-middle {$$props.class}"
				on:keydown|self={backDropClicked}
				on:click|self={backDropClicked}
			>
				{#if showIconOnTop}
					<div class="flex flex-col">
						<slot name="closingIcon" />
						<slot />
					</div>
				{:else}
					<slot />
				{/if}
			</div>
		{:else if visible}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
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
