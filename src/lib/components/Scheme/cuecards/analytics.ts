import Analytics from '$lib/utils/analytics';

export const fundOverviewCueCardImpressionEvent = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'ModFund_Graph',
		event_property: null,
		event_id: '301.0.1.3.1',
		event_metadata: eventMetaData
	});
};

export const schemeInfoCueCardImpressionEvent = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'ModFund_BasicInfo',
		event_property: null,
		event_id: '301.0.1.3.2',
		event_metadata: eventMetaData
	});
};

export const riskAndRatingCueCardImpressionEvent = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'ModFund_RatingRisk',
		event_property: null,
		event_id: '301.0.1.3.3',
		event_metadata: eventMetaData
	});
};

export const nfoCueCardImpressionEvent = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'ModFund_NFO',
		event_property: null,
		event_id: '301.0.1.3.4',
		event_metadata: eventMetaData
	});
};

export const closeCueCardClickEvent = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'CloseModularFund',
		event_property: null,
		event_id: '301.0.1.3.5',
		event_metadata: eventMetaData
	});
};

export const schemeInfoCueCardDetailsClickEvent = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ModFund_FundDetailCTA',
		event_property: null,
		event_id: '301.0.1.3.6',
		event_metadata: eventMetaData
	});
};
