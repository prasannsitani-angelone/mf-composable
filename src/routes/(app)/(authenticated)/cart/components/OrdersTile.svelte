<script lang="ts">
	import Button from '$components/Button.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	export let items: number;
	export let totalAmount: number;
	export let onClick: () => void = () => undefined;
	export let schemeLogoUrl: string;
</script>

<div class="flex flex-col rounded border border-grey-line bg-white px-4 py-3 shadow-csm sm:py-6">
	<div class="font-sm mb-2 flex flex-row items-center font-medium text-black-title">
		<div class="flex max-w-[56px] flex-row">
			<div
				class="flex h-9 w-9 min-w-[36px] flex-row items-center justify-center rounded-full border border-grey-line bg-white shadow-csm"
			>
				<img src={schemeLogoUrl} alt="scheme logo" />
			</div>
			{#if items > 1}
				<div
					class="relative left-[-16px] flex h-9 w-9 min-w-[36px] flex-row items-center justify-center rounded-full border border-grey-line bg-white text-xs shadow-csm"
				>
					+ {items - 1}
				</div>
			{/if}
		</div>
		<div class="ml-2">{items} {items > 1 ? 'Orders' : 'Order'} Placed</div>
	</div>
	<div class="flex w-full flex-col bg-grey px-4 py-2 sm:px-6 sm:py-4">
		<div class="mb-1 text-sm font-medium text-grey-body">Amount</div>
		<div class="text-base font-medium text-black-title">
			₹{addCommasToAmountString(totalAmount?.toString())}
		</div>
	</div>
	<Button variant="transparent" class="mt-2 h-max w-max self-end" {onClick}>
		VIEW ORDER DETAILS
	</Button>
</div>
