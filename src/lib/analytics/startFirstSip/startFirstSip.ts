import Analytics from '$lib/utils/analytics';

export const firstSipCardMountedAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'firstSIPvisible',
		event_property: null,
		event_id: '308.0.0.6.15',
		event_metadata: eventMetaData
	});
};

export const firstSipCardGetStartedButtonClickAnalytics = (
	eventMetaData: Record<string, string>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartYourtInvestmentJourney',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Getstarted',
		event_property: null,
		event_id: '308.0.0.6.16',
		event_metadata: eventMetaData
	});
};

export const startFirstSipScreenImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartFirstInvestment',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'StartFirstInvestment',
		event_property: null,
		event_id: '308.0.0.6.39'
	});
};

export const startFirstSipSchemeClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartFirstInvestment',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'FundName-firstSIP',
		event_property: null,
		event_id: '308.0.0.6.49',
		event_metadata: eventMetaData
	});
};
