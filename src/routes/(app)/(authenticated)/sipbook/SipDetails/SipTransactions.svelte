<script lang="ts">
	import Button from '$components/Button.svelte';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import BigGreenTickIcon from '$lib/images/icons/BigGreenTickIcon.svelte';
	import BigRedCrossIcon from '$lib/images/icons/BigRedCrossIcon.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	interface txnItem {
		title: string;
		subTitle: string;
		status: string;
	}
	let items: Array<txnItem>;
	let hideFooter = false;
	let maxTxnShowCount = 0;
	let dynamicHeight = false;
	let handleFooterClick: () => void;
	export { items, hideFooter, maxTxnShowCount, dynamicHeight, handleFooterClick };
</script>

<section class={`flex flex-col bg-white ${$$props.class}`}>
	<section
		class="mb-2"
		class:overflow-auto={dynamicHeight}
		class:dynamicHeightClass={dynamicHeight}
	>
		{#each items?.slice(0, maxTxnShowCount || items?.length) as item, index (index)}
			<div class="flex-1 px-3">
				<div class="flex w-full flex-row">
					<div class="mr-2 flex flex-col items-center">
						{#if item.status === STATUS_ARR.SUCCESS}
							<BigGreenTickIcon />
						{:else if item.status === STATUS_ARR.FAILED}
							<BigRedCrossIcon />
						{:else if item.status === STATUS_ARR.SKIPPED}
							<WMSIcon name="skip" />
						{:else}
							<div class="h-4 w-4 rounded-lg bg-grey" />
						{/if}
						{#if index !== items?.slice(0, maxTxnShowCount || items?.length).length - 1}
							<div class="flex flex-1 border-l border-grey-line" />
						{/if}
					</div>

					<div
						class="pb-5 text-sm"
						class:pb-2.5={index === items?.slice(0, maxTxnShowCount || items?.length).length - 1}
					>
						<div class="mb-1.5 font-normal text-black-title">
							{item.title}
						</div>

						<div class="font-normal text-grey-body">
							{item.subTitle}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</section>

	<!-- Footer section -->
	{#if !hideFooter && items?.length > maxTxnShowCount}
		<section class="border-t bg-white">
			<Button variant="transparent" class="w-full" onClick={handleFooterClick}>VIEW MORE</Button>
		</section>
	{/if}
</section>

<style>
	.dynamicHeightClass {
		height: calc(100vh - 254px);
	}
</style>
