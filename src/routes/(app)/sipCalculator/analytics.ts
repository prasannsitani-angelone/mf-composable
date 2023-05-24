import Analytics from '$lib/utils/analytics';
export const sipCalculatorScreenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPCalculator',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'SIPCalculator',
		event_property: null,
		event_id: '308.0.0.6.1'
	});
};
export const sipCalculatorReturnsSliderAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPCalculator',
		event_type: 'click',
		event_sub_type: 'slider',
		event_name: 'ExpectedReturn',
		event_property: null,
		event_id: '308.0.0.6.2',
		event_metadata: eventMetaData
	});
};
export const sipCalculatorInvestButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPCalculator',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'StartInvesting',
		event_property: null,
		event_id: '308.0.0.6.3'
	});
};
