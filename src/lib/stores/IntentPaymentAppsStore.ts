import { writable } from 'svelte/store';
import {
	INTENT_PAYMENT_APP_KEY_MAP,
	NON_INTENT_PAYMENT_APP_KEY
} from '$components/Payment/constants';

interface PaymentApps {
	intentPaymentApps: string[];
	nonIntentPaymentApps: string[];
}

const initialStore: PaymentApps = {
	intentPaymentApps: [],
	nonIntentPaymentApps: NON_INTENT_PAYMENT_APP_KEY
};

function createStore() {
	const { subscribe, update } = writable(initialStore);

	let store: PaymentApps;
	subscribe((v) => {
		store = v;
	});

	const getAllPaymentApps = () => {
		return [...new Set([...store.intentPaymentApps, ...store.nonIntentPaymentApps])];
	};
	const isPaymentAppIsInstalled = (app: string): boolean => {
		return store.intentPaymentApps.includes(app);
	};
	const getFallbackPaymentOption = () => {
		return getAllPaymentApps()[0] || null;
	};

	return {
		updateStore: (paymentapps?: string) => {
			const intentPaymentApps = getMappedPaymentApps(paymentapps);
			return update((initialStore) => {
				return {
					...initialStore,
					intentPaymentApps
				};
			});
		},
		getIntentPaymentApps: () => store.intentPaymentApps,
		getNonIntentPaymentApps: () => store.nonIntentPaymentApps,
		getAllPaymentApps,
		getFallbackPaymentOption,
		isPaymentAppIsInstalled,
		checkIfPaymentAppInstalledElseGetFallback: (app?: string) => {
			if (app && isPaymentAppIsInstalled(app)) {
				return app;
			}
			return getFallbackPaymentOption();
		}
	};
}

export const paymentAppStore = createStore();

const getMappedPaymentApps = (paymentapps?: string): string[] => {
	let paymentAppsArray: string[];

	if (!paymentapps) {
		// payment app is not passed. hence allow the option
		paymentAppsArray = Object.values(INTENT_PAYMENT_APP_KEY_MAP);
	} else {
		try {
			const paymentAppsFromInput: string[] = JSON.parse(paymentapps);
			const mappedApps: string[] = paymentAppsFromInput.map(
				(app) => INTENT_PAYMENT_APP_KEY_MAP[app]
			);
			paymentAppsArray = [...mappedApps];
		} catch (e) {
			paymentAppsArray = Object.values(INTENT_PAYMENT_APP_KEY_MAP);
		}
	}
	return paymentAppsArray;
};
