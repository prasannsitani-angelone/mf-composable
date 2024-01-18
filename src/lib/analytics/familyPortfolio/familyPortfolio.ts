import Analytics from '$lib/utils/analytics';

export const familyPortfolioEntryPointClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'dropdown',
		event_name: 'portfoliotypedropdown',
		event_property: null,
		event_id: '306.0.0.13.42'
	});
};

export const familyPortfolioScreenImpressionAnalytics = (
	eventMetaData: Record<string, string[]>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-familyportfolio',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'portfoliomembers',
		event_property: null,
		event_id: '306.0.0.13.43',
		event_metadata: eventMetaData
	});
};

export const familyPortfolioSelectMemberAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-familyportfolio',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'selectclient',
		event_property: null,
		event_id: '306.0.0.13.45',
		event_metadata: eventMetaData
	});
};

export const familyPortfolioSelectAllAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-familyportfolio',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'selectallclick',
		event_property: null,
		event_id: '306.0.0.13.46'
	});
};

export const familyPortfolioInfoButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-familyportfolio',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'familyportfolioibutton',
		event_property: null,
		event_id: '306.0.0.13.47'
	});
};

export const familyPortfolioInfoPopupImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-familyportfolio',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'familyportfoliopopup',
		event_property: null,
		event_id: '306.0.0.13.48'
	});
};

export const familyPortfolioViewHoldingsButtonClickAnalytics = (
	eventMetaData: Record<string, string[]>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-familyportfolio',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'viewholding',
		event_property: null,
		event_id: '306.0.0.13.49',
		event_metadata: eventMetaData
	});
};
