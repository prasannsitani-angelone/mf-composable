import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';

export const load = async ({ fetch, depends }) => {
	depends('app:cart:confirmation');

	let totalAmount = 0;

	const getItemList = async () => {
		try {
			const response = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/carts/items`, {}, fetch);
			if (response.ok) {
				totalAmount = 0;
				response?.data?.data.forEach((item) => {
					totalAmount += item.amount;
				});
			}
			return response;
		} catch (e) {
			return {};
		}
	};

	return {
		api: {
			itemList: hydrate ? getItemList() : await getItemList(),
			totalAmount
		},
		layoutConfig: {
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			title: 'Confirm Order',
			showBackIcon: true
		}
	};
};
