import { profileStore } from '$lib/stores/ProfileStore';
import { tokenStore } from '$lib/stores/TokenStore';

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
