import Analytics from '$lib/utils/analytics';

export const autopayRiskImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Autopay',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Autopay',
		event_property: null,
		event_id: '309.0.0.1.39',
		event_metadata: eventMetaData
	});
};

export const autopayBankSelectionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Autopay',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'BankSelection',
		event_property: null,
		event_id: '309.0.0.1.40',
		event_metadata: eventMetaData
	});
};

export const bankSelectionModalImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Autopay',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'BankSelection',
		event_property: null,
		event_id: '309.0.0.1.41'
	});
};

export const confirmBankSelectionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Autopay',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'confirmBank',
		event_property: null,
		event_id: '309.0.0.1.42'
	});
};

export const setupAutopayButtonClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Autopay',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'confirmBank',
		event_property: null,
		event_id: '309.0.0.1.43',
		event_metadata: eventMetaData
	});
};

export const selectedAutopayMethodImpression = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-setupAutopay',
		event_type: 'impression',
		event_sub_type: 'screen ',
		event_name: 'SelectAutopayMethod',
		event_property: null,
		event_id: '309.0.0.1.44',
		event_metadata: eventMetaData
	});
};

// NA - 309.0.0.1.45

export const proceedToAutoPayCreationAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-setupAutopay',
		event_type: 'click',
		event_sub_type: 'button ',
		event_name: 'Proceed',
		event_property: null,
		event_id: '309.0.0.1.46',
		event_metadata: eventMetaData
	});
};

export const autopayRegisteredImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-AutopayRegistered',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'AutopayRegistered',
		event_property: null,
		event_id: '309.0.0.1.47',
		event_metadata: eventMetaData
	});
};

export const doneClickAfterAutopayRegisteredAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-AutopayRegistered',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Done',
		event_property: null,
		event_id: '309.0.0.1.48'
	});
};

export const autopayFailedScreenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-AutopayFailed',
		event_type: 'impression',
		event_sub_type: 'screen ',
		event_name: 'AutopayFailed',
		event_property: null,
		event_id: '309.0.0.1.49'
	});
};
