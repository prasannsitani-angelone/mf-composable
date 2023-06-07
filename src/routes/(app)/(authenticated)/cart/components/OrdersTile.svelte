<script lang="ts">
	import Button from '$components/Button.svelte';
	import { formatAmount } from '$lib/utils/helpers/formatAmount';

	export let items: number;
	export let totalAmount: number;
	export let onClick: () => void = () => undefined;
</script>

<div class="flex flex-col rounded border border-grey-line bg-white px-4 py-3 shadow-csm sm:py-6">
	<div class="font-sm mb-2 font-medium text-black-title">
		{items} Orders Placed
	</div>
	<div class="flex w-full flex-col bg-grey px-4 py-2 sm:px-6 sm:py-4">
		<div class="mb-1 text-sm font-medium text-grey-body">Amount</div>
		<div class="text-base font-medium text-black-title">
			₹{formatAmount(totalAmount?.toString())}
		</div>
	</div>
	<Button variant="transparent" class="mt-2 h-max w-max self-end" {onClick}>
		VIEW ORDER DETAILS
	</Button>
</div>
