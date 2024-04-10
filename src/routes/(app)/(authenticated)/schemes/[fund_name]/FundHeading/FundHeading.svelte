<script lang="ts">
	import AddToCart from '$components/AddToCart.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import Tag from '$components/Tag/Tag.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	let isNFO = false;
	let schemeDetails: SchemeDetails;

	export { schemeDetails, isNFO };
</script>

<article
	class="-m-2 mb-2 max-w-4xl rounded-none bg-background-alt pb-4 text-sm shadow-csm sm:m-0 sm:mb-4 sm:rounded-lg"
>
	<header class="">
		<section class="flex cursor-pointer flex-col p-4 !pb-0 pl-3 text-lg md:px-6 md:py-5">
			<ChipOverview
				headingPrimary={schemeDetails?.schemePlan}
				headingSecondary={schemeDetails?.reInvestmentPlan}
			/>
			<div class="ml-1 flex items-center text-base text-title sm:ml-0">
				<SchemeLogo src={schemeDetails?.logoUrl} />
				<div>
					{schemeDetails?.schemeName}
					<div class="mt-1 flex flex-wrap items-center gap-2 whitespace-nowrap">
						<Tag name={schemeDetails?.categoryName} />
						<Tag name={schemeDetails?.subcategoryName} />
					</div>
				</div>
				{#if !isNFO}
					<AddToCart
						scheme={schemeDetails}
						class="ml-auto hidden sm:flex"
						entryPoint="FundDetailsPage"
					/>
				{/if}
			</div>
		</section>
	</header>
</article>
