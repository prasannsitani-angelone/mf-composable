<script lang="ts">
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SchemeLogo from '$components/SchemeLogo.svelte';

	export let items: number;
	export let totalAmount: number;
	export let schemeLogoUrl: string;
</script>

<div class="flex flex-col rounded border border-grey-line bg-white p-3">
	<div class="mb-2 text-base font-medium text-black-key">Order Status</div>
	<div class="font-sm mb-2 flex flex-row items-center justify-between font-normal text-black-title">
		<section class="flex items-center">
			<div class="flex flex-row">
				<SchemeLogo class="!mr-0" size="sm" src={schemeLogoUrl} alt="scheme logo" />
				{#if items > 1}
					<div
						class="relative left-[-16px] -mr-4 flex h-12 w-12 items-center justify-center rounded-full border border-grey-line bg-white text-base"
					>
						+ {items - 1}
					</div>
				{/if}
			</div>
			<div class="ml-2 text-base">{items} {items > 1 ? 'Orders' : 'Order'} Placed</div>
		</section>
		<section class="flex flex-col items-end justify-center text-sm font-normal text-black-title">
			<div class="text-[11px] font-normal text-black-bolder">Amount</div>
			<div class="text-sm font-normal text-black-key">
				₹{addCommasToAmountString(totalAmount?.toString())}
			</div>
		</section>
	</div>
</div>
