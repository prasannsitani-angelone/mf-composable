<script lang="ts">
	import ChipArqRating from '$components/ChipArqRating.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import ArqRatingIcon from '$lib/images/icons/ArqRatingIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import NavCharts from './NavCharts.svelte';
	let schemeDetails: SchemeDetails;

	function oneDayReturn(scheme: SchemeDetails) {
		const { navValue, previousNavValue } = scheme;

		return (((navValue - previousNavValue) / previousNavValue) * 100).toFixed(2);
	}

	export { schemeDetails };
</script>

<article class="sm-scroll-margin lg:scroll-margin mt-2 rounded-lg pt-1 sm:pt-2 lg:mt-5">
	<section class="rounded-lg bg-white p-4 pt-1 shadow-csm sm:p-6 sm:pt-1">
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
						class="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center !border-none !bg-transparent !p-0 pt-2"
						arqRating={schemeDetails?.arqRating}
					/>
				</div>
			</div>
			<div class="relative flex">
				<div class="flex flex-grow basis-0 flex-col pt-3 pb-3">
					<span class="text-base font-medium text-black-title sm:text-2xl"
						>{schemeDetails?.returns3yr?.toFixed(2)}%</span
					>
					<span class="flex gap-1 text-xs font-medium text-grey-body sm:text-sm"
						>Fund 3 Year return</span
					>
				</div>
			</div>
		</header>
		<section>
			<NavCharts />
			<div class="mt-9 flex justify-between">
				<div class="flex flex-col">
					<span class="mr-1 text-sm font-medium text-grey-body sm:text-sm"
						>NAV on {schemeDetails?.navDate}</span
					><span class="mr-1 text-lg text-black-title">{schemeDetails?.navValue}</span>
				</div>
				<div class="flex flex-col">
					<span class="text-sm font-medium text-grey-body"> 1D Returns </span><span
						class="text-red-sell">{oneDayReturn(schemeDetails)}%</span
					>
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
</article>
