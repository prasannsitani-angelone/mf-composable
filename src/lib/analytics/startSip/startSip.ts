import Analytics from '$lib/utils/analytics';

export const startSipEntryClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'StartSIP',
		event_property: null,
		event_id: '318.0.0.10.1',
		event_metadata: eventMetaData
	});
};
export const startSipPageOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartSIP',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'StartSIP',
		event_property: null,
		event_id: '318.0.0.10.2'
	});
};
export const startSipFundSelectAnalytics = (eventMetaData: Record<string, string | number>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartSIP',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'FundSelect',
		event_property: null,
		event_id: '318.0.0.10.3',
		event_metadata: eventMetaData
	});
};
