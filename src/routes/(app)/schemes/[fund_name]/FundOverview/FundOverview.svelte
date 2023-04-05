<script lang="ts">
	import ChipArqRating from '$components/ChipArqRating.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import ArqRatingIcon from '$lib/images/icons/ArqRatingIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { tags } from '../constants';
	import type { Tags } from '../types';

	import NavCharts from './NavCharts.svelte';

	let schemeDetails: SchemeDetails;
	let selectedTag: Tags[];
	$: selectedTag = [
		{
			label: '3Y',
			months: 36,
			timeScale: 'year',
			returnPeriod: 'returns3yr',
			bmReturnPeriod: 'bmReturns3yr',
			text: '3 Year'
		}
	];

	let returnPeriod: keyof Tags;
	$: returnPeriod = selectedTag[0].returnPeriod;
	$: oneDayReturnClass = 'text-green-buy ';

	function oneDayReturn(scheme: SchemeDetails): string {
		const { navValue, previousNavValue } = scheme || {};
		const oneDReturn = ((navValue - previousNavValue) / previousNavValue) * 100;

		if (oneDReturn <= 0) {
			oneDayReturnClass = 'text-red-sell';
		} else {
			oneDayReturnClass = 'text-green-buy ';
		}
		return oneDReturn.toFixed(2);
	}
	const handleChartRangeChange = (event: { detail: { text: number } }) => {
		const selectedMonth: number = event?.detail?.text;

		selectedTag = tags.filter((val) => val.months === selectedMonth);

		console.log(selectedTag);
	};
	export { schemeDetails };
</script>

<section class="rounded-lg bg-white p-4 shadow-csm sm:p-6">
	<header>
		<ChipOverview
			class="mb-2"
			categoryName={schemeDetails?.categoryName}
			subCategoryName={schemeDetails?.subcategoryName}
			reInvestmentPlan={schemeDetails?.reInvestmentPlan}
		/>
		<div class="mb-6 flex items-start justify-between sm:items-center lg:mt-6">
			<SchemeLogo src={schemeDetails?.logoUrl} alt={schemeDetails?.schemeName} />
			<div class="m-0 mr-auto flex flex-col">
				<h1 class="text-base font-medium text-black-title sm:text-lg">
					{schemeDetails?.schemeName}
				</h1>
			</div>
			<div class="relative">
				<ArqRatingIcon />
				<ChipArqRating
					class="  absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center !border-none !bg-transparent !p-0 pt-2"
					arqRating={schemeDetails?.arqRating}
				/>
			</div>
		</div>
		<div class="relative flex">
			<div class="flex flex-grow basis-0 flex-col pt-3 pb-3">
				<span class="text-base font-medium text-black-title sm:text-2xl"
					>{schemeDetails[returnPeriod]?.toFixed(2)}%</span
				>
				<span class="flex gap-1 text-xs font-medium text-grey-body sm:text-sm"
					>Fund {selectedTag[0].text} return</span
				>
			</div>
		</div>
	</header>
	<section>
		<NavCharts {schemeDetails} on:chartRangeChange={handleChartRangeChange} />
		<div class="mt-9 flex justify-between">
			<div class="flex flex-col">
				<span class="mr-1 text-sm font-medium text-grey-body sm:text-sm"
					>NAV on {schemeDetails?.navDate}</span
				><span class="mr-1 text-lg text-black-title">{schemeDetails?.navValue}</span>
			</div>
			<div class="flex flex-col">
				<span class="text-sm font-medium text-grey-body ${oneDayReturnClass}">
					1D Returns
				</span><span class={`${oneDayReturnClass}`}>{oneDayReturn(schemeDetails)}%</span>
			</div>
		</div>
	</section>
	<footer class="flex items-center justify-center border-t border-t-grey-line pt-5">
		<!-- <RocketIcon /> -->
		<span class="ml-5 text-xs font-medium text-black-title sm:text-sm">
			Launched in November 2013
			<span class="text-sm font-normal text-grey-body"> (Age - 9 years)</span></span
		>
	</footer>
</section>
