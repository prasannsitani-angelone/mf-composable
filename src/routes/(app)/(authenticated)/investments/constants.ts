import { goto } from '$app/navigation';
import type { ITab } from '$lib/types/ITab';
import { angeloneTabClickedAnalytics } from './analytics';

export const refreshWaitDays = 15;

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
