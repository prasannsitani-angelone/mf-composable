import { decodeToObject } from '$lib/utils/helpers/params';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params || undefined);
	const {
		folioListLength,
		numberOfUnits,
		amount,
		selectedFolio,
		folioHolding,
		switchInFund,
		fullAmountSelected,
		appsource,
		requestId,
		interAmcFlag,
		bankAccountNo,
		bankName,
		mandateDetails
	} = decodedParams;
	return {
		layoutConfig: {
			title: 'Confirm Switch',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		},
		folioListLength,
		numberOfUnits,
		amount,
		selectedFolio,
		folioHolding,
		switchInFund,
		fullAmountSelected,
		appsource,
		requestId,
		interAmcFlag,
		bankAccountNo,
		bankName,
		mandateDetails
	};
}) satisfies PageLoad;
