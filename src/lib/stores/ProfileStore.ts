import type { BankDetailsEntity, UserProfile } from '$lib/types/IUserProfile';
import { writable } from 'svelte/store';

const initalStore: UserProfile = {
	userType: '',
	clientId: '',
	dpNumber: '',
	bankDetails: null
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let clientId: string;
	let userType: string;
	let dpNumber: string;
	let bankDetails: BankDetailsEntity[] | null;
	subscribe((v) => {
		clientId = v.clientId || '';
		userType = v.userType || '';
		bankDetails = v.bankDetails || null;
		dpNumber = v.dpNumber;
	});
	return {
		subscribe,
		updateStore: (newStore: UserProfile) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		bankAccounts: () => bankDetails,
		primaryBankAccountIndex: () => {
			const index = bankDetails?.findIndex((bankAccount) => {
				return bankAccount.isDefalutID;
			});
			return index && index >= 0 ? index : 0;
		},
		primaryBankAccountNumber: function () {
			const accounts = bankDetails;
			const primaryBankAccountIndex = this.primaryBankAccountIndex();
			return accounts?.[primaryBankAccountIndex]?.accNO;
		},
		getBankDetailsByAccountNumber(accNO: string) {
			return bankDetails?.find((bankAccount) => {
				return accNO === bankAccount.accNO;
			});
		},
		bankAccountIndexByAccountNumberOnServer(bnkDetails: Array<BankDetailsEntity>, accNO: string) {
			return bnkDetails?.findIndex((item: BankDetailsEntity) => {
				return item.accNO === accNO;
			});
		},
		accountType() {
			if (!clientId) {
				return 'D';
			}
			return dpNumber ? 'D' : 'P';
		},
		set: (store: UserProfile) => set(store),
		clientId: () => clientId,
		userType: () => userType
	};
}

export const profileStore = CreateStore();
