import { goto } from '$app/navigation';
import type { ITab } from '$lib/types/ITab';
import { angeloneTabClickedAnalytics } from './analytics';

export const refreshWaitHours = 24;

export const tabs: ITab[] = [
	{
		name: 'Angel One',
		onClick: () => {
			angeloneTabClickedAnalytics();
			goto('./investments');
		}
	},
	{
		name: 'All',
		onClick: () => goto('./investments?type=all')
	}
];
