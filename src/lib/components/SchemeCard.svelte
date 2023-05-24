<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import ChipArqRating from './ChipArqRating.svelte';
	import ChipOverview from './ChipOverview.svelte';

	import Link from './Link.svelte';
	import SchemeLogo from './SchemeLogo.svelte';

	let schemes: WeeklyTopSchemesEntity | ExploreFundsOptions | SchemeDetails;
	let showLogo = true;
	let preventRedirectOnSchemeClick = false;
	let titleClass = '';
	let redirectUrl = '';
	export { schemes, showLogo, preventRedirectOnSchemeClick, redirectUrl, titleClass };
</script>

<Link
	disableRedirect={preventRedirectOnSchemeClick}
	to={`${
		redirectUrl
			? redirectUrl
			: `/schemes/${normalizeFundName(schemes?.schemeName, schemes?.isin, schemes?.schemeCode)}`
	}`}
	class="flex items-start justify-between {$$props.class}"
>
	{#if showLogo}
		<SchemeLogo src={schemes?.logoUrl} alt={schemes?.schemeName} />
	{/if}
	<div class="m-0 mr-auto flex flex-col">
		<slot name="chip-overview">
			<ChipOverview
				headingPrimary={schemes?.categoryName}
				headingSecondary={schemes?.subcategoryName}
			/>
		</slot>
		<h3 class={`whitespace-normal text-sm font-medium text-black-title md:text-sm ${titleClass}`}>
			{schemes?.schemeName}
		</h3>
		<slot name="rating">
			<div class="mt-1 flex">
				{#if schemes?.sortBy2 > 0 && schemes?.sortBy2 < 3}
					<div class="mr-1 bg-green-amount p-1 text-xs font-normal uppercase text-white">
						recommended
					</div>
				{/if}

				<div
					class="mr-1 bg-grey px-1 group-hover:border group-hover:border-grey-line group-hover:bg-white"
				>
					<span class="text-xs text-grey-body">{schemes?.reInvestmentPlan}</span>
				</div>
				<ChipArqRating arqRating={schemes?.arqRating} />
			</div>
		</slot>
	</div>
</Link>
