// import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
// import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
// import { browser } from '$app/environment';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
// import { goto } from '$app/navigation';
// import { base } from '$app/paths';
// import { redirect } from '@sveltejs/kit';

export const load = (async ({ fetch }) => {
	// let schemeData: [SchemeDetails];

	// const getSchemePack = async (): Promise<[SchemeDetails]> => {
	// 	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/packs?packId=start_your_first_sip`;
	// 	const res = await useFetch(url, { headers: { 'X-LRU': 'true' } }, fetch);

	// 	if (res.ok) {
	// 		schemeData = res.data.packs[0].schemes;
	// 	} else {
	// 		if (browser) {
	// 			goto(`${base}/schemes/error`, { replaceState: true });
	// 		} else {
	// 			redirect(302, `${base}/schemes/error`);
	// 		}
	// 	}

	// 	return schemeData;
	// };

	const _schemePack = [
		{
			isin: 'INF109K012B0',
			schemeCode: '8180-GR',
			schemeName: 'ICICI Prudential Balanced Advantage Fund Direct Plan Growth',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
			weightage: 4,
			wieightPercentage: 4,
			subCategory: 'Dynamic Asset Allocation or Balanced Advantage',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 14.2869,
			noOfClientInvested: 0,
			riskoMeterValue: 'High Risk'
		},
		{
			isin: 'INF109K01S39',
			schemeCode: '8188-GR',
			schemeName: 'ICICI Prudential Regular Savings Fund Direct Plan Growth',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
			weightage: 3,
			wieightPercentage: 3,
			subCategory: 'Conservative Hybrid Fund',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 10.4542,
			noOfClientInvested: 0,
			riskoMeterValue: 'Moderately High Risk'
		},
		{
			isin: 'INF179KA1RW5',
			schemeCode: 'HDACG1G-GR',
			schemeName: 'HDFC Small Cap Fund Growth Direct Plan',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
			weightage: 3,
			wieightPercentage: 3,
			subCategory: 'Small Cap Fund',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 33.2794,
			noOfClientInvested: 0,
			riskoMeterValue: 'Very High Risk'
		},
		{
			isin: 'INF109K012B0',
			schemeCode: '8180-GR',
			schemeName: 'ICICI Prudential Balanced Advantage Fund Direct Plan Growth',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
			weightage: 4,
			wieightPercentage: 4,
			subCategory: 'Dynamic Asset Allocation or Balanced Advantage',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 14.2869,
			noOfClientInvested: 0,
			riskoMeterValue: 'High Risk'
		},
		{
			isin: 'INF109K01S39',
			schemeCode: '8188-GR',
			schemeName: 'ICICI Prudential Regular Savings Fund Direct Plan Growth',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
			weightage: 3,
			wieightPercentage: 3,
			subCategory: 'Conservative Hybrid Fund',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 10.4542,
			noOfClientInvested: 0,
			riskoMeterValue: 'Moderately High Risk'
		},
		{
			isin: 'INF179KA1RW5',
			schemeCode: 'HDACG1G-GR',
			schemeName: 'HDFC Small Cap Fund Growth Direct Plan',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
			weightage: 3,
			wieightPercentage: 3,
			subCategory: 'Small Cap Fund',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 33.2794,
			noOfClientInvested: 0,
			riskoMeterValue: 'Very High Risk'
		},
		{
			isin: 'INF109K012B0',
			schemeCode: '8180-GR',
			schemeName: 'ICICI Prudential Balanced Advantage Fund Direct Plan Growth',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
			weightage: 4,
			wieightPercentage: 4,
			subCategory: 'Dynamic Asset Allocation or Balanced Advantage',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 14.2869,
			noOfClientInvested: 0,
			riskoMeterValue: 'High Risk'
		},
		{
			isin: 'INF109K01S39',
			schemeCode: '8188-GR',
			schemeName: 'ICICI Prudential Regular Savings Fund Direct Plan Growth',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
			weightage: 3,
			wieightPercentage: 3,
			subCategory: 'Conservative Hybrid Fund',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 10.4542,
			noOfClientInvested: 0,
			riskoMeterValue: 'Moderately High Risk'
		},
		{
			isin: 'INF179KA1RW5',
			schemeCode: 'HDACG1G-GR',
			schemeName: 'HDFC Small Cap Fund Growth Direct Plan',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
			weightage: 3,
			wieightPercentage: 3,
			subCategory: 'Small Cap Fund',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 33.2794,
			noOfClientInvested: 0,
			riskoMeterValue: 'Very High Risk'
		},
		{
			isin: 'INF109K012B0',
			schemeCode: '8180-GR',
			schemeName: 'ICICI Prudential Balanced Advantage Fund Direct Plan Growth',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
			weightage: 4,
			wieightPercentage: 4,
			subCategory: 'Dynamic Asset Allocation or Balanced Advantage',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 14.2869,
			noOfClientInvested: 0,
			riskoMeterValue: 'High Risk'
		},
		{
			isin: 'INF109K01S39',
			schemeCode: '8188-GR',
			schemeName: 'ICICI Prudential Regular Savings Fund Direct Plan Growth',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
			weightage: 3,
			wieightPercentage: 3,
			subCategory: 'Conservative Hybrid Fund',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 10.4542,
			noOfClientInvested: 0,
			riskoMeterValue: 'Moderately High Risk'
		},
		{
			isin: 'INF179KA1RW5',
			schemeCode: 'HDACG1G-GR',
			schemeName: 'HDFC Small Cap Fund Growth Direct Plan',
			logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
			weightage: 3,
			wieightPercentage: 3,
			subCategory: 'Small Cap Fund',
			sipMaxInstallmentNo: 9999,
			sipMaxAmount: 999999999,
			sipFrequency: 'MONTHLY',
			minSipAmount: 100,
			returns3yr: 33.2794,
			noOfClientInvested: 0,
			riskoMeterValue: 'Very High Risk'
		}
	];

	return {
		layoutConfig: {
			title: 'Select Fund',
			showBackIcon: true,
			layoutType: 'DEFAULT'
		},
		api: {
			// schemePack: browser ? getSchemePack() : await getSchemePack()
			schemePack: _schemePack
		}
	};
}) satisfies PageLoad;
