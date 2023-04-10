<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';

	import Carousel from '$components/Carousel.svelte';
	import TrendingTable from './TrendingTable.svelte';
	import TrendingCarousel from './TrendingCarousel.svelte';

	const trendingTable = {
		col: ['Funds', '3Y return', 'Min SIP Invetsments']
	};
	let tableData: Array<WeeklyTopSchemesEntity>;

	export { tableData };
</script>

<section class="mt-2 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm sm:mt-4">
	<header class="flex flex-col p-6">
		<h2 class="text-lg font-medium text-black-title">Popular With Other Investors</h2>
	</header>
	<TrendingTable {tableData} />
	<TrendingCarousel {tableData} />
</section>
