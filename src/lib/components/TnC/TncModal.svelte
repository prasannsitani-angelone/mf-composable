<script>
	import { createEventDispatcher } from 'svelte';
	import TncComponent from './TncComponent.svelte';
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';

	const dispatch = createEventDispatcher();

	export let showModal = false;
	let isModalClosed = false;

	const closingModal = () => {
		dispatch('closeModal');
		isModalClosed = false;
	};

	const closeClicked = () => {
		isModalClosed = true;
		setTimeout(() => {
			closingModal();
		}, 500);
	};
</script>

<article>
	<ModalWithAnimation isModalOpen={showModal} on:backdropclicked={closingModal} {isModalClosed}>
		<section
			class="flex h-full w-screen flex-col rounded-b-none bg-background-alt text-title shadow-csm md:h-96 md:w-5/6 md:animate-none md:rounded-lg"
		>
			<slot name="heading">
				<div class="flex items-center justify-between px-4 pt-6 md:px-8 md:py-6">
					<div>
						<span class="mr-1 text-xl"> Terms and Conditions </span>
					</div>
					<button class="md:cursor-pointer" on:click={closeClicked}>
						<CrossInCircleIcon />
					</button>
				</div>
			</slot>

			<slot name="horizontalLine">
				<div class="hidden border-t sm:block" />
			</slot>

			<slot name="bodySection">
				<section class="w-full">
					<article class="w-full rounded-b-lg px-2">
						<TncComponent class="h-screen w-full rounded-b-lg md:h-[304px]" />
					</article>
				</section>
			</slot>
		</section>
	</ModalWithAnimation>
</article>
