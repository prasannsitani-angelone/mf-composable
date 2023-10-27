import PhonePe from '$lib/images/icons/PhonePe.svelte';
import WorldIcon from './icons/GlobeIcon.svelte';
import UPIIcon from './icons/UPIIcon.svelte';
import GPayIcon from './icons/GPayIcon.svelte';
import PaytmIcon from './icons/PaytmIcon.svelte';

import { selectPaymentModeAnalytics } from './analytics/changePayment';

export const UPI_MAX_LIMIT = 100000;
export const NET_BANKING_MIN_LIMIT = 50;

export const PAYMENT_MODE = {
	PHONEPE: {
		logo: PhonePe,
		sleeveIcon: PhonePe,
		name: 'PhonePe',
		apiName: 'PHONEPE',
		analytics: selectPaymentModeAnalytics,
		enabled: (amountInNumber: number, os: string) => {
			if (os === 'Android' || os === 'iOS') {
				return amountInNumber <= UPI_MAX_LIMIT;
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
		analytics: selectPaymentModeAnalytics,
		enabled: (amountInNumber: number, os: string) => {
			if (os === 'Android' || os === 'iOS') {
				return amountInNumber <= UPI_MAX_LIMIT;
			}
			return false;
		},
		showInput: false
	},
	PAYTM: {
		logo: PaytmIcon,
		sleeveIcon: PaytmIcon,
		name: 'Paytm',
		apiName: 'Paytm',
		analytics: selectPaymentModeAnalytics,
		enabled: (amountInNumber: number, os: string) => {
			if (os === 'Android' || os === 'iOS') {
				return amountInNumber <= UPI_MAX_LIMIT;
			}
			return false;
		},
		showInput: false
	},
	UPI: {
		logo: UPIIcon,
		sleeveIcon: UPIIcon,
		name: 'UPI',
		analytics: selectPaymentModeAnalytics,
		enabled: (amountInNumber: number) => {
			return amountInNumber <= UPI_MAX_LIMIT;
		},
		showInput: true
	},
	NET_BANKING: {
		logo: WorldIcon,
		sleeveIcon: WorldIcon,
		name: 'Net Banking',
		analytics: selectPaymentModeAnalytics,
		enabled: (amount: number, os: string, redirectedFrom: string) => {
			return redirectedFrom !== 'SIP_PAYMENTS' && amount >= NET_BANKING_MIN_LIMIT;
		},
		showInput: false
	}
};

export const INTENT_PAYMENT_APP_KEY_MAP = {
	phonepe: 'PHONEPE',
	gpay: 'GOOGLEPAY',
	paytm: 'PAYTM'
};

export const NON_INTENT_PAYMENT_APP_KEY = ['UPI', 'NET_BANKING'];

export const PAYMENT_MODE_STATUS = {
	enabled: 'enabled',
	low_success_rate: 'low_success_rate',
	disabled: 'disabled'
};

export const WRONG_BANK_ERROR_CODE = 'error-upi-b3';
