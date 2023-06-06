<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import ErrorView from '$components/ErrorView.svelte';
	import { base } from '$app/paths';
	import { WMSIcon, SEO, SwitchOrderTitleCard, Button, SwitchOrderTile } from 'wms-ui-component';
	import OrderDetailLoader from '../../../orders/[orderId]/Loader/OrderDetailLoader.svelte';
	import OrderTimeLine from '../../../orders/[orderId]/TimeLine/OrderTimeLine.svelte';
	import SwitchOrderStatusCard from './SwitchOrderStatusCard/SwitchOrderStatusCard.svelte';
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { switchOrderSummaryFooterCtaClickAnalytics } from '$lib/analytics/switch/switch';

	const handleCtaRedirection = () => {
		switchOrderSummaryFooterCtaClickAnalytics();
		goto(`${base}/orders/orderspage`);
	};

	const handleErrorNavigation = () => {
		handleCtaRedirection();
	};

	export let data: PageData;
</script>

<article class="flex flex-col">
	{#await data?.api?.getOrdersData}
		<OrderDetailLoader />
	{:then ordersDetails}
		<SEO
			seoTitle="Order Summary Details | Angel One"
			seoDescription="Your order status details with one click including transaction date, id, charges etc."
		/>
		{#if ordersDetails?.ordersData}
			<div class="pb-20">
				<!-- Header -->
				<SwitchOrderStatusCard
					heading={ordersDetails?.headerContent?.heading}
					subHeading={ordersDetails?.headerContent?.subHeading}
				/>

				<!-- Switch Order Details Card -->
				<AccordianCardComponent
					class="!mt-0 !max-w-8xl !rounded-none border-t border-grey-line bg-white text-sm shadow-csm md:!mt-4 md:mb-2 md:!rounded-lg md:border-none"
					data={{
						title: ''
					}}
					disableCollapse={true}
				>
					<svelte:fragment slot="accordionHeader">
						<span />
					</svelte:fragment>

					<svelte:fragment slot="accordionBody">
						<section class="px-5 py-2 sm:pt-5 sm:pb-6">
							<div class="mt-2 mb-4 text-lg font-medium text-black-title">Switch Details</div>
							<SwitchOrderTitleCard class="!mb-0">
								<svelte:fragment slot="switchOut">
									<SwitchOrderTile
										logoUrl={ordersDetails?.ordersData?.logoUrl}
										schemeName={ordersDetails?.ordersData?.schemeName}
										orderTypeText="SWITCH OUT"
										orderTypeBgColor="bg-yellow-primary"
										schemeNameClass="!text-base"
									/>
								</svelte:fragment>
								<svelte:fragment slot="switchIn">
									<SwitchOrderTile
										logoUrl={ordersDetails?.ordersData?.toSchemeLogoUrl}
										schemeName={ordersDetails?.ordersData?.toSchemeName}
										orderTypeText="SWITCH IN"
										orderTypeBgColor="bg-purple-primary"
										schemeNameClass="!text-base"
									/>
								</svelte:fragment>
							</SwitchOrderTitleCard>
							<div
								class="flex flex-col justify-between py-2 sm:mx-0 sm:mt-4 sm:flex-row sm:rounded-lg sm:border sm:border-grey-line sm:bg-grey sm:py-6 md:px-4"
							>
								<div
									class="flex flex-row items-center justify-between border-b border-grey-line py-3 sm:flex-col sm:border-none sm:py-0"
								>
									<span
										class="text-sm font-normal text-grey-body sm:mb-1 sm:text-xs sm:font-medium"
									>
										Amount</span
									>
									<span class="text-base font-medium text-black-title">
										₹{addCommasToAmountString(ordersDetails?.ordersData?.amount)}
									</span>
								</div>
								<div class="flex flex-row items-center justify-between py-3 sm:flex-col sm:py-0">
									<span
										class="text-sm font-normal text-grey-body sm:mb-1 sm:text-xs sm:font-medium"
									>
										Estimated By</span
									>
									<span class="text-base font-medium text-black-title">
										{ordersDetails?.estimatedETA}
									</span>
								</div>
							</div>
						</section>
					</svelte:fragment>
				</AccordianCardComponent>

				<!-- Order Timeline -->
				<div class="bg-white p-4 !pt-2 md:mx-0 md:mt-4 md:rounded-lg md:p-6 md:!pt-4">
					<div class="mb-5 text-lg font-medium text-black-title">Order Status</div>
					<OrderTimeLine
						items={ordersDetails?.orderStatusItems || []}
						titleClass="!font-medium"
						subTitleClass="!font-medium"
					/>
				</div>

				<!-- Mobile view footer button -->
				<article class="mx-3 mt-4 block md:hidden">
					<section class="fixed inset-0 top-auto bg-white px-4 py-2 {$$props?.class}">
						<Button class="w-full" on:click={handleCtaRedirection}>GO TO ORDERS</Button>
					</section>
				</article>

				<!-- Desktop view footer button -->
				<article class="mt-6 hidden w-full text-right md:block {$$props?.class}">
					<Button class="w-6/12 sm:max-w-21" on:click={handleCtaRedirection}>
						GO TO DASHBOARD
					</Button>
				</article>
			</div>
		{:else}
			<ErrorView
				heading="Order Details Unavailable"
				contentLine="The link you are trying to reach is not valid. Please go to orders to check your recent orders"
				textForButton="GO TO ORDERS"
				on:errorCTAClicked={handleErrorNavigation}
			>
				<svelte:fragment slot="icon">
					<WMSIcon height={160} width={160} name="order-details-error" />
				</svelte:fragment>
			</ErrorView>
		{/if}
	{:catch}
		<ErrorView
			heading="Order Details Unavailable"
			contentLine="The link you are trying to reach is not valid. Please go to orders to check your recent orders"
			textForButton="GO TO ORDERS"
			on:errorCTAClicked={handleErrorNavigation}
		>
			<svelte:fragment slot="icon">
				<WMSIcon height={160} width={160} name="order-details-error" />
			</svelte:fragment>
		</ErrorView>
	{/await}
</article>
