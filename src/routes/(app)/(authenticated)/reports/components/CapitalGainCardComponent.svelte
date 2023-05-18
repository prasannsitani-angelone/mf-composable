<script lang="ts">
	import {
		capitalGainsScreenOpenAnalytics,
		capitalGainsPopupOpenAnalytics,
		downloadReportClickAnalytics,
		sendEmailClickAnalytics,
		capitalGainsSelectFinancialYearAnalytics
	} from '$lib/analytics/reports/reports';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import type {
		FinancialYear,
		Report,
		ReportDownloadArgs,
		reportMode as ReportMode
	} from '$lib/types/IReports';
	import { reportType, reportMode } from '$lib/types/IReports';
	import { modalsAvaialable } from '$lib/types/IReports';
	import ReportsDetailedCard from './ReportsDetailedCard.svelte';
	import ReportsDetailedPopup from './ReportsDetailedPopup.svelte';
	import ReportsFYearList from './ReportsFYearList.svelte';

	export let selectedReport: Report;
	export let selectedFyear: FinancialYear;
	export let financialYearList: FinancialYear[] = [];
	export let showModal: number;

	$: isMobile = $page?.data?.deviceType?.isMobile;

	const dispatch = createEventDispatcher();

	const capitalGainsFetchReportAnalytics = (mode: ReportMode) => {
		const eventMetaData = {
			FinancialYear: selectedFyear?.fileName
		};
		mode === reportMode.download
			? downloadReportClickAnalytics(selectedReport.title, eventMetaData)
			: sendEmailClickAnalytics(selectedReport.title, eventMetaData);
	};

	const downloadReport = (e: { detail: ReportDownloadArgs }) => {
		capitalGainsFetchReportAnalytics(e.detail?.mode);
		dispatch('onSubmit', e.detail);
	};
	const selectFYear = (e: { detail: object }) => {
		const eventMetaData = { FinancialYear: selectedFyear?.title };
		e.detail?.title !== financialYearList[0].title &&
			capitalGainsSelectFinancialYearAnalytics(eventMetaData);
		dispatch('onSelect', e.detail);
	};
	const backdropClick = () => {
		dispatch('backdropClick');
	};

	onMount(() => {
		!isMobile ? capitalGainsScreenOpenAnalytics() : capitalGainsPopupOpenAnalytics();
	});
</script>

{#if isMobile}
	<section>
		{#if showModal === modalsAvaialable.gains}
			<ReportsDetailedPopup
				heading="Capital Gains Statement"
				subHeading="Select a financial year"
				selected={selectedFyear}
				reportType={reportType.cg}
				fileName="CG_Report"
				fileExtension={selectedReport?.fileExtension}
				on:backdropClick={backdropClick}
				on:onSubmit={downloadReport}
			>
				<svelte:fragment slot="content">
					<section class="px-4 text-sm md:px-8">
						<ReportsFYearList
							list={financialYearList}
							selected={selectedFyear}
							on:onSelect={selectFYear}
						/>
					</section>
				</svelte:fragment>
			</ReportsDetailedPopup>
		{/if}
	</section>
{:else}
	<section>
		<ReportsDetailedCard
			selected={selectedFyear}
			subHeading="Select a financial year"
			reportType={reportType.cg}
			fileName="CG_Report"
			fileExtension={selectedReport?.fileExtension}
			on:onSubmit={downloadReport}
		>
			<svelte:fragment slot="content">
				<ReportsFYearList
					list={financialYearList}
					selected={selectedFyear}
					on:onSelect={selectFYear}
				/>
			</svelte:fragment>
		</ReportsDetailedCard>
	</section>
{/if}
