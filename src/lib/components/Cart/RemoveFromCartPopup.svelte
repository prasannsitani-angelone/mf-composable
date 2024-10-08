<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { onMount } from 'svelte/internal';
	import Modal from '../Modal.svelte';
	import Button from '$components/Button.svelte';
	import { cartStore } from '$lib/stores/CartStore';
	import { useFetch } from '$lib/utils/useFetch';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { invalidate } from '$app/navigation';
	import { toastStore } from '$lib/stores/ToastStore';
	import {
		deletCartConfirmationAnalytics,
		deleteCartSleeveAnalytics
	} from '../../../routes/(app)/(authenticated)/cart/analytics/cart';

	const cancelAddToCart = () => {
		cartStore.hidePopupAndclearCurrentItemSelection();
	};

	const onAttemptAddToCartConfirmation = async (cartItemId: number) => {
		const metaData = {
			FundName: ($cartStore?.item || []).filter((each) => each.cartItemId === cartItemId)[0]
				?.schemeName
		};
		deletCartConfirmationAnalytics(metaData);
		const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items/${cartItemId}`;
		const res = await useFetch(url, {
			method: 'DELETE'
		});

		if (res.ok) {
			cartStore.hideAddToCartPopup();
			cartStore.removeCartItems(cartItemId);
			toastStore.updateToastQueue({
				type: 'SUCCESS',
				message: 'Mutual Fund removed from cart '
			});
			invalidate('app:cartdata');
		} else {
			toastStore.updateToastQueue({
				type: 'ERROR',
				message: 'Mutual Fund could not be removed from cart due to technical error'
			});
		}
	};
	onMount(() => {
		deleteCartSleeveAnalytics();
	});
</script>

<Modal closeModal={cancelAddToCart} isModalOpen>
	<div
		class="flex w-screen flex-col items-center justify-between rounded-b-none rounded-t-2xl bg-background-alt p-4 text-center sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-8"
	>
		<div class="">
			<WMSIcon
				width={92}
				height={92}
				name="cart-plus-circle"
				fill="var(--PRIMARY)"
				stroke="var(--PRIMARY)"
			/>
		</div>
		<div class="mb-4 mt-6 text-2xl font-normal text-title">Remove From Cart</div>

		<div class=" text-sm font-normal text-title">
			Do you want to remove `{$cartStore.currentSelection?.schemeName || 'this fund'}` from your
			cart?
		</div>

		<section class="flex w-full flex-row gap-4 bg-background-alt pb-2 pt-6 sm:pt-10">
			<Button variant="outlined" class="flex-1 rounded max-sm:w-full" onClick={cancelAddToCart}>
				KEEP IN CART
			</Button>
			<Button
				variant="contained"
				class="flex-1 rounded max-sm:w-full"
				onClick={() => {
					onAttemptAddToCartConfirmation($cartStore.currentSelection.cartItemId);
				}}
			>
				REMOVE
			</Button>
		</section>
	</div>
</Modal>
