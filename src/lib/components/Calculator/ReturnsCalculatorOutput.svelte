<script lang="ts">
	import AmountText from '$lib/components/AmountText.svelte';
	import CalenderIcon from '$lib/images/icons/CalenderIcon.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';

	export let outputData: CalculatedValue = {};
	export let isStandAlone = false;

	$: capitalGainSlider = ((outputData.capitalGain || 0) / (outputData.matuarityAmount || 1)) * 100;
</script>

<section class={$$props.class || ''}>
	<div
		class="mb-8 flex h-9 justify-center rounded bg-background align-middle font-normal text-body"
	>
		<span class="flex items-center gap-1 text-xs leading-9 md:text-sm">
			<WMSIcon name="rupee-circle-blue" height={14} width={14} />

			<span> When you invest </span>
			<span class="font-bold text-title"
				><AmountText amount={outputData?.investedAmount || 0} />
			</span>
			{#if outputData?.currentCalculatorMode === 'SIP'}
				<span> monthly for </span>
			{:else}
				<span>and hold it for</span>
			{/if}
			<span class="font-bold text-title">{outputData?.selectedYear} year<span>s</span></span></span
		>
	</div>
	<div class="rounded {!isStandAlone ? 'border p-4' : ''}">
		<div class="pb-5">
			<div class="mb-3 flex justify-between text-sm font-normal text-body">
				<div>
					<p>Your Investment</p>
					<p class="text-xl text-title">
						<AmountText amount={outputData?.totalInvestment || 0} />
					</p>
				</div>
				<div>
					<p class="text-right">Gain</p>
					<div class="flex items-center justify-center">
						<p class="text-buy">{outputData?.gainLossPercentage?.toFixed(2)}%</p>
						<p class="ml-1 text-xl text-title">
							<AmountText amount={outputData?.capitalGain || 0} />
						</p>
					</div>
				</div>
			</div>

			<div class="slider-disabled">
				<div class="flex h-2.5 w-full flex-row-reverse rounded-full bg-border">
					<div class="h-2.5 rounded-r-full bg-buy" style={`width: ${capitalGainSlider}%`} />
				</div>
			</div>
		</div>

		<div class="bg-buy/[0.12] flex justify-center py-3">
			{#if (outputData?.matuarityAmount || 0) > 0}
				<WMSIcon name="sparkles" />
			{/if}
			<div
				class="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-buy sm:h-12 sm:w-12"
			>
				<CalenderIcon />
			</div>
			<div>
				<div class="text-sm font-normal text-body">Total Value</div>
				<div class="text-2xl font-normal text-title">
					<AmountText amount={outputData?.matuarityAmount || 0} />
				</div>
			</div>
			{#if (outputData?.matuarityAmount || 0) > 0}
				<WMSIcon name="sparkles" />
			{/if}
		</div>
	</div>
</section>
