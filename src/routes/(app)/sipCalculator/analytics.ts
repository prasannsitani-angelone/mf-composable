import Analytics from '$lib/utils/analytics';

export const sipCalculatorScreenOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPCalculator',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'SIPCalculator',
		event_property: null,
		event_id: '308.0.0.6.1',
		event_metadata: eventMetaData
	});
};
export const sipCalculatorReturnsSliderAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPCalculator',
		event_type: 'click',
		event_sub_type: 'slider',
		event_name: 'SIPCalculator_changes',
		event_property: null,
		event_id: '308.0.0.6.2',
		event_metadata: eventMetaData
	});
};
export const sipCalculatorInvestButtonClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPCalculator',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'StartInvesting',
		event_property: null,
		event_id: '308.0.0.6.3',
		event_metadata: eventMetaData
	});
};
