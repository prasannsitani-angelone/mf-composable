<script lang="ts">
	import Button from '$components/Button.svelte';
	import Modal from '$components/Modal.svelte';
	let isModalOpen = false;
	let closeModal: (() => void) | null = null;
	let confirm: (() => void) | null = null;
	let title = '';
	let titleClass = '';
	let confirmButtonTitle = '';
	export { isModalOpen, closeModal, confirm, title, confirmButtonTitle, titleClass };
</script>

<Modal {closeModal} {isModalOpen}>
	<section
		class="flex w-screen flex-col rounded-t-2xl rounded-b-none bg-white shadow-csm md:w-120 md:rounded-lg"
	>
		<div class="flex items-center justify-between px-4 pt-6 pb-4 md:py-6 md:px-8">
			<span class={`text-lg font-normal text-black-title md:text-xl ${titleClass}`}>{title}</span>
		</div>

		<section class="px-4 pt-0 pb-6 text-sm md:px-8 md:pt-6">
			<slot name="body">
				<p class="font-normal text-grey-body">
					Cancelling will stop <span class="font-semibold">ALL</span> your upcoming investments in this
					SIP. Proceed to cancel?
				</p>
			</slot>
		</section>

		<slot name="footer">
			<section class="px-4 pt-0 pb-6 text-sm md:px-8 md:pt-6">
				<article class="flex items-center justify-end text-sm font-semibold text-blue-primary">
					<Button variant="transparent" size="sm" class="mr-2 p-2 font-medium" onClick={closeModal}
						>NO</Button
					>

					<Button variant="transparent" size="sm" class="p-2" onClick={confirm}>
						{confirmButtonTitle}
					</Button>
				</article>
			</section>
		</slot>
	</section>
</Modal>
