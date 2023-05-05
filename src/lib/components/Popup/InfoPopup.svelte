<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import CrossIcon from '$lib/images/icons/CrossIcon.svelte';
	let heading = '';
	let detailText = '';
	let isModalOpen = false;
	let closeModal: (() => void) | null = null;
	export { heading, detailText, isModalOpen, closeModal };
</script>

<Modal {isModalOpen} {closeModal}>
	<div
		class="animate-bottomTransition flex w-screen flex-col rounded-t-2xl rounded-b-none bg-white shadow-csm md:w-120 md:animate-none md:rounded-lg"
	>
		<slot name="popupHeader">
			<div class="flex items-center justify-between px-4 pt-6 pb-3 md:py-6 md:px-8">
				<span class="text-lg font-medium text-black-title md:text-xl">
					{heading}
				</span>
				<slot name="crossIconSlot">
					<CrossIcon class="cursor-pointer" on:click={closeModal} />
				</slot>
			</div>
		</slot>

		<slot name="horizontalLine">
			<div class="hidden border-t border-grey-line sm:block" />
		</slot>

		<slot name="popupBody">
			<section class="px-4 pt-0 pb-6 text-sm md:px-8 md:pt-6">
				<article>
					<p class="text-left text-sm font-normal text-grey-body">
						{detailText}
					</p>
				</article>
			</section>
		</slot>
	</div>
</Modal>
