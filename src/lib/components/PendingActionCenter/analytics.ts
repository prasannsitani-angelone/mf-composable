import Analytics from '$lib/utils/analytics';

export const pendingActionsExpandClickAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'BottomNav',
		event_name: 'Action_required',
		event_property: null,
		event_id: '308.0.0.9.1',
		event_metadata: eventMetaData
	});
};
export const pendingActionsExpandImpressionAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PendingActions',
		event_type: 'impression',
		event_sub_type: 'Popup',
		event_name: 'Pending_action',
		event_property: null,
		event_id: '308.0.0.9.3',
		event_metadata: eventMetaData
	});
};
export const pendingActionsCtaClickedAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PendingActions',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'cta_click',
		event_property: null,
		event_id: '308.0.0.9.4',
		event_metadata: eventMetaData
	});
};
export const pendingActionsCloseAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PendingActions',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'close',
		event_property: null,
		event_id: '308.0.0.9.5'
	});
};
