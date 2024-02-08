<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$components/Button.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import {
		investmentExternalRefreshGotItAnalytics,
		investmentExternalRefreshFlowAnalytics
	} from '../../analytics';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';

	export let onModalClick = () => '';

	let onConfirmationClick = () => {
		onModalClick();
		investmentExternalRefreshGotItAnalytics();
	};
	$: technicalErrorMsg = `You can refresh your portfolio once every 24 hours. Please try after sometime.`;

	onMount(() => {
		investmentExternalRefreshFlowAnalytics({ status: 'Fail', Message: technicalErrorMsg });
	});
</script>

<ModalWithAnimation closeModal={onModalClick} isModalOpen>
	<div
		class="flex w-screen flex-col items-center justify-between rounded-b-none rounded-t-2xl bg-background-alt px-10 pb-8 pt-6 text-center sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-10"
	>
		<div class=""><WMSIcon width={92} height={92} name="red-cross-circle" /></div>
		<div class="mb-3 mt-6 text-xl font-normal">Refresh Not Allowed</div>

		<div class=" text-sm font-normal text-body">
			{technicalErrorMsg}
		</div>

		<Button class="mt-8 w-40 px-2" variant="outlined" onClick={onConfirmationClick}>GOT IT</Button>
	</div>
</ModalWithAnimation>
