<script lang="ts">
	import { addCommasToAmountString, WMSIcon } from 'svelte-components';
	import LineDashedIcon from '$lib/images/icons/LineDashedIcon.svelte';
	import type { IReturnsProjectedGraphDataTypes } from '$lib/types/ISipType';

	export let graphData: IReturnsProjectedGraphDataTypes;
	export let tooltipData: string[];
</script>

<section class="relative flex items-end justify-center text-xs font-normal">
	{#each graphData as bar, index (index)}
		<article class="flex flex-col items-center justify-center {index > 0 ? 'ml-10' : ''}">
			<div
				class="mb-1.5 text-sm font-medium {bar?.type !== 'INSTALMENT_AMOUNT'
					? 'text-green-amount'
					: 'text-black-bolder'}"
			>
				<div class="text-center">₹{addCommasToAmountString(bar?.amount?.toFixed(0))}</div>
				{#if bar?.type !== 'INSTALMENT_AMOUNT'}
					<div class="text-center">(+{bar?.returnPercentage?.toFixed(0)}%)</div>
				{/if}
			</div>
			<div
				class="w-10 h-{bar?.barHeight} {bar?.type !== 'INSTALMENT_AMOUNT'
					? 'bg-green-amount'
					: 'bg-black-bolder'} rounded-t"
			/>
			<div class="h-[1px] w-fit bg-grey-line pt-[1px]" />
			<article class="mt-2 font-normal text-black-bolder">
				<div class="text-center">{bar?.xAxisTitle1}</div>
			</article>
		</article>
	{/each}

	<article class="absolute left-auto top-1 mr-28">
		<div class="flex items-center">
			<div class="text-[11px] font-normal text-black-bolder">
				<div>Projected value</div>
			</div>
			<div class="ml-3">
				<LineDashedIcon />
			</div>
		</div>
		<div class="text-[11px] font-normal text-black-bolder">if you do not cancel</div>
	</article>

	{#if tooltipData?.length}
		<div class="group absolute bottom-0 left-auto ml-72">
			<div class="flex items-center justify-center text-white group-hover:text-gray-300">
				<WMSIcon width={16} height={16} name="info-in-circle-dark" />
			</div>
			<div
				class="absolute z-10 -ml-[214px] mt-1 hidden transform rounded bg-black-title text-sm text-white shadow-lg group-hover:block"
			>
				<div class="absolute -top-1 right-3 -translate-x-0.5 transform">
					<div class="h-2 w-2 rotate-45 transform bg-black-title" />
				</div>
				<div class="relative w-60 px-4 py-3 text-xs font-normal">
					{#each tooltipData as tip, index (index)}
						<div>
							{tip}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</section>
