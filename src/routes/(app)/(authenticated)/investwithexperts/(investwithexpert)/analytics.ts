import Analytics from '$lib/utils/analytics';

export const investWithExpertScreenImpressionEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'PortfolioBuilder_Entry',
		event_property: null,
		event_id: '317.0.0.1.0'
	});
};

export const investWithExpertQuickSelectEvent = (amount) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'click',
		event_sub_type: '',
		event_name: 'quick_select_amount',
		event_property: null,
		event_id: '317.0.0.1.1',
		event_metadata: { amount: amount }
	});
};

export const investWithExpertAmountIncrementEvent = (amount) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'click',
		event_sub_type: '',
		event_name: 'amount_increase',
		event_property: null,
		event_id: '317.0.0.1.2',
		event_metadata: { amount: amount }
	});
};

export const investWithExpertAmountDecrementEvent = (amount) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'click',
		event_sub_type: '',
		event_name: 'amount_decrease',
		event_property: null,
		event_id: '317.0.0.1.3',
		event_metadata: { amount: amount }
	});
};

export const investWithExpertProceedClickEvent = (eventMetaData: {
	amount: number;
	date: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-start4sips',
		event_type: 'click',
		event_sub_type: 'CTA',
		event_name: 'PortfolioBuilder_Proceed',
		event_property: null,
		event_id: '317.0.0.1.5',
		event_metadata: eventMetaData
	});
};
