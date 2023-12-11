import Analytics from '$lib/utils/analytics';

export interface IExploreMF {
	quickfilter: string;
	viewmorefund: 'Y' | 'N';
	topFilter: 'Y' | 'N';
}

export type ScreenerSource = 'Homepage' | 's_Eexploremutualfunds';

export interface ITryQuickFilter {
	rank: number;
	quickfilter: string;
	source: ScreenerSource;
}

export interface ITopfilter {
	source: ScreenerSource;
}

export interface IViewallfunds {
	source: ScreenerSource;
}

export interface IFundSelect {
	fundName: string;
	isin: string;
	fundRank: number;
	source: ScreenerSource;
}

export const exploreMFImpression = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's_ExploreMutualFunds_Filter',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'ExploreMF',
		event_property: null,
		event_id: '308.0.0.8.0'
	});
};

export const bottomFilterClick = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's_ExploreMutualFunds_Filter',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'bottomfilter',
		event_property: null,
		event_id: '308.0.0.8.8'
	});
};

export const tryQuickFilterClick = (eventMetaData: ITryQuickFilter) => {
	Analytics.logAnalyticEvent({
		screen_name: 's_Homepage',
		event_type: 'click',
		event_sub_type: 'pill',
		event_name: 'tryquickfilter',
		event_property: null,
		event_id: '308.0.0.8.1',
		event_metadata: eventMetaData
	});
};

export const topfilterClick = (eventMetaData: ITopfilter) => {
	Analytics.logAnalyticEvent({
		screen_name: 's_Homepage',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'topfilter',
		event_property: null,
		event_id: '308.0.0.8.2',
		event_metadata: eventMetaData
	});
};

export const fundSelectClick = (eventMetaData: IFundSelect) => {
	Analytics.logAnalyticEvent({
		screen_name: 's_Homepage',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'FundSelect',
		event_property: null,
		event_id: '308.0.0.8.3',
		event_metadata: eventMetaData
	});
};

export const viewallfundsClick = (eventMetaData: IViewallfunds) => {
	Analytics.logAnalyticEvent({
		screen_name: 's_Homepage',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'viewallfunds',
		event_property: null,
		event_id: '308.0.0.8.4',
		event_metadata: eventMetaData
	});
};

export const screenersFiltersPageImpression = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's_Filter',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Filter',
		event_property: null,
		event_id: '308.0.0.8.5'
	});
};

export const applyFiltersClickAnalytics = (
	eventMetaData: Record<string, string | number | undefined>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's_Filter',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Apply',
		event_property: null,
		event_id: '308.0.0.8.6',
		event_metadata: eventMetaData
	});
};

export const resetFiltersClickAnalytics = (
	eventMetaData: Record<string, string | number | undefined>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's_Filter',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Reset',
		event_property: null,
		event_id: '308.0.0.8.7',
		event_metadata: eventMetaData
	});
};
