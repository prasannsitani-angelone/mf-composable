<script lang="ts">
	import ExitLoadIcon from '$lib/images/icons/ExitLoadIcon.svelte';

	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { Button, WMSIcon } from 'svelte-components';
	import BasicInfoChip from './BasicInfoChip.svelte';
	import CakeIcon from '$lib/images/icons/CakeIcon.svelte';
	import LockInIcon from '$lib/images/icons/LockInIcon.svelte';
	import ExpenseRationIcon from '$lib/images/icons/ExpenseRationIcon.svelte';
	import FundSizeIcon from '$lib/images/icons/FundSizeIcon.svelte';
	import TaxImplecationIcon from '$lib/images/icons/TaxImplecationIcon.svelte';
	import SchemeInformationModal from './SchemeInformationModal.svelte';
	import { calculateYearDiffrence } from '$lib/utils';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { learnSchemeTerms } from '../analytics';
	import { createEventDispatcher } from 'svelte';
	import StoriesComponent from '$components/Stories/StoriesComponent.svelte';
	import { getStoriesData } from '$lib/api/media';
	import { onMount } from 'svelte';
	import type { Story } from '$lib/types/IStories';
	import StoriesSkeletonLoader from '$components/Stories/StoriesSkeletonLoader.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import {
		fundDetailsVideoClickAnalytics,
		fundDetailsVideoCloseAnalytics,
		fundDetailsVideoImpressionAnalytics
	} from '$lib/analytics/stories/stories';

	let schemeDetails: SchemeDetails;
	let isNFO = false;
	let fundAge = calculateYearDiffrence(new Date(schemeDetails?.launchDate));
	let { isin, schemeName } = schemeDetails;
	$: isModalOpen = false;

	let showFooter = true;
	let innerStyle = '';
	const dispatch = createEventDispatcher();
	let stories: Story[];
	let shouldLoadStories: boolean;
	let storyAnalytics = {
		onStoryClick: fundDetailsVideoClickAnalytics,
		onStoryClose: fundDetailsVideoCloseAnalytics,
		storyImpression: fundDetailsVideoImpressionAnalytics
	};

	const fetchStories = async () => {
		shouldLoadStories = false;
		const response = await getStoriesData('?fundpageconfig=true');
		stories = response.data?.stories;
		shouldLoadStories = true;
	};

	const toggleSchemeIformationModal = () => {
		isModalOpen = isModalOpen ? false : true;
		if (isModalOpen) {
			learnSchemeTerms({
				ISIN: schemeDetails?.isin,
				FundName: schemeDetails?.schemeName
			});
		}
	};

	const exitLoadInfoIconClicked = () => {
		dispatch('exitLoadInfoIconClicked');
	};

	onMount(async () => {
		await fetchStories();
	});
	let sipLockinPeriod =
		schemeDetails?.sipLockinPeriodFlag === 'Y' ? `${schemeDetails?.sipLockinPeriod} years` : 'Nil';
	export { schemeDetails, isNFO, showFooter, innerStyle };
</script>

<section class="px-4 md:px-6">
	<section class="flex flex-col {innerStyle}">
		{#if !isNFO}
			<section class="flex flex-row border-b pb-4 text-xs sm:gap-16">
				<BasicInfoChip title="Age" value="{fundAge} year{fundAge > 1 ? 's' : ''}">
					<CakeIcon slot="icon" />
				</BasicInfoChip>
				<BasicInfoChip title="AUM" value="₹{addCommasToAmountString(schemeDetails?.aum)} Cr.">
					<FundSizeIcon slot="icon" />
				</BasicInfoChip>
			</section>
		{/if}
		<section class="flex flex-row border-b py-4 text-xs sm:gap-16">
			<BasicInfoChip title="Lock-in Period" value={sipLockinPeriod}>
				<LockInIcon slot="icon" />
			</BasicInfoChip>

			<div class="flex flex-grow basis-0 flex-row">
				<BasicInfoChip
					title="Exit Load"
					value={schemeDetails?.exitLoadFlag === 'Y'
						? schemeDetails?.exitLoadPercentage + '%'
						: 'Nil'}
				>
					<ExitLoadIcon slot="icon" />
					<WMSIcon
						on:click={exitLoadInfoIconClicked}
						class="mx-3"
						height={12}
						width={12}
						name="info-in-circle-dark"
						stroke="var(--PRIMARY)"
						slot="right"
					/>
				</BasicInfoChip>
			</div>
		</section>
		<section
			class="flex flex-col pt-4 text-xs sm:flex-row sm:gap-16 sm:border-b sm:pb-4 {innerStyle}"
		>
			<div class="flex flex-grow basis-0 items-start border-b pb-3 sm:border-none sm:pb-0">
				<BasicInfoChip
					title="Expense Ratio"
					value="{schemeDetails?.expenseRatio}% (inclusive of GST)"
				>
					<ExpenseRationIcon slot="icon" />
				</BasicInfoChip>
			</div>
			<div class="flex flex-grow basis-0 items-start border-b py-3 sm:py-0 md:border-none">
				<TaxImplecationIcon />
				<div class="ml-1 flex w-full flex-col sm:flex-col">
					<span class="mb-2 text-body">Tax Implications</span>

					<div class="text-xs">
						{#each schemeDetails?.taxImplications || [] as taxImplications}
							<div class="mb-1 flex flex-col">
								<span class="text-body">
									{taxImplications?.header}
								</span>
								<span class="text-title">
									{taxImplications?.value}
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
		{#if !shouldLoadStories}
			<SkeletonRectangle class="!ml-8 !mt-4 !h-2 !w-24" />
			<StoriesSkeletonLoader />
		{:else if stories?.length}
			<div class="mt-4">
				<p class="text-xs text-body">Watch these short videos to learn more</p>
				<StoriesComponent
					{stories}
					version="A"
					hideFooter={true}
					isDiscoverPage={false}
					scheme={schemeDetails}
					analytics={storyAnalytics}
				/>
			</div>
		{/if}
		{#if showFooter}
			<section class="flex justify-center border-t align-middle sm:border-none">
				<Button variant="transparent" on:click={toggleSchemeIformationModal}>
					LEARN ABOUT TERMS
				</Button>
			</section>
		{/if}
	</section>
	<SchemeInformationModal {isModalOpen} {toggleSchemeIformationModal} {isin} {schemeName} />
</section>
