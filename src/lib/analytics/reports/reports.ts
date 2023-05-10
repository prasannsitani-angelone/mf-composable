import Analytics from '$lib/utils/analytics';

const downloadReportClickMap = {
	'ELSS Statement': {
		screen_name: 's-ELSSStatement',
		event_id: '304.0.0.2.1'
	},
	'Capital Gain': {
		screen_name: 's-CapitalGains',
		event_id: '304.0.0.3.1'
	},
	'Fund Holdings': {
		screen_name: 's-FundHoldings',
		event_id: '304.0.0.4.1'
	},
	'Transaction History': {
		screen_name: 's-TransactionHistory',
		event_id: '304.0.0.5.1'
	}
};
const sendEmailClickMap = {
	'ELSS Statement': {
		screen_name: 's-ELSSStatement',
		event_id: '304.0.0.2.2'
	},
	'Capital Gain': {
		screen_name: 's-CapitalGains',
		event_id: '304.0.0.3.2'
	},
	'Fund Holdings': {
		screen_name: 's-FundHoldings',
		event_id: '304.0.0.4.2'
	},
	'Transaction History': {
		screen_name: 's-TransactionHistory',
		event_id: '304.0.0.5.2'
	}
};
const doneClickMap = {
	'ELSS Statement': {
		screen_name: 'p-ELSSStatement',
		event_id: '304.0.0.2.4'
	},
	'Capital Gain': {
		screen_name: 'p-CapitalGains',
		event_id: '304.0.0.3.4'
	},
	'Fund Holdings': {
		screen_name: 'p-FundHoldings',
		event_id: '304.0.0.4.4'
	},
	'Transaction History': {
		screen_name: 'p-TransactionHistory',
		event_id: '304.0.0.5.4'
	}
};
const tryAgainClickMap = {
	'ELSS Statement': {
		screen_name: 'p-ELSSStatement',
		event_id: '304.0.0.2.5'
	},
	'Capital Gain': {
		screen_name: 'p-CapitalGains',
		event_id: '304.0.0.3.5'
	},
	'Fund Holdings': {
		screen_name: 'p-FundHoldings',
		event_id: '304.0.0.4.5'
	},
	'Transaction History': {
		screen_name: 'p-TransactionHistory',
		event_id: '304.0.0.5.5'
	}
};
const downloadCompletePopupMap = {
	'ELSS Statement': {
		screen_name: 's-ELSSStatement',
		event_id: '304.0.0.5.8'
	},
	'Capital Gain': {
		screen_name: 's-CapitalGains',
		event_id: '304.0.0.5.9'
	},
	'Fund Holdings': {
		screen_name: 's-FundHoldings',
		event_id: '304.0.0.5.10'
	},
	'Transaction History': {
		screen_name: 's-TransactionHistory',
		event_id: '304.0.0.5.11'
	}
};
const emailSentPopupMap = {
	'ELSS Statement': {
		screen_name: 's-ELSSStatement',
		event_id: '304.0.0.5.12'
	},
	'Capital Gain': {
		screen_name: 's-CapitalGains',
		event_id: '304.0.0.5.13'
	},
	'Fund Holdings': {
		screen_name: 's-FundHoldings',
		event_id: '304.0.0.5.14'
	},
	'Transaction History': {
		screen_name: 's-TransactionHistory',
		event_id: '304.0.0.5.15'
	}
};
const unableToGenerateReportPopupMap = {
	'ELSS Statement': {
		screen_name: 's-ELSSStatement',
		event_id: '304.0.0.5.16'
	},
	'Capital Gain': {
		screen_name: 's-CapitalGains',
		event_id: '304.0.0.5.17'
	},
	'Fund Holdings': {
		screen_name: 's-FundHoldings',
		event_id: '304.0.0.5.18'
	},
	'Transaction History': {
		screen_name: 's-TransactionHistory',
		event_id: '304.0.0.5.19'
	}
};
const errorSendingMailPopupMap = {
	'ELSS Statement': {
		screen_name: 's-ELSSStatement',
		event_id: '304.0.0.5.20'
	},
	'Capital Gain': {
		screen_name: 's-CapitalGains',
		event_id: '304.0.0.5.21'
	},
	'Fund Holdings': {
		screen_name: 's-FundHoldings',
		event_id: '304.0.0.5.22'
	},
	'Transaction History': {
		screen_name: 's-TransactionHistory',
		event_id: '304.0.0.5.23'
	}
};

export const reportsScreenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-reports',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-reports',
		event_property: null,
		event_id: '304.0.0.1.0'
	});
};
export const reportsCardClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-reports',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'Reports',
		event_property: null,
		event_id: '304.0.0.1.1',
		event_metadata: eventMetaData
	});
};
export const reportsEntryMobileAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-InvestmentDashboard',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Reports',
		event_property: null,
		event_id: '304.0.0.5.6'
	});
};
export const reportsEntryDesktopAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-Profile',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Reports',
		event_property: null,
		event_id: '304.0.0.5.7'
	});
};
export const elssScreenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ELSSStatement',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-ELSSStatement',
		event_property: null,
		event_id: '304.0.0.2.0'
	});
};
export const elssPopupOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-ELSSStatement',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'p-ELSSStatement',
		event_property: null,
		event_id: '304.0.0.2.3'
	});
};
export const capitalGainsScreenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CapitalGains',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-CapitalGains',
		event_property: null,
		event_id: '304.0.0.3.0'
	});
};
export const capitalGainsPopupOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-CapitalGains',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'p-CapitalGains',
		event_property: null,
		event_id: '304.0.0.3.3'
	});
};
export const fundHoldingsScreenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundHoldings',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-FundHoldings',
		event_property: null,
		event_id: '304.0.0.4.0'
	});
};
export const fundHoldingsPopupOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-FundHoldings',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'p-FundHoldings',
		event_property: null,
		event_id: '304.0.0.4.3'
	});
};
export const txnHistoryScreenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-TransactionHistory',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-TransactionHistory',
		event_property: null,
		event_id: '304.0.0.5.0'
	});
};
export const txnHistoryPopupOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'p-TransactionHistory',
		event_property: null,
		event_id: '304.0.0.5.3'
	});
};
export const downloadReportClickAnalytics = (reportTitle, eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: downloadReportClickMap[reportTitle].screen_name,
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'DownloadReport',
		event_property: null,
		event_id: downloadReportClickMap[reportTitle].event_id,
		event_metadata: eventMetaData
	});
};
export const sendEmailClickAnalytics = (reportTitle, eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: sendEmailClickMap[reportTitle].screen_name,
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'SendEmail',
		event_property: null,
		event_id: sendEmailClickMap[reportTitle].event_id,
		event_metadata: eventMetaData
	});
};
export const successPopupDoneClickAnalytics = (reportTitle, eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: doneClickMap[reportTitle].screen_name,
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Done',
		event_property: null,
		event_id: doneClickMap[reportTitle].event_id,
		event_metadata: eventMetaData
	});
};
export const failurePopupTryAgainClickAnalytics = (reportTitle, eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: tryAgainClickMap[reportTitle].screen_name,
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'TryAgain',
		event_property: null,
		event_id: tryAgainClickMap[reportTitle].event_id,
		event_metadata: eventMetaData
	});
};
export const downloadCompleteAnalytics = (reportTitle) => {
	Analytics.logAnalyticEvent({
		screen_name: downloadCompletePopupMap[reportTitle].screen_name,
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'DownloadComplete',
		event_property: null,
		event_id: downloadCompletePopupMap[reportTitle].event_id
	});
};
export const emailSentAnalytics = (reportTitle) => {
	Analytics.logAnalyticEvent({
		screen_name: emailSentPopupMap[reportTitle].screen_name,
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'EmailSent',
		event_property: null,
		event_id: emailSentPopupMap[reportTitle].event_id
	});
};
export const unableToGenerateReportAnalytics = (reportTitle) => {
	Analytics.logAnalyticEvent({
		screen_name: unableToGenerateReportPopupMap[reportTitle].screen_name,
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'UnabletoGenerate',
		event_property: null,
		event_id: unableToGenerateReportPopupMap[reportTitle].event_id
	});
};
export const errorSendingMailAnalytics = (reportTitle) => {
	Analytics.logAnalyticEvent({
		screen_name: errorSendingMailPopupMap[reportTitle].screen_name,
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Errorsendingmail',
		event_property: null,
		event_id: errorSendingMailPopupMap[reportTitle].event_id
	});
};
export const elssSelectFinancialYearAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ELSSStatement',
		event_type: 'click',
		event_sub_type: 'radiobutton',
		event_name: 'selectfinancialyear',
		event_property: null,
		event_id: '304.0.0.5.24',
		event_metadata: eventMetaData
	});
};
export const capitalGainsSelectFinancialYearAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CapitalGains',
		event_type: 'click',
		event_sub_type: 'radiobutton',
		event_name: 'selectfinancialyear',
		event_property: null,
		event_id: '304.0.0.5.25',
		event_metadata: eventMetaData
	});
};
export const fundHoldingsOpenCalendarAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-FundHoldings',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'opencalendar',
		event_property: null,
		event_id: '304.0.0.5.26'
	});
};
export const fundHoldingsDateChangeAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-opencalendar',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'changedate',
		event_property: null,
		event_id: '304.0.0.5.27'
	});
};
export const fundHoldingsApplyClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-opencalendar',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Apply',
		event_property: null,
		event_id: '304.0.0.5.28',
		event_metadata: eventMetaData
	});
};
export const txnHistoryLast3MonthsClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Last3months',
		event_property: null,
		event_id: '304.0.0.5.29'
	});
};
export const txnHistoryLast6MonthsClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Last6months',
		event_property: null,
		event_id: '304.0.0.5.30'
	});
};
export const txnHistoryYearTillDateClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Yeartilldate',
		event_property: null,
		event_id: '304.0.0.5.31'
	});
};
export const txnHistoryFYTClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'FYT',
		event_property: null,
		event_id: '304.0.0.5.32'
	});
};
export const txnHistoryFYT1ClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'FYT-1',
		event_property: null,
		event_id: '304.0.0.5.33'
	});
};
export const txnHistoryFYT2ClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'FYT-2',
		event_property: null,
		event_id: '304.0.0.5.34'
	});
};
export const txnHistoryFromCalendarOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Fromcalender',
		event_property: null,
		event_id: '304.0.0.5.35'
	});
};
export const txnHistoryToCalendarOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Tocalender',
		event_property: null,
		event_id: '304.0.0.5.36'
	});
};
export const txnHistoryApplyClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TransactionHistory',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Apply',
		event_property: null,
		event_id: '304.0.0.5.37',
		event_metadata: eventMetaData
	});
};
