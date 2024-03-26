import CardIcon from '../icons/CardIcon.svelte';
import { PAYMENT_MODE } from '$components/Payment/constants';
import { isLowerEnvironment } from '$lib/utils';

export const EMANDATE_MODE = {
	PHONEPE: {
		...PAYMENT_MODE['PHONEPE'],
		analytics: () => undefined,
		enabled: (os: string) => {
			if (os === 'Android' || (isLowerEnvironment() && os === 'iOS')) {
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
