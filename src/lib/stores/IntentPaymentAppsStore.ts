import { derived } from 'svelte/store';
import {
	INTENT_PAYMENT_APP_KEY_MAP,
	NON_INTENT_PAYMENT_APP_KEY
} from '$components/Payment/constants';
import { appStore } from '$lib/stores/SparkStore';

interface PaymentApps {
	intentPaymentApps: string[];
	nonIntentPaymentApps: string[];
	allPaymentApps: string[];
}

const initialStore: PaymentApps = {
	intentPaymentApps: [],
	nonIntentPaymentApps: [],
	allPaymentApps: []
};

const getMappedPaymentApps = (paymentapps?: string): string[] => {
	let paymentAppsArray: string[];

	if (!paymentapps) {
		// payment app is not passed. hence allow the option
		paymentAppsArray = Object.values(INTENT_PAYMENT_APP_KEY_MAP);
	} else {
		try {
			const paymentAppsFromInput: string[] = JSON.parse(paymentapps);
			const mappedApps: string[] = paymentAppsFromInput.flatMap(
				(app) => INTENT_PAYMENT_APP_KEY_MAP[app] || []
			);
			paymentAppsArray = [...mappedApps];
		} catch (e) {
			paymentAppsArray = Object.values(INTENT_PAYMENT_APP_KEY_MAP);
		}
	}
	return paymentAppsArray;
};

function createStore() {
	let store: PaymentApps;
	const { subscribe } = derived(
		appStore,
		($appStore, set, update) => {
			const paymentapps = $appStore.paymentapps;
			const intentPaymentApps = getMappedPaymentApps(paymentapps);

			update(() => {
				return {
					nonIntentPaymentApps: NON_INTENT_PAYMENT_APP_KEY,
					intentPaymentApps: intentPaymentApps,
					allPaymentApps: [...new Set([...intentPaymentApps, ...NON_INTENT_PAYMENT_APP_KEY])]
				};
			});
		},
		initialStore
	);

	subscribe((v) => {
		store = v;
	});

	return {
		subscribe,
		checkIfPaymentAppInstalledElseGetFallback: (app?: string) => {
			if (app && store.allPaymentApps.includes(app)) {
				return app;
			}
			return store.allPaymentApps[0] || null;
		}
	};
}

export const paymentAppStore = createStore();
