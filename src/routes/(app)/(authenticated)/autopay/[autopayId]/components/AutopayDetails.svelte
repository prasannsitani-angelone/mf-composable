<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	// import InfoModal from '$components/InfoModal.svelte';
	import WmsIcon from '$components/WMSIcon.svelte';
	import type { AutopayDetailsType } from '$lib/types/IEmandate';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { copyToClipboard } from '$lib/utils/share';

	export let autopay: AutopayDetailsType;

	// let showMaxAutopayLimitModal = false;

	// const toggleShowMaxAutopayLimitModal = () => {
	// 	showMaxAutopayLimitModal = !showMaxAutopayLimitModal;
	// };
</script>

<section class="p-4 px-1 pb-2 {$$props?.class}">
	<article class="flex items-center">
		<section class="flex-1 p-2">
			<div class="text-[11px] font-normal text-body">Autopay Type</div>
			<div class="text-sm font-normal uppercase text-title">
				{autopay?.authenticationMode}
			</div>
		</section>

		<section class="flex-1 p-2">
			<div class="flex items-center text-[11px] font-normal text-body">
				<div>Max. Autopay Limit</div>
				<!-- <WmsIcon
					name="question-mark-circle"
					class="ml-1"
					width={12}
					height={12}
					on:click={toggleShowMaxAutopayLimitModal}
				/> -->
			</div>
			<div class="text-sm font-normal uppercase text-title">
				<AmountText amount={autopay?.amount} />
			</div>
		</section>
	</article>

	<article class="mt-1 flex items-center">
		<section class="flex-1 p-2">
			<div class="text-[11px] font-normal text-body">Autopay ID</div>
			<div class="flex items-center text-sm font-normal text-title">
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
			<div class="text-[11px] font-normal text-body">Created On</div>
			<div class="text-sm font-normal text-title">
				{getDateTimeString(autopay?.createdOn, 'DATE', true)}
			</div>
		</section>
	</article>
</section>

<!-- {#if showMaxAutopayLimitModal}
	<InfoModal
		showModal={showMaxAutopayLimitModal}
		heading="Max. Autopay Limit"
		headingClass={'mb-3 !font-normal'}
		on:crossClicked={toggleShowMaxAutopayLimitModal}
	>
		<svelte:fragment slot="crossIconSlot">
			<span />
		</svelte:fragment>

		<svelte:fragment slot="bodySection">
			<span />
			<section class="px-4 pb-6 pt-0 text-sm font-normal text-body md:px-8 md:pt-6">
				<p>
					This is the maximum amount that can be deducted from your bank account if you had
					cumulative SIPs of 1 lac to be deducted on a single day
				</p>
				<p>
					The actual amount deducted will be your SIP amount. This limit of 1 lac is to cover your
					existing and future SIPs.
				</p>
			</section>
		</svelte:fragment>
	</InfoModal>
{/if} -->
