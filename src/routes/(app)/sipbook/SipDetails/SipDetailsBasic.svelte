<script lang="ts">
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	import { OnNavigation } from '$lib/utils/navigation';
	let sipId: number;
	let schemeName: string;
	let schemePlan: string;
	let logoUrl: string;
	let isin: string;
	let schemeCode: string;
	const appContext: AppContext = getContext('app');
	const navigateToDetailsPage = async () => {
		const path = `schemes/${normalizeFundName(schemeName, isin, schemeCode)}`;
		OnNavigation();
		goto(`${getNavigationBaseUrl(base, appContext.scheme, appContext.host)}/${path}`);
	};
	export { sipId, schemeName, schemePlan, logoUrl, isin, schemeCode };
</script>

<section class="rounded-lg bg-white shadow-csm">
	<ResultItem
		data={{
			schemeName: schemeName,
			categoryName: schemePlan?.toLowerCase(),
			logoUrl: logoUrl
		}}
		categoryStyle="text-[10px] capitalize"
		logoStyle="w-9 h-9 p-0.5 !mr-2"
		class="!border-b-0 !p-4 md:cursor-pointer"
		on:click={navigateToDetailsPage}
	>
		<div slot="returns">
			<span />
		</div>
	</ResultItem>
</section>
