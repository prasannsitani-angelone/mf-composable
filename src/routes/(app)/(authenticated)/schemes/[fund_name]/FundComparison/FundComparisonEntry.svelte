<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	import Button from '$components/Button.svelte';
	import { BtnVariant, WMSIcon } from 'svelte-components';
	import type { OtherSchemeEntityOrSchemeInfoEntity } from '$components/Scheme/types';
	import FundOverviewTile from './FundOverviewTile.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { viewDetailedComparisonClickEvent } from '../../fundcomparision/analytics';

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
			],
			showSearch: false
		};
		goto(`${base}/schemes/fundcomparision?params=${encodeObject(params)}`);
	};
	const handleFundComparisonClick = () => {
		const eventMetaData = {
			comparefundscardvisible: 'Y',
			comparefundcardfunds: {
				fundName1: firstSchemeDetails?.schemeName,
				fundName2: similarFunds?.[0]?.schemeName
			},
			comparefundcardfundsISIN: {
				isin1: firstSchemeDetails?.isin,
				isin2: similarFunds?.[0]?.isin
			},
			comparefundcardfunds3YReturn: {
				return3Year1: firstSchemeDetails?.returns3yr,
				return3Year2: similarFunds?.[0]?.returns3yr
			},
			comparefundcardfundsMinSIPAmount: {
				minSIPAmount1: firstSchemeDetails?.minSipAmount,
				minSIPAmount2: similarFunds?.[0]?.minSipAmount
			},
			comparefundcardfundsNoofInvestors: {
				fund1Investors: firstSchemeDetails?.noOfClientInvested,
				fund2Investors: similarFunds?.[0]?.noOfClientInvested
			}
		};
		viewDetailedComparisonClickEvent(eventMetaData);
		gotoFundComparison();
	};
	export { firstSchemeDetails, similarFunds };
</script>

<article class="mt-2 max-w-4xl rounded-lg bg-background-alt pb-3 text-sm shadow-csm md:mt-4">
	<header>
		<section class="flex cursor-pointer items-center justify-between px-4 pt-6 text-lg">
			<h2 class="flex items-center text-left text-base font-medium text-title">
				<span>Compare with similar fund</span>
			</h2>
		</section>
	</header>
	<section class="flex justify-between px-4 pt-4">
		<div class="w-1/2 border-r pr-3">
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
			onClick={handleFundComparisonClick}
		>
			SEE FULL COMPARISON
			<WMSIcon name="arrow-collapse" height={10} width={10} class="ml-1 rotate-90" />
		</Button>
	</section>
</article>
