import Analytics from '$lib/utils/analytics';

export const sipScoreViewDetailsCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SipBook',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ViewDetails',
		event_property: null,
		event_id: '309.0.0.1.61'
	});
};

export const sipHealthDetailsPageImpressionAnalytics = (
	eventMetaData: Record<string, string | number | boolean>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SipHealthCheck',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'SipHealthCheck',
		event_property: null,
		event_id: '309.0.0.1.62',
		event_metadata: eventMetaData
	});
};

export const sipHealthDetailsPageLearnMoreCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SipHealthCheck',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'LearnMore',
		event_property: null,
		event_id: '309.0.0.1.63'
	});
};

export const sipHealthDetailsPageCueCardOpenCtaClickAnalytics = (
	eventMetaData: Record<string, string | number | boolean>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SipHealthCheck',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'SipHealthMessage',
		event_property: null,
		event_id: '309.0.0.1.64',
		event_metadata: eventMetaData
	});
};

export const sipHealthDetailsPageCueCardImpressionAnalytics = (
	eventMetaData: Record<string, string | number | boolean>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SipHealthCheck',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'SipHealthMsgCard',
		event_property: null,
		event_id: '309.0.0.1.65',
		event_metadata: eventMetaData
	});
};

export const sipHealthDetailsPageSetupAutopayCtaClickAnalytics = (
	eventMetaData: Record<string, string | number | boolean>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SipHealthCheck',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'SetupAutoPay',
		event_property: null,
		event_id: '309.0.0.1.66',
		event_metadata: eventMetaData
	});
};
