import type { SvelteComponent } from 'svelte';
export enum modalsAvaialable {
	elss,
	gains,
	fundHolding,
	txnHistory,
	fundHoldingCalendar,
	txnHistoryCalendar,
	reportGenerating,
	downloadSuccessful,
	downloadError,
	emailSuccessful,
	emailError
}

export enum reportType {
	elss = 'ELSS',
	cg = 'CG',
	funds = 'FUNDS',
	txn = 'TXN'
}

export enum reportMode {
	download = 'download',
	email = 'email'
}
export interface Report {
	title: string;
	icon: SvelteComponent;
	postHeading?: string;
	emailText: string;
	downloadText: string;
	fileExtension: string;
}

export interface FinancialYear {
	fromDate: string;
	toDate: string;
	selected: boolean;
	fileName: string;
	title: string;
}

export interface ReportDownloadArgs {
	type: reportType;
	mode: reportMode;
	toDate?: string;
	fromDate?: string;
	fileName?: string;
}

export type EventMetaData = {
	frequentlyUsedTimePeriod: string;
	financialYear: string;
	customRange: string;
};
