import Analytics from '$lib/utils/analytics';

export const screenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-search',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-search',
		event_property: null,
		event_id: '300.0.0.1.0'
	});
};

export const searchFundSelectionAnalytics = (eventMetaData: any, eventProperty: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-search',
		event_type: 'click',
		event_sub_type: 'select',
		event_name: 'FundNameSearchSelection',
		event_property: eventProperty,
		event_id: '300.0.0.1.2',
		event_metadata: eventMetaData
	});
};

export const keywordSearchAnalytics = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-search',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'KeywordSearch',
		event_property: null,
		event_id: '300.0.0.1.3',
		event_metadata: eventMetaData
	});
};
