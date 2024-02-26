import { versionStore } from '$lib/stores/VersionStore';
import type { ScreenedSchemes } from '$lib/types/Screener';
import Analytics from '$lib/utils/analytics';

export type VideoAnalyticsCallbacks = {
	videoImpression?: () => void;
	muteUnmute?: (title: string | undefined, isMuted: boolean) => void;
	bottomDrawerItemClick?: (title: string, scheme: ScreenedSchemes, index: number) => void;
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

export const handleVideoCardClickAnalytics = (title: string) => {
	Analytics.logAnalyticEvent({
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'video',
		event_id: '308.0.0.10.5',
		screen_name: 's-Homepage',
		event_property: null,
		event_metadata: {
			VideoIndex: '1',
			version: versionStore.getVersion(),
			VideoTitle: title
		}
	});
};

export const handleMuteUnMuteAnalytics = (title: string | undefined, isMuted: boolean) => {
	Analytics.logAnalyticEvent({
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'videomute',
		event_id: '308.0.0.10.6',
		screen_name: 's-Homepage',
		event_property: null,
		event_metadata: {
			version: versionStore.getVersion(),
			VideoTitle: title,
			mute: isMuted ? 'Yes' : 'No'
		}
	});
};

export const handleFundSelectAnalytics = (
	title: string | undefined,
	{ schemeName, isin }: ScreenedSchemes,
	index: number
) => {
	Analytics.logAnalyticEvent({
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'videomute',
		event_id: '308.0.0.10.8',
		screen_name: 's-Videopage',
		event_property: null,
		event_metadata: {
			version: versionStore.getVersion(),
			VideoTitle: title,
			FundIndex: index,
			FundName: schemeName,
			Isin: isin
		}
	});
};

export const handleCrossButtonAnalytics = (title: string | undefined) => {
	Analytics.logAnalyticEvent({
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'videomute',
		event_id: '308.0.0.10.9',
		screen_name: 's-Videopage',
		event_property: null,
		event_metadata: {
			version: versionStore.getVersion(),
			VideoTitle: title
		}
	});
};
