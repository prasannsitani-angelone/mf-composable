<script lang="ts">
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SchemeLogo from '$components/SchemeLogo.svelte';

	export let items = 1;
	export let isCart = false;
	export let title = '';
	export let totalAmount: number;
	export let schemeLogoUrl: string;
</script>

<div class="mt-3 flex flex-col rounded border bg-background-alt p-3">
	<div class="mb-2 text-base font-medium text-title">Order Details</div>
	<div class="font-sm mb-2 flex flex-row items-center justify-between font-normal text-title">
		<section class="flex items-center">
			<div class="flex flex-row">
				<SchemeLogo class="!mr-0" size="sm" src={schemeLogoUrl} alt="scheme logo" />
				{#if isCart && items > 1}
					<div
						class="relative left-[-16px] -mr-4 flex h-12 w-12 items-center justify-center rounded-full border bg-background-alt text-base"
					>
						+ {items - 1}
					</div>
				{/if}
			</div>
			{#if isCart}
				<div class="ml-2 text-base">{items} {items > 1 ? 'Orders' : 'Order'} Placed</div>
			{:else}
				<div class="ml-2 text-base">{title}</div>
			{/if}
		</section>
		<section class="flex flex-col items-end justify-center text-sm font-normal text-title">
			<div class="text-[11px] font-normal text-body">Amount</div>
			<div class="text-sm font-normal text-title">
				₹{addCommasToAmountString(totalAmount?.toString())}
			</div>
		</section>
	</div>
</div>
