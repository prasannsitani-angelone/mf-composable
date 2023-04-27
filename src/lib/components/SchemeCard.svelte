<script lang="ts">
	import type { AppContext } from '$lib/types/IAppContext';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { getContext } from 'svelte';
	import ChipArqRating from './ChipArqRating.svelte';
	import ChipOverview from './ChipOverview.svelte';

	import Link from './Link.svelte';
	import SchemeLogo from './SchemeLogo.svelte';

	let schemes: WeeklyTopSchemesEntity;
	let showLogo = true;
	let preventRedirectOnSchemeClick = false;
	let redirectUrl = '';
	const appContext: AppContext = getContext('app');
	export { schemes, showLogo, preventRedirectOnSchemeClick, redirectUrl };
</script>

<Link
	disableRedirect={preventRedirectOnSchemeClick}
	to={`${
		redirectUrl
			? redirectUrl
			: `${getNavigationBaseUrl('', appContext.scheme, appContext.host)}/schemes/` +
			  normalizeFundName(schemes?.schemeName, schemes?.isin, schemes?.schemeCode)
	}`}
	class={`flex items-start justify-between ${$$props.class}`}
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
		<h3 class="whitespace-normal text-base font-medium text-black-title sm:text-sm">
			{schemes?.schemeName}
		</h3>
		<slot name="rating">
			<div class="mt-1 flex">
				<ChipArqRating arqRating={schemes?.arqRating} />
				<div
					class="ml-1 bg-grey px-1 group-hover:border group-hover:border-grey-line group-hover:bg-white"
				>
					<span class="text-xs text-grey-body">{schemes?.reInvestmentPlan}</span>
				</div>
			</div>
		</slot>
	</div>
</Link>
