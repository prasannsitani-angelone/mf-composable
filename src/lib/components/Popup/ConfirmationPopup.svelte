<script lang="ts">
	import Button from '$components/Button.svelte';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	let isModalOpen = false;
	let closeModal: (() => void) | null = null;
	let confirm: (() => void) | null = null;
	let title = '';
	let titleClass = '';
	let confirmButtonTitle = '';
	let confirmButtonDisable = false;
	export {
		isModalOpen,
		closeModal,
		confirm,
		title,
		confirmButtonTitle,
		titleClass,
		confirmButtonDisable
	};
</script>

<ModalWithAnimation {closeModal} {isModalOpen}>
	<section
		class="z-40 flex w-screen flex-col rounded-b-none rounded-t-2xl bg-background-alt shadow-csm md:w-96 md:rounded-lg"
	>
		<div class="flex items-center justify-between px-4 pb-4 pt-6 md:px-8">
			<span class={`text-lg font-medium text-title ${titleClass}`}>{title}</span>
		</div>

		<section class="px-4 pb-6 pt-0 text-sm md:px-8 md:pb-8">
			<slot name="body">
				<p class="font-normal text-body">
					Cancelling will stop <span class="font-medium">ALL</span> your upcoming investments in this
					SIP. Do you want to cancel this SIP?
				</p>
			</slot>
		</section>

		<slot name="footer">
			<section class="px-4 pb-6 pt-0 text-sm md:px-8">
				<article class="flex items-center justify-end text-sm font-medium text-primary">
					<Button
						variant="transparent"
						size="sm"
						class="mr-2 p-2 disabled:bg-background-alt"
						disabled={confirmButtonDisable}
						onClick={closeModal}>NO</Button
					>

					<Button
						variant="transparent"
						size="sm"
						class="p-2 disabled:bg-background-alt"
						disabled={confirmButtonDisable}
						onClick={confirm}
					>
						{confirmButtonTitle}
					</Button>
				</article>
			</section>
		</slot>
	</section>
</ModalWithAnimation>
