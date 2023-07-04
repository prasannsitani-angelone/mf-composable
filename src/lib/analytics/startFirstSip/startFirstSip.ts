import Analytics from '$lib/utils/analytics';

export const firstSipCardMountedAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'firstSIPvisible',
		event_property: null,
		event_id: '308.0.0.6.15',
		event_metadata: eventMetaData
	});
};

export const firstSipCardGetStartedButtonClickAnalytics = (
	eventMetaData: Record<string, string>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartYourtInvestmentJourney',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Getstarted',
		event_property: null,
		event_id: '308.0.0.6.16',
		event_metadata: eventMetaData
	});
};

export const startFirstSipScreenImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartFirstInvestment',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'StartFirstInvestment',
		event_property: null,
		event_id: '308.0.0.6.39'
	});
};

export const startFirstSipScreenBackButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartFirstInvestment',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'cross',
		event_property: null,
		event_id: '308.0.0.6.17'
	});
};

export const startFirstSipScreenPredefinedAmountClickAnalytics = (
	eventMetaData: Record<string, string>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartFirstInvestment',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'AmountSelect',
		event_property: null,
		event_id: '308.0.0.6.18',
		event_metadata: eventMetaData
	});
};

export const startFirstSipScreenIncreaseDecreaseClickAnalytics = (
	eventMetaData: Record<string, string>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartFirstInvestment',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ChangedAmount',
		event_property: null,
		event_id: '308.0.0.6.19',
		event_metadata: eventMetaData
	});
};

export const startFirstSipScreenProceedClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-StartFirstInvestment',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ProceedtoFund',
		event_property: null,
		event_id: '308.0.0.6.20',
		event_metadata: eventMetaData
	});
};

export const startFirstSipConfirmationScreenImpressionAnalytics = (
	eventMetaData: Record<string, string>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-RecommendFund',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'RecommendFund',
		event_property: null,
		event_id: '308.0.0.6.21',
		event_metadata: eventMetaData
	});
};

export const startFirstSipConfirmationScreenWhyThisFundClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-RecommendFund',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'Whythisfund',
		event_property: null,
		event_id: '308.0.0.6.22'
	});
};

export const startFirstSipConfirmationScreenLearnMoreClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-RecommendFund',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'LearnmoreSIPDate',
		event_property: null,
		event_id: '308.0.0.6.25'
	});
};

export const startFirstSipConfirmationScreenProceedClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-RecommendFund',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Proceedtopayment',
		event_property: null,
		event_id: '308.0.0.6.27'
	});
};
