import GPayIcon__SvelteComponent_ from '$components/Payment/icons/GPayIcon.svelte';
import UpiIcon__SvelteComponent_ from '$components/Payment/icons/UPIIcon.svelte';
import PhonePe from '$lib/images/icons/PhonePe.svelte';
import CardIcon from '../icons/CardIcon.svelte';

export const EMANDATE_MODE = {
	PHONEPE: {
		logo: PhonePe,
		name: 'PhonePe',
		apiName: 'phonepe',
		analytics: () => undefined,
		enabled: (os: string) => {
			if (os === 'Android') {
				return true;
			}
			return false;
		},
		showInput: false
	},
	GOOGLEPAY: {
		logo: GPayIcon__SvelteComponent_,
		name: 'Google Pay',
		apiName: 'gpay',
		analytics: () => undefined,
		enabled: (os: string) => {
			if (os === 'Android' || os === 'iOS') {
				return true;
			}
			return false;
		},
		showInput: false
	},
	UPI: {
		logo: UpiIcon__SvelteComponent_,
		sleeveIcon: UpiIcon__SvelteComponent_,
		name: 'UPI ID',
		analytics: () => undefined,
		enabled: () => {
			return true;
		},
		showInput: true
	},
	NET_BANKING: {
		logo: CardIcon,
		name: 'Debit Card/Net Banking',
		analytics: () => undefined,
		enabled: () => {
			return true;
		},
		showInput: false
	}
};
