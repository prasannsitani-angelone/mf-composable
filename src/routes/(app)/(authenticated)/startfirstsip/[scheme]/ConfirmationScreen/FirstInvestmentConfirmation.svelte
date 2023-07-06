<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import TrendingCarouselItems from '../../../../discoverfunds/TrendingFunds/TrendingCarouselItems.svelte';
	import AmountText from '$components/AmountText.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import DotIcon from '$lib/images/icons/DotIcon.svelte';
	import CalendarDateSelect from '../../../../../../lib/components/Calendar/CalendarDateSelect.svelte';
	import Button from '$components/Button.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { headerStore } from '$lib/stores/HeaderStore';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import FirstPayment from './payment/FirstPayment.svelte';
	import { getDateSuperscript } from '$lib/utils/helpers/date';
	import {
		startFirstSipConfirmationScreenImpressionAnalytics,
		startFirstSipConfirmationScreenLearnMoreClickAnalytics,
		startFirstSipConfirmationScreenProceedClickAnalytics,
		startFirstSipConfirmationScreenWhyThisFundClickAnalytics
	} from '$lib/analytics/startFirstSip/startFirstSip';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	type calendarDataType = {
		calendarDate: number;
		calendarMonth: string;
		calendarYear: number;
	};

	export let scheme: SchemeDetails;
	export let expected3yReturns: number;
	export let amount: number;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	let showWhyThisFundModal = false;
	let showCalendarLearnMoreModal = false;
	let calendarDate: number;
	let calendarMonth: string;
	let calendarYear: number;
	let intiatePayment = false;
	let dateSuperscript = 'th';

	const numberOfPeopleInvestedValue = 18200; // temporary change (this will be removed after in BE changes)

	const toggleShowWhyThisFundModal = () => {
		showWhyThisFundModal = !showWhyThisFundModal;

		if (showWhyThisFundModal) {
			startFirstSipConfirmationScreenWhyThisFundClickAnalytics();
		}
	};

	const toggleShowCalendarLearnMoreModal = () => {
		showCalendarLearnMoreModal = !showCalendarLearnMoreModal;

		if (showCalendarLearnMoreModal) {
			startFirstSipConfirmationScreenLearnMoreClickAnalytics();
		}
	};

	const whyThisFundModalData = {
		heading: 'Why this fund?',
		detailText:
			'This is an index fund. NIFTY 50 index fund tracks NIFTY and your money is invested in Top-50 companies which make up the NIFTY index. Here are the benefits:',
		detailPoints: [
			'High growth with diversified portfolio',
			'Invest in Top 50 companies of India',
			"Become part of Bharat's growth story"
		]
	};

	onMount(() => {
		if (isMobile || isTablet) {
			$headerStore.showMobileHeader = false;
		}

		startFirstSipConfirmationScreenImpressionAnalytics({
			FundIsin: scheme?.isin,
			MonthlyAmount: `${amount}`
		});
	});

	onDestroy(() => {
		if (isMobile || isTablet) {
			$headerStore.showMobileHeader = true;
		}
	});

	const setCalendarDate = (calendarData: calendarDataType) => {
		calendarDate = calendarData?.calendarDate;
		calendarMonth = calendarData?.calendarMonth;
		calendarYear = calendarData?.calendarYear;
		dateSuperscript = getDateSuperscript(calendarDate);
	};

	const startFirstSipConfirmationScreenProceedClickAnalyticsFunc = () => {
		const eventMetaData = {
			FundISIN: scheme?.isin,
			MonthlyAmount: `${amount}`,
			SipDate: `${calendarDate}-${
				new Date(`${calendarMonth} 1, ${calendarYear}`).getMonth() + 1
			}-${calendarYear}`
		};
		startFirstSipConfirmationScreenProceedClickAnalytics(eventMetaData);
	};

	const handleProceedClick = () => {
		intiatePayment = true;

		startFirstSipConfirmationScreenProceedClickAnalyticsFunc();
	};

	const hidePaymentMethodScreen = () => {
		intiatePayment = false;
	};
</script>

<section>
	{#if (isMobile || isTablet) && !$headerStore?.showMobileHeader}
		<slot name="customMobileHeader">
			<MobileHeader
				title={'Fund for first investment'}
				showSearchIcon={false}
				showBackIcon={true}
				showCloseIcon={false}
				class="-mx-2 -mt-2 mb-2 bg-white"
			/>
		</slot>
	{/if}

	<article data-testid="startFirstSipConfirmationPage">
		<TrendingCarouselItems
			clazz="p-3 bg-white rounded-lg shadow-csm"
			schemes={scheme}
			index={0}
			disableRedirection
		>
			<svelte:fragment slot="topRightSection">
				<section class="ml-1 flex flex-col items-end">
					<div class="w-20 text-right text-xs font-medium text-black-bolder">Returns p.a</div>
					<article class="mt-0.5 flex items-center">
						<WMSIcon class="mt-1 mr-1 h-4 w-3" name="green-uparrow-trending-fund" />
						<div class="text-base font-bold text-black-title">
							{scheme?.returns3yr?.toFixed(2)}%
						</div>
					</article>
				</section>
			</svelte:fragment>

			<svelte:fragment slot="detailsLeft">
				<section>
					<div class="text-xs font-medium text-black-bolder">Monthly Amount</div>
					<div class="font-medium"><AmountText {amount} /></div>
				</section>
			</svelte:fragment>

			<svelte:fragment slot="detailsRight">
				<section class="flex flex-col items-end">
					<div class="text-xs font-medium text-black-bolder">Expected 3Y Returns</div>
					<div class="text-base font-bold text-green-amount">
						<AmountText amount={expected3yReturns} />
					</div>
				</section>
			</svelte:fragment>

			<svelte:fragment slot="cardFooter">
				<button
					class="mt-3 w-fit text-left text-xs font-medium text-blue-primary"
					on:click={toggleShowWhyThisFundModal}
				>
					Why this fund?
				</button>
			</svelte:fragment>

			<svelte:fragment slot="detailsFooterDescription">
				<p class="text-xs">
					<span class=" font-semibold">
						{addCommasToAmountString(numberOfPeopleInvestedValue?.toString())}+
					</span>
					people have invested in this fund
				</p>
			</svelte:fragment>
		</TrendingCarouselItems>
	</article>

	<article class="mt-2 flex items-center justify-between rounded-lg bg-white p-3 shadow-csm">
		<section>
			<div class="text-sm font-medium text-black-key">Monthly SIP Date</div>
			<button
				class="w-fit text-xs font-medium text-blue-primary"
				on:click={toggleShowCalendarLearnMoreModal}>Learn More</button
			>
		</section>

		<CalendarDateSelect schemeData={scheme} on:dateChange={(e) => setCalendarDate(e?.detail)} />
	</article>

	<section class="fixed inset-0 top-auto z-20 block bg-white p-4 shadow-csm md:hidden">
		<Button class="w-full rounded" onClick={handleProceedClick}>PROCEED TO PAYMENT</Button>
	</section>
</section>

{#if showWhyThisFundModal}
	<InfoModal
		showModal={showWhyThisFundModal}
		heading={whyThisFundModalData?.heading}
		headingClass={'!font-medium'}
		on:crossClicked={toggleShowWhyThisFundModal}
	>
		<svelte:fragment slot="crossIconSlot">
			<span />
		</svelte:fragment>

		<svelte:fragment slot="bodySection">
			<section class="mx-4 mb-6 mt-1 text-sm font-normal text-grey-body">
				<div>{whyThisFundModalData?.detailText}</div>

				<div class="mt-3">
					{#each whyThisFundModalData?.detailPoints as point (point)}
						<div class="flex items-center">
							<DotIcon />
							<span class="ml-3">{point}</span>
						</div>
					{/each}
				</div>
			</section>
		</svelte:fragment>
	</InfoModal>
{/if}

{#if showCalendarLearnMoreModal}
	<InfoModal
		showModal={showCalendarLearnMoreModal}
		heading="Monthly SIP Date"
		detailText="Date on which your monthly instalment is due for investment"
		headingClass={'!font-medium'}
		on:crossClicked={toggleShowCalendarLearnMoreModal}
	>
		<svelte:fragment slot="crossIconSlot">
			<span />
		</svelte:fragment>
	</InfoModal>
{/if}
{#if intiatePayment}
	<FirstPayment
		{scheme}
		{amount}
		{calendarDate}
		{dateSuperscript}
		{hidePaymentMethodScreen}
		{calendarMonth}
		{calendarYear}
	/>
{/if}
