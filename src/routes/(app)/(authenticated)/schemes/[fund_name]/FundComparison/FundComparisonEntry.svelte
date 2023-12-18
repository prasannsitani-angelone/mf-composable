<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	import Button from '$components/Button.svelte';
	import { BtnVariant, WMSIcon } from 'svelte-components';
	import type { OtherSchemeEntityOrSchemeInfoEntity } from '$components/Scheme/types';
	import FundOverviewTile from './FundOverviewTile.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { encodeObject } from '$lib/utils/helpers/params';

	let firstSchemeDetails: SchemeDetails | OtherSchemeEntityOrSchemeInfoEntity;
	let similarFunds: OtherSchemeEntityOrSchemeInfoEntity[];

	const gotoFundComparison = () => {
		const params = {
			comparisionArr: [
				{
					isin: firstSchemeDetails?.isin,
					schemeCode: firstSchemeDetails?.schemeCode
				},
				{
					isin: similarFunds?.[0]?.isin,
					schemeCode: similarFunds?.[0]?.schemeCode
				}
			]
		};
		goto(`${base}/schemes/fundcomparision?params=${encodeObject(params)}`);
	};
	export { firstSchemeDetails, similarFunds };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white pb-3 text-sm shadow-csm">
	<header>
		<section class="flex cursor-pointer items-center justify-between px-4 pt-6 text-lg">
			<h2 class="flex items-center text-left text-base font-medium text-black-title">
				<span>Compare with similar fund</span>
			</h2>
		</section>
	</header>
	<section class="flex justify-between px-4 pt-4">
		<div class="w-1/2 border-r border-grey-line pr-3">
			<FundOverviewTile schemeDetails={firstSchemeDetails} isPrimary={true} />
		</div>
		<div class="w-1/2 pl-3">
			<FundOverviewTile schemeDetails={similarFunds?.[0]} />
		</div>
	</section>
	<section class="px-4 pt-2">
		<Button
			variant={BtnVariant.Transparent}
			size="sm"
			class="px-0 py-0 text-xs"
			onClick={gotoFundComparison}
		>
			SEE FULL COMPARISON
			<WMSIcon name="arrow-collapse" height={10} width={10} class="ml-1 rotate-90" />
		</Button>
	</section>
</article>
