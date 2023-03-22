<script lang="ts">
	import type { SchemeDetails, SchemeHoldings } from '$lib/types/ISchemeDetails';
	import { setContext } from 'svelte';
	import type { PageData } from './$types';
	import { SCHEME_DETAILS_KEY } from './constants';
	import FundManager from './FundManager.svelte';
	import FundOverview from './FundOverview/FundOverview.svelte';
	import LockInPeriod from './LockInPeriod.svelte';
	import SchemeInformation from './SchemeInformation/SchemeInformation.svelte';

	setContext(SCHEME_DETAILS_KEY, {
		getSchemeDetails: async (): Promise<SchemeDetails> => {
			const schemeData: SchemeDetails = await data.api.schemeData;
			return schemeData;
		},
		getHoldingData: async (): Promise<Array<SchemeHoldings>> => {
			const holdingData: Array<SchemeHoldings> = await data.api.holdingData;

			return holdingData;
		}
	});

	export let data: PageData;
</script>

{#await data?.api?.schemeData}
	<div>Loading</div>
{:then schemedata}
	<article class="sm-scroll-margin lg:scroll-margin mt-2 rounded-lg pt-1 sm:pt-2 lg:mt-5">
		<FundOverview />
		<LockInPeriod />
		<SchemeInformation />
		<FundManager />
	</article>
{/await}
