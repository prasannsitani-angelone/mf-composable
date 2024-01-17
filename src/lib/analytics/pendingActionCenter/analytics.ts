import Analytics from '$lib/utils/analytics';

export interface IActionItem {
	heading: string;
	fundName: string;
	amount: number;
}

export const actionCentreEntryImpression = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'text',
		event_name: 'Action_required',
		event_property: null,
		event_id: '308.0.0.9.1'
	});
};

export const actionCentreClick = (eventMetaData: { text: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Actnow',
		event_property: null,
		event_id: '308.0.0.9.2',
		event_metadata: eventMetaData
	});
};

export const actionCentreImpression = (eventMetaData: {
	pending: number;
	failed: number;
	failedInstallment: number;
	items: IActionItem[];
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PendingActions',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Pending_action',
		event_property: null,
		event_id: '308.0.0.9.3',
		event_metadata: eventMetaData
	});
};

export const actNowClick = (eventMetaData: {
	FundName: string;
	Heading: string;
	cta: string;
	Amount: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PendingActions',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'cta_payoption',
		event_property: null,
		event_id: '308.0.0.9.4',
		event_metadata: eventMetaData
	});
};
