<script lang="ts">
	import { page } from '$app/stores';
	import { appStore } from '$lib/stores/SparkStore';
	import { compareVersion } from '$lib/utils/helpers';
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
	const iOSVersionCompatible = '14.5';

	$: isDownloadEnabled = (() => {
		if (appStore.platform() === 'mf-web') {
			return true;
		} else if (
			appStore.isSparkIOSUser() &&
			compareVersion($page?.data?.deviceType?.osVersion, iOSVersionCompatible)
		) {
			return true;
		} else if (
			$page?.data?.deviceType?.os === 'Android' &&
			typeof window?.JSBlobDownloadInterface?.getBase64FromBlobData === 'function'
		) {
			return true;
		} else {
			return false;
		}
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

<section class="bg-background-alt sm:m-2 sm:rounded-lg sm:py-5 sm:shadow-csm">
	{#if info}
		<div
			class="mx-4 mb-[18px] rounded-lg bg-background px-4 py-2 text-sm font-normal text-body sm:mx-6 sm:mb-6"
		>
			{info}
		</div>
	{/if}
	{#if subHeading}
		<p
			class={`px-4 pb-2 text-xs font-normal text-body sm:border-b sm:border-border sm:px-6 ${
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
						? 'border border-primary bg-background-alt text-primary'
						: ''
				} ${buttonDisabled ? 'border border-disabled bg-background-alt' : ''} ${
					!isDownloadEnabled ? 'flex-1' : ''
				}`}
				onClick={() => downloadReport({ type: reportType, mode: reportMode.email })}
			>
				<div
					class="flex items-center justify-center"
					class:text-primary={isDownloadEnabled && !buttonDisabled}
					class:text-disabled={buttonDisabled}
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
