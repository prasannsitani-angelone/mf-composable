<script lang="ts">
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	let schemeName: string;
	let logoUrl: string;
	let isin: string;
	let schemeCode: string;
	const navigateToDetailsPage = async () => {
		const path = `schemes/${normalizeFundName(schemeName, isin, schemeCode)}`;

		goto(`${base}/${path}`);
	};
	export { schemeName, logoUrl, isin, schemeCode };
</script>

<section class="rounded-lg bg-white shadow-csm">
	<ResultItem
		data={{
			schemeName: schemeName,
			logoUrl: logoUrl
		}}
		categoryStyle="text-[10px] capitalize"
		logoStyle="w-12 h-12"
		class="!border-b-0 !p-4 md:cursor-pointer"
		on:click={navigateToDetailsPage}
	>
		<div slot="returns">
			<span />
		</div>
	</ResultItem>
</section>
