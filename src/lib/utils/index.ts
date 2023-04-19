import { profileStore } from '$lib/stores/ProfileStore';
import { tokenStore } from '$lib/stores/TokenStore';
import type { SearchOptionsEntity } from '$lib/types/IDiscoverFunds';
import type { BankDetailsEntity } from '$lib/types/IUserProfile';

export interface TableColumnToggle {
	label: string;
	field: string;
}

export const MFCommonHeader = () => {
	const headers = {
		userType: `${profileStore.userType()}`,
		accountType: `${profileStore?.accountType()}`,
		authorization: `Bearer ${tokenStore.activeToken()}`
	};

	return headers;
};

export const yearlyReturnMap: Array<TableColumnToggle> = [
	{
		label: '1Y Return',
		field: 'returns1yr'
	},
	{
		label: '3Y Return',
		field: 'returns3yr'
	},
	{
		label: '5Y Return',
		field: 'returns5yr'
	}
];

const findNextYearReturn = (yearlyReturn: Array<TableColumnToggle>, currentReturn: string) => {
	const currentIndex = yearlyReturn.findIndex((val) => val.field === currentReturn);

	let nextIndex = currentIndex + 1;
	if (currentIndex === yearlyReturn.length - 1) {
		nextIndex = 0;
	}

	return nextIndex;
};

export const returnYearTableChangeColumn = (col: string, allColumns: Array<TableColumnToggle>) => {
	const nextColumnIndex = findNextYearReturn(allColumns, col);

	const nextColumn = allColumns[nextColumnIndex];
	return nextColumn;
};

export const formatDate = (epochDate: Date) => {
	if (!epochDate) {
		return '';
	}
	const date = new Date(epochDate);
	const day = date.getDate();
	const month = date.toLocaleString('default', { month: 'short' });
	const year = date.getFullYear();

	return `${month} ${day} ${year}`;
};

export const getBankLogoUrl = (
	bankDetails: BankDetailsEntity[] | null,
	bankAccountNumber: string
) => {
	if (!bankDetails) {
		return '';
	}

	let bankLogoUrl = '';

	bankDetails?.forEach((item) => {
		if (item?.accNO === bankAccountNumber) {
			bankLogoUrl = item?.bankLogo;
		}
	});

	return bankLogoUrl;
};

export const getExploreFundsNavigationPath = (option: SearchOptionsEntity) => {
	return `/explorefunds/${option.name?.split(' ').join('-').toLowerCase()}?id=${option.id}`;
};
