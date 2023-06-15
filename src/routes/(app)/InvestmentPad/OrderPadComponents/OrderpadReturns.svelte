<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import { calculateSipReturns } from '$lib/utils/helpers/returns';
	import { WMSIcon } from 'wms-ui-component';

	export let investedAmount: number;
	export let threeYearReturns: number;

	$: threeYearReturnsValue =
		Math.round(calculateSipReturns(investedAmount, 3, threeYearReturns)?.matuarityAmount * 100) /
		100;

	let showthreeYearReturnsInfoModal = false;

	const toggleShowthreeYearReturnsInfoModal = () => {
		showthreeYearReturnsInfoModal = !showthreeYearReturnsInfoModal;
	};
</script>

{#if threeYearReturns > 0}
	<section class="border-b py-3 px-4 {$$props?.class}">
		<article class="flex items-center">
			<WMSIcon width={10} height={13} name="green-uparrow-trending-fund" />
			<div class="ml-1 text-sm font-normal text-grey-body">
				<span class="font-bold text-green-teal"><AmountText amount={threeYearReturnsValue} /></span>
				in 3Y at {threeYearReturns?.toFixed(2)}% return
			</div>
			<WMSIcon
				width={12}
				height={12}
				name="info-in-circle-dark"
				class="ml-1 mt-0.5 cursor-default lg:cursor-pointer"
				on:click={toggleShowthreeYearReturnsInfoModal}
			/>
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
			<span class="text-lg font-medium text-black-key lg:text-xl"> Current Value </span>
		</svelte:fragment>

		<svelte:fragment slot="crossIconSlot">
			<span />
		</svelte:fragment>

		<svelte:fragment slot="bodySection">
			<section class="px-4 pt-0 pb-12 text-sm md:px-8 md:pt-6">
				<article>
					<p class="font-normal text-black-bolder">
						Current value if you had invested <AmountText amount={investedAmount} /> monthly for the
						last 3 years
					</p>

					<div class="mt-4 text-[28px] font-bold text-green-teal">
						<AmountText amount={threeYearReturnsValue} />
					</div>
				</article>
			</section>
		</svelte:fragment>
	</InfoModal>
{/if}
