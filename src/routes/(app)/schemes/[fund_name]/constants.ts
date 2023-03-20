export const SCHEME_DETAILS_KEY = 'FundDetailsKey';

export const tags = [
	{
		label: '1M',
		months: 1,
		timeScale: 'month',
		returnPeriod: 'returns1Month',
		bmReturnPeriod: 'bmReturns1Month'
		// disabled: props.fundDetails?.returns1Month === 0
	},
	{
		label: '3M',
		months: 3,
		timeScale: 'month',
		returnPeriod: 'returns3Month',
		bmReturnPeriod: 'bmReturns3Month'
		// disabled: props.fundDetails?.returns3Month === 0
	},
	{
		label: '6M',
		months: 6,
		timeScale: 'month',
		returnPeriod: 'returns6Month',
		bmReturnPeriod: 'bmReturns6Month'
		// disabled: props.fundDetails?.returns6Month === 0
	},
	{
		label: '1Y',
		months: 12,
		timeScale: 'year',
		returnPeriod: 'returns1yr',
		bmReturnPeriod: 'bmReturns1yr'
		// disabled: props.fundDetails?.returns1yr === 0
	},
	{
		label: '3Y',
		months: 36,
		timeScale: 'year',
		returnPeriod: 'returns3yr',
		bmReturnPeriod: 'bmReturns3yr'
		// disabled: props.fundDetails?.returns3yr === 0
	},
	{
		label: '5Y',
		months: 60,
		timeScale: 'year',
		returnPeriod: 'returns5yr',
		bmReturnPeriod: 'bmReturns5yr'
		// disabled: props.fundDetails?.returns5yr === 0
	},
	{
		label: 'ALL',
		months: 240,
		timeScale: 'year',
		returnPeriod: 'inceptionReturn',
		bmReturnPeriod: 'bmReturns5yr'
		// disabled: props.fundDetails?.returns1Month === 0
	}
];
