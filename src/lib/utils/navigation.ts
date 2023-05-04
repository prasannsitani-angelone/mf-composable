import { isExternalNavigation } from './helpers/navigation';
import { externalNavigation } from '$lib/stores/ExtrenalNavigationStore';

export const OnNavigation = () => {
	if (isExternalNavigation()) {
		externalNavigation.update((_) => {
			return { active: true };
		});
	}
};
