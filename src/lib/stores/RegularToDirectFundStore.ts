import { writable } from 'svelte/store';

const initalStore = {
	schemes: []
};

function CreateStore() {
	const { subscribe, set } = writable(initalStore);
	let state = initalStore;
	subscribe((v) => {
		state = {
			...v
		};
	});
	return {
		filterRegularFunds: (funds) => {
			return funds?.filter((fund) => fund?.schemePlan?.toUpperCase() === 'REGULAR');
		},
		populateRegularFunds: function (funds = []) {
			const regularFunds = this.filterRegularFunds(funds);
			set({
				schemes: regularFunds
			});
		},
		getSchemes: () => {
			return state.schemes;
		},
		reset: () => {
			set({
				schemes: []
			});
		}
	};
}

export const regularToDirectFundsStore = CreateStore();
