import Analytics from '$lib/utils/analytics';

export const investmentDashboardScreenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-investmentdashboard',
		event_property: null,
		event_id: '306.0.0.1.0'
	});
};

export const viewPortfolioAnalysisAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'ViewPortfolioAnalysis',
		event_property: null,
		event_id: '306.0.0.1.1',
		event_metadata: eventMetaData
	});
};

export const fundCardClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'FundName',
		event_property: null,
		event_id: '306.0.0.1.2',
		event_metadata: eventMetaData
	});
};

export const hideAllFoliosAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'HideAllFolios',
		event_property: null,
		event_id: '306.0.0.1.3',
		event_metadata: eventMetaData
	});
};

export const schemesSortByAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'sort',
		event_name: 'SortBy',
		event_property: null,
		event_id: '306.0.0.1.4',
		event_metadata: eventMetaData
	});
};

export const portfolioAnalysisScreenOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-portfolioanalysis',
		event_property: null,
		event_id: '306.0.0.13.0',
		event_metadata: eventMetaData
	});
};

export const equityDebtTabSwitchAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis',
		event_type: 'click',
		event_sub_type: 'tab',
		event_name: 'AssetClassify',
		event_property: null,
		event_id: '306.0.0.13.1',
		event_metadata: eventMetaData
	});
};

export const graphYearSelectAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'YOYReturn',
		event_property: null,
		event_id: '306.0.0.13.3',
		event_metadata: eventMetaData
	});
};

export const marketCapShowCompaniesCtaAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis-DetailedAnalysis',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ShowCompanies',
		event_property: null,
		event_id: '306.0.0.13.12'
	});
};

export const sectorsShowCompaniesCtaAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis-DetailedAnalysis',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ShowCompaniesSectors',
		event_property: null,
		event_id: '306.0.0.13.13'
	});
};

export const instrumentsShowCompaniesCtaAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis-DetailedAnalysis',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ShowHoldingsInstruments',
		event_property: null,
		event_id: '306.0.0.13.14'
	});
};

export const ratingsShowCompaniesCtaAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis-DetailedAnalysis',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ShowHoldingsRatings',
		event_property: null,
		event_id: '306.0.0.13.15'
	});
};

export const filterByInstrumentsAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis-DetailedAnalysis',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'FILTERBYInstruments',
		event_property: null,
		event_id: '306.0.0.13.16',
		event_metadata: eventMetaData
	});
};

export const filterByRatingsAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis-DetailedAnalysis',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'FILTERBYRatings',
		event_property: null,
		event_id: '306.0.0.13.17',
		event_metadata: eventMetaData
	});
};

export const investmentDetailsScreenOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investmentsdetails',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'fundinvestmentdetails',
		event_property: null,
		event_id: '306.0.0.13.18',
		event_metadata: eventMetaData
	});
};

export const investmentPadScreenOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-investments',
		event_property: null,
		event_id: '303.0.0.1.0',
		event_metadata: eventMetaData
	});
};

export const investmentPadInvestButtonCtaAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Invest',
		event_property: null,
		event_id: '303.0.0.1.1',
		event_metadata: eventMetaData
	});
};

export const transactionChargesIconClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'TransactionCharges',
		event_property: null,
		event_id: '303.0.0.1.2'
	});
};

export const transactionChargesModalOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionCharges',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'p-TransactionCharges',
		event_property: null,
		event_id: '303.0.0.1.3'
	});
};

export const transactionChargesModalCloseAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionCharges',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'Close',
		event_property: null,
		event_id: '303.0.0.1.4'
	});
};
