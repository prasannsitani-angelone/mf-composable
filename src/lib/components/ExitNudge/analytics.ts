import Analytics from '$lib/utils/analytics';

export const exitNudgeImpressionEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Exitpage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Exitpage',
		event_property: null,
		event_id: '308.0.0.6.40'
	});
};

export const exitNudgeKnowMoreClickEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Exitpage',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'Knowmoreaboutthisfund',
		event_property: null,
		event_id: '308.0.0.6.41'
	});
};

export const exitNudgeStartSipClickEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Exitpage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'startfirstSIP',
		event_property: null,
		event_id: '308.0.0.6.42'
	});
};

export const exitNudgeBackClickEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Exitpage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Goback',
		event_property: null,
		event_id: '308.0.0.6.43'
	});
};
