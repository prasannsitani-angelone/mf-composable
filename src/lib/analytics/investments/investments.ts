import Analytics from '$lib/utils/analytics';

export const investMoreClickEvent = (schemeName: string) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investmentsdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Investmore',
		event_property: null,
		event_id: '306.0.0.13.21',
		event_metadata: { fundname: schemeName }
	});
};
