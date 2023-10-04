<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import UnitsAllocatedIcon from '$lib/images/icons/UnitsAllocatedIcon.svelte';
	import CurrentNavIcon from '$lib/images/icons/CurrentNavIcon.svelte';
	import AverageNavIcon from '$lib/images/icons/AverageNavIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	import type { FolioHoldingType } from '$lib/types/IInvestments';
	export let data: FolioHoldingType;
	export let isPartialImport: boolean;
</script>

<section
	class="
             p-4
            text-lg md:px-6 md:py-5"
>
	<section class="hidden sm:block">
		<h4 class="text-left font-normal">
			<span class="text-lg text-black-title">Folio Summary</span>
		</h4>
	</section>
	<section class="flex items-center justify-between py-1 max-sm:flex-wrap md:mt-5 md:py-0">
		<article
			class="mr-3 flex flex-1 items-center justify-center rounded bg-grey px-4 py-3 md:justify-start"
		>
			<UnitsAllocatedIcon class="mr-2" />
			<div class="flex flex-col">
				<span class="text-xs font-normal text-black-title/70"> Units </span>
				<span class="text-sm font-normal text-black-title">
					{data?.totalUnitsAllocated?.toFixed(3)}
				</span>
			</div>
		</article>
		<article
			class="flex flex-1 items-center justify-center rounded bg-grey px-4 py-3 md:justify-start"
		>
			<CurrentNavIcon class="mr-2" />
			<div class="flex flex-col">
				<span class="text-xs font-normal text-black-title/70">
					{#if isPartialImport}
						<WMSIcon name="polygon-red-warning" class="inline-block" width={12} height={12} />
					{/if}
					<span>Current Nav</span>
				</span>
				<span class="text-sm font-normal text-black-title">
					{#if isPartialImport}
						- -
					{:else}
						₹{addCommasToAmountString(data?.currentNav?.toFixed(2))}
					{/if}
				</span>
			</div>
		</article>
		<article
			class="ml-3 hidden flex-1 items-center justify-center rounded bg-grey px-4 py-3 md:justify-start lg:flex"
		>
			<AverageNavIcon class="mr-2" />
			<div class="flex flex-col">
				<span class="text-xs font-normal text-black-title/70">
					<span>Average NAV</span>
				</span>
				{#if data?.investedValue && data?.totalUnitsAllocated}
					<span class="text-sm font-normal text-black-title">
						₹{addCommasToAmountString((data?.investedValue / data.totalUnitsAllocated)?.toFixed(2))}
					</span>
				{:else}
					<span class="text-sm font-normal text-black-title"> -- </span>
				{/if}
			</div>
		</article>
		<article
			class="ml-3 hidden flex-1 items-center justify-center rounded bg-grey px-4 py-3 md:justify-start lg:flex"
		>
			<WMSIcon width={35} height={35} class="mr-2" name="percentage-in-circle" />
			<div class="flex flex-col">
				<span class="text-xs font-normal text-black-title/70">
					{#if isPartialImport}
						<WMSIcon name="polygon-red-warning" class="inline-block" width={12} height={12} />
					{/if}
					<span>Returns</span>
				</span>
				<span class="text-sm font-normal text-black-title">
					{#if isPartialImport}
						- -
					{:else}
						₹{addCommasToAmountString(data?.returnsAbsolutePer?.toFixed(2))}%
					{/if}
				</span>
			</div>
		</article>
		<article class="w-full pt-5 sm:hidden">
			<div class="flex justify-between">
				<span class="text-sm font-normal text-grey-body">
					<span>Your average NAV</span>
				</span>
				{#if data?.investedValue && data?.totalUnitsAllocated}
					<span class="text-sm font-normal text-black-title">
						₹{addCommasToAmountString((data?.investedValue / data.totalUnitsAllocated)?.toFixed(2))}
					</span>
				{:else}
					<span class="text-sm font-normal text-black-title"> -- </span>
				{/if}
			</div>
		</article>
	</section>
</section>
