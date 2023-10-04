<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import PageTitle from '$components/PageTitle.svelte';
	import ReportsCategories from './ReportsCategories.svelte';
	import ElssIcon from '$lib/images/icons/ElssIcon.svelte';
	import CapitalGainIcon from '$lib/images/icons/CapitalGainIcon.svelte';
	import FundHoldingsIcon from '$lib/images/icons/FundHoldings.svelte';
	import TransactionHistoryIcon from '$lib/images/icons/TransactionHistoryIcon.svelte';
	import SuccessTickInCircleIcon from '$lib/images/icons/SuccessTickInCircleIcon.svelte';
	import FailedIcon from '$lib/images/icons/FailedIcon.svelte';
	import ElssCardComponent from './components/ElssCardComponent.svelte';
	import CapitalGainsCardComponent from './components/CapitalGainCardComponent.svelte';
	import FundHoldingsCardComponent from './components/FundHoldingsCardComponent.svelte';
	import TxnHistoryCardComponent from './components/TxnHistoryCardComponent.svelte';
	import { getFinancialYearList } from '$lib/utils/helpers/date';
	import { downloadFile } from '$lib/utils/helpers/download';
	import SimplePopup from '$components/Popup/SimplePopup.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';

	import type {
		Report,
		FinancialYear,
		ReportDownloadArgs,
		reportMode as ReportMode
	} from '$lib/types/IReports';
	import { modalsAvaialable, reportMode } from '$lib/types/IReports';

	import {
		reportsScreenOpenAnalytics,
		successPopupDoneClickAnalytics,
		failurePopupTryAgainClickAnalytics,
		downloadCompleteAnalytics,
		unableToGenerateReportAnalytics,
		emailSentAnalytics,
		errorSendingMailAnalytics
	} from '$lib/analytics/reports/reports';

	$: isMobile = $page?.data?.deviceType?.isMobile;

	const reportItemList = [
		{
			title: 'ELSS Statement',
			icon: ElssIcon,
			postHeading: 'TAX FILING',
			emailText: 'ELSS statement',
			downloadText: 'ELSS report',
			fileExtension: '.pdf'
		},
		{
			title: 'Capital Gain',
			icon: CapitalGainIcon,
			postHeading: 'TAX FILING',
			emailText: 'Capital Gains statement',
			downloadText: 'Capital Gains report',
			fileExtension: '.xlsx'
		},
		{
			title: 'Fund Holdings',
			icon: FundHoldingsIcon,
			emailText: 'Fund holdings report',
			downloadText: 'Fund holdings report',
			fileExtension: '.xlsx'
		},
		{
			title: 'Transaction History',
			icon: TransactionHistoryIcon,
			emailText: 'Transaction history report',
			downloadText: 'Transaction history report',
			fileExtension: '.xlsx'
		}
	];

	let selectedReport: Report = !isMobile ? reportItemList[0] : {};

	let financialYearList: FinancialYear[] = getFinancialYearList(3);

	let showModal: number;

	let selectedFyear: FinancialYear;
	let recentReport: ReportDownloadArgs;
	let loaderText = 'Generating your report';

	const updateShowModal = (modal: number | undefined) => {
		showModal = modal;
	};
	const handleBackdropClick = () => {
		updateShowModal(undefined);
	};
	const toggleFYearSelected = (e: { detail: object }) => {
		unselectFYear();
		financialYearList.forEach((item) => {
			if (item.title === e.detail?.title) {
				item.selected = !item.selected;
				selectedFyear = item;
			}
		});
	};

	$: {
		toggleFYearSelected({ detail: financialYearList[0] });
	}

	const unselectFYear = () => {
		selectedFyear = undefined;
		financialYearList.forEach((item) => {
			item.selected = false;
		});
	};

	const onSelectReport = (e: { detail: Report }) => {
		selectedReport = { ...e.detail };
		if (selectedReport?.title === 'ELSS Statement') {
			updateShowModal(modalsAvaialable.elss);
		} else if (selectedReport?.title === 'Capital Gain') {
			updateShowModal(modalsAvaialable.gains);
		} else if (selectedReport?.title === 'Fund Holdings') {
			updateShowModal(modalsAvaialable.fundHolding);
		} else if (selectedReport?.title === 'Transaction History') {
			updateShowModal(modalsAvaialable.txnHistory);
		}
	};

	const updateLoaderText = (mode: ReportMode) => {
		mode === reportMode.download
			? (loaderText = 'Generating your report for download')
			: (loaderText = 'Generating your report');
	};

	const updateRecentReport = (item) => {
		recentReport = item;
	};

	const tryDownloadAgain = () => {
		downloadReport(recentReport);
		reportFailurePopupTryAgainClickAnalytics();
	};

	const reportSuccessPopupDoneClickAnalytics = () => {
		let eventMetaData = {};
		if (recentReport?.mode === reportMode.download) {
			eventMetaData = {
				DownloadComplete: `${selectedReport?.downloadText} has been downloaded to your device`
			};
		} else {
			eventMetaData = {
				EmailSentSuccessfully: `${selectedReport?.title} report has been sent successfully to the registered email id`
			};
		}
		handleBackdropClick();
		successPopupDoneClickAnalytics(selectedReport?.title, eventMetaData);
	};

	const reportFailurePopupTryAgainClickAnalytics = () => {
		let eventMetaData = {};
		if (recentReport?.mode === reportMode.download) {
			eventMetaData = {
				UnableToDownloadReport:
					'Due to technical issues, we are unable to generate the report. Please try again later.'
			};
		} else {
			eventMetaData = {
				ErrorSendingEmail:
					'Due to  technical issues, we face some difficulties in sending the generated report to the registered email ID. Please try again later.'
			};
		}
		handleBackdropClick();
		failurePopupTryAgainClickAnalytics(selectedReport?.title, eventMetaData);
	};

	const downloadReport = async (e: { detail: ReportDownloadArgs }) => {
		let { type, mode, fileName, toDate, fromDate } = e.detail;
		updateLoaderText(mode);
		updateShowModal(modalsAvaialable.reportGenerating);
		updateRecentReport({ type, mode, fileName, toDate, fromDate });
		let url = `${PUBLIC_MF_CORE_BASE_URL}/reports?type=${type}&mode=${mode}&toDate=${toDate}`;
		if (fromDate) {
			url = `${url}&fromDate=${fromDate}`;
		}
		let res = await useFetch(url, {}, fetch, true);
		if (res?.ok) {
			// Api Success - Send Email / Download Scenario
			const blobRes = await res.blob();
			if (mode === reportMode.download) {
				downloadFile(blobRes, blobRes?.type, fileName);
				updateShowModal(modalsAvaialable.downloadSuccessful);
				downloadCompleteAnalytics(selectedReport?.title);
			} else {
				updateShowModal(modalsAvaialable.emailSuccessful);
				emailSentAnalytics(selectedReport?.title);
			}
		} else {
			// Api Failure - Report to analutics
			if (mode === reportMode.download) {
				updateShowModal(modalsAvaialable.downloadError);
				unableToGenerateReportAnalytics(selectedReport?.title);
			} else {
				updateShowModal(modalsAvaialable.emailError);
				errorSendingMailAnalytics(selectedReport?.title);
			}
		}
	};

	onMount(() => {
		reportsScreenOpenAnalytics();
	});
</script>

<section>
	<PageTitle title="Reports" class="mb-0 lg:mb-4" />
	<ReportsCategories {reportItemList} {selectedReport} on:onSelect={onSelectReport} />
</section>
<section class="mt-2 sm:mt-12">
	<!-- ELSS screen -->
	{#if selectedReport?.title === 'ELSS Statement'}
		<ElssCardComponent
			{showModal}
			{selectedReport}
			{selectedFyear}
			{financialYearList}
			on:backdropClick={handleBackdropClick}
			on:onSelect={toggleFYearSelected}
			on:onSubmit={downloadReport}
		/>

		<!-- CG Screen -->
	{:else if selectedReport?.title === 'Capital Gain'}
		<CapitalGainsCardComponent
			{showModal}
			{selectedReport}
			{selectedFyear}
			{financialYearList}
			on:backdropClick={handleBackdropClick}
			on:onSelect={toggleFYearSelected}
			on:onSubmit={downloadReport}
		/>
	{:else if selectedReport?.title === 'Fund Holdings'}
		<!-- Fund Holdings Screen -->
		<FundHoldingsCardComponent
			{selectedReport}
			{showModal}
			on:backdropClick={handleBackdropClick}
			on:onSubmit={downloadReport}
			on:updateShowModal={(e) => updateShowModal(e.detail)}
		/>
	{:else if selectedReport?.title === 'Transaction History'}
		<!-- Txn History Screen -->
		<TxnHistoryCardComponent
			{selectedReport}
			{showModal}
			on:backdropClick={handleBackdropClick}
			on:onSubmit={downloadReport}
			on:updateShowModal={(e) => updateShowModal(e.detail)}
		/>
	{/if}

	<!-- Generating Report Modal -->
	{#if showModal === modalsAvaialable.reportGenerating}
		<SimplePopup
			subHeading1={loaderText}
			subHeading1Class="!pt-8 sm:!pt-5 !text-base sm:!text-lg !font-normal"
			subHeading2="This could take a few seconds. Please wait."
			subHeading2Class={`sm:!px-8 !text-sm !font-normal ${isMobile ? 'pb-4' : ''}
          `}
			on:backdropClick={handleBackdropClick}
		>
			<svelte:fragment slot="popupIcon">
				<LoadingIndicator svgClass={`${isMobile ? '!w-[86px] !h-[86px] mt-10' : '!w-28 !h-28'}`} />
			</svelte:fragment>
		</SimplePopup>
	{/if}
	<!-- Download Complete Modal -->
	{#if showModal === modalsAvaialable.downloadSuccessful}
		<SimplePopup
			heading="Download complete"
			subHeading1={`${selectedReport?.downloadText} has been downloaded to your device.`}
			buttonTitle="DONE"
			on:backdropClick={handleBackdropClick}
			on:onSubmit={reportSuccessPopupDoneClickAnalytics}
		>
			<svelte:fragment slot="popupIcon">
				<SuccessTickInCircleIcon class="py-2" />
			</svelte:fragment>
		</SimplePopup>
	{/if}
	<!-- Download Error Modal -->
	{#if showModal === modalsAvaialable.downloadError}
		<SimplePopup
			heading="Unable to Generate Report"
			subHeading1="We could not generate your report due to a technical error. Please try again."
			buttonTitle="TRY AGAIN"
			on:backdropClick={handleBackdropClick}
			on:onSubmit={tryDownloadAgain}
		>
			<svelte:fragment slot="popupIcon">
				<FailedIcon class="py-2" />
			</svelte:fragment>
		</SimplePopup>
	{/if}
	<!-- Email Successful Modal -->
	{#if showModal === modalsAvaialable.emailSuccessful}
		<SimplePopup
			heading="Email On The Way"
			subHeading1={`We have shared ${selectedReport?.emailText} to your registered email ID. You shall recieve it soon.`}
			buttonTitle="DONE"
			on:backdropClick={handleBackdropClick}
			on:onSubmit={reportSuccessPopupDoneClickAnalytics}
		>
			<svelte:fragment slot="popupIcon">
				<SuccessTickInCircleIcon class="py-2" />
			</svelte:fragment>
		</SimplePopup>
	{/if}
	<!-- Email Error Modal -->
	{#if showModal === modalsAvaialable.emailError}
		<SimplePopup
			heading="Error sending email"
			subHeading1="Due to technical issues, we are unable to send your report. Please try again later."
			buttonTitle="TRY AGAIN"
			on:backdropClick={handleBackdropClick}
			on:onSubmit={tryDownloadAgain}
		>
			<svelte:fragment slot="popupIcon">
				<FailedIcon class="py-2" />
			</svelte:fragment>
		</SimplePopup>
	{/if}
</section>
