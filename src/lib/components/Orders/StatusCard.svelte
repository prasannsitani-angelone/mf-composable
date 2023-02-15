<script lang="ts">
	import ClosedFolderIcon from '$lib/images/icons/ClosedFolderIcon.svelte';
	import FailureCrossIcon from '$lib/images/icons/FailureCrossIcon.svelte';
	import TickInStarIcon from '$lib/images/icons/TickInStarIcon.svelte';
	import StatusChip from '$lib/components/StatusChip.svelte';
	import OrderSummary from '../OrderSummary.svelte';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	export let order: any;
</script>

<div class="mt-2 flex flex-col bg-white px-2 py-4">
	<div class="flex items-center justify-between">
		<h5 class="text-black-title">SGB Series 3 - 2022</h5>
		<div class="flex items-center">
			<ClosedFolderIcon />
			<span class="ml-1 text-xs text-blue-primary">24</span>
		</div>
	</div>
	<OrderSummary
		investmentAmt="5000"
		issuePrice="5000"
		appliedDate={getDateTimeString(order.createdAt, 'DATE', true)}
	/>
	<StatusChip icon={FailureCrossIcon} message="This application was rejected" />
	<StatusChip
		icon={TickInStarIcon}
		class="bg-green-buy bg-opacity-12"
		message="Allotment expected by 5 Nov 2022"
	/>
	<StatusChip
		icon={TickInStarIcon}
		class="bg-green-buy bg-opacity-12"
		message="Allotted on 5 Apr 2020"
	/>
</div>
