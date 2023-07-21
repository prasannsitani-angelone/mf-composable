import Analytics from '$lib/utils/analytics';

export const filterToggleButtonClickEvent = (eventMetaData: { toggle: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'Toggle',
		event_name: 'absolute/XIRRtoggle',
		event_property: null,
		event_id: '306.0.0.13.18',
		event_metadata: eventMetaData
	});
};

export const xirrFilterClickEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'click',
		event_name: 'What is XIRR?',
		event_property: null,
		event_id: '306.0.0.13.19'
	});
};

export const xirrFilterModalImpressionEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'impression',
		event_sub_type: 'text',
		event_name: 'What is XIRR?',
		event_property: null,
		event_id: '306.0.0.13.20'
	});
};
