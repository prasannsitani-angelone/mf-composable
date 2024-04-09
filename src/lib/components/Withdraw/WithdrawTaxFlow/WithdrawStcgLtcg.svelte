<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { BtnVariant, Button, WMSIcon, addCommasToAmountString } from 'svelte-components';
	import TaxOption from './TaxOption.svelte';
	import type { IHoldingTaxationDetails } from '$lib/types/IInvestments';
	import type { Story } from '$lib/types/IStories';
	import { getStoriesData } from '$lib/api/media';
	import StoriesComponent from '$components/Stories/StoriesComponent.svelte';
	import StoriesSkeletonLoader from '$components/Stories/StoriesSkeletonLoader.svelte';
	import {
		exitLoadVideoClickAnalytics,
		exitLoadVideoCloseAnalytics,
		exitLoadVideoImpressionAnalytics
	} from '$lib/analytics/stories/stories';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	const dispatch = createEventDispatcher();

	let taxationDetails: IHoldingTaxationDetails;
	let categoryName = '';
	let stories: Story[];
	let shouldLoadStories: boolean;
	let scheme: SchemeDetails;

	let storyAnalytics = {
		onStoryClick: exitLoadVideoClickAnalytics,
		onStoryClose: exitLoadVideoCloseAnalytics,
		storyImpression: exitLoadVideoImpressionAnalytics
	};

	const taxOptionsData = [
		{
			type: 'LTCG',
			title: `Withdraw up to ₹${addCommasToAmountString(
				taxationDetails?.ltcgCurAmount?.toFixed(2)
			)}`,
			description:
				categoryName?.toLowerCase() === 'equity'
					? '<div>Only <span class="text-title font-medium">LTCG</span> (Long Term Capital Gains) tax applicable <span class="text-title font-medium">at 10%</span></div>'
					: '<div>Only <span class="text-title font-medium" class="text-title">LTCG</span> (Long Term Capital Gains) tax applicable <span class="text-title font-medium">at 20%</span></div>'
		},
		{
			type: 'STCG',
			title: `Withdraw more than ₹${addCommasToAmountString(
				taxationDetails?.ltcgCurAmount?.toFixed(2)
			)}`,
			description:
				categoryName?.toLowerCase() === 'equity'
					? '<div><span class="text-title font-medium">STCG</span> (Short Term Capital Gains) tax applicable <span class="text-title font-medium">at 15%</span> in addition to <span class="text-title font-medium">10% LTCG</span> tax</div>'
					: '<div><span class="text-title font-medium">STCG</span> (Short Term Capital Gains) tax applicable <span class="text-title font-medium">as per your tax slab rate</span> in addition to <span class="text-title font-medium">20% LTCG</span> tax</div>'
		}
	];

	const primaryCtaClick = () => {
		dispatch('continueCtaClick');
	};

	const fetchStories = async () => {
		shouldLoadStories = false;
		const response = await getStoriesData('?taxconfig=true');
		stories = response.data?.stories;
		shouldLoadStories = true;
	};

	onMount(() => {
		fetchStories();
	});

	export { taxationDetails, categoryName, scheme };
</script>

<article
	class="flex w-full flex-col rounded-b-none rounded-t-2xl bg-background-alt px-3 pb-4 pt-8 text-title shadow-clg md:rounded-lg {$$props?.class}"
>
	<div class="text-lg font-medium text-title">Taxes on Withdrawal</div>

	<section class="my-4 rounded-lg border p-3 pb-0">
		{#each taxOptionsData as option, index}
			<TaxOption
				title={option?.title}
				description={option?.description}
				class={index > 0 ? 'border-t pt-1' : ''}
			>
				<svelte:fragment slot="tag">
					{#if option?.type === 'LTCG'}
						<section class="flex w-28 items-center rounded bg-tint12-buy px-2 py-1">
							<WMSIcon
								name="tick-in-circle-extended"
								height={12}
								width={12}
								stroke="#fff"
								bgStroke="var(--BUY)"
								class="min-w-[12px]"
							/>
							<div class="ml-1 text-xs font-normal text-buy">Tax optimised</div>
						</section>
					{:else}
						<span />
					{/if}
				</svelte:fragment>
			</TaxOption>
		{/each}
	</section>

	<div class="mb-4 px-3 text-[11px] font-normal text-body">
		Note: Taxes are applicable if your realised gain exceeds ₹1 Lakh across brokers. Calculations
		are based on transactions done with Angel One only. Your actual capital gains tax may differ
	</div>

	{#if !shouldLoadStories}
		<StoriesSkeletonLoader numberOfSkeletons={1} />
	{:else if stories?.length}
		<StoriesComponent
			{stories}
			version="A"
			hideFooter={true}
			isDiscoverPage={false}
			showDescription={true}
			header="Tax"
			{scheme}
			analytics={storyAnalytics}
		/>
	{/if}

	<Button variant={BtnVariant?.Contained} class="mb-2" onClick={primaryCtaClick}>CONTINUE</Button>
</article>
