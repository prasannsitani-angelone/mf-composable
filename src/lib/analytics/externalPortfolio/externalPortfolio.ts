import Analytics from '$lib/utils/analytics';

export const externalPortfolioViewAnalysisClickAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'ViewExternalPortfolioAnalysis',
		event_property: null,
		event_id: '306.0.0.13.60',
		event_metadata: eventMetaData
	});
};
export const externalPortfolioScreenOpenAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Portfolio_Analysis',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'ExternalPortfolioAnalysis',
		event_property: null,
		event_id: '306.0.0.13.61',
		event_metadata: eventMetaData
	});
};
export const externalPortfolioBenchmarkInfoIconClickAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Portfolio_Analysis',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'info',
		event_property: null,
		event_id: '306.0.0.13.62',
		event_metadata: eventMetaData
	});
};
export const externalPortfolioBenchmarkPopupOpenAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Info',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'whycomparethisfundwithNifty50',
		event_property: null,
		event_id: '306.0.0.13.63',
		event_metadata: eventMetaData
	});
};
