<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import TrendingCarousel from './TrendingCarousel.svelte';
	let title = 'Most Bought SIPs';

	let tableData: Array<WeeklyTopSchemesEntity>;
	let classes = {
		header: '',
		container: '',
		item: ''
	};
	let version: string;

	export { tableData, title, classes, version };
</script>

<section
	class={`my-2 max-w-4xl rounded-lg bg-background-alt text-sm shadow-csm sm:pb-4 ${classes.container} ${$$props.class}`}
>
	<header class={`flex flex-col px-4 py-3 ${classes.header}`}>
		<h2 class="text-base font-medium text-title">{title}</h2>
	</header>
	<TrendingCarousel {tableData} {version} class={classes.item} />
	<slot name="footer" />
</section>
