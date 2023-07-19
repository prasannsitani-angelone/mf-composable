<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import WmsIcon from '$components/WMSIcon.svelte';
	import type { AutopayDetailsType } from '$lib/types/IEmandate';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { copyToClipboard } from '$lib/utils/share';

	export let autopay: AutopayDetailsType;

	let showMaxAutopayLimitModal = false;

	const toggleShowMaxAutopayLimitModal = () => {
		showMaxAutopayLimitModal = !showMaxAutopayLimitModal;
	};
</script>

<section class="p-4 px-1 pb-2 {$$props?.class}">
	<article class="flex items-center">
		<section class="flex-1 p-2">
			<div class="text-[11px] font-normal text-grey-body">Autopay Type</div>
			<div class="text-sm font-medium uppercase text-black-title">
				{autopay?.authenticationMode}
			</div>
		</section>

		<section class="flex-1 p-2">
			<div class="flex items-center text-[11px] font-normal text-grey-body">
				<div>Max. Autopay Limit</div>
				<WmsIcon
					name="question-mark-circle"
					class="ml-1"
					width={12}
					height={12}
					on:click={toggleShowMaxAutopayLimitModal}
				/>
			</div>
			<div class="text-sm font-medium uppercase text-black-title">
				<AmountText amount={autopay?.amount} />
			</div>
		</section>
	</article>

	<article class="mt-1 flex items-center">
		<section class="flex-1 p-2">
			<div class="text-[11px] font-normal text-grey-body">Autopay ID</div>
			<div class="flex items-center text-sm font-medium text-black-title">
				<div class="w-28 truncate uppercase">
					{autopay?.mandateRefNo}
				</div>
				<WmsIcon
					class="ml-1 cursor-pointer active:opacity-50"
					on:click={() => copyToClipboard(autopay?.mandateRefNo)}
					height={16}
					width={17}
					name="copy"
				/>
			</div>
		</section>

		<section class="flex-1 p-2">
			<div class="text-[11px] font-normal text-grey-body">Created On</div>
			<div class="text-sm font-medium text-black-title">
				{getDateTimeString(autopay?.createdOn, 'DATE', true)}
			</div>
		</section>
	</article>
</section>

{#if showMaxAutopayLimitModal}
	<InfoModal
		showModal={showMaxAutopayLimitModal}
		heading="Max. Autopay Limit"
		headingClass={'mb-3 !font-medium'}
		on:crossClicked={toggleShowMaxAutopayLimitModal}
	>
		<svelte:fragment slot="crossIconSlot">
			<span />
		</svelte:fragment>

		<svelte:fragment slot="bodySection">
			<span />
			<section class="px-4 pb-6 pt-0 text-sm font-normal text-grey-body md:px-8 md:pt-6">
				<p>
					This is just the Maximum amount that can be deducted from your bank account on a single
					day of you had an cumulative SIP of 1 lac for a day.
				</p>
				<p>
					Actual amount deducted will be your SIP amount. This limit is 1 lac to cover for your
					future SIPs as well.
				</p>
			</section>
		</svelte:fragment>
	</InfoModal>
{/if}
