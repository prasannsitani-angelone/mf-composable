import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';

export const load = async ({ fetch, depends }) => {
	depends('app:cart:confirmation');

	const getItemList = async () => {
		let totalAmount = 0;
		const cartIDArray: Array<number> = [];
		const shortenedFundList: Array<object> = [];
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
					cartIDArray.push(item.cartItemId);
					shortenedFundList.push({
						name: item.schemeName,
						type: item.investmentType,
						amount: item.amount,
						date: item.sipDay
					});
				});
			}
			return {
				...response,
				shortenedFundList,
				cartIDArray,
				totalAmount
			};
		} catch (e) {
			return {
				shortenedFundList,
				cartIDArray,
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
			title: 'Complete Your Payment',
			showBackIcon: true
		}
	};
};
