<script lang="ts">
	import ExitLoadIcon from '$lib/images/icons/ExitLoadIcon.svelte';

	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { Button } from 'svelte-components';
	import BasicInfoChip from './BasicInfoChip.svelte';
	import CakeIcon from '$lib/images/icons/CakeIcon.svelte';
	import LockInIcon from '$lib/images/icons/LockInIcon.svelte';
	import ExpenseRationIcon from '$lib/images/icons/ExpenseRationIcon.svelte';
	import FundSizeIcon from '$lib/images/icons/FundSizeIcon.svelte';
	import TaxImplecationIcon from '$lib/images/icons/TaxImplecationIcon.svelte';
	import SchemeInformationModal from './SchemeInformationModal.svelte';
	import { calculateYearDiffrence } from '$lib/utils';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { learnSchemeTerms } from '../analytics';

	let schemeDetails: SchemeDetails;
	let isNFO = false;
	let fundAge = calculateYearDiffrence(new Date(schemeDetails?.launchDate));
	let { isin, schemeName } = schemeDetails;
	$: isModalOpen = false;

	let showFooter = true;
	let innerStyle = '';

	const toggleSchemeIformationModal = () => {
		isModalOpen = isModalOpen ? false : true;
		if (isModalOpen) {
			learnSchemeTerms({
				ISIN: schemeDetails?.isin,
				FundName: schemeDetails?.schemeName
			});
		}
	};
	let sipLockinPeriod =
		schemeDetails?.sipLockinPeriodFlag === 'Y' ? `${schemeDetails?.sipLockinPeriod} years` : 'Nil';
	export { schemeDetails, isNFO, showFooter, innerStyle };
</script>

<section class="px-4 md:px-6">
	<section class="flex flex-col {innerStyle}">
		{#if !isNFO}
			<section class="flex flex-row border-b pb-4 text-xs sm:gap-16">
				<BasicInfoChip title="Fund Age" value="{fundAge} year{fundAge > 1 ? 's' : ''}">
					<CakeIcon slot="icon" />
				</BasicInfoChip>
				<BasicInfoChip
					title="Fund Size (AUM)"
					value="₹{addCommasToAmountString(schemeDetails?.aum)} Cr."
				>
					<FundSizeIcon slot="icon" />
				</BasicInfoChip>
			</section>
		{/if}
		<section class="flex flex-row border-b py-4 text-xs sm:gap-16">
			<BasicInfoChip title="Lock-in Period" value={sipLockinPeriod}>
				<LockInIcon slot="icon" />
			</BasicInfoChip>
			<BasicInfoChip
				title="Expense Ratio"
				value="{schemeDetails?.expenseRatio}% (inclusive of GST)"
			>
				<ExpenseRationIcon slot="icon" />
			</BasicInfoChip>
		</section>
		<section
			class="flex flex-col pt-4 text-xs sm:flex-row sm:gap-16 sm:border-b sm:pb-4 {innerStyle}"
		>
			<div class="flex flex-grow basis-0 items-start border-b pb-3 sm:border-none sm:pb-0">
				<ExitLoadIcon />
				<div class="ml-1 flex w-full flex-col sm:flex-col">
					<span class="mb-2 text-body">Exit Load</span>
					<span class="text-title"
						>{schemeDetails?.exitLoadFlag === 'Y' ? schemeDetails?.exitLoadValue : 'Nil'}</span
					>
				</div>
			</div>
			<div class="flex flex-grow basis-0 items-start py-3 sm:border-none sm:py-0">
				<TaxImplecationIcon />
				<div class="ml-1 flex w-full flex-col sm:flex-col">
					<span class="mb-2 text-body">Tax Implications</span>

					<div class="text-xs">
						{#each schemeDetails?.taxImplications || [] as taxImplications}
							<div class="mb-1 flex flex-col">
								<span class="text-body">
									{taxImplications?.header}
								</span>
								<span class="text-title">
									{taxImplications?.value}
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
		{#if showFooter}
			<section class="flex justify-center border-t align-middle sm:border-none">
				<Button variant="transparent" on:click={toggleSchemeIformationModal}>
					LEARN ABOUT TERMS
				</Button>
			</section>
		{/if}
	</section>
	<SchemeInformationModal {isModalOpen} {toggleSchemeIformationModal} {isin} {schemeName} />
</section>
