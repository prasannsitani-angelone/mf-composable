<script setup lang="ts">
	import { onMount } from 'svelte';
	import { appStore } from '$lib/stores/SparkStore';
	import { compareVersion } from '$lib/utils/helpers';
	import type { ReportDownloadArgs } from '$lib/types/IReports';
	import { reportType, reportMode } from '$lib/types/IReports';
	import Button from '$components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	import CalendarIcon from '$lib/images/icons/CalendarIcon.svelte';
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';
	import SingleDatepicker from '$components/Datepickers/SingleDatepicker.svelte';
	import type { DatepickerEntity } from '$lib/types/IDatepicker';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';

	export let fromDate = '';
	export let displayFromDate = '';
	export let toDate = '';
	export let displayToDate = '';
	export let heading = '';
	export let datepickerSelected = 'from';

	const dispatch = createEventDispatcher();

	$: isMobile = $page?.data?.deviceType?.isMobile;

	let showFromDateDatepicker = true;

	$: buttonDisabled = !fromDate || !toDate;

	const updateShowFromDateDatepicker = (dateType?: string) => {
		if (dateType === 'from') {
			showFromDateDatepicker = true;
			dispatch('onFromDatepickerClick');
		} else {
			showFromDateDatepicker = false;
			dispatch('onToDatepickerClick');
		}
	};

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

	const applyDate = () => {
		dispatch('applyDate');
	};
	const backdropClick = () => {
		dispatch('backdropClick');
	};
	const handleFromDateChange = (newDate: DatepickerEntity) => {
		if (newDate?.hasChosen) {
			dispatch('onFromDateChange', newDate?.selected);
		}
	};
	const handleToDateChange = (newDate: DatepickerEntity) => {
		if (newDate?.hasChosen) {
			dispatch('onToDateChange', newDate?.selected);
		}
	};
	const downloadReport = (options: ReportDownloadArgs) => {
		if (toDate && fromDate) {
			dispatch('onSubmit', options);
		}
	};

	onMount(() => {
		datepickerSelected === 'from'
			? updateShowFromDateDatepicker('from')
			: updateShowFromDateDatepicker();
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<ModalWithAnimation closeModal={backdropClick} isModalOpen>
	<div
		class="w-screen items-stretch rounded-b-none rounded-t-2xl bg-white max-sm:!p-0 sm:!w-[460px] sm:rounded-lg"
	>
		<div class="flex items-center justify-between border-b border-grey-line px-8">
			<p class="py-6 text-xl font-normal text-black-title">
				{heading}
			</p>
			{#if !isMobile}
				<CrossInCircleIcon class="cursor-pointer" onClick={backdropClick} />
			{/if}
		</div>
		<div class="mx-4 flex flex-col py-6 sm:mx-8">
			<div class="mb-3 flex items-center justify-start gap-4">
				<div class="w-1/2">
					<p class="pb-4 text-sm font-normal text-grey-body">From</p>
					<div
						class="flex items-center justify-between border-b border-grey-line pb-2 md:cursor-pointer"
						on:click={() => updateShowFromDateDatepicker('from')}
					>
						{#if fromDate}
							<span class="text-base font-normal text-black-title">{displayFromDate}</span>
						{:else}
							<span class="text-base font-normal text-grey-disabled">DD/MM/YYYY</span>{/if}
						<CalendarIcon class="mb-1 ml-auto" />
					</div>
				</div>
				<div class="w-1/2">
					<p class="pb-4 text-sm font-normal text-grey-body">To</p>
					<div
						class="flex items-center justify-between border-b border-grey-line pb-2 md:cursor-pointer"
						on:click={() => updateShowFromDateDatepicker()}
					>
						{#if toDate}
							<span class="tetx-black-title text-base font-normal">{displayToDate}</span>
						{:else}
							<span class="text-base font-normal text-grey-disabled">DD/MM/YYYY</span>
						{/if}
						<CalendarIcon class="mb-1 ml-auto" />
					</div>
				</div>
			</div>
			{#if showFromDateDatepicker}
				<SingleDatepicker
					selected={fromDate || new Date()}
					maxDate={toDate}
					class="mt-3"
					onChange={handleFromDateChange}
				/>
			{:else}
				<SingleDatepicker
					selected={toDate || new Date()}
					minDate={fromDate}
					class="mt-3"
					onChange={handleToDateChange}
				/>
			{/if}
		</div>
		{#if !isMobile}
			<section class="mb-6 flex items-center justify-center">
				<div class="w-[190px]">
					{#if isDownloadEnabled}
						<Button
							disabled={buttonDisabled}
							class={`w-full rounded ${buttonDisabled ? '!text-white' : ''}`}
							onClick={applyDate}
						>
							<div class="flex items-center justify-center">APPLY</div>
						</Button>
					{/if}
				</div>
			</section>
		{:else}
			<section class="px-4 py-4 md:px-6 md:py-1">
				<article class="flex items-center justify-between gap-3">
					<Button
						disabled={buttonDisabled}
						variant={isDownloadEnabled ? 'outlined' : 'contained'}
						class={`w-[49%] rounded ${
							isDownloadEnabled && !buttonDisabled
								? 'border border-blue-primary bg-white text-blue-primary'
								: ''
						} ${buttonDisabled ? 'border !border-grey-line border-grey-disabled !bg-white' : ''} ${
							!isDownloadEnabled ? 'flex-1' : ''
						}`}
						onClick={() =>
							downloadReport({
								type: reportType.txn,
								mode: reportMode.email
							})}
					>
						<div
							class="flex items-center justify-center"
							class:text-blue-primary={isDownloadEnabled && !buttonDisabled}
							class:text-grey-disabled={buttonDisabled}
						>
							SEND EMAIL
						</div>
					</Button>
					{#if isDownloadEnabled}
						<Button
							disabled={buttonDisabled}
							class={`w-[49%] rounded ${buttonDisabled ? '!text-white' : ''}`}
							onClick={() =>
								downloadReport({
									type: reportType.txn,
									mode: reportMode.download
								})}
						>
							<div class="flex items-center justify-center">DOWNLOAD REPORT</div>
						</Button>
					{/if}
				</article>
			</section>
		{/if}
	</div>
</ModalWithAnimation>
