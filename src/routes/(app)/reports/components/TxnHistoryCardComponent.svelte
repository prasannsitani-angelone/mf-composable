<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import {
		txnHistoryScreenOpenAnalytics,
		txnHistoryPopupOpenAnalytics,
		downloadReportClickAnalytics,
		sendEmailClickAnalytics,
		txnHistoryLast3MonthsClickAnalytics,
		txnHistoryLast6MonthsClickAnalytics,
		txnHistoryYearTillDateClickAnalytics,
		txnHistoryFYTClickAnalytics,
		txnHistoryFYT1ClickAnalytics,
		txnHistoryFYT2ClickAnalytics,
		txnHistoryFromCalendarOpenAnalytics,
		txnHistoryToCalendarOpenAnalytics,
		txnHistoryApplyClickAnalytics
	} from '$lib/analytics/reports/reports';

	import type {
		Report,
		reportMode as ReportMode,
		ReportDownloadArgs,
		EventMetaData,
		FinancialYear
	} from '$lib/types/IReports';

	import { modalsAvaialable, reportType, reportMode } from '$lib/types/IReports';
	import { getFrequentTimePeriodList, convertToTwoDigit } from '$lib/utils/helpers/date';
	import ClockInCircleMediumIcon from '$lib/images/icons/ClockInCircleMediumIcon.svelte';
	import FinancialYearIcon from '$lib/images/icons/FinancialYearIcon.svelte';
	import CustomDateIcon from '$lib/images/icons/CustomDateIcon.svelte';
	import CalendarIcon from '$lib/images/icons/CalendarIcon.svelte';
	import RangeDatepickerPopup from '$components/Popup/RangeDatepickerPopup.svelte';
	import RightArrowDarkIcon from '$lib/images/icons/RightArrowDarkIcon.svelte';
	import ReportsDetailedPopup from './ReportsDetailedPopup.svelte';
	import ReportsDetailedCard from './ReportsDetailedCard.svelte';
	import ButtonSelect from './ButtonSelect.svelte';

	export let selectedReport: Report = {};
	export let showModal: number;

	$: isMobile = $page?.data?.deviceType?.isMobile;

	const dispatch = createEventDispatcher();

	let customFromDate: string | null;
	let customToDate: string | null;
	let displayFromDate: string | null;
	let displayToDate: string | null;
	let datepickerSelected = 'from';
	let selectedTxnHistoryOption: FinancialYear = null;

	$: buttonDisabled = (!customFromDate || !customToDate) && !selectedTxnHistoryOption;
	const handleFromDateChange = (newDate: Date) => {
		if (newDate) {
			customFromDate = `${newDate.getFullYear()}-${convertToTwoDigit(
				newDate.getMonth() + 1
			)}-${convertToTwoDigit(newDate.getDate())}`;
			displayFromDate = newDate.toLocaleDateString('en-GB');
		}
	};
	const handleToDateChange = (newDate: Date) => {
		if (newDate) {
			customToDate = `${newDate.getFullYear()}-${convertToTwoDigit(
				newDate.getMonth() + 1
			)}-${convertToTwoDigit(newDate.getDate())}`;
			displayToDate = newDate.toLocaleDateString('en-GB');
		}
	};
	const showCalendarModal = (dateType: string) => {
		selectTxnHistoryOption({ detail: '' });
		datepickerSelected = dateType;
		updateShowModal(modalsAvaialable.txnHistoryCalendar);
	};
	const clearCustomDates = () => {
		customFromDate = null;
		customToDate = null;
		displayFromDate = null;
		displayToDate = null;
	};
	const reportTxnHistoryApplyClickAnalytics = () => {
		backdropClick();

		const eventMetaData = {
			From: displayFromDate,
			To: displayToDate
		};
		if (displayFromDate && displayToDate) {
			txnHistoryApplyClickAnalytics(eventMetaData);
		}
	};
	const txnHistoryFrequentOptionsClickAnalytics = {
		'Last 3 Months': () => {
			txnHistoryLast3MonthsClickAnalytics();
		},
		'Last 6 Months': () => {
			txnHistoryLast6MonthsClickAnalytics();
		},
		'Year Till Date': () => {
			txnHistoryYearTillDateClickAnalytics();
		}
	};
	const txnHistoryFYearClickAnalytics = {
		0: () => {
			txnHistoryFYTClickAnalytics();
		},
		1: () => {
			txnHistoryFYT1ClickAnalytics();
		},
		2: () => {
			txnHistoryFYT2ClickAnalytics();
		}
	};
	const unselectTxnOptions = () => {
		selectedTxnHistoryOption = null;
		frequentTimePeriodList.forEach((item) => {
			item.isSelected = false;
		});
		financialYearOptionsList.forEach((item) => {
			item.isSelected = false;
		});
	};
	const selectTxnHistoryOption = (e: { detail: string }) => {
		const title = e.detail;
		if (title) {
			clearCustomDates();
		}
		unselectTxnOptions();

		frequentTimePeriodList?.forEach((item) => {
			if (item.title === title) {
				item.isSelected = !item.isSelected;
				selectedTxnHistoryOption = item;
				txnHistoryFrequentOptionsClickAnalytics[item.title]();
			}
		});
		financialYearOptionsList?.forEach((item, index) => {
			if (item.title === title) {
				item.isSelected = !item.isSelected;
				selectedTxnHistoryOption = item;
				txnHistoryFYearClickAnalytics[index]();
			}
		});
	};

	const getAnalyticsData = () => {
		const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
		const analyticsFromDate =
			customFromDate && new Date(customFromDate).toLocaleDateString('en-GB', dateOptions);
		const analyticsToDate =
			customToDate && new Date(customToDate).toLocaleDateString('en-GB', dateOptions);

		const analyticsData = {
			...(selectedTxnHistoryOption?.title.substring(0, 2) !== 'FY' && {
				frequentlyUsedTimePeriod: selectedTxnHistoryOption?.title
			}),
			...(selectedTxnHistoryOption?.title.substring(0, 2) === 'FY' && {
				financialYear: selectedTxnHistoryOption?.title
			}),
			...(analyticsFromDate &&
				analyticsToDate && {
					customRange: `${analyticsFromDate}-${analyticsToDate}`
				})
		};
		return analyticsData;
	};

	const txnHistoryFetchReportAnalytics = (mode: ReportMode, analyticsData: EventMetaData) => {
		const eventMetaData = {
			FrequentlyUsedTimePeriod: analyticsData?.frequentlyUsedTimePeriod,
			FinancialYear: analyticsData?.financialYear,
			CustomRange: analyticsData?.customRange
		};
		mode === reportMode.download
			? downloadReportClickAnalytics(selectedReport.title, eventMetaData)
			: sendEmailClickAnalytics(selectedReport.title, eventMetaData);
	};

	const downloadReport = (e: { detail: ReportDownloadArgs }) => {
		const options = e.detail;
		if (!options.fileName) {
			options.fileName = `Txn_History_${customFromDate}_${customToDate}${selectedReport?.fileExtension}`;
			options.fromDate = customFromDate;
			options.toDate = customToDate;
		}

		txnHistoryFetchReportAnalytics(options.mode, getAnalyticsData());
		dispatch('onSubmit', options);
		selectTxnHistoryOption({ detail: 'Last 3 Months' });
	};

	const backdropClick = () => {
		if (!customFromDate || isMobile) {
			selectTxnHistoryOption({ detail: 'Last 3 Months' });
		}
		dispatch('backdropClick');
	};
	const updateShowModal = (modal: number | null) => {
		dispatch('updateShowModal', modal);
	};
	const getFinancialYearOptionsList = (listLength: 3) => {
		const today = new Date();
		let endYear;
		today.getMonth() < 3 // before April
			? (endYear = today.getFullYear())
			: (endYear = today.getFullYear() + 1);

		const financialYearList = [];
		for (let i = 0; i < listLength; i++) {
			const temp = {
				fromDate: `${endYear - 1}-04-01`,
				toDate: `${endYear}-03-31`,
				selected: false,
				fileName: `FY_${endYear - 1}_${endYear % 100}`,
				title: `FY ${endYear - 1}-${endYear % 100}`
			};
			endYear -= 1;
			financialYearList.push(temp);
		}
		return financialYearList;
	};

	let financialYearOptionsList = getFinancialYearOptionsList(3);
	let frequentTimePeriodList = getFrequentTimePeriodList();

	$: selectTxnHistoryOption({ detail: 'Last 3 Months' });

	const reportDatepickerClick = (type: string) => {
		if (type === 'from') {
			txnHistoryFromCalendarOpenAnalytics();
		} else if (type === 'to') {
			txnHistoryToCalendarOpenAnalytics();
		}
	};

	onMount(() => {
		!isMobile ? txnHistoryScreenOpenAnalytics() : txnHistoryPopupOpenAnalytics();
	});
</script>

<section>
	{#if isMobile}
		<section>
			{#if showModal === modalsAvaialable.txnHistory}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<ReportsDetailedPopup
					heading="Transaction History"
					selected={selectedTxnHistoryOption}
					reportType={reportType.txn}
					fileName="Txn_History_Report"
					fileExtension={selectedReport?.fileExtension}
					on:backdropClick={backdropClick}
					on:onSubmit={downloadReport}
				>
					<svelte:fragment slot="content">
						<section class="px-4 py-3 text-sm md:px-8">
							<article class="flex items-center justify-start gap-2">
								<ClockInCircleMediumIcon />
								<p class="text-sm text-gray-500">Frequently Used Time Period</p>
							</article>

							<ButtonSelect
								selected={selectedTxnHistoryOption}
								list={frequentTimePeriodList}
								on:onSelect={selectTxnHistoryOption}
							/>
						</section>

						<section class="px-4 py-3 text-sm md:px-8">
							<article class="flex items-center justify-start gap-2">
								<FinancialYearIcon />
								<p class="text-sm text-gray-500">Financial Year</p>
							</article>

							<ButtonSelect
								selected={selectedTxnHistoryOption}
								list={financialYearOptionsList}
								on:onSelect={selectTxnHistoryOption}
							/>
						</section>

						<section class="px-4 py-3 text-sm md:px-8">
							<article
								class="flex items-center justify-start gap-2"
								on:click={() => showCalendarModal('from')}
							>
								<CustomDateIcon />
								<p class="text-sm text-gray-500">Custom Date Range</p>
								<RightArrowDarkIcon class="ml-auto mr-5" />
							</article>
						</section>
					</svelte:fragment>
				</ReportsDetailedPopup>
			{/if}
		</section>
	{:else}
		<section>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<ReportsDetailedCard
				selected={selectedTxnHistoryOption}
				reportType={reportType.txn}
				fileName="Txn_History"
				fileExtension={selectedReport?.fileExtension}
				{buttonDisabled}
				on:onSubmit={downloadReport}
			>
				<svelte:fragment slot="content">
					<section class="px-4 py-3 text-sm md:px-8">
						<article class="flex items-center justify-start gap-2 sm:pb-3">
							<ClockInCircleMediumIcon />
							<p class="text-sm text-gray-500">Frequently Used Time Period</p>
						</article>

						<ButtonSelect
							selected={selectedTxnHistoryOption}
							list={frequentTimePeriodList}
							on:onSelect={selectTxnHistoryOption}
						/>
					</section>

					<section class="px-4 py-3 text-sm md:px-8">
						<article class="flex items-center justify-start gap-2 sm:pb-3">
							<FinancialYearIcon />
							<p class="text-sm text-gray-500">Financial Year</p>
						</article>

						<ButtonSelect
							selected={selectedTxnHistoryOption}
							list={financialYearOptionsList}
							on:onSelect={selectTxnHistoryOption}
						/>
					</section>

					<section class="px-4 py-3 text-sm md:px-8">
						<article class="flex items-center justify-start gap-2 sm:pb-3">
							<CustomDateIcon />
							<p class="text-sm text-gray-500">Custom Date Range</p>
						</article>
						<div class="mt-2 ml-4 flex items-center gap-4 pl-4">
							<div class="w-1/2">
								<p class="mb-4 text-xs font-normal text-grey-body">From</p>
								<div
									class="flex cursor-pointer items-center border-b border-grey-line pb-2"
									on:click={() => showCalendarModal('from')}
								>
									{#if customFromDate}
										<span class="test font-medium">{displayFromDate}</span>
									{:else}
										<span class="text-base font-medium text-grey-disabled">DD/MM/YYYY</span>
									{/if}
									<CalendarIcon class="ml-auto mb-1" />
								</div>
							</div>
							<div class="w-1/2">
								<p class="mb-4 text-xs font-normal text-grey-body">To</p>
								<div
									class="border-grey-lin flex cursor-pointer items-center border-b pb-2"
									on:click={() => showCalendarModal('to')}
								>
									{#if customToDate}
										<span class="test font-medium">{displayToDate}</span>
									{:else}
										<span class="text-base font-medium text-grey-disabled">DD/MM/YYYY</span>
									{/if}
									<CalendarIcon class="ml-auto mb-1" />
								</div>
							</div>
						</div>
					</section>
				</svelte:fragment>
			</ReportsDetailedCard>
		</section>
	{/if}
	{#if showModal === modalsAvaialable.txnHistoryCalendar}
		<RangeDatepickerPopup
			heading="Select Custom Date Range"
			fromDate={customFromDate}
			toDate={customToDate}
			{displayFromDate}
			{displayToDate}
			{datepickerSelected}
			on:backdropClick={backdropClick}
			on:onFromDatepickerClick={() => reportDatepickerClick('from')}
			on:onToDatepickerClick={() => reportDatepickerClick('to')}
			on:onFromDateChange={(e) => handleFromDateChange(e.detail)}
			on:onToDateChange={(e) => handleToDateChange(e.detail)}
			on:applyDate={reportTxnHistoryApplyClickAnalytics}
			on:onSubmit={downloadReport}
		/>
	{/if}
</section>
