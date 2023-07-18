<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import Modal from '../Modal.svelte';
	import Button from '$components/Button.svelte';
	import { cartStore } from '$lib/stores/CartStore';

	const cancelAddToCart = () => {
		cartStore.hidePopupAndclearCurrentItemSelection();
	};

	const onAttemptAddToCartConfirmation = () => {
		cartStore.hideAddToCartPopup();
		cartStore.updateAddToCartRequestFromModal();
	};
</script>

<Modal closeModal={cancelAddToCart} isModalOpen>
	<div
		class="flex w-screen flex-col items-center justify-between rounded-b-none rounded-t-2xl bg-white p-4 text-center sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-8"
	>
		<div class=""><WMSIcon width={92} height={92} name="cart-plus-circle" /></div>
		<div class="mb-4 mt-6 text-2xl font-medium text-black-key">Add to cart</div>

		<div class=" text-sm font-normal text-black-key">
			You already have '{$cartStore.currentSelection?.schemeName || 'this fund'}' in your cart. Are
			you sure you want to add it again ?
		</div>

		<section class="flex w-full flex-row gap-4 bg-white pb-2 pt-6 sm:pt-10">
			<Button variant="outlined" class="flex-1 rounded max-sm:w-full" onClick={cancelAddToCart}>
				CANCEL
			</Button>
			<Button
				variant="contained"
				class="flex-1 rounded max-sm:w-full"
				onClick={onAttemptAddToCartConfirmation}
			>
				ADD
			</Button>
		</section>
	</div>
</Modal>
