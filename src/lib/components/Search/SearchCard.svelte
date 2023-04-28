<script lang="ts">
	import SchemeCard from '$components/SchemeCard.svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';

	export let data: WeeklyTopSchemesEntity;
	export let itemStyle = '';
</script>

<article
	class={`flex p-3 text-xs lg:p-4 ${
		itemStyle ? itemStyle : 'items-center justify-between border-b lg:border-none'
	} ${$$props.class || ''}`}
	on:click
	on:keydown
>
	<SchemeCard class="pr-8" schemes={data} />
	<slot name="returns">
		<section class="text-base font-medium text-black-title sm:text-sm">
			{data?.returns3yr ? data?.returns3yr.toFixed(1) + '%' : '-'}
		</section>
	</slot>
</article>
