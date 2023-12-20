import { profileStore } from '$lib/stores/ProfileStore';
import type { IEmandate } from '$lib/types/IEmandate';

export const getMandateDataByAccNO = (
	accountNo: string,
	emandateMap: Record<string, Array<IEmandate>>
) => {
	return emandateMap && emandateMap[accountNo] && emandateMap[accountNo].length > 0
		? emandateMap[accountNo][0]
		: null;
};

const checkMandateExist = (accountNo: string, emandateMap: Record<string, Array<IEmandate>>) => {
	return emandateMap ? !!emandateMap[accountNo] : false;
};

const primaryEmandateAccountIndex = (emandateMap: Record<string, Array<IEmandate>>) => {
	const primaryBankAccountNumber = profileStore.primaryBankAccountNumber();
	if (checkMandateExist(primaryBankAccountNumber, emandateMap)) {
		return profileStore.primaryBankAccountIndex();
	}
	const index = profileStore
		.bankAccounts()
		?.findIndex((bankAccount) => checkMandateExist(bankAccount.accNO, emandateMap));
	return index;
};

export const primaryEmandateAccountNumber = (emandateMap: Record<string, Array<IEmandate>>) => {
	const index = primaryEmandateAccountIndex(emandateMap);
	return index > -1 ? profileStore.bankAccounts()?.[index]?.accNO : null;
};

export const getPrimaryAccountMandateData = (emandateMap: Record<string, Array<IEmandate>>) => {
	const primaryEmandateAccNo = primaryEmandateAccountNumber(emandateMap);
	return primaryEmandateAccNo ? getMandateDataByAccNO(primaryEmandateAccNo, emandateMap) : null;
};

export const getAllMandateDataByAccNO = (emandateMap: Record<string, Array<IEmandate>>) => {
	const primaryEmandateAccNo = primaryEmandateAccountNumber(emandateMap);
	return emandateMap &&
		emandateMap[primaryEmandateAccNo] &&
		emandateMap[primaryEmandateAccNo].length > 0
		? emandateMap[primaryEmandateAccNo]
		: null;
};
