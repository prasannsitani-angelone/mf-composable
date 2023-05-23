<script lang="ts">
	import ChipOverview from '$components/ChipOverview.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { formatDate } from '$lib/utils';
	import { tags } from '$lib/constants/tags';
	import type { Tags } from '$lib/types/ITags';

	import NavCharts from './NavCharts.svelte';
	import RocketIcon from '$lib/images/icons/RocketIcon.svelte';
	import { onMount } from 'svelte';
	import { sFundDetails } from '../analytics';
	import AddToFavourites from '$components/AddToFavourites.svelte';

	let schemeDetails: SchemeDetails;
	let selectedTag: Tags[];
	let isNFO = false;
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
	let fundLaunchMonth: string = new Date(schemeDetails?.launchDate)?.toLocaleString('default', {
		month: 'long'
	});
	let fundLaunchYear = new Date(schemeDetails?.launchDate).getFullYear();
	let fundAge = calculateYearDiffrence(new Date(schemeDetails?.launchDate));

	$: returnPeriod = selectedTag[0].returnPeriod;
	$: oneDayReturnClass = 'text-green-buy ';
	$: oneDayReturnSuffix = '';

	function calculateYearDiffrence(date: Date) {
		const diffMs = Date.now() - date;
		const actualDate = new Date(diffMs); // miliseconds from epoch
		return Math.abs(actualDate.getUTCFullYear() - 1970);
	}

	function oneDayReturn(scheme: SchemeDetails): string {
		const { navValue, previousNavValue } = scheme || {};
		const oneDReturn = ((navValue - previousNavValue) / previousNavValue) * 100;

		if (oneDReturn <= 0) {
			oneDayReturnClass = 'text-red-sell';
			oneDayReturnSuffix = '-';
		} else {
			oneDayReturnClass = 'text-green-buy ';
			oneDayReturnSuffix = '+';
		}
		return oneDReturn.toFixed(2);
	}
	const handleChartRangeChange = (event: { detail: { text: number } }) => {
		const selectedMonth: number = event?.detail?.text;
		selectedTag = tags.filter((val) => val.months === selectedMonth);
	};

	onMount(() => {
		const {
			schemeName,
			arqRating,
			navValue,
			reInvestmentPlan,
			subcategoryName,
			exitLoadValue,
			expenseRatio
		} = schemeDetails || {};
		const eventMetadata = {
			Fundname: schemeName,
			FundType: reInvestmentPlan,
			SubAssetType: subcategoryName,
			Rating: arqRating,
			Nav: navValue,
			'Exit Load': exitLoadValue,
			'Expense Ratio': expenseRatio
		};
		sFundDetails(eventMetadata);
	});
	export { schemeDetails, isNFO };
</script>

<section class="rounded-lg bg-white p-4 shadow-csm sm:p-6 sm:pb-2">
	<header>
		<ChipOverview
			class="mb-2"
			headingPrimary={schemeDetails?.categoryName}
			headingSecondary={schemeDetails?.subcategoryName}
			headingTertiary={schemeDetails?.reInvestmentPlan}
		/>
		<div class="mb-6 flex items-start justify-between sm:items-center lg:mt-6">
			<SchemeLogo src={schemeDetails?.logoUrl} alt={schemeDetails?.schemeName} />
			<div class="m-0 mr-auto flex flex-col">
				<h1 class="text-base font-medium text-black-title sm:text-lg">
					{schemeDetails?.schemeName}
				</h1>
			</div>
			<div class="relative {isNFO ? 'mb-auto' : ''}">
				{#if !isNFO}
					<AddToFavourites
						isin={schemeDetails?.isin}
						schemeCode={schemeDetails?.schemeCode}
						isFavourite={schemeDetails?.isFavourite}
					/>
				{:else}
					<div>
						<span class="text-sm font-normal uppercase text-grey-body">Nav</span>
						<span>₹{schemeDetails?.navValue}</span>
					</div>
				{/if}
			</div>
		</div>
		{#if !isNFO}
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
		{/if}
	</header>
	{#if !isNFO}
		<section class="mb-5">
			<NavCharts {schemeDetails} on:chartRangeChange={handleChartRangeChange} />
			<div class="mt-9 flex justify-between">
				<div class="flex flex-col">
					<span class="mr-1 text-sm font-medium text-grey-body sm:text-sm"
						>NAV on {formatDate(schemeDetails?.navDate)}</span
					><span class="mr-1 text-lg text-black-title">₹{schemeDetails?.navValue?.toFixed(2)}</span>
				</div>
				<div class="flex flex-col">
					<span class="text-sm font-medium text-grey-body ${oneDayReturnClass}">
						1D Returns
					</span><span class={`${oneDayReturnClass}`}
						>{oneDayReturnSuffix}{oneDayReturn(schemeDetails)}%</span
					>
				</div>
			</div>
		</section>

		<footer class="flex items-center justify-center border-t border-t-grey-line pt-5 pb-4">
			<RocketIcon />
			<span class="ml-5 text-xs font-medium text-black-title sm:text-sm">
				Launched in {fundLaunchMonth}
				{fundLaunchYear}
				<span class="text-sm font-normal text-grey-body">
					(Age - {fundAge} year{fundAge > 1 ? 's' : ''})</span
				></span
			>
		</footer>
	{/if}
</section>
