import Analytics from '$lib/utils/analytics';

interface ITaxSavingInfo {
	Info: string;
}
interface IFundCardClick {
	'Fund Name': string;
}

export const sExploreMutualFunds = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ExploreMutualFunds',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-ExploreMutualFunds',
		event_property: null,
		event_id: '308.0.0.2.0'
	});
};

export const exploreMFFilter = (eventMetaData: string) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ExploreMutualFunds',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'filter',
		event_property: null,
		event_id: '308.0.0.2.1',
		event_metadata: eventMetaData
	});
};
export const taxSavingInfo = (eventMetaData: ITaxSavingInfo) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ExploreMutualFunds',
		event_type: 'click',
		event_sub_type: 'info',
		event_name: 'MFinfo',
		event_property: null,
		event_id: '308.0.0.2.2',
		event_metadata: eventMetaData
	});
};
export const fundCardClick = (eventMetaData: IFundCardClick) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ExploreMutualFunds',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'FundName',
		event_property: null,
		event_id: '308.0.0.2.4',
		event_metadata: eventMetaData
	});
};
