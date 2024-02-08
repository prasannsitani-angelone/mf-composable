<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
	import { WMSIcon } from 'svelte-components';

	export let portfolioPack: PortfolioPack;
	export let showChevron = false;
</script>

<section class="w-full">
	<div class="flex items-center justify-between">
		<div class="flex items-center">
			<SchemeLogo src={portfolioPack.packLogoUrl} />
			<div class="text-xs">
				<p class="text-base font-medium">{portfolioPack.packName}</p>
				<p class="pt-1 text-xs text-body">
					{portfolioPack.description}
				</p>
			</div>
		</div>
		{#if showChevron}
			<div class="pl-8">
				<WMSIcon name="right-arrow" stroke="#3F5BD9" />
			</div>
		{/if}
	</div>
	<div
		class="mt-3 flex w-full flex-row justify-between divide-x divide-[#C7CDEB] rounded bg-[#F1F3FC] px-4 py-2 text-title"
	>
		<div class="flex w-6/12 flex-col items-start">
			<p class="text-xs text-body">Min. SIP Amount</p>
			<p class="text-base font-medium">
				<AmountText amount={portfolioPack.minSipAmount || 0} />
			</p>
		</div>
		<div class="flex w-6/12 flex-col items-end">
			<p class="text-xs text-body">Returns</p>
			<div class="flex flex-row items-center">
				<p class="text-base font-medium">{portfolioPack.threeYrReturnAvgPer.toFixed(2)}% p.a</p>
			</div>
		</div>
	</div>
</section>
