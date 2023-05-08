<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';

	export let heading = '';
	export let detailText = '';
	export let showModal: boolean;

	const dispatch = createEventDispatcher();

	const crossButtonClicked = () => {
		dispatch('crossClicked');
	};
</script>

<section class="z-20 justify-start">
	<Modal isModalOpen={showModal} on:backdropclicked={crossButtonClicked}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="animate-bottomTransition flex w-screen flex-col rounded-t-2xl rounded-b-none bg-white shadow-csm md:w-120 md:animate-none md:rounded-lg"
		>
			<slot name="heading">
				<div class="flex items-center justify-between px-4 pt-6 pb-3 md:py-6 md:px-8">
					<span class="text-lg font-normal text-black-title md:text-xl">
						{heading}
					</span>
					<slot name="crossIconSlot">
						<span class="cursor-default md:cursor-pointer" on:click={crossButtonClicked}>
							<CrossInCircleIcon />
						</span>
					</slot>
				</div>
			</slot>

			<slot name="horizontalLine">
				<div class="hidden border-t border-grey-line sm:block" />
			</slot>

			<slot name="bodySection">
				<section class="px-4 pt-0 pb-6 text-sm md:px-8 md:pt-6">
					<article>
						<p class="font-normal text-grey-body">
							{detailText}
						</p>
					</article>
				</section>
			</slot>
		</div>
	</Modal>
</section>
