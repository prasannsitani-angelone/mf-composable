<script lang="ts">
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	let heading = '';
	let detailText = '';
	let isModalOpen = false;
	let closeModal: (() => void) | null = null;
	export { heading, detailText, isModalOpen, closeModal };
</script>

<ModalWithAnimation {isModalOpen} {closeModal}>
	<div
		class="flex w-screen flex-col rounded-b-none rounded-t-2xl bg-background-alt shadow-csm md:w-120 md:rounded-lg"
	>
		<slot name="popupHeader">
			<div class="flex items-center justify-between px-4 pb-3 pt-6 md:px-8 md:py-6">
				<span class="text-lg font-normal text-title md:text-xl">
					{heading}
				</span>
				<slot name="crossIconSlot">
					<WMSIcon name="cross-circle" class="cursor-pointer" on:click={closeModal} />
				</slot>
			</div>
		</slot>

		<slot name="horizontalLine">
			<div class="hidden border-t sm:block" />
		</slot>

		<slot name="popupBody">
			<section class="px-4 pb-6 pt-0 text-sm md:px-8 md:pt-6">
				<article>
					<p class="text-left text-sm font-normal text-body">
						{detailText}
					</p>
				</article>
			</section>
		</slot>
	</div>
</ModalWithAnimation>
