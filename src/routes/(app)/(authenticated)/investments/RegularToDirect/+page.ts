import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { regularToDirectFundsStore } from '$lib/stores/RegularToDirectFundStore';
import { calculateLumpsumReturns } from '$lib/utils/helpers/returns';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getRegularSchemes = async () => {
		let amount = 0;
		if (regularToDirectFundsStore.getSchemes()?.length > 0) {
			const regularSchemes = regularToDirectFundsStore.getSchemes();
			regularSchemes.forEach((element) => {
				amount += element.investedValue;
			});
			return {
				regularCumullativeAmount: calculateLumpsumReturns(amount, 10, 10)?.matuarityAmount,
				directCumullativeAmount: calculateLumpsumReturns(amount, 10, 11.5)?.matuarityAmount,
				amount,
				schemes: regularSchemes
			};
		}

		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings`;

		const res = await useFetch(url, {}, fetch);
		if (res?.ok) {
			const regularSchemes = regularToDirectFundsStore.filterRegularFunds(
				res?.data?.data?.holdings
			);
			regularSchemes.forEach((element) => {
				amount += element.investedValue;
			});
			return {
				regularCumullativeAmount: calculateLumpsumReturns(amount, 10, 10)?.matuarityAmount,
				directCumullativeAmount: calculateLumpsumReturns(amount, 10, 11.5)?.matuarityAmount,
				amount,
				schemes: regularSchemes
			};
		} else {
			return {
				schemes: [],
				amount: 0
			};
		}
	};

	return {
		api: {
			regularSchemes: browser ? getRegularSchemes() : await getRegularSchemes()
		},
		layoutConfig: {
			title: 'Switch to Direct Plans',
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			showBackIcon: true
		}
	};
}) satisfies PageLoad;
