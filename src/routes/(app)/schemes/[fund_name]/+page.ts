import { PUBLIC_MF_ANDROID_APN, PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';

import type { PageLoad } from './$types';
import type { SchemeDetails, SchemeHoldings } from '$lib/types/ISchemeDetails';
import { browser } from '$app/environment';
import type { FundComparisons } from './types';
import { useFetch } from '$lib/utils/useFetch';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { goto } from '$app/navigation';
import { decodeToObject } from '$lib/utils/helpers/params';
import { shareMessage } from '$lib/utils/share';
import { shouldDisplayShare } from '$lib/utils';
import { shareFundDetailClickAnalytics } from './analytics';

import { hydrate } from '$lib/utils/helpers/hydrated';

export const load = (async ({ fetch, params, url, parent }) => {
	const queryParam = url?.searchParams?.get('params') || '';
	const fundName = params['fund_name'];
	const decodedParams = decodeToObject(queryParam);
	const { redirectedFrom, isExternal, clientCode } = decodedParams || {};
	const { pathname, search } = url;
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();
	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];
	let schemeData: SchemeDetails;
	const parentData = await parent();
	const showShare = shouldDisplayShare(parentData);

	if (isExternal && !parentData?.tokenObj?.userToken?.NTAccessToken) {
		const redirectUrl = `${base}/login?redirect=${encodeURIComponent(pathname + search)}`;
		if (browser) return await goto(redirectUrl);
		else throw redirect(302, redirectUrl);
	}

	if (isExternal && clientCode && clientCode !== parentData?.profile?.clientId) {
		if (browser) {
			goto(`${base}/schemes/clientError`, { replaceState: true });
		} else {
			throw redirect(302, `${base}/schemes/clientError`);
		}
	}

	const getSchemeData = async (): Promise<SchemeDetails> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		const res = await useFetch(
			url,
			{
				headers: {
					'X-LRU': 'true',
					'X-Skip-Validation': redirectedFrom === 'SIP_PAYMENTS'
				}
			},
			fetch
		);

		if (res.ok) {
			schemeData = res.data;
		} else {
			if (browser) {
				goto(`${base}/schemes/error`, { replaceState: true });
			} else {
				throw redirect(302, `${base}/schemes/error`);
			}
		}

		return schemeData;
	};

	const onClickShareIcon = async () => {
		shareFundDetailClickAnalytics({
			Fundname: schemeData?.schemeName,
			FundType: schemeData?.reInvestmentPlan,
			AssetType: schemeData?.categoryName,
			SubAssetType: schemeData?.subcategoryName
		});
		const message = {
			text: `Hey, check out this fund - ${
				schemeData?.schemeName
			}. It has given ${schemeData?.returns3yr?.toFixed(
				2
			)}% returns in the last 3 years. Learn more about this fund on Angel One - https://angeloneapp.page.link/?link=${
				url?.href
			}&apn=${PUBLIC_MF_ANDROID_APN}`
		};
		shareMessage(message);
	};

	const getFundHoldings = async (): Promise<Array<SchemeHoldings>> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/holdings`;
		const res = await useFetch(url, {}, fetch);
		const holdingData: Array<SchemeHoldings> = res.data;

		return holdingData;
	};

	const getFundComparisonsData = async (): Promise<FundComparisons> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/comparisons`;
		const res = await useFetch(url, {}, fetch);
		const holdingData: FundComparisons = res.data;

		return holdingData;
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
		layoutConfig: {
			title: 'Fund Details',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN',
			showShareIcon: showShare,
			showCartIcon: true,
			onClickShareIcon: onClickShareIcon,
			decodedParams
		},
		api: {
			schemeData: hydrate ? getSchemeData() : await getSchemeData(),
			holdingData: hydrate ? getFundHoldings() : await getFundHoldings(),
			comparisons: hydrate ? getFundComparisonsData() : await getFundComparisonsData(),
			previousPaymentDetails: hydrate
				? getPreviousPaymentDetails()
				: await getPreviousPaymentDetails()
		}
	};
}) satisfies PageLoad;
