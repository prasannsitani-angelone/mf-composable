<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from '$components/Modal.svelte';
	import Button from '$components/Button.svelte';
	import { WMSIcon } from 'wms-ui-component';
	import {
		investmentExternalRefreshGotItAnalytics,
		investmentExternalRefreshFlowAnalytics
	} from '../../analytics';

	export let onModalClick = () => '';
	export let errorType: 'WAIT_TWENTY_FOUR_HOURS' | 'TECHNICAL_ERROR';
	let onConfirmationClick = () => {
		onModalClick();
		investmentExternalRefreshGotItAnalytics();
	};
	const technicalErrorMsg =
		'You can refresh your portfolio once every 72 hours. Please try again after some time.';
	const waitTwentyFourHoursMsg =
		'You can refresh your portfolio once every 24 hours. Please try again after some time.';
	onMount(() => {
		let message = errorType === 'TECHNICAL_ERROR' ? technicalErrorMsg : waitTwentyFourHoursMsg;
		investmentExternalRefreshFlowAnalytics({ status: 'Fail', Message: message });
	});
</script>

<Modal closeModal={onModalClick} isModalOpen>
	<div
		class="flex w-screen flex-col items-center justify-between rounded-t-2xl rounded-b-none bg-white px-10 pt-6 pb-8 text-center sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-10"
	>
		<div class=""><WMSIcon width={92} height={92} name="red-cross-circle" /></div>
		<div class="mb-3 mt-6 text-xl font-medium">Refresh Not Allowed</div>
		{#if errorType === 'WAIT_TWENTY_FOUR_HOURS'}
			<div class=" text-sm font-normal text-grey-body">
				{waitTwentyFourHoursMsg}
			</div>
		{:else if errorType === 'TECHNICAL_ERROR'}
			<div class=" text-sm font-normal text-grey-body">
				{technicalErrorMsg}
			</div>
		{/if}
		<Button class="mt-8 w-40 px-2" variant="outlined" onClick={onConfirmationClick}>GOT IT</Button>
	</div>
</Modal>
