<script lang="ts">
	import LinearChart from '$components/Charts/LinearChart.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
	import type { LinearChartInput } from '$lib/types/IChart';
	import { WMSIcon } from 'svelte-components';

	export let portfolioPack: PortfolioPack;
	export let showWeightage = false;
	export let showAmount = false;
	export let amount = 0;
	let colors = ['#B99AE6', '#FACE80', '#E3A0A4', '#80E0EA'];
	let linearChartInput: LinearChartInput[] = [];
	portfolioPack.schemes.forEach((x, i) => {
		linearChartInput.push({ name: x.isin, color: colors[i], weightage: x.wieightPercentage });
	});
</script>

<section>
	<div class="pb-3">Portfolio Allocation</div>
	{#if showWeightage}
		<LinearChart chartInput={linearChartInput}>
			<svelte:fragment slot="weightage" let:inputVar>
				<div class="flex items-center justify-center pt-2 text-center text-sm">
					<WMSIcon name="eclipse" width={8} height={8} stroke={inputVar.color} />
					<div class="pl-2">{inputVar.weightage}%</div>
				</div>
			</svelte:fragment>
		</LinearChart>
	{:else}
		<div class="pb-3 text-xs text-black-bolder">No. of SIPs - 4</div>
	{/if}
	<div class="flex justify-between border-b pb-2 text-[11px] text-grey-body">
		<p>Fund</p>
		<p>{showWeightage ? 'Weightage (%)' : 'Amount'}</p>
	</div>
	{#each portfolioPack.schemes as scheme}
		<div class="mt-2 flex items-start justify-between py-2 text-black-key">
			<div class="flex">
				<SchemeLogo size="xs2" src={scheme.logoUrl} alt={scheme.schemeName} />
				<div class="flex flex-col self-center text-xs font-normal">
					<p>{scheme.schemeName}</p>
					<p class="text-grey-body">3Y Returns: {scheme.returns3yr}%</p>
				</div>
			</div>
			<div class="flex items-start text-sm font-medium">
				{#if showWeightage}
					<div class="flex items-center pl-8">
						{scheme.wieightPercentage}
						<WMSIcon class="pl-2" name="right-arrow" stroke="#3F5BD9" />
					</div>
				{:else if showAmount}
					{(scheme.wieightPercentage * amount) / 100}
				{/if}
			</div>
		</div>
	{/each}
	<!-- <CueCardCarouselComponent
        bind:isModalOpen={showFundDetailCarousel}
        carouselItems={fundDetailsCarouselItems}
        on:cueCardLoad={handleCueCardLoad}
        on:cueCardClose={handleCueCardClose}
    /> -->
</section>
