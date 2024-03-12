import type { IDueSips } from '$lib/types/ISipType';
import Analytics from '$lib/utils/analytics';

export const sHomepage = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 'mf-homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'mf-Homepage',
		event_property: null,
		event_id: '308.0.0.1.0',
		event_metadata: eventMetaData
	});
};

export const nudgeImpression = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'setautopay',
		event_property: null,
		event_id: '308.0.0.1.18'
	});
};

export const nudgeClick = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'setautopay',
		event_property: null,
		event_id: '308.0.0.1.7'
	});
};

export const homepageSipPaymentDueNudgeImpressionAnalytics = (eventMetaData: IDueSips) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'sippaymentdue',
		event_property: null,
		event_id: '308.0.0.5.2',
		event_metadata: eventMetaData
	});
};

export const homepageMultipleSipPaymentDueNudgeImpressionAnalytics = (eventMetaData: {
	dueSips: IDueSips[];
	version: string;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'sippaymentdue',
		event_property: null,
		event_id: '308.0.0.5.4',
		event_metadata: eventMetaData
	});
};

export const tabClickNavigationAnalytics = (eventMetaData: { 'Tab Name': string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'tab',
		event_name: 'bottom-tab',
		event_property: null,
		event_id: '305.0.0.4.23',
		event_metadata: eventMetaData
	});
};

export const homepageSipCalculatorClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'SIPCalculator',
		event_property: null,
		event_id: '308.0.0.6.0'
	});
};

export const homepageNfoClickAnalytics = (nfoCount: number) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'NFOEntryPoint',
		event_property: null,
		event_id: '308.0.0.6.10',
		event_metadata: { NumberOfNFO: nfoCount }
	});
};

export const homepageExternalFundsClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'TrackExternalFundsIcon',
		event_property: null,
		event_id: '308.0.0.6.11'
	});
};

export const investmentCardClickAnalytics = (eventMetaData: {
	CurrentValue: number;
	TotalInvestment: number;
	OverallReturn: string;
	TodaysReturn: string;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'Investment',
		event_property: null,
		event_id: '308.0.0.1.11',
		event_metadata: eventMetaData
	});
};

export const nfoEntryImpressionAnalytics = (eventMetaData: Record<string, string | number>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'NFO',
		event_property: null,
		event_id: '308.0.0.10.30',
		event_metadata: eventMetaData
	});
};

export const sipDueCardImpressionAnalytics = (
	eventMetaData: Record<string, string | number | Record<string, string | number>[]>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'SIPDue',
		event_property: null,
		event_id: '308.0.0.9.11',
		event_metadata: eventMetaData
	});
};

export const sipDueCardSlideAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'slider',
		event_name: 'DueSlider',
		event_property: null,
		event_id: '308.0.0.9.12'
	});
};

export const sipDueCardCtaClickAnalytics = (eventMetaData: Record<string, string | number>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'cta_payoption',
		event_property: null,
		event_id: '308.0.0.9.13',
		event_metadata: eventMetaData
	});
};

export const sipMissedCardImpressionAnalytics = (
	eventMetaData: Record<string, string | number | Record<string, string | number>[]>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'SIPMissed',
		event_property: null,
		event_id: '308.0.0.9.21',
		event_metadata: eventMetaData
	});
};

export const sipMissedCardSlideAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'slider',
		event_name: 'MissedSlider',
		event_property: null,
		event_id: '308.0.0.9.22'
	});
};

export const sipMissedCardCtaClickAnalytics = (eventMetaData: Record<string, string | number>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'cta_payoption',
		event_property: null,
		event_id: '308.0.0.9.23',
		event_metadata: eventMetaData
	});
};

export const setupAutopayCardImpressionAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'SetupAutopay',
		event_property: null,
		event_id: '308.0.0.10.50',
		event_metadata: eventMetaData
	});
};

export const setupAutopayCardCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'SetupAutopay',
		event_property: null,
		event_id: '308.0.0.10.51'
	});
};

export const pageVerticalScrollAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'scroll',
		event_sub_type: 'list',
		event_name: 'verticalscroll',
		event_property: null,
		event_id: '308.0.0.10.60',
		event_metadata: eventMetaData
	});
};

export const cartEntryImpressionAnalytics = (eventMetaData: Record<string, string | number>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'button',
		event_name: 'CartEntry',
		event_property: null,
		event_id: '308.0.0.1.21',
		event_metadata: eventMetaData
	});
};

export const cartEntryClickAnalytics = (eventMetaData: Record<string, string | number>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'CartEntryClick',
		event_property: null,
		event_id: '308.0.0.1.22',
		event_metadata: eventMetaData
	});
};
