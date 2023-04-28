import { isExternalNavigation } from './helpers/navigation';
import { get } from 'svelte/store';
import { externalNavigation } from '$lib/stores/ExtrenalNavigationStore';

export const OnNavigation = () => {
	if (isExternalNavigation()) {
		externalNavigation.update((_) => {
			return { active: true };
		});
	}
};
