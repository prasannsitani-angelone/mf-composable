import type { Tags } from '$components/Scheme/types';

export const SCHEME_DETAILS_KEY = 'FundDetailsKey';

export const tags: Tags[] = [
	{
		label: '1M',
		months: 1,
		timeScale: 'month',
		returnPeriod: 'returns1Month',
		bmReturnPeriod: 'bmReturns1Month',
		text: '1 Month'
	},
	{
		label: '3M',
		months: 3,
		timeScale: 'month',
		returnPeriod: 'returns3Month',
		bmReturnPeriod: 'bmReturns3Month',
		text: '3 Month'
	},
	{
		label: '6M',
		months: 6,
		timeScale: 'month',
		returnPeriod: 'returns6Month',
		bmReturnPeriod: 'bmReturns6Month',
		text: '6 Month'
	},
	{
		label: '1Y',
		months: 12,
		timeScale: 'year',
		returnPeriod: 'returns1yr',
		bmReturnPeriod: 'bmReturns1yr',
		text: '1 Year'
	},
	{
		label: '3Y',
		months: 36,
		timeScale: 'year',
		returnPeriod: 'returns3yr',
		bmReturnPeriod: 'bmReturns3yr',
		text: '3 Year'
	},
	{
		label: '5Y',
		months: 60,
		timeScale: 'year',
		returnPeriod: 'returns5yr',
		bmReturnPeriod: 'bmReturns5yr',
		text: '5 Year'
	},
	{
		label: 'ALL',
		months: 240,
		timeScale: 'year',
		returnPeriod: 'inceptionReturn',
		bmReturnPeriod: 'bmReturns5yr',
		text: 'All time'
	}
];
