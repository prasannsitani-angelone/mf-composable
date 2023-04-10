<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import ChipArqRating from './ChipArqRating.svelte';
	import ChipOverview from './ChipOverview.svelte';

	import Link from './Link.svelte';
	import SchemeLogo from './SchemeLogo.svelte';

	let schemes: WeeklyTopSchemesEntity;
	let showLogo = true;

	export { schemes, showLogo };
</script>

<Link
	to={`/schemes/${normalizeFundName(schemes?.schemeName, schemes?.isin, schemes?.schemeCode)}`}
	class="flex items-start justify-between"
>
	{#if showLogo}
		<SchemeLogo src={schemes?.logoUrl} alt={schemes?.schemeName} />
	{/if}
	<div class="m-0 mr-auto flex flex-col">
		<ChipOverview categoryName={schemes?.categoryName} subCategoryName={schemes?.subcategoryName} />
		<h3 class="text-base font-medium text-black-title sm:text-sm">
			{schemes?.schemeName}
		</h3>
		<div class="mt-1 flex">
			<ChipArqRating arqRating={schemes?.arqRating} />
			<div
				class="ml-1 bg-grey px-1 group-hover:border group-hover:border-grey-line group-hover:bg-white"
			>
				<span class="text-xs text-grey-body">{schemes?.reInvestmentPlan}</span>
			</div>
		</div>
	</div>
</Link>
