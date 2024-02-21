<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import OldTrendingCarousel from './OldTrendingCarousel.svelte';
	let title = 'Most Bought on Angel One';

	let tableData: Array<WeeklyTopSchemesEntity>;
	let classes = {
		header: '',
		container: ''
	};
	let version: string;

	export { tableData, title, classes, version };
</script>

<section
	class={`bg-backdrop-alt my-2 max-w-4xl rounded-lg bg-background-alt text-sm shadow-csm sm:pb-4 ${classes.container} ${$$props.class}`}
>
	<header class={`flex flex-col px-6 py-3 sm:py-6 ${classes.header}`}>
		<h2 class="text-lg font-medium text-title">{title}</h2>
	</header>
	<OldTrendingCarousel {tableData} {version} />
	<slot name="footer" />
</section>
