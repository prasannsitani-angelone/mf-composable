import { prerequisiteCacheList } from '$lib/constants/cache';

export const deletePageCache = () => {
	caches.delete('pages');
};

export const deleteCompleteCache = () => {
	caches.keys().then(function (names) {
		for (const name of names) {
			const list = prerequisiteCacheList.filter((item) => {
				return name.includes(item);
			});
			if (!list.length) {
				caches.delete(name);
			}
		}
	});
};
