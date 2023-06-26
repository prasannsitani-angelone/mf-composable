import Analytics from '$lib/utils/analytics';

// eslint-disable-next-line
export const impressionWithoutHeaders = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 'mf-loginWithoutHeaders',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'mf-loginWithoutHeaders',
		event_property: null,
		event_id: '999.9.9.9.3',
		event_metadata: eventMetaData
	});
};

// eslint-disable-next-line
export const successLoginWithoutHeaders = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 'mf-loginWithoutHeaders',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'mf-successLoginWithoutHeaders',
		event_property: null,
		event_id: '999.9.9.9.4',
		event_metadata: eventMetaData
	});
};
