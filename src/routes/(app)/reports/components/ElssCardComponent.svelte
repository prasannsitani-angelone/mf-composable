<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import {
		elssScreenOpenAnalytics,
		elssPopupOpenAnalytics,
		downloadReportClickAnalytics,
		sendEmailClickAnalytics,
		elssSelectFinancialYearAnalytics
	} from '$lib/analytics/reports/reports';

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

	const elssFetchReportAnalytics = (mode: ReportMode) => {
		const eventMetaData = {
			FinancialYear: selectedFyear?.fileName
		};
		mode === reportMode.download
			? downloadReportClickAnalytics(selectedReport.title, eventMetaData)
			: sendEmailClickAnalytics(selectedReport.title, eventMetaData);
	};

	const downloadReport = (e: { detail: ReportDownloadArgs }) => {
		elssFetchReportAnalytics(e.detail?.mode);
		dispatch('onSubmit', e.detail);
	};
	const selectFYear = (e: { detail: object }) => {
		const eventMetaData = { FinancialYear: selectedFyear?.title };
		e.detail?.title !== financialYearList[0].title &&
			elssSelectFinancialYearAnalytics(eventMetaData);
		dispatch('onSelect', e.detail);
	};
	const backdropClick = () => {
		dispatch('backdropClick');
	};

	onMount(() => {
		!isMobile ? elssScreenOpenAnalytics() : elssPopupOpenAnalytics();
	});
</script>

{#if isMobile}
	<section>
		{#if showModal === modalsAvaialable.elss}
			<ReportsDetailedPopup
				heading="ELSS Statement"
				info="File password is your PAN number in capital letters"
				subHeading="Select a financial year"
				selected={selectedFyear}
				reportType={reportType.elss}
				fileName="ELSS_Report"
				fileExtension="selectedReport?.fileExtension"
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
			info="File password is your PAN number in capital letters"
			subHeading="Select a financial year"
			reportType={reportType.elss}
			fileName="ELSS_Report"
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
