import type { FolioObject } from '$lib/types/IInvestments';
import Analytics from '$lib/utils/analytics';

export const switchHamburgerIconClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-invesmentdetails',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'hamburger',
		event_property: null,
		event_id: '311.0.0.1.1'
	});
};

export const switchOptionsOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-invesmentdetails',
		event_type: 'impression',
		event_sub_type: 'bottomsheet',
		event_name: 'bs-switch',
		event_property: null,
		event_id: '311.0.0.1.2'
	});
};

export const finalSwitchConfirmationAnalytics = (eventMetaData: {
	SwitchOutFund: string;
	SwitchinFund: string;
	SwitchAmount: number;
	Units: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-switchconfirmationscreen',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ConfirmSwitch',
		event_property: null,
		event_id: '311.0.0.1.17',
		event_metadata: eventMetaData
	});
};

export const proceedForSwitchClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-switchfund',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Proceedafterswitch',
		event_property: null,
		event_id: '311.0.0.1.11'
	});
};

export const blockedUnitsSwitchFolioAnalytics = (eventMetaData: {
	WithDrawableAmount: number;
	BlockedAmount: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-switchfund',
		event_type: 'impression',
		event_sub_type: 'bottomsheet',
		event_name: 'bs-switchfunddetails',
		event_property: null,
		event_id: '311.0.0.1.15',
		event_metadata: eventMetaData
	});
};

export const switchConfirmationScreenAnalytics = (eventMetaData: {
	SwitchOutFund: string;
	SwitchinFund: string;
	SwitchAmount: string;
	Units: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-switchconfirmationscreen',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 's-switchconfirmationscreen',
		event_property: null,
		event_id: '311.0.0.1.16',
		event_metadata: eventMetaData
	});
};

export const selectSwitchInFundClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-switchfund',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'selectswitchinfund',
		event_property: null,
		event_id: '311.0.0.1.7'
	});
};

export const switchFullAmountClickAnalytics = (eventMetaData: { SwitchFullAmount: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-switchfund',
		event_type: 'click',
		event_sub_type: 'checkbox',
		event_name: 'switchfullamount',
		event_property: null,
		event_id: '311.0.0.1.10',
		event_metadata: eventMetaData
	});
};

export const switchFolioDataAnalytics = (eventMetaData: Array<FolioObject>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-selectfolioforswitching',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 's-selectfolioforswitching',
		event_property: null,
		event_id: '311.0.0.1.12',
		event_metadata: eventMetaData
	});
};

export const folioConfirmSwitchAnalytics = (eventMetaData: {
	FolioNumber: string;
	SwitchableValue: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-selectfolioforswitching',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 's-confirmfolioselection',
		event_property: null,
		event_id: '311.0.0.1.14',
		event_metadata: eventMetaData
	});
};
