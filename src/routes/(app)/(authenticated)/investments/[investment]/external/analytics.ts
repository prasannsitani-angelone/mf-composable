import Analytics from '$lib/utils/analytics';

export const externalInvestmentInvestMoreClickEvent = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investmentdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'allpageCTA',
		event_property: null,
		event_id: '313.0.0.0.24',
		event_metadata: eventMetaData
	});
};

export const externalInvestmentMappedFundClickEvent = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investmentdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'mappedfundCTA',
		event_property: null,
		event_id: '313.0.0.0.25',
		event_metadata: eventMetaData
	});
};
