import type { StatusHistoryTypes } from './IOrderItem';
import type { SchemeDetails } from './ISchemeDetails';

export interface InvestmentEntity {
	schemeCode: string;
	isin: string;
	schemeName: string;
	settlementType: string;
	logoUrl: string;
	schemePlan: string;
	sipEnabled: boolean;
	currentValue: number;
	investedValue: number;
	returnsValue: number;
	returnsAbsolutePer: number;
	xirrPer: number;
	totalUnitsAllocated: number;
	averageNav: number;
	currentNav: number;
	folioNumbers: string[];
	nextSipDate: number;
	investmentAllowed: boolean;
	redemptionAllowed: boolean;
	redemableAmount: number;
	minimumRedeemAmount: number;
	amcCode: number;
	switchFlag: string;
	stpFlag: string;
	swpFlag: string;
	datasource: string;
	nfoScheme: string;
	externalFundImportStatus: string;
	externalImportFailed: boolean;
	rtaSchemeCode: string;
}

export interface OrdersSummary {
	totalFailedOrders: number;
	totalProcessingOrders: number;
	totalScheduledOrders: number;
	totalCompletedOrders: number;
}

export interface ProtfolioDataEntity {
	countIdentifier: keyof OrdersSummary;
	orderCountStyles?: string;
	title: string;
	orders: OrdersEntity[];
	textString: string;
	status?: string;
	orderType: string;
}

export interface ProtfolioData {
	inProgress: ProtfolioDataEntity;
	upComing: ProtfolioDataEntity;
	failed: ProtfolioDataEntity;
}

export interface OrdersEntity {
	orderId: number;
	transactionType: string;
	investmentType: string;
	schemeCode: string;
	isin: string;
	amount: number;
	quantity: number;
	redeemAll: boolean;
	folioNumber: string;
	transactionRefNumber: string;
	pgTxnId: string;
	paymentMode: string;
	status: string;
	remarks: string;
	nav: number;
	units: number;
	sipId: number;
	subBrokerCode: string;
	paymentRemarks: string;
	paymentStatus: string;
	firstOrder: string;
	statusHistory: Array<StatusHistoryTypes>;
	createdTs: number;
	updatedTs: number;
	scheduledTs: number;
	arqRating: number;
	schemeName: string;
	schemePlan: string;
	schemeType: string;
	category: string;
	subCategory: string;
	logoUrl: string;
	reInvestmentPlan: string;
	bankAccountNo: string;
	bankName: string;
	mandateRefNo: string;
	ExpectedNavDate: number;
	nfoScheme: string;
	clientCode: string;
	settlementType: string;
	toSettlementType: string;
}

export interface FolioSummaryTypes {
	averageNav: number;
	currentNav: number;
	currentValue: number;
	datasource: string;
	folioNumbers: string[];
	investedValue: number;
	investmentAllowed: boolean;
	isin: string;
	logoUrl: string;
	minimumRedeemAmount: number;
	redemableAmount: number;
	redemptionAllowed: boolean;
	returnsAbsolutePer: number;
	returnsValue: number;
	schemeCode: string;
	schemeName: string;
	schemePlan: string;
	settlementType: string;
	sipEnabled: boolean;
	totalUnitsAllocated: number;
	xirrPer: number;
	lastSuccessfullImportTs: number;
}

export interface OrdersResponse {
	ok: boolean;
	status: number;
	data: { data: OrdersEntity; status: string };
}

export interface InternalInvestmentSummary {
	currentValue: number;
	investedValue: number;
	returnsValue: number;
	returnsAbsolutePer: number;
	xirr: number;
	previousDayReturns: number;
	previousDayReturnPercentage: number;
	isEquityPortfolioFlag: boolean;
	benchMarkCoCode: string;
	benchmarkName: string;
}
export interface InvestmentSummary {
	currentValue?: number;
	investedValue?: number;
	returnsValue?: number;
	returnsAbsolutePer?: number;
	xirr?: number;
	previousDayReturns?: number;
	previousDayReturnPercentage?: number;
	lastImportStatus: string;
	lastSuccessfullImportTs: number;
	isEquityPortfolioFlag: boolean;
	benchMarkCoCode: string;
	benchmarkName: string;
}

export interface FolioObject {
	folioNumber: string;
	isin: string;
	schemeCode: string;
	redemableAmount: number;
	redemableUnits: number;
	blockedAmount: number;
	blockedunits: number;
	mobileNo: string;
	email: string;
	rta: string;
	dpFlag: string;
	pledgedUnits: number;
	unitsUnderProcess: number;
	amountUnderProcess: number;
	currentDayPledgedUnits: number;
	roundedOff: boolean;
}
export interface FolioHoldingType {
	schemeCode: string;
	isin: string;
	schemeName: string;
	settlementType: string;
	logoUrl: string;
	schemePlan: string;
	sipEnabled: boolean;
	currentValue: number;
	investedValue: number;
	returnsValue: number;
	returnsAbsolutePer: number;
	xirrPer: number;
	totalUnitsAllocated: number;
	averageNav: number;
	currentNav: number;
	folioNumbers: Array<string>;
	nextSipDate: number;
	investmentAllowed: boolean;
	redemptionAllowed: boolean;
	redemableAmount: number;
	datasource: string;
	nfoScheme: string;
	minimumRedeemAmount: number;
	redeemMultiplier: number;
	folioHoldings: Array<FolioObject>;
	switchFlag: string;
	stpFlag: string;
	swpFlag: string;
	amcCode: number;
	distributors: Array<DistributorsType>;
	rtaName: string;
	externalFundImportStatus: string;
	externalImportFailed: boolean;
	lastSuccessfullImportTs: number;
	pledgeUnits: number;
	lockInUnits: number;
	safeKeepUnits: number;
	unitBlockedReason: Array<string>;
	benchMarkCoCode: string;
	benchMarkName: string;
}

export interface SwitchInSchemeType {
	ok?: boolean;
	data?: SchemeDetails;
}

export interface CharDataEntity {
	value: number;
	timestamp: number;
}
export interface ChartData {
	chart: CharDataEntity[];
	summary: InvestmentSummary;
}

export interface OrdersData {
	orders: OrdersEntity[];
	summary: OrdersSummary;
}

export interface Transaction {
	transactionId: number;
	transactionDate: number;
	transactionType: string;
	units: number;
	nav: number;
	amount: number;
}

type ColRenderFn = (data: FolioObject) => string;

export interface FolioTableColumn {
	label: string;
	field: keyof FolioObject | string;
	tdClass?: string;
	thWrapperClass?: string;
	tdRender?: ColRenderFn;
}
export interface FolioTableData {
	columns: FolioTableColumn[];
	rows: FolioObject[];
}

export interface DistributorsType {
	distributor: string;
	folio: string;
}

export interface ScenarioMap {
	errorFetchingInvestments: string;
	FetchingInprogress: string;
	noInvestmentFound: string;
}

export interface HoldingsResponse {
	holdings: InvestmentEntity[];
}

export interface HoldingsPromise {
	data: HoldingsResponse;
	status: string;
}

export interface SummaryResponse {
	summary: InvestmentSummary;
}
export interface SummaryPromise {
	data: SummaryResponse;
	status: string;
}
export interface DistributorListEntity {
	distributor: string;
	folio: string;
}

export interface ToggleButtonParam {
	name: string;
	id: string;
	primary?: boolean;
	disabled?: boolean;
	class?: string;
}

export interface IOPtimsiePortfolioData {
	isin: string;
	schemeCode: string;
	schemeName: string;
	logoUrl: string;
	clientWithMultipleSips?: number;
	firstSchemeLogoUrl?: string;
}

export interface ITaxation {
	stcgCurPercentage: number;
	stcgCurAmount: number;
	stcgInvUnits: number;
	ltcgCurPercentage: number;
	ltcgCurAmount: number;
	ltcgInvUnits: number;
	totalElssInvestedFy: number;
	maxElssInvestAllowed: number;
	elssInvestmentCap: number;
}

export interface ITaxationDetails {
	units?: number;
	investedAmount?: number;
	currentValue?: number;
	taxType: 'STCG' | 'LTCG';
	holdingType: 'EQUITY' | 'NON_EQUITY';
	schemeName?: string;
	logoUrl?: string;
}

export interface IHoldingTaxationDetails {
	stcgCurPercentage: number;
	stcgCurAmount: number;
	stcgInvUnits: number;
	ltcgCurPercentage: number;
	ltcgCurAmount: number;
	ltcgInvUnits: number;
	totalElssInvestedFy: number;
	maxElssInvestAllowed: number;
	elssInvestmentCap: number;
	stcgInvAmount: number;
	ltcgInvAmount: number;
	taxationType: string;
}
