<script lang="ts">
	import Card from '$components/Card.svelte';
	// import WmsIcon from '$components/WMSIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount.js';
	// import Modal from '$components/Modal.svelte';

	export let totalAmount: number;
	export let mandateLimit: number;

	// let maxAutopayLimitVisible = false;

	const autopayNotes = [
		{
			detail: 'Only SIP amount will be debited from your bank account on the SIP due date'
		},
		{
			detail:
				'This is a one-time setup. Payments for your future SIPs will be linked with this Autopay '
		}
	];

	// const onShowAutopayLimitmodal = () => {
	// 	maxAutopayLimitVisible = true;
	// };

	// const onHideAutopayLimitmodal = () => {
	// 	maxAutopayLimitVisible = false;
	// };
</script>

<Card class="!p-3">
	<div class="mb-4 flex">
		<div class=" flex-1 border-r border-grey-separator text-left">
			<div class=" mb-1 text-1xs font-normal leading-normal text-grey-body">
				Unlinked SIP Amount
			</div>
			<div class=" text-xl font-medium text-black-title">
				₹{addCommasToAmountString(totalAmount)}
			</div>
		</div>
		<div class="  flex-1 text-right">
			<div
				class=" mb-1 flex w-full items-center justify-end text-1xs font-normal leading-normal text-grey-body"
			>
				Autopay Limit
				 <!-- <WmsIcon
					height={12}
					width={12}
					class="ml-1 cursor-pointer"
					on:click={onShowAutopayLimitmodal}
					name="question-mark-circle"
				/> -->
			</div>
			<div class=" text-xl font-medium text-black-title">
				₹{addCommasToAmountString(mandateLimit)}
			</div>
		</div>
	</div>
	<div class=" rounded bg-yellow-background px-2 py-1">
		<div class=" mb-1 text-base font-medium text-black-title">Note:</div>
		<ul>
			{#each autopayNotes as item, index (index)}
				<li class=" mb-1 ml-4 list-disc text-sm font-normal text-black-title">{item.detail}</li>
			{/each}
		</ul>
	</div>
</Card>

<!-- {#if maxAutopayLimitVisible}
	<Modal closeModal={onHideAutopayLimitmodal} isModalOpen>
		<div
			class=" w-screen justify-between rounded-b-none rounded-t-2xl bg-white p-4 text-left sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-8"
		>
			<div class=" pb-6 pt-2 text-lg font-medium text-black-title">Max. Autopay Limit</div>

			<div class=" text-sm font-normal text-grey-body">
				This is the maximum amount that can be deducted from your bank account if you had cumulative
				SIPs of 1 lac to be deducted on a single day.<br />
				The actual amount deducted will be your SIP amount. This limit of 1 lac is to cover your existing
				and future SIPs.
			</div>
		</div>
	</Modal>
{/if} -->
