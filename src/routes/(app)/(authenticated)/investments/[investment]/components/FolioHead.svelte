<script lang="ts">
	import UnitsAllocatedIcon from '$lib/images/icons/UnitsAllocatedIcon.svelte';
	import CurrentNavIcon from '$lib/images/icons/CurrentNavIcon.svelte';
	import AverageNavIcon from '$lib/images/icons/AverageNavIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	import type { FolioHoldingType } from '$lib/types/IInvestments';
	export let data: FolioHoldingType;
</script>

<section
	class="
             p-4
            text-lg md:px-6 md:py-5"
>
	<section class="hidden md:block">
		<h4 class="text-left font-normal">
			<span class="text-lg text-title">Folio Summary</span>
		</h4>
	</section>
	<section class="flex items-center justify-between py-1 md:mt-5 md:py-0">
		<article
			class="mr-3 flex flex-1 items-center justify-center rounded bg-background px-4 py-3 md:justify-start"
		>
			<UnitsAllocatedIcon class="mr-2" />
			<div class="flex flex-col">
				<span class="text-xs font-normal text-body"> Units </span>
				<span class="text-sm font-normal text-title">
					{data?.totalUnitsAllocated?.toFixed(3)}
				</span>
			</div>
		</article>
		<article
			class="flex flex-1 items-center justify-center rounded bg-background px-4 py-3 md:justify-start"
		>
			<CurrentNavIcon class="mr-2" />
			<div class="flex flex-col">
				<span class="text-xs font-normal text-body"> Current NAV </span>
				<span class="text-sm font-normal text-title">
					₹{addCommasToAmountString(data?.currentNav?.toFixed(2))}
				</span>
			</div>
		</article>
		<article
			class="ml-3 hidden flex-1 items-center justify-center rounded bg-background px-4 py-3 md:justify-start lg:flex"
		>
			<AverageNavIcon class="mr-2" />
			<div class="flex flex-col">
				<span class="text-xs font-normal text-body"> Your Average NAV </span>
				<span class="text-sm font-normal text-title">
					₹{addCommasToAmountString(data?.averageNav?.toFixed(2))}
				</span>
			</div>
		</article>
	</section>
</section>
