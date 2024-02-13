export interface SwitchParams {
	isin?: string;
	schemeCode?: string;
}

export interface AutopayParams {
	showAlert?: boolean;
}

export interface BuyPortfolioParams {
	amount?: number;
	date?: number;
	requestId?: string;
	showInputPopup?: boolean;
}

export interface LtcgStcgParams {
	investmentPercent?: number;
	investedAmt?: number;
}

export interface InvestWithExpertsConfirmParams {
	amount?: number;
	date?: number;
	requestId?: string;
}

export interface InvestWithExpertsSummaryParams {
	sipID?: number;
}

export interface OrderSummaryParams {
	firstTimePayment?: boolean;
	orderID?: number;
	isIntegeratedFlow?: boolean;
	isRedeem?: boolean;
	isSwitch?: boolean;
	isSwp?: boolean;
	isLumpsumViaMandate?: boolean;
	isBuyPortfolio?: boolean;
	isCart?: boolean;
	showEditSip?: boolean;
}

export interface SipBookParams {
	isExternal?: boolean;
	showEditSip?: boolean;
}

export interface RedemptionParams {
	isExternal?: boolean;
	selectedAmount?: string;
	selectedUnits?: number;
	isFullAmountSelected?: boolean;
	selectedFolioDetails?: object;
}

export interface RedemptionConfirmationParams {
	isExternal?: boolean;
	requestId?: string;
}

export interface EditSipParams {
	isExternal?: boolean;
	sipAmount?: string;
	sipStartDate?: string;
	requestId?: string;
}

export type IUrlParams =
	| SwitchParams
	| AutopayParams
	| BuyPortfolioParams
	| LtcgStcgParams
	| InvestWithExpertsConfirmParams
	| InvestWithExpertsSummaryParams
	| OrderSummaryParams
	| SipBookParams
	| RedemptionParams
	| RedemptionConfirmationParams
	| EditSipParams;
