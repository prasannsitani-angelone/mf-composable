<script lang="ts">
	import PendingIcon from '$lib/images/icons/PendingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import StatusChip from '$lib/components/StatusChip.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { getDateDiffInDays, getDateTimeString } from '$lib/utils/helpers/date';
	let scheme: any = {};
	export { scheme };
</script>

<div class="mt-2 flex flex-col bg-white px-2 py-4">
	<div class="flex items-center justify-between">
		<div>
			<h5 class="text-black-title">{scheme.schemeName}</h5>
			<span class="text-xs text-grey-body">Closes on</span>
			<span class="text-xs text-black-title">{getDateTimeString(scheme.biddingEndDate)}</span>
		</div>
		<a href="/goldBonds/investment"><Button>Invest</Button></a>
	</div>
	<div class="mt-3 flex items-center justify-between">
		<div>
			<span class="text-xs text-grey-body">Price per gram</span>
			<h4 class="text-black-title">₹{addCommasToAmountString(scheme?.minPrice?.toString())}</h4>
		</div>
		<div class="text-right">
			<span class="text-xs text-grey-body">Maturity on</span>
			<h4 class="text-black-title">June 24, 2016</h4>
		</div>
	</div>
	<StatusChip
		icon={PendingIcon}
		message={`Application closes in ${getDateDiffInDays(new Date(scheme.biddingEndDate))} days`}
	/>
</div>
