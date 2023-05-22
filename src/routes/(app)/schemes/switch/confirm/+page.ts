import { decodeToObject } from '$lib/utils/helpers/params';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params || undefined);
	const {
		folioList,
		numberOfUnits,
		amount,
		selectedFolio,
		folioHolding,
		switchInFund,
		fullAmountSelected
	} = decodedParams;
	return {
		layoutConfig: {
			title: 'Confirm Switch',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		},
		folioList,
		numberOfUnits,
		amount,
		selectedFolio,
		folioHolding,
		switchInFund,
		fullAmountSelected
	};
}) satisfies PageLoad;
