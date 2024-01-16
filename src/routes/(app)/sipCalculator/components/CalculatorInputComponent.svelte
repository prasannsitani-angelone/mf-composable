<script lang="ts">
	import InvestmentTypeRadioSelection from '$components/ReturnEstimator/InvestmentTypeRadioSelection.svelte';
	import AmountText from '$components/AmountText.svelte';
	import Slider from '@bulatdashiev/svelte-slider';

	export let selectedInvestmentType: string;
	export let MinAmountSlider = 0;
	export let MaxAmountSlider = 0;
	export let steps = 0;
	export let amountSlider = [0];
	export let MinRoiSlider = 0;
	export let MaxRoiSlider = 0;
	export let roiSlider = [0];
</script>

<section class={$$props.class}>
	<InvestmentTypeRadioSelection class="mb-6" bind:selectedInvestmentType on:investmentTypeChange>
		<div
			slot="sipLabel"
			class="text-center text-sm font-normal leading-none tracking-tight text-black-key"
		>
			Invest Monthly (SIP)
		</div>
		<div
			slot="oneTimeLabel"
			class="text-center text-sm font-normal leading-none tracking-tight text-black-key"
		>
			Invest One Time
		</div>
	</InvestmentTypeRadioSelection>

	<div class="mb-6">
		<div class="mb-3 flex justify-between">
			<span
				class="flex items-center justify-center text-xs font-normal text-black-title md:text-sm md:font-normal md:text-grey-body"
			>
				{selectedInvestmentType === 'SIP' ? 'Monthly Investment' : 'Total Investment '}
			</span>

			<div class="min-w-[90px] items-center justify-end gap-2.5 rounded bg-grey px-2 py-1">
				<div class="text-right text-base font-medium text-black-key">
					<AmountText amount={amountSlider[0]} />
				</div>
			</div>
		</div>
		<div class="slider">
			<Slider
				bind:value={amountSlider}
				class="h-[60px]"
				min={MinAmountSlider}
				max={MaxAmountSlider}
				step={steps}
			>
				<div class="h-5 w-5 rounded-full bg-blue-primary" />
			</Slider>
		</div>
	</div>

	<div class="mb-6">
		<div class="mb-5 flex justify-between">
			<span
				class="flex items-center justify-center text-xs font-normal text-black-title md:text-sm md:font-normal md:text-grey-body"
			>
				Expected Returns % (p.a.)
			</span>
			<div class="flex flex-row items-center">
				{#if roiSlider[0] <= 10}
					<div class="mr-2 inline-flex w-fit rounded bg-[#E0F2EE] px-2 py-1">
						<div class="text-[10px] font-normal text-green-card">Low Risk</div>
					</div>
				{:else if roiSlider[0] <= 15}
					<div class="mr-2 inline-flex w-fit rounded bg-yellow-background px-2 py-1">
						<div class="text-[10px] font-normal text-yellow-primary">Moderate Risk</div>
					</div>
				{:else}
					<div class="mr-2 inline-flex w-fit rounded bg-red-light px-2 py-1">
						<div class=" text-[10px] font-normal text-red-errorDark">High Risk</div>
					</div>
				{/if}
				<div class="min-w-[45px] rounded bg-grey px-2 py-1">
					<div class="text-right text-base font-medium text-black-key">
						{roiSlider[0]}%
					</div>
				</div>
			</div>
		</div>
		<div class="slider mb-6">
			<Slider
				class="h-[60px]"
				bind:value={roiSlider}
				min={MinRoiSlider}
				max={MaxRoiSlider}
				step={1}
			>
				<div class="h-5 w-5 rounded-full bg-blue-primary" />
			</Slider>
		</div>
	</div>
</section>

<style>
	.slider {
		--progress-bg: #3f5bd9;
		--track-bg: #e8ebfa;
	}
</style>
