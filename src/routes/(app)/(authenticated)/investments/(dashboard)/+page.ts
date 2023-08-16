import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { faqsIconClick } from '$lib/analytics/faqs/faqs';
import { decodeToObject, encodeObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import MobileInvestmentTab from './components/MobileInvestmentTab.svelte';

export const load = (async ({ fetch, url }) => {
	const isExternal = url.searchParams.get('type') === 'all';
	const urlParams = url.searchParams.get('param') || '';
	const decodedParams = decodeToObject(urlParams);

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

	const getOptimisePortfolioData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/recommendation/sip`;

		const res = await useFetch(url, {}, fetch);
		if (res?.ok && res?.status === 200) {
			const optimisePortfolioData = res.data;
			return {
				...optimisePortfolioData
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

	const faqParams = encodeObject({
		tag: 'investments',
		showRecentOrders: true
	});

	const onClickFaqsIcon = () => {
		faqsIconClick({
			Source: 'Investments'
		});
	};

	return {
		api: {
			investment: browser ? getInvestmentData() : await getInvestmentData(),
			externalInvestmentSummary: browser
				? getExternalInvestmentSummary()
				: await getExternalInvestmentSummary(),
			externalInvestment: browser ? getExternalInvestmentData() : await getExternalInvestmentData(),
			getOptimisePortfolioData: browser
				? getOptimisePortfolioData()
				: await getOptimisePortfolioData()
		},
		isExternal,
		layoutConfig: {
			title: 'Investment Dashboard',
			showBottomNavigation: true,
			layoutType: 'TWO_COLUMN_REVERSE',
			titleClass: '!text-xl',
			headerClass: '!bg-grey !py-2.5 !px-4',
			component: MobileInvestmentTab,
			showFaqIcon: true,
			faqParams,
			onClickFaqsIcon
		},
		urlParamsValues: decodedParams
	};
}) satisfies PageLoad;
