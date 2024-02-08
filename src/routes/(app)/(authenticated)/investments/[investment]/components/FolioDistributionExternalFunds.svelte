<script lang="ts">
	import type { DistributorListEntity } from '$lib/types/IInvestments';
	export let distributorList: DistributorListEntity[];
</script>

<section class="border-t p-4 md:px-6 md:py-5">
	<ul>
		{#each distributorList as eachItem}
			<li class="grid grid-cols-2 gap-y-px pb-3 last:pb-0">
				<div class=" col-span-1 col-start-1 row-span-1 row-start-1 text-sm font-normal text-body">
					Distributor
				</div>
				<div class=" col-span-1 col-start-1 row-span-1 row-start-2 text-xs font-normal text-body">
					Folio Number
				</div>
				<div
					class=" col-span-1 col-start-2 row-span-1 row-start-1 text-right text-sm font-normal text-title"
				>
					{eachItem.distributor}
				</div>
				<div
					class=" col-span-1 col-start-2 row-span-1 row-start-2 text-right text-xs font-normal text-body"
				>
					{eachItem.folio}
				</div>
			</li>
		{/each}
	</ul>
</section>
