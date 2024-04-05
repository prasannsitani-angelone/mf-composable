import { getNudgeData } from '$lib/api/nudges';
import type { NudgeDataType } from '$lib/types/INudge';
import { writable } from 'svelte/store';

const initialStore: NudgeDataType[] = [];

function CreateStore() {
	const { subscribe, set } = writable(initialStore);
	let nudgeData;
	subscribe((v) => {
		nudgeData = {
			...v
		};
	});
	return {
		subscribe,
		getNudges: () => nudgeData,
		set: (store: NudgeDataType) => set(store),
		fetchNewNudges: async (isGuest: boolean) => {
			const newNudgeData = await getNudgeData(isGuest);
			if (newNudgeData) {
				set(newNudgeData);
			}
		}
	};
}

const NudgeStore = CreateStore();
export default NudgeStore;
