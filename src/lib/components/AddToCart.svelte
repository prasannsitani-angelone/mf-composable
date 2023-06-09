<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { WMSIcon } from 'wms-ui-component';
	import Button from './Button.svelte';
	import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';

	import { cartStore } from '$lib/stores/CartStore';
	import { toastStore } from '$lib/stores/ToastStore';
	import { createEventDispatcher } from 'svelte';

	const baseUrl = PUBLIC_MF_CORE_BASE_URL;
	const cartsUrl = '/carts/items';

	export let scheme: ExploreFundsOptions | WeeklyTopSchemesEntity;
	export let showForAllUsers = false;
	export let iconColor = '#3F5BD9';

	let dispatch = createEventDispatcher();

	let diasbaled = false; // To prevent user for clicking on the cart icon if a cart addition request is already in progress

	/**
	 * Request Addition to the cart
	 */
	const requestAddToCart = async () => {
		const url = `${baseUrl}${cartsUrl}`;
		const body = JSON.stringify(createPayload());

		const res = await useFetch(url, {
			method: 'POST',
			body
		});

		if (res.ok) {
			// Update the cart store on client for further process as we are not calling the page api again and again
			// on cart store update in order to acheive better performance
			const addedItemCartId = Array.isArray(res.data?.data?.itemsId) && res.data.data.itemsId[0];
			const dataForStoreUpdate = addedItemCartId
				? { ...scheme, cartItemId: addedItemCartId }
				: { ...scheme };
			cartStore.updateCartItems(dataForStoreUpdate);
			// Show Suceess Toast on successful addition
			toastStore.updateToastQueue({
				type: 'SUCCESS',
				message: 'Mutual Fund added to cart',
				redirectText: 'VIEW CART',
				redirectLink: `/cart`
			});
		} else {
			// Show Error Toast on successful addition
			toastStore.updateToastQueue({
				type: 'ERROR',
				message: 'Mutual Fund could not be added to cart due to technical error'
			});
		}
	};

	/**
	 * Adds an existing cart item again to cart.
	 * Set addToCartRequestedFromModal flag in the store to falsy so that it shouldn't get triggered reactively
	 */
	const repeateAdditionToCart = async () => {
		if ($cartStore.currentSelection?.schemeCode === scheme.schemeCode) {
			cartStore.updateAddToCartRequestFromModal();
			await requestAddToCart();
		}
	};

	/**
	 * Reactively check whether a readdition of existing cart item has requestewd from the add to cart confirmation modal.
	 * If re-addition of an existing cart item is requested from cart confirmartion modal, addToCartRequestedFromModal flag in cart store
	 * is set to truthy. This calls the cart addition function
	 */
	$: if ($cartStore.addToCartRequestedFromModal) {
		repeateAdditionToCart();
	}

	const initiateAddToCart = async () => {
		// check if item already exist in cart - check the response and the local store,
		// If Item exist on Cart, Open confirmation modal
		if (doesItemExistInCart()) {
			cartStore.showAddToCartPopup(scheme);
		} else {
			// If Item does not exist in cart, update cart directly
			await requestAddToCart();
		}
		diasbaled = false;
	};

	/**
	 * Check if the target item already exists in the cart.
	 * To do so, check the page api response for the case if the item has been part of user's cart
	 * Also, check the local store for the case if user has added the targer fund to the cart from client side
	 */
	const doesItemExistInCart = () => {
		return (
			scheme.isCartItem ||
			(Array.isArray($cartStore.item) &&
				$cartStore.item.filter((eachItem) => {
					if (eachItem && scheme) {
						return eachItem.schemeCode === scheme.schemeCode;
					} else {
						return false;
					}
				}).length > 0)
		);
	};

	const createPayload = () => {
		const amount =
			scheme?.isSipAllowed?.toUpperCase() === 'Y'
				? scheme?.minSipAmount
				: scheme?.isLumpsumAllowed?.toUpperCase() === 'Y'
				? scheme?.minPurchaseAmount
				: 0;
		const investmentType =
			scheme?.isSipAllowed?.toUpperCase() === 'Y'
				? 'SIP'
				: scheme?.isLumpsumAllowed?.toUpperCase() === 'Y'
				? 'LUMPSUM'
				: '';
		return [
			{
				isin: scheme?.isin || '',
				schemeCode: scheme?.schemeCode || '',
				amount: amount,
				dpId: $page.data?.profile?.dpDetails?.dpIdNo || '',
				investmentType: investmentType
			}
		];
	};

	$: showCartIcon = $page.data?.isGuest ? (showForAllUsers ? true : false) : true;
</script>

{#if showCartIcon}
	<Button
		variant="transparent"
		class={$$props.class}
		ariaLabel="AddToCart"
		onClick={async (e) => {
			e.stopPropagation();
			if (diasbaled) return;
			diasbaled = true;
			await initiateAddToCart();
			dispatch('onCartClick');
		}}
	>
		<WMSIcon name="cart-plus" stroke={iconColor} />
	</Button>
{/if}
