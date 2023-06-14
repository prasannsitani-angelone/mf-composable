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
		event_name: 'StartSIP',
		event_property: null,
		event_id: '308.0.0.6.8',
		event_metadata: eventMetaData
	});
};
