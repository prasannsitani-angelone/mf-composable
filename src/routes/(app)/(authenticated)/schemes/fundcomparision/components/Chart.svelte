<script lang="ts">
	import Button from '$components/Button.svelte';
	import LineChart from '$components/Charts/LineChart.svelte';

	export let lineData;
	export let lineChartOptions;
	export let tags = [];
	export let selectedTag: number;
	export let onTagClick: (param: number) => undefined;
</script>

<div class="bg-background-alt px-2 py-3 sm:p-6">
	<LineChart
		data={lineData}
		chartOptions={lineChartOptions}
		chartClass="w-full h-64 relative"
		tooltipSymbol="₹"
	/>
	<article class="mt-6 flex justify-center">
		<section class="flex w-auto flex-row gap-2 bg-background-alt sm:gap-4">
			{#each tags as tag, index}
				{#if tag.returnPeriod}
					<Button
						variant="outlined"
						size="xs"
						class={` noselect flex h-5 !w-9 cursor-pointer flex-row items-center justify-center rounded-sm border bg-background-alt  p-0 py-[2px] text-xs font-medium active:opacity-70 sm:h-6 sm:w-11 sm:text-sm sm:font-normal ${
							selectedTag === index ? '!border-primary !text-primary' : '!text-body '
						}`}
						onClick={() => onTagClick(index)}
					>
						{tag.label}
					</Button>
				{/if}
			{/each}
		</section>
	</article>
</div>
