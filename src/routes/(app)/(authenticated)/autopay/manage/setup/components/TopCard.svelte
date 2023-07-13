<script lang="ts">
	import Card from '$components/Card.svelte';
	import WmsIcon from '$components/WMSIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount.js';
	import type { INudge } from '$lib/types/INudge';
	import { getSipAmountWithoutMandate } from '../../utils';
	import { autopayLimit } from '../../constants';
	import Modal from '$components/Modal.svelte';

	export let nudgeData: INudge[];
	let amount: number;
	$: amount = getSipAmountWithoutMandate(nudgeData);

	let maxAutopayLimitVisible = false;

	const autopayNotes = [
		{
			detail: 'Only SIP amount will be debited from your bank account on the SIP due date'
		},
		{
			detail:
				'This is a one-time setup. Payments for your future SIPs will be linked with this Autopay '
		},
		{
			detail: 'The daily payment limit via this autopay is ₹1 Lakh'
		}
	];

	const onShowAutopayLimitmodal = () => {
		maxAutopayLimitVisible = true;
	};

	const onHideAutopayLimitmodal = () => {
		maxAutopayLimitVisible = false;
	};
</script>

<Card class="!p-3">
	<div class="mb-4 flex">
		<div class=" flex-1 border-r border-grey-separator text-left">
			<div class=" mb-1 text-1xs font-normal leading-normal text-grey-body">Current SIP Amount</div>
			<div class=" text-xl font-medium text-black-title">₹{addCommasToAmountString(amount)}</div>
		</div>
		<div class="  flex-1 text-right">
			<div
				class=" mb-1 flex w-full items-center justify-end text-1xs font-normal leading-normal text-grey-body"
			>
				Autopay Limit <WmsIcon
					height={12}
					width={12}
					class="ml-1 cursor-pointer"
					on:click={onShowAutopayLimitmodal}
					name="question-mark-circle"
				/>
			</div>
			<div class=" text-xl font-medium text-black-title">
				₹{addCommasToAmountString(autopayLimit)}
			</div>
		</div>
	</div>
	<div class=" rounded bg-yellow-background px-2 py-1">
		<div class=" mb-1 text-base font-medium text-black-title">Note:</div>
		<ul>
			{#each autopayNotes as item, index (index)}
				<li class=" ml-4 mb-1 list-disc text-sm font-normal text-black-title">{item.detail}</li>
			{/each}
		</ul>
	</div>
</Card>

{#if maxAutopayLimitVisible}
	<Modal closeModal={onHideAutopayLimitmodal} isModalOpen>
		<div
			class=" w-screen justify-between rounded-t-2xl rounded-b-none bg-white p-4 text-left sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-8"
		>
			<div class=" pb-6 pt-2 text-lg font-medium text-black-title">Max. Autopay Limit</div>

			<div class=" text-sm font-normal text-grey-body">
				This is just the Maximum amount that can be deducted from your bank account on a single day
				of you had an cumulative SIP of 1 lac for a day. <br /> Actual amount deducted will be your SIP
				amount. This limit is 1 lac to cover for your future SIPs as well.
			</div>
		</div>
	</Modal>
{/if}
