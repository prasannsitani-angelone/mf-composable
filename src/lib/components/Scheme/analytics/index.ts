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
export interface IMobileSchemeDetailsPageInvestButtonClickAnalytics {
	ISIN: string;
	FundName: string;
	'3YReturn': number;
	isOpenNFO: boolean;
	schemeURL: string;
}
interface IChartTimeIntervalSelection {
	ChartTimeIntervalSelected: string;
	ISIN: string;
	ScreenName: string;
}
interface IAllHoldings {
	action: string;
}
interface ICalculateReturnsAmount {
	InvestmentType: string;
	Amount: number;
}
export interface ISortbyReturnYear {
	ReturnYear: string;
	ISIN: string;
	FundName: string;
	section: 'OtherFundsByAMC' | 'Similar Funds';
}
export interface IFundNameSelection {
	currentISIN: string;
	currentFund3YReturn: number;
	selectedISIN: string;
	selectedFund3YReturn: number;
}

interface IFundDetailShare {
	ISIN: string;
	FundName: string;
	'3YReturn': number;
	isOpenNFO: boolean;
	schemeURL: string;
}

interface ILearnSchemeTerms {
	ISIN: string;
	FundName: string;
}

interface ISchemeTermsInfo {
	ISIN: string;
	FundName: string;
}

interface IViewAllFundHoldings {
	ISIN: string;
	FundName: string;
}

interface IFundHoldingsInfo {
	ISIN: string;
	FundName: string;
}
export const sFundDetails = (eventMetaData: IsFundDetails) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-FundDetails',
		event_property: null,
		event_id: '301.0.1.1.1',
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
		event_id: '301.0.1.1.4',
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

export const fundDetailShare = (eventMetaData: IFundDetailShare) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'FundDetailShare',
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
		event_sub_type: 'button',
		event_name: 'SortByReturns',
		event_property: null,
		event_id: '301.0.1.1.9',
		event_metadata: eventMetaData
	});
};

export const fundNameSelection = (
	eventMetaData: IFundNameSelection,
	type: 'SimilarFundSelect' | 'SameAMCFundSelect',
	event_id: '301.0.1.1.10' | '301.0.1.1.11'
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'select',
		event_name: type,
		event_property: null,
		event_id,
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
		event_name: 'FundDetailInvest',
		event_property: null,
		event_id: '301.0.1.1.2',
		event_metadata: eventMetaData
	});
};

export const shareFundDetailClickAnalytics = (eventMetaData: IFundDetailShare) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'FundDetailShare',
		event_property: null,
		event_id: '301.0.1.1.3',
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

export const learnSchemeTerms = (eventMetaData: ILearnSchemeTerms) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'LearnSchemeTerms',
		event_property: null,
		event_id: '301.0.1.1.5',
		event_metadata: eventMetaData
	});
};

export const schemeTermsInfo = (eventMetaData: ISchemeTermsInfo) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-LearnSchemeTerms',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'LearnSchemeTerms',
		event_property: null,
		event_id: '301.0.1.1.6',
		event_metadata: eventMetaData
	});
};

export const viewAllFundHoldings = (eventMetaData: IViewAllFundHoldings) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ViewAllFundHoldings',
		event_property: null,
		event_id: '301.0.1.1.7',
		event_metadata: eventMetaData
	});
};

export const fundHoldingsInfo = (eventMetaData: IFundHoldingsInfo) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-FundHoldings',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'FundHoldingsInfo',
		event_property: null,
		event_id: '301.0.1.1.8',
		event_metadata: eventMetaData
	});
};
