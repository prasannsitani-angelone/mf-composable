import Analytics from '$lib/utils/analytics';
import type { MetaData } from '$lib/types/ICartStore';

export const addToCartHeaderNavAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-AddToCart',
		event_type: 'click',
		event_sub_type: '',
		event_name: 'AddToCartNav',
		event_property: 'NavBar',
		event_id: '315.0.0.0.0'
	});
};

export const mountAddToCartAnalytics = (eventMetaData: MetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-AddToCart',
		event_type: 'impressions',
		event_sub_type: 'screen',
		event_name: 'AddToCart',
		event_property: null,
		event_id: '315.0.0.0.1',
		event_metadata: eventMetaData
	});
};

export const clickManageCartAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-AddToCart',
		event_type: 'click',
		event_sub_type: 'Button',
		event_name: 'ManageCartButton',
		event_property: null,
		event_id: '315.0.0.0.2'
	});
};

export const mountManageCartAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ManageCart',
		event_type: 'impressions',
		event_sub_type: 'screen',
		event_name: 'ManageCartScreen',
		event_property: null,
		event_id: '315.0.0.1.1'
	});
};

export const deleteFromCartAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ManageCart',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'DeleteFromCart',
		event_property: null,
		event_id: '315.0.0.1.2'
	});
};

export const deleteCartSleeveAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ManageCartSleeve',
		event_type: 'impressions',
		event_sub_type: 'screen',
		event_name: 'DeleteConfirmation',
		event_property: null,
		event_id: '315.0.0.2.1'
	});
};

export const deletCartConfirmationAnalytics = (eventMetaData: { FundName: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ManageCartSleeve',
		event_type: 'click',
		event_sub_type: 'Button',
		event_name: 'DeleteCTA',
		event_property: null,
		event_id: '315.0.0.2.2',
		event_metadata: eventMetaData
	});
};

export const ProceedToCheckoutClickAnalytics = (eventMetaData: MetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ProceesToCheckOut',
		event_type: 'click',
		event_sub_type: 'Button',
		event_name: 'ProceedToCheckOut',
		event_property: null,
		event_id: '315.0.0.0.3',
		event_metadata: eventMetaData
	});
};

/**
 * For Adding to Cart Via Explore,PopularFunds, Funds Details and Hot and New Section
 */
export const addToCartIconClickedAnalytics = (eventMetaData: {
	'Fund Name': string;
	source: string;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-discover',
		event_type: 'click',
		event_sub_type: 'Button',
		event_name: 'AddToCartIcon',
		event_property: null,
		event_id: '315.0.0.8.0',
		event_metadata: eventMetaData
	});
};

export const addAgainToCartIconClickedAnalytics = (eventMetaData: {
	'Fund Name': string;
	source: string;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundAlreadyAdded',
		event_type: 'click',
		event_sub_type: 'Button',
		event_name: 'AddFundAgain',
		event_property: 'Add',
		event_id: '315.0.0.9.0',
		event_metadata: eventMetaData
	});
};

export const addToCartToastNavAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-discover',
		event_type: 'click',
		event_sub_type: 'Button',
		event_name: 'GoToCart',
		event_property: null,
		event_id: '315.0.0.8.1'
	});
};
