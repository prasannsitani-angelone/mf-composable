import type { WeeklyTopSchemesEntity } from './IDiscoverFunds';
export interface RemoveCartItem {
	schemeName: string;
	cartItemId: number;
}

export interface ICartStore {
	item: WeeklyTopSchemesEntity[];
	count: number;
	repetetiveAddAttempt: boolean;
	removeFromCart: boolean;
	currentSelection: WeeklyTopSchemesEntity | RemoveCartItem | null;
	addToCartRequestedFromModal: boolean;
}
export interface CartEntity {
	cartItemId: number;
	schemeCode: string;
	isin: string;
	schemeName: string;
	logoUrl: string;
	investmentType: string;
	amount: number;
	minSipAmount: number;
	minPurchaseAmount: number;
	sipMultiplierAmount: number;
	sipMaxAmount: number;
	sipAllowedDays: string;
	lumpsumMaxAmount: number;
	isLumpsumAllowed: string;
	lumpsumMultiplierAmount: number;
	isSipAllowed: string;
	purchaseTxnMode: string;
	isSelected: boolean;
	sipDay: number;
	frequency: string;
	installmentNo: number;
	inputError?: string;
	inputAmount?: number;
}

export interface FundsInList {
	Name: string;
	Type: string;
	Amount: number;
	Date: string | number;
}

export interface MetaData {
	NoOfCheckedFunds: number;
	NoOfUnchecked: number;
	CheckedFundsList: FundsInList[];
	TotalAmount: number;
}
