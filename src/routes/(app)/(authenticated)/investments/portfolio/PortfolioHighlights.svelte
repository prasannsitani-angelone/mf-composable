<script lang="ts">
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	import PlusIcon from '$lib/images/icons/PlusIcon.svelte';
	import EqualIcon from '$lib/images/icons/EqualIcon.svelte';
	import GraphUpIcon from '$lib/images/icons/GraphUpIcon.svelte';
	import GraphDownIcon from '$lib/images/icons/GraphDownIcon.svelte';
	import type { FolioSummaryTypes } from '$lib/types/IInvestments';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	export let data: FolioSummaryTypes;
	export let isPartialImport: boolean;
</script>

<article class="flex items-center justify-between rounded lg:border">
	<section
		class="flex flex-1 flex-col items-start justify-center py-3 pt-2 lg:items-center lg:border-r lg:pt-3"
	>
		<div class="text-xs font-medium text-grey-body">Total Invested</div>
		<div class="text-base font-medium text-black-title">
			₹{!Number.isNaN(Math.abs(data?.investedValue))
				? addCommasToAmountString(Math.abs(data?.investedValue)?.toFixed(2))
				: ''}
		</div>
	</section>

	<span class="-ml-[22px] hidden w-0 lg:block">
		<PlusIcon class="verticalLine relative" />
	</span>

	<!-- Line Separator (mobile layout) -->
	<div class="ml-11 block h-9 border-r md:hidden" />

	<section
		class="ml-10 hidden flex-1 flex-col items-end justify-center py-3 lg:flex lg:items-center"
	>
		<div class="text-xs font-medium text-grey-body">
			{#if isPartialImport}
				<WMSIcon name="polygon-red-warning" class="inline-block" width={12} height={12} />
			{/if}
			<span>Total Returns</span>
		</div>
		<div class="text-base font-medium text-black-title">
			{#if isPartialImport}
				<span class="mr-1">- -</span>
			{:else}
				<span class="mr-1">
					{data?.returnsValue < 0 ? '-' : ''}₹{!Number.isNaN(Math.abs(data?.returnsValue))
						? addCommasToAmountString(Math.abs(data?.returnsValue)?.toFixed(2))
						: ''}
				</span>
				<span
					class={`text-xs ${
						data?.returnsValue > 0
							? 'text-green-buy'
							: data?.returnsValue < 0
							? 'text-red-sell'
							: ''
					}`}
				>
					{data?.returnsAbsolutePer > 0 ? '+' : ''}{data?.returnsAbsolutePer?.toFixed(2)}%
				</span>
			{/if}
		</div>
	</section>

	<section
		class="ml-10 flex flex-1 flex-col items-end justify-center py-3 pt-2 lg:hidden lg:items-center lg:pt-3"
	>
		<div class="text-xs font-medium text-grey-body">
			{#if isPartialImport}
				<WMSIcon name="polygon-red-warning" class="inline-block" width={12} height={12} />
			{/if}
			<span>Current Value</span>
		</div>

		<div class="text-base font-medium text-black-title">
			{#if isPartialImport}
				<span class="mr-1">- -</span>
			{:else}
				<span class="mr-1">
					{data?.currentValue < 0 ? '-' : ''}₹{!Number.isNaN(Math.abs(data?.currentValue))
						? addCommasToAmountString(Math.abs(data?.currentValue)?.toFixed(2))
						: ''}
				</span>
			{/if}
		</div>
	</section>

	<span class="mr-5 hidden w-0 lg:block">
		<EqualIcon class="verticalLine relative" />
	</span>

	<section class="hidden flex-1 flex-col items-center justify-center border-l py-3 lg:flex">
		<div class="text-xs font-medium text-grey-body">
			{#if isPartialImport}
				<WMSIcon name="polygon-red-warning" class="inline-block" width={12} height={12} />
			{/if}
			<span>Current Value</span>
		</div>
		<div class="text-base font-medium text-black-title">
			{#if isPartialImport}
				<span class="mr-1">- -</span>
			{:else}
				₹{!Number.isNaN(Math.abs(data?.currentValue))
					? addCommasToAmountString(Math.abs(data?.currentValue)?.toFixed(2))
					: ''}
			{/if}
		</div>
	</section>
</article>
{#if !isPartialImport}
	<article class="lg:hidden">
		<section class="my-1 flex items-center justify-center rounded border py-1">
			<div class="mr-1 -mb-1 flex items-center text-xs font-medium text-grey-body">
				{#if data?.returnsValue >= 0}
					<GraphUpIcon class="mr-1" />
				{:else}
					<GraphDownIcon class="mr-1" />
				{/if}
				<span> Returns </span>
			</div>
			<div class="text-base font-medium text-black-title">
				<span class="mr-1">
					{data?.returnsValue < 0 ? '-' : ''}₹{!Number.isNaN(Math.abs(data?.returnsValue))
						? addCommasToAmountString(Math.abs(data?.returnsValue)?.toFixed(2))
						: ''}
				</span>
				<span
					class={`text-xs ${
						data?.returnsValue > 0
							? 'text-green-buy'
							: data?.returnsValue < 0
							? 'text-red-sell'
							: ''
					}`}
				>
					({data?.returnsAbsolutePer > 0 ? '+' : ''}{data?.returnsAbsolutePer?.toFixed(2)}%)
				</span>
			</div>
		</section>
	</article>
{/if}

<style>
	.verticalLine::after {
		content: '';
		position: absolute;
		z-index: -1;
		left: 50%;
		transform: translate(-50%);
	}
</style>
