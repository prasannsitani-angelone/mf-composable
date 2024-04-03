import CardIcon from '../icons/CardIcon.svelte';
import { PAYMENT_MODE } from '$components/Payment/constants';
import { checkVersionCompatibility } from '$lib/utils';
import { PUBLIC_MANDATE_PHONEPE_ENABLE } from '$env/static/public';

export const EMANDATE_MODE = {
	PHONEPE: {
		...PAYMENT_MODE['PHONEPE'],
		analytics: () => undefined,
		enabled: (os: string) => {
			if (
				os === 'Android' ||
				(checkVersionCompatibility(PUBLIC_MANDATE_PHONEPE_ENABLE) && os === 'iOS')
			) {
				return true;
			}
			return false;
		}
	},
	GOOGLEPAY: {
		...PAYMENT_MODE['GOOGLEPAY'],
		analytics: () => undefined,
		enabled: (os: string) => {
			if (os === 'Android' || os === 'iOS') {
				return true;
			}
			return false;
		}
	},
	UPI: {
		...PAYMENT_MODE['UPI'],
		analytics: () => undefined,
		enabled: () => {
			return true;
		}
	},
	NET_BANKING: {
		...PAYMENT_MODE['NET_BANKING'],
		logo: CardIcon,
		name: 'Debit Card/Net Banking',
		analytics: () => undefined,
		enabled: () => {
			return true;
		}
	}
};
