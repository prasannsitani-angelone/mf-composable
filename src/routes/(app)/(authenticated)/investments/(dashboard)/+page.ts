import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL, PUBLIC_PORTFOLIO_BASE_URL } from '$env/static/public';
import { faqsIconClick } from '$lib/analytics/faqs/faqs';
import { decodeToObject, encodeObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url, parent }) => {
	const urlParams = url.searchParams.get('param') || '';
	const decodedParams = decodeToObject(urlParams);
	const { type } = decodedParams || {};
	const isExternal = url.searchParams.get('type') === 'all' || type === 'all';

	const getInvestmentData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings`;

		const res = await useFetch(url, {}, fetch);
		if (res?.ok) {
			const investmentData = res.data;
			return {
				...investmentData
			};
		} else if (res?.status < 500) {
			return {};
		} else {
			return new Error('Something Went Wrong');
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

	const getFamilyMembers = async () => {
		const parentData = await parent();

		const url = `${PUBLIC_PORTFOLIO_BASE_URL}/family/v1/managemembers`;
		const res = await useFetch(
			url,
			{
				headers: {
					token: parentData?.token
				},
				method: 'POST',
				body: JSON.stringify({
					party_code: parentData?.profile?.clientId
				})
			},
			fetch
		);

		if (res?.ok) {
			return res?.data;
		} else {
			return {};
		}
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
				: await getOptimisePortfolioData(),
			familyMembers: browser ? getFamilyMembers() : await getFamilyMembers()
		},
		isExternal,
		layoutConfig: {
			title: 'Portfolio',
			showBottomNavigation: true,
			layoutType: 'TWO_COLUMN_REVERSE',
			layoutClass: '!m-0 !p-0 md:px-2 md:py-2',
			titleClass: '!text-xl',
			headerClass: '!bg-grey !py-2.5 !px-4',
			showFaqIcon: true,
			faqParams,
			onClickFaqsIcon
		},
		urlParamsValues: decodedParams
	};
}) satisfies PageLoad;
