import type { PromptContext } from '$lib/types/IAskAngel';
import Analytics from '$lib/utils/analytics';

export const askAngelEntryImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'AskAngel',
		event_property: null,
		event_id: '318.0.0.1.1'
	});
};

export const askAngelEntryClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'AskAngel',
		event_property: null,
		event_id: '318.0.0.1.2'
	});
};

export const askAngelChoiceClickAnalytics = (eventMetaData: PromptContext) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-AskAngel',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'AskAngelQA',
		event_property: null,
		event_id: '318.0.0.1.3',
		event_metadata: eventMetaData
	});
};

export const askAngelRetryClickAnalytics = (eventMetaData: PromptContext) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-AskAngel',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'Retry',
		event_property: null,
		event_id: '318.0.0.1.5',
		event_metadata: eventMetaData
	});
};

export const askAngelStartAgainIconClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-AskAngel',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'StartAgain',
		event_property: null,
		event_id: '318.0.0.1.6'
	});
};

export const askAngelCrossClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-AskAngel',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'cross_button',
		event_property: null,
		event_id: '318.0.0.1.7'
	});
};
