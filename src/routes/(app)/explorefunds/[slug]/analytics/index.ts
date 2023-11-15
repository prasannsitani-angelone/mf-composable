import Analytics from '$lib/utils/analytics';

interface IFundCardClick {
	type: string;
	category: string;
	fundisin: string;
	fundrank: number;
	label?: string;
}

export const sExploreMutualFunds = (eventMetaData: { type: string; Category: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ExploreMutualFunds',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'ExploreMF',
		event_property: null,
		event_id: '308.0.0.2.0',
		event_metadata: eventMetaData
	});
};

export const exploreMFFilter = (eventMetaData: {
	type: string;
	Category: string;
	label: string;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'click',
		event_name: 'categoryselect',
		event_property: null,
		event_id: '308.0.0.2.1',
		event_metadata: eventMetaData
	});
};

export const exploreMFFilterTab = (eventMetaData: {
	type: string;
	Category: string;
	label: string;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'click',
		event_name: 'tabpill',
		event_property: null,
		event_id: '308.0.0.2.5',
		event_metadata: eventMetaData
	});
};

export const fundCardClick = (eventMetaData: IFundCardClick) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ExploreMutualFunds',
		event_type: 'click',
		event_sub_type: 'click',
		event_name: 'CategoryFundSelect',
		event_property: null,
		event_id: '308.0.0.2.4',
		event_metadata: eventMetaData
	});
};

export const fundCardClickTab = (eventMetaData: IFundCardClick) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'tab',
		event_name: 'TabFundSelect',
		event_property: null,
		event_id: '308.0.0.2.6',
		event_metadata: eventMetaData
	});
};
