<script lang="ts">
	import type { PageData } from '../$types';
	import Button from '$components/Button.svelte';
	import { SEO } from 'svelte-components';
	import OrderpadReturns from '../../../InvestmentPad/OrderPadComponents/OrderpadReturns.svelte';
	import { page } from '$app/stores';
	import AmountSection from './AmountInputOrderpad/AmountSection.svelte';
	import StartFirstSipStatic from './AmountInputOrderpad/StartFirstSipStatic.svelte';
	import FirstInvestmentConfirmation from './ConfirmationScreen/FirstInvestmentConfirmation.svelte';
	import { goto } from '$app/navigation';
	import { decodeToObject, encodeObject, getQueryParamsObj } from '$lib/utils/helpers/params';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { afterUpdate, onMount } from 'svelte';
	import StartFirstSipSkeleton from './AmountInputOrderpad/StartFirstSipSkeleton.svelte';
	import {
		startFirstSipScreenImpressionAnalytics,
		startFirstSipScreenIncreaseDecreaseClickAnalytics,
		startFirstSipScreenPredefinedAmountClickAnalytics,
		startFirstSipScreenProceedClickAnalytics
	} from '$lib/analytics/startFirstSip/startFirstSip';

	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	type queryParamsObjTypes = {
		amount: number;
		threeYearReturnsValue: number;
		showConfirmationScreen: boolean;
		isin?: string;
		schemeCode?: string;
	};

	let amount = 500; // initial amount
	let threeYearReturnsValue = 0;
	let queryParamsObj: queryParamsObjTypes;

	let showConfirmationScreen = false;

	const handleProceedClick = (schemeData: SchemeDetails) => {
		const currentPath = window?.location?.pathname;
		const params = encodeObject({
			showConfirmationScreen: true,
			isin: schemeData?.isin,
			schemeCode: schemeData?.schemeCode,
			amount,
			threeYearReturnsValue
		});

		startFirstSipScreenProceedClickAnalytics({ Amount: `${amount}` });

		const redirectPath = `${currentPath}?params=${params}`;
		goto(redirectPath);
	};

	const setQueryParamsData = () => {
		if (queryParamsObj?.amount > 0) {
			amount = queryParamsObj?.amount;
		}
		if (queryParamsObj?.threeYearReturnsValue > 0) {
			threeYearReturnsValue = queryParamsObj?.threeYearReturnsValue;
		}

		showConfirmationScreen = queryParamsObj?.showConfirmationScreen ?? false;
	};

	afterUpdate(() => {
		queryParamsObj = getQueryParamsObj();
		queryParamsObj = decodeToObject(queryParamsObj?.params);
		setQueryParamsData();
	});

	const handlePlusClick = () => {
		if (amount >= 100 && amount < 500) {
			amount += 100;
		} else if (amount >= 500 && amount < 5000) {
			amount += 500;
		}

		startFirstSipScreenIncreaseDecreaseClickAnalytics({ AmountChanged: 'Increase' });
	};

	const handleMinusClick = () => {
		if (amount > 100 && amount <= 500) {
			amount -= 100;
		} else if (amount > 500 && amount <= 5000) {
			amount -= 500;
		}

		startFirstSipScreenIncreaseDecreaseClickAnalytics({ AmountChanged: 'Decrease' });
	};

	const quickInputs = [1000, 1500, 2000];

	const handleQuickInputClick = (pillAmount: number) => {
		amount = pillAmount;

		startFirstSipScreenPredefinedAmountClickAnalytics({ AmountSelected: `${pillAmount}` });
	};

	const setThreeYearReturnsValue = (amount: number) => {
		threeYearReturnsValue = amount;
	};

	onMount(() => {
		startFirstSipScreenImpressionAnalytics();
	});
</script>

{#await data?.api?.schemeData}
	<StartFirstSipSkeleton />
{:then schemeData}
	<SEO
		seoTitle="Start Your First Investment | Angel One"
		seoDescription="Step-by-Step guide to make your first investment"
	/>

	{#if isMobile || isTablet}
		{#if !showConfirmationScreen}
			<article
				class="-mx-2 -my-2 bg-gradient-to-b from-purple-background via-white to-purple-background"
				data-testid="startFirstSipPage"
			>
				<section class="mb-72 h-full px-6 py-6">
					<StartFirstSipStatic />
				</section>
				<section
					class="fixed inset-0 top-auto z-20 block rounded-t-lg bg-white px-3 py-6 shadow-csm md:hidden"
				>
					<div class="text-lg font-semibold text-black-key">Choose monthly investment amount</div>

					<div class="text-xs font-medium text-black-bolder">Start investing with just ₹100!</div>

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
							roundDownToNearestHundredRequired={true}
							on:threeYearReturnsValue={(e) => setThreeYearReturnsValue(e?.detail)}
						>
							<svelte:fragment slot="supporting-text">
								<span class="ml-1">Expected 3Y Returns</span>
							</svelte:fragment>
							<svelte:fragment slot="info-icon">
								<span />
							</svelte:fragment>
						</OrderpadReturns>
					</section>

					<Button class="w-full rounded" onClick={() => handleProceedClick(schemeData)}
						>PROCEED</Button
					>
				</section>
			</article>
		{:else if showConfirmationScreen}
			<FirstInvestmentConfirmation
				scheme={schemeData}
				expected3yReturns={threeYearReturnsValue}
				{amount}
			/>
		{/if}
	{/if}
{/await}
