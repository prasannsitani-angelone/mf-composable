import WorldIcon from '$lib/images/icons/WorldIcon.svelte';
import GPayIcon from '$lib/images/icons/GPayIcon.svelte';
import GPay from '$lib/images/icons/GPay.svelte';
import PhonepeIcon from '$lib/images/icons/PhonepeIcon.svelte';
import PhonePe from '$lib/images/icons/PhonePe.svelte';
import UPIIcon from '$lib/images/icons/UPIIcon.svelte';

import { deviceStore } from '$lib/stores/DeviceStore';

const MAX_LIMIT = 100000;

export const PAYMENT_MODE = {
	PHONEPE: {
		logo: PhonepeIcon,
		sleeveIcon: PhonePe,
		name: 'PhonePe',
		analytics: () => undefined,
		enabled: (amountInNumber: number) => {
			const os = deviceStore.osName();
			if (os === 'Android' || os === 'iOS') {
				return amountInNumber <= MAX_LIMIT;
			}
			return false;
		},
		showInput: false
	},
	GOOGLEPAY: {
		logo: GPayIcon,
		sleeveIcon: GPay,
		name: 'Google Pay',
		analytics: () => undefined,
		enabled: (amountInNumber: number) => {
			const os = deviceStore.osName();
			if (os === 'Android' || os === 'iOS') {
				return amountInNumber <= MAX_LIMIT;
			}
			return false;
		},
		showInput: false
	},
	UPI: {
		logo: UPIIcon,
		sleeveIcon: UPIIcon,
		name: 'UPI',
		analytics: () => undefined,
		enabled: (amountInNumber: number) => {
			return amountInNumber <= MAX_LIMIT;
		},
		showInput: true
	},
	NET_BANKING: {
		logo: WorldIcon,
		sleeveIcon: WorldIcon,
		name: 'Net Banking',
		analytics: () => undefined,
		enabled: (amount: number, redirectedFrom: string) => {
			return redirectedFrom !== 'SIP_PAYMENTS' && amount >= 50;
		},
		showInput: false
	}
};

export const orderpadParentPage = {
	INVESTMENT: 'INVESTMENT',
	SCHEME: 'SCHEME'
};
