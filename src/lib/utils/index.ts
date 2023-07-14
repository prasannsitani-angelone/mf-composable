import { browser } from '$app/environment';
import { PLATFORM_TYPE } from '$lib/constants/platform';
import { profileStore } from '$lib/stores/ProfileStore';
import { tokenStore } from '$lib/stores/TokenStore';
import { userStore } from '$lib/stores/UserStore';
import type { PromotionsEntity, SearchOptionsEntity } from '$lib/types/IDiscoverFunds';
import type { BankDetailsEntity } from '$lib/types/IUserProfile';
import type { PageParentData } from '../../routes/(app)/schemes/[fund_name]/$types';
import { appStore } from '$lib/stores/SparkStore';
import type { LayoutData } from '../../../.svelte-kit/types/src/routes/(app)/$types';
import type { AutopayTypes } from '$lib/types/IEmandate';

export interface TableColumnToggle {
	label: string;
	field: string;
	prefix?: string;
	suffix?: string;
}

export const MFCommonHeader = () => {
	const headers = {
		userType: `${userStore.userType()}`,
		accountType: `${profileStore?.accountType()}`,
		authorization: `Bearer ${tokenStore.activeToken()}`
	};

	return headers;
};

export const exploreMutualFundMap: Array<TableColumnToggle> = [
	{
		label: '3Y Return',
		field: 'returns3yr',
		suffix: '%',
		prefix: ''
	},
	{
		label: '5Y Return',
		field: 'returns5yr',
		suffix: '%',
		prefix: ''
	},
	{
		label: 'Current NAV',
		field: 'navValue',
		prefix: '₹',
		suffix: ''
	},
	{
		label: 'Min SIP amount',
		field: 'minSipAmount',
		prefix: '₹',
		suffix: ''
	}
];

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

export const nfoTableToggleList: Array<TableColumnToggle> = [
	{
		label: 'Open Date',
		field: 'nfoStartDate',
		prefix: '',
		suffix: ''
	},
	{
		label: 'Close Date',
		field: 'nfoEndDate',
		prefix: '',
		suffix: ''
	},
	{
		label: 'Current NAV',
		field: 'navValue',
		prefix: '₹',
		suffix: ''
	},
	{
		label: 'Min amount',
		field: 'minPurchaseAmount',
		prefix: '₹',
		suffix: ''
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

export const returnNFOTableChangeColumn = (col: string, allColumns: Array<TableColumnToggle>) => {
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
	bankDetails: BankDetailsEntity[] | null | undefined,
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

export const getBanksWithoutMandateList = (
	bankDetails: BankDetailsEntity[] | null | undefined,
	mandateList: AutopayTypes[]
) => {
	const banksWithoutMandate: BankDetailsEntity[] = [];

	(bankDetails || [])?.forEach((bank) => {
		let bankMandatePresent = false;

		(mandateList || [])?.forEach((mandate) => {
			if (
				bank?.accNO === mandate?.accountNo ||
				Number(bank?.accNO) === Number(mandate?.accountNo)
			) {
				bankMandatePresent = true;
			}
		});

		if (!bankMandatePresent) {
			banksWithoutMandate.push(bank);
		}
	});

	return banksWithoutMandate;
};

export const getExploreFundsNavigationPath = (option: SearchOptionsEntity) => {
	return `/explorefunds/${option.name?.split(' ').join('-').toLowerCase()}?id=${option.id}`;
};

export const getPromotionsNavigationPath = (option: PromotionsEntity) => {
	return `/promotions/${option.header?.split(' ').join('-').toLowerCase()}?id=${option.id}`;
};

export const capitalizeFirstLetter = (name: string) => {
	return name?.charAt(0)?.toUpperCase() + name.slice(1);
};

export const getNameFromDashedParams = (nameInParam: string) => {
	return capitalizeFirstLetter(nameInParam?.split('-').join(' ').toLowerCase());
};

export const shouldDisplayShare = (parentData: PageParentData) => {
	const osName = parentData?.deviceType?.osName || parentData?.deviceType?.os;
	const platform = parentData?.sparkHeaders.platform;
	const platformvariant = parentData?.sparkHeaders?.platformvariant;
	return (
		(browser &&
			typeof window?.webkit?.messageHandlers?.callBackHandlerMFShareOption?.postMessage ===
				'function') ||
		(browser && typeof window?.ShareDataHandler?.share === 'function') ||
		(osName?.toLowerCase() === 'ios' &&
			platform?.toLowerCase() !== PLATFORM_TYPE.SPARK_IOS &&
			platform?.toLowerCase() !== PLATFORM_TYPE.ANGELBEE_IOS) ||
		(osName?.toLowerCase() === 'android' && platformvariant?.toLowerCase() !== 'webview')
	);
};

export function shouldDisplayAngelBeeBanner(data: LayoutData) {
	const dpNumber = data.profile?.dpDetails?.dpIdNo || '';
	const isAngelBeeUser = appStore.isAngelBeeAndroidUser() || appStore.isAngelBeeIosUser();
	const accessToken = tokenStore.accessToken();
	return accessToken && dpNumber && isAngelBeeUser;
}
