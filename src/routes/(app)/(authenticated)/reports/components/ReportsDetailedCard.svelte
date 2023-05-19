<script lang="ts">
	import { page } from '$app/stores';
	import { appStore } from '$lib/stores/SparkStore';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import Button from '$components/Button.svelte';
	import type { FinancialYear, ReportDownloadArgs } from '$lib/types/IReports';
	import { reportMode } from '$lib/types/IReports';
	import { createEventDispatcher } from 'svelte';

	export let selected: FinancialYear = {};
	export let info = '';
	export let subHeading = '';
	export let reportType = '';
	export let fileName = '';
	export let fileExtension = '';
	export let subHeadingClass = '';
	export let buttonDisabled = false;

	$: deviceType = $page.data.deviceType;

	const dispatch = createEventDispatcher();

	let isDownloadEnabled = true;

	$: isDownloadEnabled = (() => {
		return (
			// iOS 14.5 and above
			!appStore.isSparkIOSUser() &&
			// android webview
			!(appStore.isSparkAndroidUser() && appStore.isWebView())
		);
	})();

	$: formattedFileName = (() => {
		if (selected?.fileName) {
			return `${fileName}_${selected.fileName}${fileExtension}`;
		} else {
			return `${fileName}_${selected?.fromDate}_${selected?.toDate}${fileExtension}`;
		}
	})();

	const downloadReport = (options: ReportDownloadArgs) => {
		if (selected?.toDate) {
			options.fromDate = selected?.fromDate;
			options.toDate = selected?.toDate;
			options.fileName = formattedFileName;
		}
		dispatch('onSubmit', options);
	};
</script>

<section class="bg-white sm:m-2 sm:rounded-lg sm:py-5 sm:shadow-csm">
	{#if info}
		<div
			class="mx-4 mb-[18px] rounded-lg bg-grey px-4 py-2 text-sm font-medium text-grey-body sm:mx-6 sm:mb-6"
		>
			{info}
		</div>
	{/if}
	{#if subHeading}
		<p
			class={`px-4 pb-2 text-xs font-medium text-grey-body sm:border-b sm:border-grey-line sm:px-6 ${
				subHeadingClass || ''
			}`}
		>
			{subHeading}
		</p>
	{/if}

	<section class="sm:text-sm">
		<article class="sm:flex sm:flex-col sm:pb-5">
			<slot name="content" />
		</article>
	</section>

	<section class="px-4 py-4 md:px-6 md:py-1">
		<article class="flex items-center justify-between gap-3">
			<Button
				disabled={buttonDisabled}
				variant={isDownloadEnabled ? 'outlined' : 'contained'}
				class={`w-[49%] rounded ${
					isDownloadEnabled && !buttonDisabled
						? 'border border-blue-primary bg-white text-blue-primary'
						: ''
				} ${buttonDisabled ? 'border border-grey-disabled bg-white' : ''} ${
					!isDownloadEnabled ? 'flex-1' : ''
				}`}
				onClick={() => downloadReport({ type: reportType, mode: reportMode.email })}
			>
				<div
					class="flex items-center justify-center"
					class:text-blue-primary={isDownloadEnabled && !buttonDisabled}
					class:text-grey-disabled={buttonDisabled}
				>
					SEND EMAIL
					{#if !deviceType?.isMobile && !buttonDisabled}
						<RightIcon class="ml-3" stroke="blue" />
					{/if}
				</div>
			</Button>
			{#if isDownloadEnabled}
				<Button
					disabled={buttonDisabled}
					class="w-[49%] rounded"
					onClick={() => downloadReport({ type: reportType, mode: reportMode.download })}
				>
					<div class="flex items-center justify-center">
						DOWNLOAD REPORT
						{#if !deviceType?.isMobile}
							<RightIcon class="ml-3" stroke="white" />
						{/if}
					</div>
				</Button>
			{/if}
		</article>
	</section>
</section>
