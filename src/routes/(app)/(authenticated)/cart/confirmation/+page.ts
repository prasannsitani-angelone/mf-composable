import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';

export const load = async ({ fetch, depends }) => {
	depends('app:cart:confirmation');

	const getItemList = async () => {
		let totalAmount = 0;
		try {
			const response = await useFetch(
				`${PUBLIC_MF_CORE_BASE_URL}/carts/items?status=READY_TO_CHECKOUT`,
				{},
				fetch
			);
			if (response.ok) {
				totalAmount = 0;
				response?.data?.data.forEach((item) => {
					totalAmount += item.amount;
				});
			}
			return {
				...response,
				totalAmount
			};
		} catch (e) {
			return {
				totalAmount
			};
		}
	};

	const getPreviousPaymentDetails = async () => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/user/paymentHandlers`;
			return await useFetch(url, {}, fetch);
		} catch (e) {
			return {};
		}
	};

	return {
		api: {
			itemList: hydrate ? getItemList() : await getItemList(),
			previousPaymentDetails: hydrate
				? getPreviousPaymentDetails()
				: await getPreviousPaymentDetails()
		},
		layoutConfig: {
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			title: 'Confirm Order',
			showBackIcon: true
		}
	};
};
