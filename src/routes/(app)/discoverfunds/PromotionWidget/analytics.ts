import Analytics from '$lib/utils/analytics';

export const handleBannerImpressionAnalytics = (eventMetaData?: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'IPLbanner',
		event_property: null,
		event_id: '308.0.0.11.0',
		event_metadata: eventMetaData
	});
};

export const handleCarouselItemClickAnalytics = (eventMetaData?: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'IPLbanner_card',
		event_property: null,
		event_id: '308.0.0.11.1',
		event_metadata: eventMetaData
	});
};

export const handleCarouselSliderAnalytics = (eventMetaData?: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'slider',
		event_name: 'IPLbanner_slider',
		event_property: null,
		event_id: '308.0.0.11.2',
		event_metadata: eventMetaData
	});
};
