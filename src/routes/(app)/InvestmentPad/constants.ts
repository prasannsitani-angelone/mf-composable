import PhonePe from '$lib/images/icons/PhonePe.svelte';
import WorldIcon from './icons/GlobeIcon.svelte';
import UPIIcon from './icons/UPIIcon.svelte';
import GPayIcon from './icons/GpayIcon.svelte';

const MAX_LIMIT = 100000;

export const PAYMENT_MODE = {
	PHONEPE: {
		logo: PhonePe,
		sleeveIcon: PhonePe,
		name: 'PhonePe',
		apiName: 'PHONEPE',
		analytics: () => undefined,
		enabled: (amountInNumber: number, os: string) => {
			if (os === 'Android' || os === 'iOS') {
				return amountInNumber <= MAX_LIMIT;
			}
			return false;
		},
		showInput: false
	},
	GOOGLEPAY: {
		logo: GPayIcon,
		sleeveIcon: GPayIcon,
		name: 'Google Pay',
		apiName: 'GPAY',
		analytics: () => undefined,
		enabled: (amountInNumber: number, os: string) => {
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
		enabled: (amount: number, os: string, redirectedFrom: string) => {
			return redirectedFrom !== 'SIP_PAYMENTS' && amount >= 50;
		},
		showInput: false
	}
};

export const orderpadParentPage = {
	INVESTMENT: 'INVESTMENT',
	SCHEME: 'SCHEME'
};
