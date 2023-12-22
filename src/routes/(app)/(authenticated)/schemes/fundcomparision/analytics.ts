import Analytics from '$lib/utils/analytics';
import type { ICompareFunds } from './type';

export const viewDetailedComparisonClickEvent = (eventMetaData: ICompareFunds) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundDetails',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ViewDetailedComparison',
		event_property: null,
		event_id: '301.0.1.1.13',
		event_metadata: eventMetaData
	});
};
export const compareFundDeleteClickEvent = (eventMetaData: {
	fundnameDeleted: string;
	fundnameDeletedIsin: string;
	fundDeleted3YReturn: number;
	fundDeletedMinSipAmount: number;
	rank: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-comparefunds',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'CompareFundDelete',
		event_property: null,
		event_id: '325.0.0.1.2',
		event_metadata: eventMetaData
	});
};
export const addFundButtonClickEvent = (eventMetaData: { rank: number }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-comparefunds',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'AddFundButton',
		event_property: null,
		event_id: '325.0.0.1.3',
		event_metadata: eventMetaData
	});
};
export const addFundsScreenImpressionEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Addfunds',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'AddFunds',
		event_property: null,
		event_id: '325.0.0.1.4'
	});
};
export const suggestedFundnameClickEvent = (eventMetaData: {
	suggestedFund: string;
	suggestedFundRank: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Addfunds',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'SuggestedFundname',
		event_property: null,
		event_id: '325.0.0.1.5',
		event_metadata: eventMetaData
	});
};
export const addFundsSearchImpressionEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-searchfunds',
		event_type: 'impression',
		event_sub_type: 'text',
		event_name: 'AddFundsSearch',
		event_property: null,
		event_id: '325.0.0.1.6'
	});
};
export const searchedFundnameSelectClickEvent = (eventMetaData: {
	searchSelectFundname: string;
	searchSelectFundnameIsin: string;
	searchSelectFundRank: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-searchfunds',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'SearchedFundnameSelect',
		event_property: null,
		event_id: '325.0.0.1.8',
		event_metadata: eventMetaData
	});
};
export const comparefundInvestSelectClickEvent = (eventMetaData: {
	fundname: string;
	investMFIsin: string;
	investButtonRank: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-comparefunds',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ComparefundInvestSelect',
		event_property: null,
		event_id: '325.0.0.1.10',
		event_metadata: eventMetaData
	});
};
