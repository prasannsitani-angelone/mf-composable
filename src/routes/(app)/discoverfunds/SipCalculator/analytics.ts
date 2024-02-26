import Analytics from '$lib/utils/analytics';

export const sipCalculatorNudgeImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'SIPCalculator',
		event_property: null,
		event_id: '308.0.0.10.16',
		event_metadata: eventMetaData
	});
};

export const sipCalculatorReturnsSliderAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'slider',
		event_name: 'SIPCalculator_changes',
		event_property: null,
		event_id: '308.0.0.10.17',
		event_metadata: eventMetaData
	});
};

export const sipCalculatorEditClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'SipEditor',
		event_property: null,
		event_id: '308.0.0.10.18'
	});
};

export const sipCalculatorInvestButtonClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ChooseFunds',
		event_property: null,
		event_id: '308.0.0.10.19',
		event_metadata: eventMetaData
	});
};
