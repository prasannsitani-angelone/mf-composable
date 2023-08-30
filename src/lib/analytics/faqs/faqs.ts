import Analytics from '$lib/utils/analytics';

export const faqsIconClick = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FAQ',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'FAQ',
		event_property: null,
		event_id: '316.0.0.0.0',
		event_metadata: eventMetaData
	});
};

export const faqsScreenImpression = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FAQ',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'FAQ-help',
		event_property: null,
		event_id: '316.0.0.0.1',
		event_metadata: eventMetaData
	});
};

export const faqsScreenOrdersViewAllCtaClick = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FAQhelp',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'OrdersViewAll',
		event_property: null,
		event_id: '316.0.0.0.3',
		event_metadata: eventMetaData
	});
};

export const faqsScreenFaqsViewAllCtaClick = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FAQhelp',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'FAQsViewAll',
		event_property: null,
		event_id: '316.0.0.0.4',
		event_metadata: eventMetaData
	});
};

export const allFaqsProfileCtaClick = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ProfileFAQs',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ProfileFAQs',
		event_property: null,
		event_id: '316.0.0.0.6'
	});
};

export const faqCallCtaClick = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FAQcall',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'FAQcall',
		event_property: null,
		event_id: '316.0.0.0.7',
		event_metadata: eventMetaData
	});
};

export const faqEmailCtaClick = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FAQemail',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'FAQemail',
		event_property: null,
		event_id: '316.0.0.0.8',
		event_metadata: eventMetaData
	});
};

export const faqTicketCtaClick = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FAQ',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Your Tickets',
		event_property: null,
		event_id: '316.0.0.0.9',
		event_metadata: eventMetaData
	});
};
