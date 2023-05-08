import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getInvestmentData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings`;

		const res = await useFetch(url, {}, fetch);
		if (res?.ok) {
			const investmentData = res.data;
			return {
				...investmentData
			};
		} else {
			return {};
		}
	};

	const getExternalInvestmentData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?external=true`;

		const res = await useFetch(url, {}, fetch);

		if (res?.ok) {
			const investmentData = res.data;
			return {
				...investmentData
			};
		} else {
			return res.data || {};
		}
	};

	const getExternalInvestmentSummary = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?summary=true&external=true`;
		const res = await useFetch(url, {}, fetch);

		return res.data;
	};

	return {
		api: {
			investment: browser ? getInvestmentData() : await getInvestmentData(),
			externalInvestmentSummary: browser
				? getExternalInvestmentSummary()
				: await getExternalInvestmentSummary(),
			externalInvestment: browser ? getExternalInvestmentData() : await getExternalInvestmentData()
		},
		layoutConfig: {
			title: 'Investment Dashboard',
			showBottomNavigation: true,
			layoutType: 'TWO_COLUMN_REVERSE'
		}
	};
}) satisfies PageLoad;
