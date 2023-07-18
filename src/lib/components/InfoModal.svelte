<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';

	export let heading = '';
	export let detailText = '';
	export let headingClass = '';
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
			class="animate-bottomTransition flex w-screen flex-col rounded-b-none rounded-t-2xl bg-white shadow-csm sm:w-120 sm:animate-none sm:rounded-lg"
		>
			<slot name="heading">
				<div class="flex items-center justify-between px-4 pb-3 pt-6 md:px-8 md:py-6">
					<slot name="headingDetails">
						<span class="text-lg font-normal text-black-title md:text-xl {headingClass}">
							{heading}
						</span>
					</slot>
					<slot name="crossIconSlot">
						<span class="cursor-default lg:cursor-pointer" on:click={crossButtonClicked}>
							<CrossInCircleIcon />
						</span>
					</slot>
				</div>
			</slot>

			<slot name="horizontalLine">
				<div class="hidden border-t border-grey-line sm:block" />
			</slot>

			<slot name="bodySection">
				<section class="px-4 pb-6 pt-0 text-sm md:px-8 md:pt-6">
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
