<script lang="ts">
	import type { PageData } from '../$types';
	import Button from '$components/Button.svelte';
	import { SEO } from 'wms-ui-component';
	import OrderpadReturns from '../../../InvestmentPad/OrderPadComponents/OrderpadReturns.svelte';
	import { page } from '$app/stores';
	import AmountSection from './AmountSection.svelte';
	import StartFirstSipStatic from './StartFirstSipStatic.svelte';

	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	let amount = 500; // initial amount

	const handleProceedClick = () => {
		// add redirection
	};

	const handlePlusClick = () => {
		if (amount >= 100 && amount < 500) {
			amount += 100;
		} else if (amount >= 500 && amount < 5000) {
			amount += 500;
		}
	};

	const handleMinusClick = () => {
		if (amount > 100 && amount <= 500) {
			amount -= 100;
		} else if (amount > 500 && amount <= 5000) {
			amount -= 500;
		}
	};

	const quickInputs = [1000, 1500, 2000];

	const handleQuickInputClick = (pillAmount: number) => {
		amount = pillAmount;
	};
</script>

{#await data?.api?.schemeData}
	Loading...
{:then schemeData}
	<SEO
		seoTitle="Start Your First Investment | Angel One"
		seoDescription="Step-by-Step guide to make your first investment"
	/>

	{#if isMobile || isTablet}
		<article
			class="-mx-2 -my-2 bg-gradient-to-b from-purple-background via-white to-purple-background"
		>
			<section class="mb-80 h-full px-6 py-6">
				<StartFirstSipStatic />
			</section>
			<section
				class="fixed inset-0 top-auto z-20 block rounded-t-lg bg-white px-3 py-6 shadow-csm md:hidden"
			>
				<div class="text-lg font-semibold text-black-key">Choose monthly investment amount</div>

				<div class="text-xs font-medium text-black-bolder">
					Start investing with just ₹100 monthly!
				</div>

				<section class="mt-6">
					<AmountSection
						{amount}
						{quickInputs}
						on:plusClick={handlePlusClick}
						on:minusClick={handleMinusClick}
						on:quickInputClick={(e) => handleQuickInputClick(e?.detail)}
					/>
				</section>

				<section class="mb-6">
					<OrderpadReturns
						class="border-none !px-0 !py-0"
						investedAmount={Number(amount)}
						threeYearReturns={schemeData?.returns3yr}
						textClass={'flex items-center'}
						amountClass={'text-xl'}
					>
						<svelte:fragment slot="supporting-text">
							<span class="ml-1">Expected 3Y Returns</span>
						</svelte:fragment>
						<svelte:fragment slot="info-icon">
							<span />
						</svelte:fragment>
					</OrderpadReturns>
				</section>

				<Button class="w-full rounded" onClick={handleProceedClick}>PROCEED</Button>
			</section>
		</article>
	{/if}
{/await}
