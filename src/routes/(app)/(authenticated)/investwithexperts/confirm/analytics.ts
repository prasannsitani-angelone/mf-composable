import Analytics from '$lib/utils/analytics';

export const onMountAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'PortfolioBuilder_ConfirmAndReview',
		event_property: '',
		event_id: '317.0.0.2.0'
	});
};

export const whyTheseFundsClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'click',
		event_sub_type: 'CTA',
		event_name: 'WhyTheseFunds',
		event_property: '',
		event_id: '317.0.0.2.1'
	});
};

export const payNowClickAnalytics = (eventMetaData: Record<string, string | number>[]) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'click',
		event_sub_type: 'CTA',
		event_name: 'PayNow',
		event_property: '',
		event_id: '317.0.0.2.2',
		event_metadata: eventMetaData
	});
};

export const changePaymentMethodAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'click',
		event_sub_type: 'CTA',
		event_name: 'changePaymentMethod',
		event_property: '',
		event_id: '317.0.0.2.3'
	});
};

export const mountChangePaymentMethodAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'PortfolioBuilderPaymentMethod',
		event_property: '',
		event_id: '317.0.0.3.0',
		event_metadata: eventMetaData
	});
};

export const payFromPaymentMethodPage = (eventMetaData: Record<string, string | number>[]) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'click',
		event_sub_type: 'CTA',
		event_name: 'PayNow',
		event_property: '',
		event_id: '317.0.0.3.1',
		event_metadata: eventMetaData
	});
};
