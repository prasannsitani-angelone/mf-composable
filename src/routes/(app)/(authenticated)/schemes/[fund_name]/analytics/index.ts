import Analytics from '$lib/utils/analytics';

interface IsFundDetails {
	Fundname: string;
	FundType: string;
	SubAssetType: string;
	Rating: number;
	Nav: number;
	'Exit Load': string;
	'Expense Ratio': number;
}
interface IMobileSchemeDetailsPageInvestButtonClickAnalytics {
	Fundname: string;
	AssetType: string;
	SubAssetType: string;
	FundType: string;
	Rating: number;
	NAV: number;
}
interface IChartTimeIntervalSelection {
	ChartTimeIntervalSelected: string;
}
interface IAllHoldings {
	action: string;
}
interface ICalculateReturnsAmount {
	InvestmentType: string;
	Amount: number;
}
interface ISortbyReturnYear {
	ReturnYear: string;
}
interface IFundNameSelection {
	Fundname: string;
	FundType: string;
	Rating: number;
	ReturnYear: string;
	ReturnsValue: string;
}

export const sFundDetails = (eventMetaData: IsFundDetails) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-FundDetails',
		event_property: null,
		event_id: '301.0.0.1.0',
		event_metadata: eventMetaData
	});
};

export const chartTimeIntervalSelection = (eventMetaData: IChartTimeIntervalSelection) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'ChartTimeIntervalSelection',
		event_property: null,
		event_id: '301.0.0.1.1',
		event_metadata: eventMetaData
	});
};
export const calculateReturnsAmount = (eventMetaData: ICalculateReturnsAmount) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'slider',
		event_name: 'CalculateReturnsAmount',
		event_property: null,
		event_id: '301.0.0.1.2',
		event_metadata: eventMetaData
	});
};

export const calculateReturnsduration = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'slider',
		event_name: 'CalculateReturnsduration',
		event_property: null,
		event_id: '301.0.0.1.3',
		event_metadata: eventMetaData
	});
};

export const allHoldings = (eventMetaData: IAllHoldings) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'AllHoldings',
		event_property: null,
		event_id: '301.0.0.1.8',
		event_metadata: eventMetaData
	});
};
export const sortbyReturnYear = (eventMetaData: ISortbyReturnYear) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'sort',
		event_name: 'sortbyReturnYear',
		event_property: null,
		event_id: '301.0.0.1.9',
		event_metadata: eventMetaData
	});
};

export const fundNameSelection = (eventMetaData: IFundNameSelection) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'select',
		event_name: 'FundNameSelection',
		event_property: null,
		event_id: '301.0.0.1.10',
		event_metadata: eventMetaData
	});
};

export const pUnderstandingSchemeTerms = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-UnderstandingSchemeTerms',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'p-UnderstandingSchemeTerms',
		event_property: null,
		event_id: '301.0.0.1.13'
	});
};
export const mobileSchemeDetailsPageInvestButtonClickAnalytics = (
	eventMetaData: IMobileSchemeDetailsPageInvestButtonClickAnalytics
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'invest',
		event_property: null,
		event_id: '301.0.0.1.14',
		event_metadata: eventMetaData
	});
};

export const shareFundDetailClickAnalytics = (eventMetaData: {
	Fundname: string;
	FundType: string;
	AssetType: string;
	SubAssetType: string;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Share',
		event_property: null,
		event_id: '301.0.0.1.15',
		event_metadata: eventMetaData
	});
};

export const returnCalculatorImpressionAnalytics = (
	eventMetaData: Record<string, string | number | undefined>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'impression',
		event_sub_type: 'tab',
		event_name: 'ReturnCalc_card',
		event_property: null,
		event_id: '301.0.1.2.6',
		event_metadata: eventMetaData
	});
};

export const returnCalculatorResultAnalytics = (
	eventMetaData: Record<string, string | number | undefined>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'api',
		event_sub_type: 'api',
		event_name: 'ReturnCalc_api',
		event_property: null,
		event_id: '301.0.1.2.12',
		event_metadata: eventMetaData
	});
};
