<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import { calculateSipReturns } from '$lib/utils/helpers/returns';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { roundDownToNearestHundred } from '$lib/utils/helpers/formatAmount';

	export let investedAmount: number;
	export let threeYearReturns: number;
	export let textClass = '';
	export let amountClass = '';
	export let roundDownToNearestHundredRequired = false;

	const dispatch = createEventDispatcher();

	$: threeYearReturnsValue =
		Math.round(calculateSipReturns(investedAmount, 3, threeYearReturns)?.matuarityAmount * 100) /
		100;
	$: if (roundDownToNearestHundredRequired) {
		threeYearReturnsValue = roundDownToNearestHundred(threeYearReturnsValue);
	}
	$: dispatch('threeYearReturnsValue', threeYearReturnsValue);

	let showthreeYearReturnsInfoModal = false;

	const toggleShowthreeYearReturnsInfoModal = () => {
		showthreeYearReturnsInfoModal = !showthreeYearReturnsInfoModal;
	};

	onMount(() => {
		dispatch('threeYearReturnsValue', threeYearReturnsValue);
	});
</script>

{#if threeYearReturns > 0}
	<section class="border-b px-4 py-3 {$$props?.class}">
		<article class="flex items-center">
			<WMSIcon width={10} height={13} name="green-uparrow-trending-fund" />
			<div class="ml-1 text-sm font-normal text-body {textClass}">
				<span class="font-bold text-buy {amountClass}"
					><AmountText amount={threeYearReturnsValue} /></span
				>
				<slot name="supporting-text">
					in 3Y at {threeYearReturns?.toFixed(2)}% return
				</slot>
			</div>
			<slot name="info-icon">
				<WMSIcon
					width={12}
					height={12}
					name="info-in-circle-dark"
					stroke="var(--TITLE)"
					class="ml-1 mt-0.5 cursor-default lg:cursor-pointer"
					on:click={toggleShowthreeYearReturnsInfoModal}
				/>
			</slot>
		</article>
	</section>
{/if}

{#if showthreeYearReturnsInfoModal}
	<InfoModal
		showModal={showthreeYearReturnsInfoModal}
		heading="Current Value"
		detailText={'Current value if you had invested ₹500 monthly for the last 3 years'}
		on:crossClicked={toggleShowthreeYearReturnsInfoModal}
	>
		<svelte:fragment slot="headingDetails">
			<span class="text-lg font-normal text-title lg:text-xl"> Current Value </span>
		</svelte:fragment>

		<svelte:fragment slot="crossIconSlot">
			<span />
		</svelte:fragment>

		<svelte:fragment slot="bodySection">
			<section class="px-4 pb-12 pt-0 text-sm md:px-8 md:pt-6">
				<article>
					<p class="font-normal text-body">
						Current value if you had invested <AmountText amount={investedAmount} /> monthly for the
						last 3 years
					</p>

					<div class="mt-4 text-[28px] font-bold text-buy">
						<AmountText amount={threeYearReturnsValue} />
					</div>
				</article>
			</section>
		</svelte:fragment>
	</InfoModal>
{/if}
