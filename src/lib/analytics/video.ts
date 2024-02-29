import Analytics from '$lib/utils/analytics';

interface VideoAnalyticsMetaData {
	version?: string;
	VideoTitle?: string;
	FundName?: string;
	FundIndex?: number;
	Isin?: string;
	mute?: boolean;
}

export type VideoAnalyticsCallbacks = {
	videoImpression?: (isHomePage?: boolean, eventMetaData?: VideoAnalyticsMetaData | null) => void;
	muteUnmute?: (eventMetaData: VideoAnalyticsMetaData) => void;
	bottomDrawerItemClick?: (eventMetaData: VideoAnalyticsMetaData) => void;
	bottomDrawerDrag?: (eventMetaData: VideoAnalyticsMetaData) => void;
};

export const handleVideoImpressionEvent = (
	isHomePage = true,
	eventMetaData: VideoAnalyticsMetaData | null = null
) => {
	Analytics.logAnalyticEvent({
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'video',
		event_id: isHomePage ? '308.0.0.10.4' : '308.0.0.10.7',
		screen_name: isHomePage ? 's-Homepage' : 's-VideoPage',
		event_property: null,
		event_metadata: eventMetaData
	});
};

export const handleVideoCardClickAnalytics = (eventMetaData: VideoAnalyticsMetaData) => {
	Analytics.logAnalyticEvent({
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'video',
		event_id: '308.0.0.10.5',
		screen_name: 's-Homepage',
		event_property: null,
		event_metadata: eventMetaData
	});
};

export const handleMuteUnMuteAnalytics = (eventMetaData: VideoAnalyticsMetaData) => {
	Analytics.logAnalyticEvent({
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'videomute',
		event_id: '308.0.0.10.6',
		screen_name: 's-Homepage',
		event_property: null,
		event_metadata: eventMetaData
	});
};

export const handleFundSelectAnalytics = (eventMetaData: VideoAnalyticsMetaData) => {
	Analytics.logAnalyticEvent({
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'videomute',
		event_id: '308.0.0.10.8',
		screen_name: 's-Videopage',
		event_property: null,
		event_metadata: eventMetaData
	});
};

export const handleCrossButtonAnalytics = (eventMetaData: VideoAnalyticsMetaData) => {
	Analytics.logAnalyticEvent({
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'videomute',
		event_id: '308.0.0.10.9',
		screen_name: 's-Videopage',
		event_property: null,
		event_metadata: eventMetaData
	});
};

export const handleFundSliderAnalytics = (eventMetaData: VideoAnalyticsMetaData) => {
	Analytics.logAnalyticEvent({
		event_type: 'Slider',
		event_sub_type: 'button',
		event_name: 'videomute',
		event_id: '308.0.0.10.9',
		screen_name: 's-Videopage',
		event_property: null,
		event_metadata: eventMetaData
	});
};
