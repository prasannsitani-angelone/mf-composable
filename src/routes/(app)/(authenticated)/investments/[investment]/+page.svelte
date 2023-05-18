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
	import type { FolioHoldingType, ChartData, OrdersData } from '$lib/types/IInvestments';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { getQueryParamsObj } from '$lib/utils/helpers/params';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import InvestmentDetailsFooter from './components/InvestmentDetailsFooter.svelte';
	import { orderpadParentPage } from '../../../InvestmentPad/constants';
	import OrderPadHeader from '../../../InvestmentPad/OrderPadComponents/OrderPadHeader.svelte';
	import { investmentDetailsFooterEvents } from './constants';
	import type { OrderPadTypes } from '$lib/types/IOrderPad';
	import RedemptionPad from '../../../Redemption/RedemptionPad.svelte';
	import { format } from 'date-fns';
	import Modal from '$components/Modal.svelte';
	import SwitchOptions from '$components/Switch/SwitchOptions.svelte';
	import { withdrawFlowStartClickAnalytics } from '$lib/analytics/redemption/redemption';
	import {
		switchHamburgerIconClickAnalytics,
		switchOptionsOpenAnalytics
	} from '$lib/analytics/switch/switch';

	export let data: PageData;

	interface BreadcrumbType {
		text: string;
		href: string;
	}
	let breadCrumbs: BreadcrumbType[];
	$: breadCrumbs = [];
	$: isMobile = $page?.data?.deviceType?.isMobile;
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
	}

	$: {
		setPageData(data.api?.allResponse);
	}

	const handleErrorNavigation = () => goto('/');

	const investmentHeaderButtonClick = (clickedButton: string) => {
		if (clickedButton?.length) {
			orderPadActiveTab = clickedButton;

			if (orderPadActiveTab === 'WITHDRAW') {
				withdrawButtonClickAnalytics();
			}
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
			if (totalBlockedUnits && !totalPledgedUnits && !totalUnitsUnderProcess) {
				withdrawDisableText = 'Withdrawal is disabled as your investment is in lock-in period';
				isWithdrawDisableLockInCase = true;
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
	};

	const setQueryParamsData = () => {
		if (queryParamsObj?.orderpad === 'INVEST') {
			showInvestmentPad = true;
			showRedemptionPad = false;
		} else if (queryParamsObj?.orderpad === 'REDEEM') {
			showRedemptionPad = true;
			showInvestmentPad = false;
			orderPadActiveTab = 'WITHDRAW';
		} else {
			showRedemptionPad = false;
			showInvestmentPad = false;
		}
	};

	afterUpdate(() => {
		queryParamsObj = getQueryParamsObj();
		setQueryParamsData();
	});

	const handleWithdrawCtaClick = () => {
		const currentPath = window?.location?.pathname;
		const redirectPath = `${currentPath}?orderpad=REDEEM`;

		withdrawButtonClickAnalytics();

		goto(redirectPath);
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
</script>

{#await data.api.allResponse}
	<InvestmentDetailsLoader />
{:then res}
	{#if res.holdingsData && Object.keys(res.holdingsData)?.length > 0}
		<!-- Left Side -->
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />

			{#if !isMobile || !(showInvestmentPad || showRedemptionPad)}
				<!-- Investment Details Page (Mobile and Desktop Layout) -->
				<LeftSideView
					holdings={res.holdingsData}
					chartData={res.chartData}
					ordersData={res.ordersData}
					schemeDetails={res.schemeData}
				/>

				{#if res.holdingsData}
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
				{/if}
			{:else}
				<!-- Invest/Redeem Pages (Mobile Layout) -->
				{#if showInvestmentPad}
					{#await data?.api?.previousPaymentDetails}
						<div />
					{:then previousPaymentDetails}
						<InvestmentPad
							class="block md:hidden"
							schemeData={res.schemeData}
							fromInvestmentDetailsPage
							{previousPaymentDetails}
						/>
					{/await}
				{:else if showRedemptionPad}
					<RedemptionPad
						holdingDetails={holdingsData}
						isRedemptionNotAllowed={!holdingsData?.redemptionAllowed ||
							!!withdrawDisableText?.length}
						redemptionNotAllowedText={withdrawDisableText}
						{isInvestmentNotAllowed}
					/>
				{/if}
			{/if}
		</section>

		<!-- Right Side (Desktop Layout) -->
		{#if !isMobile}
			{#if orderPadActiveTab === investmentDetailsFooterEvents?.INVEST}
				<!-- Investment Pad -->
				{#await data?.api?.previousPaymentDetails}
					<div />
				{:then previousPaymentDetails}
					<InvestmentPad
						class="sticky -top-2 mt-[52px] hidden md:block"
						schemeData={res.schemeData}
						fromInvestmentDetailsPage
						investmentNotAllowedText={investDisableText}
						{previousPaymentDetails}
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
	<Modal isModalOpen={isSwitchModalOpen} closeModal={toggleSwitch}>
		<SwitchOptions
			schemeData={res.schemeData}
			switchFlags={holdingsData.switchFlag}
			holdingDetails={holdingsData}
			redemptionNotAllowedText={withdrawDisableText}
		/>
	</Modal>
{/await}
