<script lang="ts">
	import Card from '$components/Card.svelte';
	import { createEventDispatcher } from 'svelte';

	import type { Report } from '$lib/types/IReports';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';

	const dispatch = createEventDispatcher();

	export let selectedReport: Report;
	export let reportItemList: Report[] = [];

	//TODO: Analytics
	// const reportsCardAnalytics = (reportTitle: string): void => {
	//TODO: Analytics
	// const eventMetaData = {
	//   Report: reportTitle
	// }
	// reportsCardClickAnalytics(eventMetaData)
	// };

	const selectReport = (item: Report) => {
		//TODO: Analytics
		// reportsCardAnalytics(item.title)
		dispatch('onSelect', { ...item });
	};
</script>

<Card class="sm:m-2 sm:p-0">
	{#each reportItemList as item, index (item?.title)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="sm:my-2 sm:py-2" on:click={() => selectReport({ ...item })}>
			<div
				class={`flex flex-row items-center py-4 hover:cursor-pointer hover:bg-grey sm:mx-2 sm:px-4 md:rounded-lg md:border-b-0 md:border-none 
        ${index !== reportItemList?.length - 1 ? 'border-b border-grey-line' : ''}
        ${selectedReport?.title === item?.title ? 'sm:bg-grey' : ''}
        `}
				class:rounded-t-lg={index === 0}
				class:rounded-b-lg={index === reportItemList?.length - 1}
			>
				<svelte:component this={item?.icon} class="mr-3" />
				<div class="flex items-center">
					<h2 class="mr-2 text-sm font-medium text-black-title">
						{item?.title}
					</h2>
					{#if item?.postHeading}
						<div
							class={`rounded-sm p-0.5 ${
								selectedReport?.title === item?.title
									? 'bg-grey text-black-title sm:border sm:border-grey-line sm:bg-white sm:text-grey-body'
									: 'bg-grey text-black-title'
							}`}
						>
							<div class="text-[10px] font-medium">
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
