<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { afterUpdate } from 'svelte';
	import { userStore } from '$lib/stores/UserStore';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import LeftSideView from './LeftSideView.svelte';
	import InvestmentDetailsLoader from './components/InvestmentDetailsLoader.svelte';
	import InvestmentPad from '../../../InvestmentPad/InvestmentPad.svelte';
	import type { PageData } from './$types';
	import type {
		FolioHoldingType,
		ChartData,
		OrdersData,
		IHoldingTaxationDetails
	} from '$lib/types/IInvestments';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { decodeToObject, getQueryParamsObj } from '$lib/utils/helpers/params';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import InvestmentDetailsFooter from './components/InvestmentDetailsFooter.svelte';
	import { orderpadParentPage } from '../../../InvestmentPad/constants';
	import OrderPadHeader from '../../../InvestmentPad/OrderPadComponents/OrderPadHeader.svelte';
	import { investmentDetailsFooterEvents } from './constants';
	import type { OrderPadTypes } from '$lib/types/IOrderPad';
	import RedemptionPad from '../../../Redemption/RedemptionPad.svelte';
	import { format } from 'date-fns';
	import SwitchOptions from '$components/Switch/SwitchOptions.svelte';
	import {
		stayInvestedPrimaryCtaClickAnalytics,
		stayInvestedSecondaryCtaClickAnalytics,
		withdrawFlowStartClickAnalytics,
		withdrawalTaxesModalCtaClickAnalytics,
		withdrawalTaxesModalImpressionAnalytics
	} from '$lib/analytics/redemption/redemption';
	import {
		switchHamburgerIconClickAnalytics,
		switchOptionsOpenAnalytics
	} from '$lib/analytics/switch/switch';
	import { SEO } from 'svelte-components';
	import StayInvested from '../../../Redemption/StayInvested.svelte';
	import InvestmentDetailsFooterLoader from './components/InvestmentDetailsFooterLoader.svelte';
	import { hydrate } from '$lib/utils/helpers/hydrated';
	import { investMoreClickEvent } from '$lib/analytics/investments/investments';
	import SwpDetails from './components/SwpDetails.svelte';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	import WithdrawStcgLtcg from '$components/Withdraw/WithdrawTaxFlow/WithdrawStcgLtcg.svelte';
	import { base } from '$app/paths';
	import { appStore } from '$lib/stores/SparkStore';
	import { goBackToSpark } from '$lib/utils';
	import { getDataforInvestment } from '../../../InvestmentPad/api';

	export let data: PageData;

	interface BreadcrumbType {
		text: string;
		href: string;
	}
	let breadCrumbs: BreadcrumbType[];
	$: breadCrumbs = [];
	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;
	$: showInvestmentPad = false;
	$: showRedemptionPad = false;
	$: holdingsData = <FolioHoldingType>{};
	$: queryParamsObj = <OrderPadTypes>{};
	$: isSwitchModalOpen = false;

	let orderPadActiveTab = investmentDetailsFooterEvents?.INVEST;
	let isInvestmentNotAllowed = false;
	let investDisableText = '';
	let withdrawDisableText = '';
	let isWithdrawDisableLockInCase = false;
	let showStayInvestedModal = false;
	let showWithdrawStcgLtcg = false;
	let isWithdrawalStcgLtcgEligible = true;
	let decodedParams = {};
	let taxationDetails: IHoldingTaxationDetails;
	let categoryName = '';
	let subCategoryName = '';

	async function setPageData(
		data: Promise<{
			holdingsData: FolioHoldingType;
			chartData: ChartData;
			ordersData: OrdersData;
			schemeData: SchemeDetails;
		}>
	) {
		const result = await data;

		breadCrumbs = [
			{
				text: 'Home',
				href: '/'
			},
			{
				text: 'Your Investments',
				href: '/investments'
			},
			{
				text: `${result?.holdingsData?.schemeName}`,
				href: `/investments/${normalizeFundName(
					result?.holdingsData?.schemeName,
					result?.holdingsData?.isin,
					result?.holdingsData?.schemeCode
				)}`
			}
		];

		holdingsData = result?.holdingsData;

		isInvestmentNotAllowed = !isInvestmentAllowed(userStore?.userType(), holdingsData?.schemePlan);

		setInvestDisableText();
		setWithdrawDisableText();

		categoryName = result?.schemeData?.categoryName || '';
		subCategoryName = result?.schemeData?.subcategoryName || '';
		setTaxationDetails();
	}

	$: {
		setPageData(data.api?.allResponse);
	}

	const setIsWithdrawalStcgLtcgEligible = () => {
		const { ltcgInvAmount, ltcgCurAmount } = taxationDetails || {};

		if (
			ltcgInvAmount > 0 &&
			ltcgCurAmount > ltcgInvAmount &&
			subCategoryName?.toLowerCase() !== 'elss'
		) {
			isWithdrawalStcgLtcgEligible = true;
		} else {
			isWithdrawalStcgLtcgEligible = false;
		}
	};

	const setTaxationDetails = async () => {
		const taxationDetailsRes = await data?.api?.taxationDetails;
		taxationDetails = taxationDetailsRes?.data?.data;

		setIsWithdrawalStcgLtcgEligible();
	};

	const handleErrorNavigation = () => {
		if ($appStore.openViaTabView || appStore.isMFTabAvailable()) {
			goBackToSpark();
		} else {
			goto(`${base}/discoverfunds`);
		}
	};

	const investmentHeaderButtonClick = (clickedButton: string) => {
		if (clickedButton?.length) {
			if (clickedButton === 'WITHDRAW' && orderPadActiveTab !== clickedButton) {
				withdrawButtonClickAnalytics();

				if (!isInvestmentNotAllowed) {
					if (showStayInvestedModal) {
						showStayInvestedModal = false;
					} else {
						showStayInvestedModal = true;
						return;
					}
				}
			}

			orderPadActiveTab = clickedButton;
		}
	};

	const setInvestDisableText = () => {
		if (isInvestmentNotAllowed) {
			if (
				userStore?.userType() === 'B2C' &&
				holdingsData?.schemePlan?.toUpperCase() === 'REGULAR'
			) {
				investDisableText =
					'Investments in Regular funds are disabled. Invest more in the Direct fund.';
			} else if (
				userStore?.userType() === 'B2B' &&
				holdingsData?.schemePlan?.toUpperCase() === 'DIRECT'
			) {
				investDisableText =
					'Investments in Direct funds are disabled. Invest more in the Regular fund.';
			}
		} else if (!holdingsData?.investmentAllowed) {
			investDisableText = 'AMC is not accepting more investments in this fund';
		}
	};

	const setWithdrawDisableText = () => {
		let totalBlockedUnits = 0;
		let totalPledgedUnits = 0;
		let totalRedeemableUnits = 0;
		let totalUnitsUnderProcess = 0;

		holdingsData?.folioHoldings?.forEach((folio) => {
			totalBlockedUnits += folio?.blockedunits;
			totalPledgedUnits += folio?.pledgedUnits;
			totalRedeemableUnits += folio?.redemableUnits;
			totalUnitsUnderProcess += folio?.unitsUnderProcess;
		});

		if (!holdingsData?.redemptionAllowed) {
			withdrawDisableText =
				'Withdrawal is disabled as exchange has disabled withdrawal for this scheme';
		} else if (!totalRedeemableUnits) {
			if (
				totalBlockedUnits &&
				!holdingsData?.lockInUnits &&
				!holdingsData?.safeKeepUnits &&
				!holdingsData?.pledgeUnits &&
				!totalUnitsUnderProcess
			) {
				withdrawDisableText = '';
			} else if (totalBlockedUnits && !totalPledgedUnits && !totalUnitsUnderProcess) {
				withdrawDisableText =
					'Withdraw is disabled temporarily as withdrawal units are in process of being credited to your account or are in lock-in';
				// isWithdrawDisableLockInCase = true;
			} else if (totalPledgedUnits && !totalBlockedUnits && !totalUnitsUnderProcess) {
				withdrawDisableText = 'Withdrawal is disabled as you have pledged these funds';
			} else if (totalUnitsUnderProcess && !totalBlockedUnits && !totalPledgedUnits) {
				withdrawDisableText = 'Withdrawal is disabled as your withdrawal order is in progress';
			} else if (totalBlockedUnits && totalPledgedUnits && !totalUnitsUnderProcess) {
				withdrawDisableText = 'Your funds are pledged and in lock-in period';
			} else if (totalUnitsUnderProcess && totalPledgedUnits && !totalBlockedUnits) {
				withdrawDisableText =
					'Withdrawal is disabled as your withdrawal is in progress and funds are pledged';
			} else {
				withdrawDisableText = 'Withdrawal is disabled as you do not have any withdrawable units';
			}
		}
	};

	const handleInvestMoreCtaClick = () => {
		const currentPath = window?.location?.pathname;
		const redirectPath = `${currentPath}?orderpad=INVEST`;

		goto(redirectPath);

		investMoreClickEvent(holdingsData?.schemeName);
	};

	const setQueryParamsData = () => {
		if (queryParamsObj?.orderpad === 'INVEST') {
			showInvestmentPad = true;
			showRedemptionPad = false;
		} else if (queryParamsObj?.orderpad === 'REDEEM') {
			showRedemptionPad = true;
			showInvestmentPad = false;
			orderPadActiveTab = 'WITHDRAW';
		} else if (queryParamsObj?.orderpad === 'MORE_OPTIONS') {
			showInvestmentPad = false;
			showRedemptionPad = false;
			orderPadActiveTab = 'MORE_OPTIONS';
		} else if (queryParamsObj?.orderpad === 'SWP') {
			showInvestmentPad = false;
			showRedemptionPad = false;
			orderPadActiveTab = 'SWP';
		} else {
			showRedemptionPad = false;
			showInvestmentPad = false;
		}
	};

	afterUpdate(() => {
		queryParamsObj = getQueryParamsObj();

		if (queryParamsObj) {
			decodedParams = decodeToObject(queryParamsObj?.params || '');
			if (decodedParams?.orderpad) {
				queryParamsObj.orderpad = decodedParams?.orderpad;
			}
		}

		setQueryParamsData();
	});

	const handleStayInvestedModalWithdrawClick = () => {
		stayInvestedSecondaryCtaClickAnalytics();

		if (isMobile || isTablet) {
			handleWithdrawCtaClick();
		} else {
			investmentHeaderButtonClick('WITHDRAW');
		}
	};

	const redirectToRedemptionPad = () => {
		const currentPath = window?.location?.pathname;
		const redirectPath = `${currentPath}?orderpad=REDEEM`;

		goto(redirectPath);
	};

	const handleWithdrawCtaClick = () => {
		withdrawButtonClickAnalytics();

		if (!isInvestmentNotAllowed) {
			if (showStayInvestedModal) {
				showStayInvestedModal = false;
			} else {
				showStayInvestedModal = true;
				return;
			}
		}

		redirectToRedemptionPad();
	};

	const toggleShowStayInvestedModal = (primaryCta?: boolean) => {
		if (primaryCta && showStayInvestedModal) {
			stayInvestedPrimaryCtaClickAnalytics();
		}

		showStayInvestedModal = !showStayInvestedModal;
	};

	const toggleShowWithdrawStcgLtcg = () => {
		showWithdrawStcgLtcg = !showWithdrawStcgLtcg;

		if (showWithdrawStcgLtcg) {
			withdrawalTaxesModalImpressionAnalyticsFunc();
		}
	};

	const checkWithdrawStcgLtcg = () => {
		if (isWithdrawalStcgLtcgEligible) {
			toggleShowStayInvestedModal();
			toggleShowWithdrawStcgLtcg();
		} else {
			handleStayInvestedModalWithdrawClick();
		}
	};

	const handleContinueStcgLtcg = () => {
		toggleShowWithdrawStcgLtcg();

		if (isMobile || isTablet) {
			redirectToRedemptionPad();
		} else {
			orderPadActiveTab = 'WITHDRAW';
		}

		withdrawalTaxesModalCtaClickAnalyticsFunc();
	};

	const toggleSwitch = () => {
		// add logic
		isSwitchModalOpen = isSwitchModalOpen ? false : true;
		if (isSwitchModalOpen) {
			switchHamburgerIconClickAnalytics();
			switchOptionsOpenAnalytics();
		}
	};

	const handleMoreOptionsClick = () => {
		// add logic
		toggleSwitch();
	};

	const withdrawButtonClickAnalytics = () => {
		interface eventMetaDataType {
			FundName: string;
			CurrentValue: number;
			TotalInvestment: number;
			TotalReturns: number;
			ReturnsPercentage: number;
			NextSipDate?: string;
		}

		const eventMetadata: eventMetaDataType = {
			FundName: holdingsData?.schemeName,
			CurrentValue: parseFloat(holdingsData?.currentValue?.toFixed(2)),
			TotalInvestment: parseFloat(holdingsData?.investedValue?.toFixed(2)),
			TotalReturns: parseFloat(holdingsData?.returnsValue?.toFixed(2)),
			ReturnsPercentage: parseFloat(holdingsData?.returnsAbsolutePer?.toFixed(2)),
			NextSipDate: format(new Date(holdingsData?.nextSipDate), 'dd MMM yyyy')
		};

		if (!holdingsData?.sipEnabled) {
			delete eventMetadata.NextSipDate;
		}

		withdrawFlowStartClickAnalytics(eventMetadata);
	};

	const withdrawalTaxesModalImpressionAnalyticsFunc = () => {
		const eventMetadata = {
			Fundname: holdingsData?.schemeName,
			FundCategory: categoryName,
			ISIN: holdingsData?.isin,
			WithdrawalOptimizedAmount: taxationDetails?.ltcgCurAmount,
			CurrentAmount: holdingsData?.currentValue,
			ShortTermInvestment: taxationDetails?.stcgInvAmount
		};

		withdrawalTaxesModalImpressionAnalytics(eventMetadata);
	};

	const withdrawalTaxesModalCtaClickAnalyticsFunc = () => {
		const eventMetadata = {
			Fundname: holdingsData?.schemeName,
			FundCategory: categoryName,
			ISIN: holdingsData?.isin,
			WithdrawalOptimizedAmount: taxationDetails?.ltcgCurAmount,
			CurrentAmount: holdingsData?.currentValue,
			ShortTermInvestment: taxationDetails?.stcgInvAmount
		};

		withdrawalTaxesModalCtaClickAnalytics(eventMetadata);
	};
</script>

{#await data.api.allResponse}
	<InvestmentDetailsLoader />
{:then res}
	{#if res.holdingsData && Object.keys(res.holdingsData)?.length > 0}
		<SEO
			seoTitle={`${res.holdingsData?.schemeName} | Angel One`}
			seoDescription={`${res.holdingsData?.schemeName} | Angel One`}
		/>
		<!-- Left Side -->
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />

			{#if (!isMobile && !isTablet) || !(showInvestmentPad || showRedemptionPad)}
				<!-- Investment Details Page (Mobile and Desktop Layout) -->
				<LeftSideView
					holdings={res.holdingsData}
					chartData={res.chartData}
					ordersData={res.ordersData}
					schemeDetails={res.schemeData}
					isRedemptionNotAllowed={Boolean(withdrawDisableText?.length)}
				/>

				{#if res.holdingsData}
					{#if hydrate}
						<!-- Investment Details Page Footer (Mobile Layout) -->
						<InvestmentDetailsFooter
							parentPage={orderpadParentPage?.INVESTMENT}
							investmentAllowed={holdingsData?.investmentAllowed &&
								!isInvestmentNotAllowed &&
								!investDisableText?.length}
							redemptionAllowed={holdingsData?.redemptionAllowed && !withdrawDisableText?.length}
							investmentDisableText={investDisableText}
							redemptionDisableText={withdrawDisableText}
							{isWithdrawDisableLockInCase}
							on:investButtonClick={handleInvestMoreCtaClick}
							on:withdrawButtonClick={handleWithdrawCtaClick}
							on:moreOptionsButtonClick={handleMoreOptionsClick}
						/>
					{:else}
						<article class="fixed inset-0 top-auto z-20 block bg-background-alt p-2 md:hidden">
							<InvestmentDetailsFooterLoader />
						</article>
					{/if}
				{/if}
			{:else}
				<!-- Invest/Redeem Pages (Mobile Layout) -->
				{#if showInvestmentPad}
					{#await getDataforInvestment()}
						<div />
					{:then dataForInvestment}
						<InvestmentPad
							class="block md:hidden"
							schemeData={res?.schemeData}
							previousPaymentDetails={dataForInvestment?.previousPaymentDetails}
							mandateData={dataForInvestment?.mandateData}
							fromInvestmentDetailsPage
						/>
					{/await}
				{:else if showRedemptionPad}
					<RedemptionPad
						holdingDetails={holdingsData}
						isRedemptionNotAllowed={!holdingsData?.redemptionAllowed ||
							!!withdrawDisableText?.length}
						redemptionNotAllowedText={withdrawDisableText}
						{isInvestmentNotAllowed}
						{isWithdrawalStcgLtcgEligible}
						{categoryName}
						{taxationDetails}
						ltcgCurAmount={isWithdrawalStcgLtcgEligible ? taxationDetails?.ltcgCurAmount : 0}
					/>
				{/if}
			{/if}
		</section>

		<!-- Right Side (Desktop Layout) -->
		{#if !isMobile && !isTablet}
			{#if orderPadActiveTab === investmentDetailsFooterEvents?.INVEST}
				<!-- Investment Pad -->
				{#await getDataforInvestment()}
					<div />
				{:then dataForInvestment}
					<InvestmentPad
						class="sticky -top-2 mt-[52px] hidden md:block"
						schemeData={res?.schemeData}
						fromInvestmentDetailsPage
						previousPaymentDetails={dataForInvestment?.previousPaymentDetails}
						mandateData={dataForInvestment?.mandateData}
						investmentNotAllowedText={investDisableText}
					>
						<svelte:fragment slot="header">
							{#if res?.holdingsData}
								<OrderPadHeader
									{orderPadActiveTab}
									on:onHeaderButtonClick={(buttonType) =>
										investmentHeaderButtonClick(buttonType?.detail)}
								/>
							{/if}
						</svelte:fragment>
					</InvestmentPad>
				{/await}
			{:else if orderPadActiveTab === investmentDetailsFooterEvents?.WITHDRAW}
				<!-- Redemption Pad -->
				<article class="sticky -top-2 mt-[52px] h-fit rounded-b-lg shadow-csm">
					<OrderPadHeader
						{orderPadActiveTab}
						on:onHeaderButtonClick={(buttonType) => investmentHeaderButtonClick(buttonType?.detail)}
					/>
					<RedemptionPad
						holdingDetails={holdingsData}
						isRedemptionNotAllowed={!holdingsData?.redemptionAllowed ||
							!!withdrawDisableText?.length}
						redemptionNotAllowedText={withdrawDisableText}
						{isInvestmentNotAllowed}
						{isWithdrawalStcgLtcgEligible}
						{categoryName}
						{taxationDetails}
						ltcgCurAmount={isWithdrawalStcgLtcgEligible ? taxationDetails?.ltcgCurAmount : 0}
					/>
				</article>
			{:else if orderPadActiveTab === investmentDetailsFooterEvents?.SWP}
				<article class="sticky -top-2 mt-[52px] h-fit rounded-lg bg-background-alt shadow-csm">
					<SwpDetails
						schemeData={res.schemeData}
						holdingDetails={holdingsData}
						params={decodedParams}
					/>
				</article>
			{:else if orderPadActiveTab === investmentDetailsFooterEvents?.MORE_OPTIONS}
				<article class="sticky -top-2 mt-[52px] h-fit rounded-lg bg-background-alt shadow-csm">
					<SwitchOptions
						isSwitch={queryParamsObj?.orderpad === 'MORE_OPTIONS'}
						schemeData={res.schemeData}
						switchFlags={holdingsData.switchFlag}
						holdingDetails={holdingsData}
						redemptionNotAllowedText={withdrawDisableText}
						on:handleBackButtonNavigation={() =>
							(orderPadActiveTab = investmentDetailsFooterEvents?.INVEST)}
					/>
				</article>
			{/if}
		{/if}
	{:else}
		<section class="col-span-full">
			<ErrorView
				Icon={PortfolioEmptyIcon}
				heading="No Investment Found"
				contentLine="You have not invested in this fund currently. Explore mutual funds to start a new investment"
				textForButton="EXPLORE MUTUAL FUNDS"
				handleCTAClick={handleErrorNavigation}
			/>
		</section>
	{/if}
	<ModalWithAnimation isModalOpen={isSwitchModalOpen} closeModal={toggleSwitch}>
		<SwitchOptions
			schemeData={res?.schemeData}
			switchFlags={holdingsData.switchFlag}
			holdingDetails={holdingsData}
			redemptionNotAllowedText={withdrawDisableText}
		/>
	</ModalWithAnimation>

	{#if showStayInvestedModal}
		<ModalWithAnimation
			isModalOpen={showStayInvestedModal}
			on:backdropclicked={() => toggleShowStayInvestedModal()}
		>
			<StayInvested
				class="z-60 sm:w-120"
				on:primaryCtaClick={() => toggleShowStayInvestedModal(true)}
				on:secondaryCtaClick={checkWithdrawStcgLtcg}
				currentValue={holdingsData?.currentValue}
				categoryName={res?.schemeData?.categoryName}
				subCategoryName={res?.schemeData?.subCategoryName}
				exitLoadDetails={res?.schemeData?.exitLoadValue || ''}
				scheme={res?.schemeData}
			/>
		</ModalWithAnimation>
	{/if}

	{#if showWithdrawStcgLtcg}
		<ModalWithAnimation
			isModalOpen={showWithdrawStcgLtcg}
			on:backdropclicked={toggleShowWithdrawStcgLtcg}
		>
			<WithdrawStcgLtcg
				class="z-60 sm:w-120"
				categoryName={res?.schemeData?.categoryName || ''}
				{taxationDetails}
				on:continueCtaClick={handleContinueStcgLtcg}
				scheme={res?.schemeData}
			/>
		</ModalWithAnimation>
	{/if}
{/await}
