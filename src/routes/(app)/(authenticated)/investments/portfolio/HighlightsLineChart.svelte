<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import LineChart from '$lib/components/Charts/LineChart.svelte';
	import Button from '$components/Button.svelte';
	import { lineChartSchema as schema } from './config';
	import { tags } from '$lib/constants/tags';
	import type { Tags } from '$lib/types/ITags';

	let selectionTags: Tags[] = [];
	$: selectionTags = tags.slice(0, 5);

	const dispatch = createEventDispatcher();

	type OnTagSelectionFunction = (months: number) => void;

	export let data: string[];
	export let label: number[];
	export let showGraphTags: boolean;
	export let onTagSelection: OnTagSelectionFunction = () => '';
	export let selectedTag = '6M';
	export let isExternal = false;

	const lineChartOptions = {
		maintainAspectRatio: false,
		elements: {
			point: {
				borderWidth: 6, // make responsive
				pointRadius: 10, // make responsive
				hoverRadius: 10, // make responsive
				hoverBorderWidth: 6 // make responsive
			}
		}
	};

	$: lineData = {
		data: {
			labels: label,
			datasets: [
				{
					...schema.data.datasets[0],
					data: data
				}
			]
		},
		options: isExternal ? lineChartOptions : schema.options
	};

	const changeTag = (tag: Tags) => {
		selectedTag = tag.label;
		if (typeof onTagSelection === 'function') {
			onTagSelection(tag.months);
		}
		dispatch('portfolioChartTagChange', tag);
	};
</script>

<div>
	<LineChart
		data={lineData.data}
		chartOptions={lineData.options}
		chartClass="w-full h-64 relative"
		tooltipSymbol="₹"
	/>
	{#if showGraphTags}
		<section class="mt-1 flex justify-center">
			<section
				class="max-w-10 scrollbar-hide flex w-full flex-row gap-2 overflow-x-auto bg-background-alt sm:gap-4 lg:max-w-fit"
			>
				{#each selectionTags as tag (tag.months)}
					<Button variant="transparent" class="cursor-pointer !p-0" onClick={() => changeTag(tag)}>
						<div class="mx-1 flex flex-col items-center justify-between font-normal lg:mb-4">
							<span
								class={`pb-4 text-center text-sm md:pb-0 ${
									selectedTag === tag.label
										? 'border-b-2 border-primary text-primary md:border-b-0'
										: 'text-body'
								}`}
							>
								{tag.label} Returns
							</span>
						</div>
					</Button>
				{/each}
			</section>
		</section>
	{/if}
</div>
