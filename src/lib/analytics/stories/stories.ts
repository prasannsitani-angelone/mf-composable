import Analytics from '$lib/utils/analytics';

export const clickOnStoryAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StoryView',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'storyicon',
		event_property: null,
		event_id: '308.0.0.6.4',
		event_metadata: eventMetaData
	});
};

export const storyImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StoryView',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: null,
		event_property: null,
		event_id: '308.0.0.6.5',
		event_metadata: eventMetaData
	});
};

export const closeStoryAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StoryView',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'cross',
		event_property: null,
		event_id: '308.0.0.6.6',
		event_metadata: eventMetaData
	});
};

export const storySliderAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StoryView',
		event_type: 'Slider',
		event_sub_type: 'screen',
		event_name: 'storyslider',
		event_property: null,
		event_id: '308.0.0.6.7',
		event_metadata: eventMetaData
	});
};

export const startSipClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StoryView',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'StartSIPFromVideo',
		event_property: null,
		event_id: '308.0.0.6.8',
		event_metadata: eventMetaData
	});
};

export const fundDetailsVideoClickAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'videos',
		event_property: null,
		event_id: '301.0.1.4.1',
		event_metadata: eventMetaData
	});
};

export const fundDetailsVideoImpressionAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Videos',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'videos',
		event_property: null,
		event_id: '301.0.1.4.2',
		event_metadata: eventMetaData
	});
};

export const fundDetailsVideoCloseAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Videos',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'close',
		event_property: null,
		event_id: '301.0.1.4.3',
		event_metadata: eventMetaData
	});
};

export const exitLoadVideoClickAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-potentialreturns',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'videos',
		event_property: null,
		event_id: '307.0.0.1.50',
		event_metadata: eventMetaData
	});
};

export const exitLoadVideoImpressionAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Videos',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'videos',
		event_property: null,
		event_id: '307.0.0.1.51',
		event_metadata: eventMetaData
	});
};

export const exitLoadVideoCloseAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Videos',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'close',
		event_property: null,
		event_id: '307.0.0.1.52',
		event_metadata: eventMetaData
	});
};

export const taxWithdrawalVideoClickAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-potentialreturns',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'videos',
		event_property: null,
		event_id: '307.0.0.1.53',
		event_metadata: eventMetaData
	});
};

export const taxWithdrawalVideoImpressionAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Videos',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'videos',
		event_property: null,
		event_id: '307.0.0.1.54',
		event_metadata: eventMetaData
	});
};

export const taxWithdrawalVideoCloseAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Videos',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'close',
		event_property: null,
		event_id: '307.0.0.1.55',
		event_metadata: eventMetaData
	});
};
