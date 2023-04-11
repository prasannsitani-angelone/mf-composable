<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import TrendingTable from './TrendingTable.svelte';
	import TrendingCarousel from './TrendingCarousel.svelte';
	let title = 'Popular With Other Investors';
	const trendingTable = {
		col: ['Funds', '3Y return', 'Min SIP Invetsments']
	};
	let tableData: Array<WeeklyTopSchemesEntity>;
	let classes = {
		header: '',
		container: ''
	};
	export { tableData, title, classes };
</script>

<section
	class={`mt-2 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm sm:mt-4 ${classes.container}`}
>
	<header class={`flex flex-col p-6 ${classes.header}`}>
		<h2 class="text-lg font-medium text-black-title">{title}</h2>
	</header>
	<TrendingTable {tableData} />
	<TrendingCarousel {tableData} />
	<slot name="footer" />
</section>
