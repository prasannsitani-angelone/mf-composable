<script lang="ts">
	import { base } from '$app/paths';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { TrendingFund } from '$lib/types/ITrendingFunds';
	import { modifiedGoto } from '$lib/utils/goto';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { createEventDispatcher } from 'svelte';

	let fund: TrendingFund;
	const dispatch = createEventDispatcher();

	export { fund };

	const gotoSchemeDetails = () => {
		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			fund?.schemeName,
			fund?.isin,
			fund?.schemeCode
		)}?orderpad=INVEST&params=${encodeObject({
			paymentMandatory: true
		})}`;
		modifiedGoto(schemeDetailsPath);
		dispatch('cardClick');
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<article on:click={gotoSchemeDetails} class="rounded-lg border border-border p-3">
	<SchemeLogo size="xs" class="mb-2 border-none" src={fund?.logoUrl} alt={fund?.schemeName} />
	<p class="my-2 line-clamp-2 text-sm font-medium text-title">{fund?.schemeName}</p>
	<p class="mt-2">
		<span class="text-sm font-medium text-buy">{fund?.returns3yr?.toFixed(2)}% p.a.</span>
		<span class="text-xs font-normal text-body">(3Y)</span>
	</p>
</article>
