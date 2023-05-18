<script>
	import Link from '$lib/components/Link.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import ReportsMobileIcon from '$lib/images/icons/ReportsMobileIcon.svelte';
	import { reportsEntryMobileAnalytics } from '$lib/analytics/reports/reports';
	const onViewReportsClick = () => {
		reportsEntryMobileAnalytics();
	};
</script>

<section class="my-2 mt-3 rounded-lg bg-white px-2 py-2 shadow-csm">
	<Link
		to={`/reports`}
		class="flex flex-row items-center rounded-lg bg-grey p-3"
		on:click={onViewReportsClick}
	>
		<ReportsMobileIcon />
		<div class="ml-2 flex flex-col">
			<p class="text-sm font-medium text-black-title">Reports</p>
			<p class="text-xs font-medium text-grey-body">Tax Filing, Fund Holdings, Transactions</p>
		</div>
		<RightIcon class="ml-auto" />
	</Link>
</section>
