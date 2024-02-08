<script lang="ts">
	import type { FolioObject } from '$lib/types/IInvestments';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	import WMSIcon from '$lib/components/WMSIcon.svelte';
	let folioList: Array<FolioObject>;
	let selectedFolio: FolioObject;
	let redemableAmount: number;
	let toggleFolioSelection: (flag: boolean) => void;
	export { folioList, selectedFolio, redemableAmount, toggleFolioSelection };
</script>

{#if folioList?.length > 1}
	<section
		class="font-sm mb-4 mt-3 items-center rounded-t-lg bg-background-alt p-4 text-sm shadow-csm"
	>
		<div class="pb-4">Switch Details</div>
		<article class="flex-col items-center rounded-lg bg-background p-3">
			<section class="flex items-center justify-between border-b pb-2">
				<div class="text-sm text-body">Selected Folio</div>
				<button
					class="flex cursor-pointer items-center justify-center text-base text-title"
					on:click={() => toggleFolioSelection(true)}
				>
					<span>
						#{selectedFolio?.folioNumber}
					</span>
					<span class="ml-1 cursor-pointer">
						<WMSIcon height={10} width={9} name="arrow-expand" />
					</span>
				</button>
			</section>
			<section class="flex items-center justify-between pt-2">
				<div class="text-body">Folio Value</div>
				<div class="font-normal text-title">
					₹{addCommasToAmountString((redemableAmount + selectedFolio?.blockedAmount)?.toFixed(2))}
				</div>
			</section>
		</article>
	</section>
{/if}
