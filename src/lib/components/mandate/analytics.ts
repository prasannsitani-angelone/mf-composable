import Analytics from '$lib/utils/analytics';

export const accounChangeAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPMandate',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ChangeBank',
		event_property: null,
		event_id: '302.0.0.1.2',
		event_metadata: eventMetaData
	});
};
