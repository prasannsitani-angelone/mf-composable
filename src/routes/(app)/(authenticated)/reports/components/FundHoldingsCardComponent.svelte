<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import ReportsDetailedPopup from './ReportsDetailedPopup.svelte';
	import ReportsDetailedCard from './ReportsDetailedCard.svelte';
	import CalendarIcon from '$lib/images/icons/CalendarIcon.svelte';
	import { convertToTwoDigit } from '$lib/utils/helpers/date';
	import SingleDatepicker from '$components/Datepickers/SingleDatepicker.svelte';
	import SingleDatepickerPopup from '$components/Popup/SingleDatepickerPopup.svelte';

	import {
		fundHoldingsScreenOpenAnalytics,
		fundHoldingsPopupOpenAnalytics,
		downloadReportClickAnalytics,
		sendEmailClickAnalytics,
		fundHoldingsOpenCalendarAnalytics,
		fundHoldingsDateChangeAnalytics,
		fundHoldingsApplyClickAnalytics
	} from '$lib/analytics/reports/reports';
	import type { Report, ReportDownloadArgs } from '$lib/types/IReports';

	import { modalsAvaialable, reportType, reportMode } from '$lib/types/IReports';

	export let selectedReport: Report;
	export let showModal: number;

	$: isMobile = $page?.data?.deviceType?.isMobile;

	const dispatch = createEventDispatcher();

	let showCalendar = false;
	let date: string;
	let displayDate: string;
	let subHeading = 'View mutual funds held in your portfolio as on a specific date';
	let minDate = new Date();
	minDate.setFullYear(minDate.getFullYear() - 3);

	const handleDateChange = (newDate: Date) => {
		if (newDate && !Array.isArray(newDate)) {
			date = `${newDate.getFullYear()}-${convertToTwoDigit(
				newDate.getMonth() + 1
			)}-${convertToTwoDigit(newDate.getDate())}`;
			displayDate = newDate?.toLocaleDateString('en-GB');
			const today = new Date();
			date !==
				`${today.getFullYear()}-${convertToTwoDigit(today.getMonth() + 1)}-${convertToTwoDigit(
					today.getDate()
				)}` && fundHoldingsDateChangeAnalytics();
		}
	};
	const reportFundHoldingsApplyClickAnalytics = () => {
		backdropClick();
		const eventMetaData = {
			PreviousDate: new Date().toLocaleDateString('en-GB'),
			ChangedDate: displayDate
		};
		fundHoldingsApplyClickAnalytics(eventMetaData);
	};
	const toggleShowCalendar = () => {
		!isMobile
			? updateShowModal(modalsAvaialable.fundHoldingCalendar)
			: (showCalendar = !showCalendar);
		fundHoldingsOpenCalendarAnalytics();
	};

	const fundHoldingsFetchReportAnalytics = (options: ReportDownloadArgs) => {
		const eventMetaData = {
			Date: options?.toDate
		};
		options?.mode === reportMode.download
			? downloadReportClickAnalytics(selectedReport.title, eventMetaData)
			: sendEmailClickAnalytics(selectedReport.title, eventMetaData);
	};

	const downloadReport = (e: { detail: ReportDownloadArgs }) => {
		e.detail.fileName = `Fund_holdings_${date}${selectedReport?.fileExtension}`;
		e.detail.toDate = date;

		fundHoldingsFetchReportAnalytics(e.detail);
		dispatch('onSubmit', e.detail);
	};

	const backdropClick = () => {
		showCalendar = false;
		dispatch('backdropClick');
	};
	const updateShowModal = (modal: number | null) => {
		dispatch('updateShowModal', modal);
	};

	onMount(() => {
		!isMobile ? fundHoldingsScreenOpenAnalytics() : fundHoldingsPopupOpenAnalytics();
		handleDateChange(new Date());
	});
</script>

{#if isMobile}
	<section>
		{#if showModal === modalsAvaialable.fundHolding}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<ReportsDetailedPopup
				heading="Fund Holdings"
				{subHeading}
				subHeadingClass="!text-sm !font-normal !pb-6"
				reportType={reportType.funds}
				fileName="Fund_holdings"
				fileExtension={selectedReport?.fileExtension}
				on:backdropClick={backdropClick}
				on:onSubmit={downloadReport}
			>
				<svelte:fragment slot="content">
					<section class="px-4 text-sm md:px-8">
						<article class="flex flex-col">
							<p class="text-xs text-body">Date</p>
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div class="mb-3 flex items-center border-b" on:click={toggleShowCalendar}>
								{#if date}
									<span class="test font-normal text-title">{displayDate}</span>
								{:else}
									<span class="text-base font-normal text-disabled">DD/MM/YYYY</span>
								{/if}
								<CalendarIcon class="mb-1 ml-auto" />
							</div>
							{#if showCalendar}
								<SingleDatepicker
									{minDate}
									selected={date}
									closeOnAutoApply={true}
									onChange={(date) => handleDateChange(date?.selected)}
								/>
							{/if}
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
			{subHeading}
			reportType={reportType.funds}
			fileName="Fund_holdings"
			fileExtension="selectedReport?.fileExtension"
			on:onSubmit={downloadReport}
		>
			<svelte:fragment slot="content">
				<section class="px-6 py-6">
					<p class="pb-[14px] text-xs font-normal text-body">Date</p>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="mb-32 flex w-1/2 items-center border-b" on:click={toggleShowCalendar}>
						{#if date}
							<span class="test text-base font-normal">{displayDate}</span>
						{:else}
							<span class="text-base font-normal text-disabled">DD/MM/YYYY</span>
						{/if}
						<CalendarIcon class="mb-1 ml-auto" />
					</div>
				</section>
			</svelte:fragment>
		</ReportsDetailedCard>
		{#if showModal === modalsAvaialable.fundHoldingCalendar}
			<SingleDatepickerPopup
				heading="Select Custom Date Range"
				{minDate}
				{date}
				{displayDate}
				on:backdropClick={backdropClick}
				on:onChange={(e) => handleDateChange(e.detail)}
				on:applyDate={reportFundHoldingsApplyClickAnalytics}
			/>
		{/if}
	</section>
{/if}
