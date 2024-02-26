import Analytics from '$lib/utils/analytics';

interface VideoAnalyticsMetaData {
	version?: string;
	VideoTitle?: string;
	FundName?: string;
	FundIndex?: string;
	Isin?: string;
	mute?: boolean;
}

export type VideoAnalyticsCallbacks = {
	videoImpression?: () => void;
	muteUnmute?: (eventMetaData: VideoAnalyticsMetaData) => void;
	bottomDrawerItemClick?: (eventMetaData: VideoAnalyticsMetaData) => void;
};

export const handleVideoImpressionEvent = () => {
	Analytics.logAnalyticEvent({
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'video',
		event_id: '308.0.0.10.4',
		screen_name: 's-Homepage',
		event_property: null
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
