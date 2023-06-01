<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from '$components/Modal.svelte';
	import Button from '$components/Button.svelte';
	import { WMSIcon } from 'wms-ui-component';
	import {
		investmentExternalRefreshGotItAnalytics,
		investmentExternalRefreshFlowAnalytics
	} from '../../analytics';
	import type { InvestmentSummary } from '$lib/types/IInvestments';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { refreshWaitDays } from '../../constants';

	export let summary: InvestmentSummary;
	export let onModalClick = () => '';

	let onConfirmationClick = () => {
		onModalClick();
		investmentExternalRefreshGotItAnalytics();
	};
	$: technicalErrorMsg = `You can refresh your portfolio once every ${refreshWaitDays} days. You can try again on ${getNextAllowedDateToRefresh(
		summary
	)}.`;

	function getNextAllowedDateToRefresh(summary: InvestmentSummary) {
		const nextAllowedDate = summary.lastSuccessfullImportTs + refreshWaitDays * 24 * 60 * 60 * 1000;
		const nextAllowedDateString = getDateTimeString(nextAllowedDate, 'DATETIME');
		return nextAllowedDateString;
	}

	onMount(() => {
		investmentExternalRefreshFlowAnalytics({ status: 'Fail', Message: technicalErrorMsg });
	});
</script>

<Modal closeModal={onModalClick} isModalOpen>
	<div
		class="flex w-screen flex-col items-center justify-between rounded-t-2xl rounded-b-none bg-white px-10 pt-6 pb-8 text-center sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-10"
	>
		<div class=""><WMSIcon width={92} height={92} name="red-cross-circle" /></div>
		<div class="mb-3 mt-6 text-xl font-medium">Refresh Not Allowed</div>

		<div class=" text-sm font-normal text-grey-body">
			{technicalErrorMsg}
		</div>

		<Button class="mt-8 w-40 px-2" variant="outlined" onClick={onConfirmationClick}>GOT IT</Button>
	</div>
</Modal>
