import { PUBLIC_MF_ANDROID_APN, PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';

import type { PageLoad } from './$types';
import type { SchemeDetails, SchemeHoldings, SectorHoldings } from '$lib/types/ISchemeDetails';
import { browser } from '$app/environment';
import type { FundComparisons } from '$components/Scheme/types';
import { useFetch } from '$lib/utils/useFetch';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { goto } from '$app/navigation';
import { decodeToObject } from '$lib/utils/helpers/params';
import { shareMessage } from '$lib/utils/share';
import { shouldDisplayShare } from '$lib/utils';
import { shareFundDetailClickAnalytics } from '$components/Scheme/analytics';

import { hydrate } from '$lib/utils/helpers/hydrated';
import { getDeeplinkForUrl } from '$lib/utils/helpers/deeplinks';
import { getCompleteSIPDateBasedonDD, getDateTimeString } from '$lib/utils/helpers/date';
import { getEmandateDataFunc } from '$components/Payment/api';
import type { MandateWithBankDetails } from '$lib/types/IEmandate';

export const load = (async ({ fetch, params, url, parent }) => {
	const queryParam = url?.searchParams?.get('params') || '';
	const orderpadParam = url?.searchParams?.get('orderpad');
	const fundName = params['fund_name'];

	const decodedParams = decodeToObject(queryParam);
	const { redirectedFrom, isExternal, clientCode } = decodedParams || {};
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();
	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];
	let schemeData: SchemeDetails;
	const parentData = await parent();
	const showShare = shouldDisplayShare(parentData);

	if (isExternal && clientCode && clientCode !== parentData?.profile?.clientId) {
		if (browser) {
			goto(`${base}/schemes/clientError`, { replaceState: true });
		} else {
			redirect(302, `${base}/schemes/clientError`);
		}
	}

	const getSchemeData = async (): Promise<SchemeDetails> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		const res = await useFetch(
			url,
			{
				headers: {
					'X-LRU': 'true',
					'X-Skip-Validation': redirectedFrom === 'SIP_PAYMENTS' || false
				}
			},
			fetch
		);

		if (res.ok) {
			schemeData = res.data;
			return schemeData;
		} else if (res?.status < 500) {
			if (browser) {
				goto(`${base}/schemes/error`, { replaceState: true });
			} else {
				redirect(302, `${base}/schemes/error`);
			}
		} else {
			return new Error('Something went wrong');
		}
	};

	const onClickShareIcon = async () => {
		const { isin, schemeName, returns3yr, nfoScheme } = schemeData;
		shareFundDetailClickAnalytics({
			ISIN: isin,
			FundName: schemeName,
			'3YReturn': returns3yr,
			isOpenNFO: nfoScheme === 'Y',
			schemeURL: getDeeplinkForUrl(url)
		});
		const nfoCloseDate = nfoScheme === 'Y' ? getDateTimeString(schemeData?.nfoEndDate) : '';
		const nfoText = `this NFO - ${schemeData?.schemeName}. The last day to invest in this NFO is ${nfoCloseDate}. Learn more on Angel One -`;
		const lessThanZeroReturn = `the ${schemeData?.schemeName} mutual fund on Angel One -`;
		const grThanZeroReturn = `this mutual fund - ${
			schemeData?.schemeName
		}. It has given ${schemeData?.returns3yr?.toFixed(
			2
		)}% returns annually in the last 3 years. Learn more on Angel One -`;
		const no3yrReturn = `this mutual fund - ${
			schemeData?.schemeName
		}. It has given ${schemeData?.inceptionReturn.toFixed(
			2
		)}% returns since its launch. Learn more on Angel One -`;
		const message = {
			text: `Hey,\n check out ${
				nfoScheme === 'Y'
					? nfoText
					: returns3yr === 0 && schemeData?.inceptionReturn > 0
					? no3yrReturn
					: returns3yr <= 0
					? lessThanZeroReturn
					: grThanZeroReturn
			}\n https://angeloneapp.page.link/?link=${url?.href}&apn=${PUBLIC_MF_ANDROID_APN}`
		};
		shareMessage(message);
	};

	const getFundHoldings = async (): Promise<Array<SchemeHoldings>> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/holdings`;
		const res = await useFetch(url, {}, fetch);
		const holdingData: Array<SchemeHoldings> = res.data;

		if (res?.ok || res?.status < 500) {
			return holdingData;
		} else {
			return new Error('Something went wrong');
		}
	};

	const getFundHoldingsBySector = async (): Promise<Array<SectorHoldings>> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/sectors`;
		const res = await useFetch(url, {}, fetch);
		const holdingData: Array<SectorHoldings> = res.data?.sectorDetails;

		if (res?.ok || res?.status < 500) {
			return holdingData;
		} else {
			return new Error('Something went wrong');
		}
	};

	const getFundComparisonsData = async (): Promise<FundComparisons> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/comparisons`;
		const res = await useFetch(url, {}, fetch);
		const holdingData: FundComparisons = res.data;

		if (res?.ok || res?.status < 500) {
			return holdingData;
		} else {
			return new Error('Something went wrong');
		}
	};

	const getPreviousPaymentDetails = async () => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/user/paymentHandlers`;
			return await useFetch(url, {}, fetch);
		} catch (e) {
			return new Error('Something went wrong');
		}
	};

	const getAllMandates = (madateMap: { [propKey: string]: MandateWithBankDetails }) => {
		const all = (Object.values(madateMap) || []).flat();
		return all;
	};

	const getMandateData = async () => {
		const mandateResponse = await getEmandateDataFunc({
			amount: 0,
			sipDate: getCompleteSIPDateBasedonDD(4, new Date(), 30)
		});
		const mandateData = getAllMandates(mandateResponse?.data);
		return mandateData;
	};

	const getDataforInvestment = async () => {
		try {
			const res = await Promise.all([getPreviousPaymentDetails(), getMandateData()]);
			return {
				previousPaymentDetails: res[0],
				mandateData: res[1]
			};
		} catch (e) {
			return new Error('Something went wrong');
		}
	};

	const getDataforHoldings = async () => {
		try {
			const res = await Promise.all([getFundHoldings(), getFundHoldingsBySector()]);
			return {
				holdingData: res[0],
				sectorHoldings: res[1]
			};
		} catch (e) {
			return new Error('Something went wrong');
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
			decodedParams,
			hideMobileHeader: orderpadParam === 'INVEST'
		},
		api: {
			schemeData: hydrate ? getSchemeData() : await getSchemeData(),
			holdingData: hydrate ? getDataforHoldings() : await getDataforHoldings(),
			comparisons: hydrate ? getFundComparisonsData() : await getFundComparisonsData(),
			dataForInvestment: hydrate ? getDataforInvestment() : await getDataforInvestment()
		},
		showInvestmentPad: orderpadParam === 'INVEST'
	};
}) satisfies PageLoad;
