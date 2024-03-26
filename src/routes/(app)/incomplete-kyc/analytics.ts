import Analytics from '$lib/utils/analytics';

export const handleIncompleteKycImpression = (eventMetaData?: object) => {
	Analytics.logAnalyticEvent({
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'KYCnotcomplete',
		event_id: '319.0.0.0.1',
		event_property: null,
		event_metadata: eventMetaData,
		screen_name: ''
	});
};

export const handleClickViewKycAnalytics = (eventMetaData?: object) => {
	Analytics.logAnalyticEvent({
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ViewKycStatus',
		event_id: '319.0.0.0.2',
		event_property: null,
		event_metadata: eventMetaData,
		screen_name: ''
	});
};

export const handleGoBackButtonAnalytics = (eventMetaData?: object) => {
	Analytics.logAnalyticEvent({
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'goback',
		event_id: '319.0.0.0.3',
		event_property: null,
		event_metadata: eventMetaData,
		screen_name: ''
	});
};
