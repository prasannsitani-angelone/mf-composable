<script lang="ts">
	import Card from '$components/Card.svelte';
	import { createEventDispatcher } from 'svelte';

	import type { Report } from '$lib/types/IReports';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';

	import { reportsCardClickAnalytics } from '$lib/analytics/reports/reports';

	const dispatch = createEventDispatcher();

	export let selectedReport: Report;
	export let reportItemList: Report[] = [];

	const reportsCardAnalytics = (reportTitle: string): void => {
		const eventMetaData = {
			Report: reportTitle
		};
		reportsCardClickAnalytics(eventMetaData);
	};

	const selectReport = (item: Report) => {
		reportsCardAnalytics(item.title);
		dispatch('onSelect', { ...item });
	};
</script>

<Card class="sm:m-2 sm:p-0">
	{#each reportItemList as item, index (item?.title)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="sm:my-2 sm:py-2" on:click={() => selectReport({ ...item })}>
			<div
				class={`flex flex-row items-center py-4 hover:cursor-pointer hover:bg-background sm:mx-2 sm:px-4 md:rounded-lg md:border-b-0 md:border-none
        ${index !== reportItemList?.length - 1 ? 'border-b' : ''}
        ${selectedReport?.title === item?.title ? 'sm:bg-background' : ''}
        `}
				class:rounded-t-lg={index === 0}
				class:rounded-b-lg={index === reportItemList?.length - 1}
			>
				<svelte:component this={item?.icon} class="mr-3" />
				<div class="flex items-center">
					<h2 class="mr-2 text-sm font-normal text-title">
						{item?.title}
					</h2>
					{#if item?.postHeading}
						<div
							class={`rounded-sm p-0.5 ${
								selectedReport?.title === item?.title
									? 'bg-background text-title sm:border sm:border-border sm:bg-background-alt sm:text-body'
									: 'bg-background text-title'
							}`}
						>
							<div class="text-[10px] font-normal">
								{item?.postHeading}
							</div>
						</div>
					{/if}
				</div>
				<RightIcon class="ml-auto" />
			</div>
		</div>
	{/each}
</Card>
