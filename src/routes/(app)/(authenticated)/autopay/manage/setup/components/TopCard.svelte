<script lang="ts">
	import Card from '$components/Card.svelte';
	import { WMSIcon } from 'svelte-components';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount.js';
	import DotIcon from '$lib/images/icons/DotIcon.svelte';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';

	export let totalAmount: number;

	let showAutopayLimitModal = false;

	const autopayNotes = [
		{
			detail: 'Only SIP amount will be debited from your bank account on the SIP due date'
		},
		{
			detail:
				'This is a one-time setup. Payments for your existing and future SIPs will be linked with this Autopay'
		},
		{
			detail:
				'Autopay limit for UPI mode is ₹15,000 and daily autopay limit for Net Banking mode is ₹1,00,000',
			icon: 'info-in-circle-dark'
		}
	];

	const autopayLimitModalNotes = [
		{
			detail:
				'For UPI mode, single transaction autopay limit is ₹15,000. SIPs more than ₹15,000 will not be linked to UPI Autopay.'
		},
		{
			detail: 'For Net Banking mode, one day autopay limit is ₹1,00,000.'
		},
		{
			detail:
				'The max limit covers your future SIPs as well. Payments for your future SIPs will be linked with this Autopay.'
		}
	];

	const toggleAutopayLimitmodal = () => {
		showAutopayLimitModal = !showAutopayLimitModal;
	};
</script>

<Card class="!p-3">
	<div class="mb-3 flex flex-col items-center justify-center">
		<div class="mb-1 text-xs font-normal text-body">Unlinked SIP Amount</div>
		<div class="text-2xl font-normal text-title">
			₹{addCommasToAmountString(totalAmount)}
		</div>
	</div>
	<div class=" rounded bg-tint12-secondary p-2">
		<div class="mb-1 text-sm font-medium text-body">Note:</div>
		<ul>
			{#each autopayNotes as item, index (index)}
				<div class="flex items-end">
					<li class="mb-1 ml-4 list-disc text-xs font-normal text-body" style="line-height: 20px;">
						{item.detail}
						<span class="relative ml-1 mr-2 pb-2 sm:pb-[6px]" style="vertical-align: middle;">
							{#if item?.icon}
								<WMSIcon
									width={12}
									height={12}
									name="info-in-circle-dark"
									class="absolute left-1 top-0 cursor-default"
									on:click={toggleAutopayLimitmodal}
								/>
							{/if}
						</span>
					</li>
				</div>
			{/each}
		</ul>
	</div>
</Card>

{#if showAutopayLimitModal}
	<ModalWithAnimation closeModal={toggleAutopayLimitmodal} isModalOpen>
		<div
			class="w-screen justify-between rounded-b-none rounded-t-2xl bg-background-alt p-4 text-left md:w-120 md:rounded-lg md:px-4"
		>
			<div class="pb-6 pt-2 text-lg font-medium text-title">Autopay Limit</div>

			<div class="text-sm font-normal text-body">
				<p>
					The maximum amount that can be deducted from your bank account on a single day for your
					SIP payments is the <span class="font-medium">maximum autopay limit.</span>
				</p>
				<div class="mt-4">
					Please Note:
					{#each autopayLimitModalNotes as notes, index (index)}
						<div class="ml-2 flex items-start">
							<span class="mt-2 min-w-fit"><DotIcon /></span>
							<span class="ml-2.5">{notes?.detail}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</ModalWithAnimation>
{/if}
