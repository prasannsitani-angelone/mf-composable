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

export const angeloneTabClickedAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-InvestmentDashboard',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Angelone',
		event_property: null,
		event_id: '313.0.0.0.1'
	});
};

export const allTabClickedAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-InvestmentDashboard',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'All',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.2'
	});
};

export const allTabScreenOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-InvestmentDashboard',
		event_type: 'impressions',
		event_sub_type: 'screen',
		event_name: 'All',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.3'
	});
};

export const investmentRowClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investmentDashboardAll',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Fundname',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.4'
	});
};

export const investmentDetailsExternalScreenOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investmentdetails',
		event_type: 'impressions',
		event_sub_type: 'screen',
		event_name: 'investmentdetails',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.5'
	});
};

export const investmentDetailsExternalFolioSection = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-showmorefolio',
		event_type: 'impressions',
		event_sub_type: 'bottom sheet',
		event_name: 'showmorefolios',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.6'
	});
};

export const investmentDetailsExternalFolioSectionCtaClick = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-showmorefolio',
		event_type: 'impressions',
		event_sub_type: 'bottom sheet',
		event_name: 'showmorefolios',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.7'
	});
};

export const investmentExternalPartialImportScreenOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-InvestmentDashboard',
		event_type: 'i-icon',
		event_sub_type: 'screen',
		event_name: 'i-icon',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.10'
	});
};

export const investmentExternalRefreshFlowAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-refresh',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Refresh',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.11'
	});
};

export const investmentExternalRefreshGotItAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-refresh',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Got it',
		event_property: null,
		event_id: '313.0.0.0.12'
	});
};

export const investmentExternalRefreshGotToInvestmentAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-refresh',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Go to investments',
		event_property: null,
		event_id: '313.0.0.0.14'
	});
};

export const tefTryAgainClickAnlytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-InvestmentDashboard',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Tryagain',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.15'
	});
};

export const trackExternalInvestmentsClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-InvestmentDashboard',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Track external investments',
		event_property: null,
		event_id: '313.0.0.0.16'
	});
};

export const tefGenerateOtpScreenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Trackandanalyseinvestment',
		event_type: 'impressions',
		event_sub_type: 'bottom sheet',
		event_name: 'Generateotp',
		event_property: null,
		event_id: '313.0.0.0.19'
	});
};

export const tefGenerateOtpClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Trackandanalyseinvestment',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Generateotp',
		event_property: null,
		event_id: '313.0.0.0.20'
	});
};

export const tefVerifyOtpScreenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Trackandanalyseinvestment',
		event_type: 'impressions',
		event_sub_type: 'bottom sheet',
		event_name: 'Verifyotp',
		event_property: null,
		event_id: '313.0.0.0.21'
	});
};

export const tefVerifyOtpClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Trackandanalyseinvestment',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Verifyotp',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '313.0.0.0.22'
	});
};

export const tefResendOtpClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-TrackandanalysVerifyotp',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Resendotp',
		event_property: null,
		event_id: '313.0.0.0.23'
	});
};

export const investmentDashboardImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-investmentdashboard',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '306.0.0.13.24'
	});
};

export const holdingClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'FundName',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '306.0.0.13.25'
	});
};

export const fundForYouImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'impression',
		event_sub_type: 'Card',
		event_name: 'Fundforyou',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '306.0.0.13.26'
	});
};

export const fundForYouClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'Click',
		event_sub_type: 'Card',
		event_name: 'Fundforyou',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '306.0.0.13.27'
	});
};

export const fundForYouPopUpImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-fundforyou',
		event_type: 'impression',
		event_sub_type: 'Pop-up',
		event_name: 'Fundforyou',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '306.0.0.13.28'
	});
};

export const fundForYouInvestClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-fundforyou',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'invest',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '306.0.0.13.29'
	});
};

export const fundForYouClickTextAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-fundforyou',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'whythisfund?',
		event_property: null,
		event_metadata: eventMetaData,
		event_id: '306.0.0.13.30'
	});
};

export const fundForYouWhyImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-fundforyou',
		event_type: 'impression',
		event_sub_type: 'pop-up',
		event_name: 'whythisfund?',
		event_property: null,
		event_id: '306.0.0.13.31'
	});
};

export const switchToDirectImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investmentdashboard',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'Switch to direct',
		event_property: null,
		event_id: '311.0.0.1.46',
		event_metadata: eventMetaData
	});
};

export const switchToDirectClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investmentdashboard',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'Switch to direct card',
		event_property: null,
		event_id: '311.0.0.1.47',
		event_metadata: eventMetaData
	});
};

export const switchToDirectScreenImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-switchtodirect',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Switch to direct screen',
		event_property: null,
		event_id: '311.0.0.1.48'
	});
};

export const switchToDirectFundClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-switchtodirect',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'Fundname',
		event_property: null,
		event_id: '311.0.0.1.49',
		event_metadata: eventMetaData
	});
};

export const shortTermInvestmentClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis',
		event_type: 'click',
		event_sub_type: 'Card',
		event_name: 'Shortterminvestments',
		event_property: null,
		event_id: '306.0.0.13.32',
		event_metadata: eventMetaData
	});
};

export const longTermInvestmentClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfolioanalysis',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'longterminvestments',
		event_property: null,
		event_id: '306.0.0.13.33',
		event_metadata: eventMetaData
	});
};

export const shortTermInvestmentImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-shortterminvestment',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Shortterminvestments',
		event_property: null,
		event_id: '306.0.0.13.34',
		event_metadata: eventMetaData
	});
};

export const shortTermTabClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-shortterminvestment',
		event_type: 'click',
		event_sub_type: 'tab',
		event_name: 'OptionClick',
		event_property: null,
		event_id: '306.0.0.13.35',
		event_metadata: eventMetaData
	});
};

export const longTermInvestmentImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-longterminvestment',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'longterminvestment',
		event_property: null,
		event_id: '306.0.0.13.36',
		event_metadata: eventMetaData
	});
};

export const longTermTabClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-longterminvestment',
		event_type: 'click',
		event_sub_type: 'tab',
		event_name: 'OptionClick',
		event_property: null,
		event_id: '306.0.0.13.37',
		event_metadata: eventMetaData
	});
};
export const portfolioBenchmarkInfoIconClickAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Portfolio_Analysis',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'info',
		event_property: null,
		event_id: '306.0.0.13.50',
		event_metadata: eventMetaData
	});
};
export const portfolioBenchmarkPopupOpenAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Info',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'whycomparethisfundwithNifty50',
		event_property: null,
		event_id: '306.0.0.13.51',
		event_metadata: eventMetaData
	});
};
