import type { FamilyMemberTypes } from '$lib/types/IFamilyPortfolio';
import { writable } from 'svelte/store';

const initalStore: FamilyMemberTypes[] = [];

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let familyMembers: FamilyMemberTypes[] = [];

	subscribe((v) => {
		familyMembers = v;
	});
	return {
		subscribe,
		updateStore: (updatedMembers: FamilyMemberTypes[]) =>
			update((v) => {
				return [...v, ...updatedMembers];
			}),
		set: (store: FamilyMemberTypes[]) => set(store),
		getFamilyMembersDetails: () => familyMembers,
		isFamilyPortfolio: (selfClientCode: string) => {
			let familyPortfolio = false;

			familyMembers?.forEach((member) => {
				if (member?.selected && member?.party_code !== selfClientCode) {
					familyPortfolio = true;
				}
			});

			return familyPortfolio;
		}
	};
}

export const familyStore = CreateStore();
