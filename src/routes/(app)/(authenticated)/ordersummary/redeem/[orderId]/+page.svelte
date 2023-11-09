<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import ErrorView from '$components/ErrorView.svelte';
	import { base } from '$app/paths';
	import { SEO } from 'svelte-components';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	import OrderDetailLoader from '../../../orders/[orderId]/Loader/OrderDetailLoader.svelte';
	import OrderTimeLine from '../../../orders/[orderId]/TimeLine/OrderTimeLine.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import Button from '$components/Button.svelte';
	import SummaryHeader from './SummaryHeader.svelte';
	import SummaryDetails from './SummaryDetails.svelte';
	import { withdrawOrderSummaryFooterCtaClickAnalytics } from '$lib/analytics/redemption/redemption';
	import { INVESTMENT_TYPE } from '$lib/constants/transactionType';

	let showExpectedNavDateModal = false;

	const toggleShowExpectedNavDateModal = () => {
		showExpectedNavDateModal = !showExpectedNavDateModal;
	};

	const handleCtaRedirection = (sendButtonClickAnalyticsEvent = false, eventMetadata?: unknown) => {
		if (sendButtonClickAnalyticsEvent) {
			withdrawOrderSummaryFooterCtaClickAnalytics(eventMetadata);
		}

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

		{#if ordersDetails}
			{@const investmentType = ordersDetails?.ordersData?.investmentType}
			<div class="pb-20">
				<!-- Header -->
				<SummaryHeader
					heading={ordersDetails?.headerContent?.heading}
					subHeading={ordersDetails?.headerContent?.subHeading}
				/>

				<!-- Details Section -->
				<SummaryDetails
					ordersData={ordersDetails?.ordersData}
					statusItems={ordersDetails?.statusItems}
					amountTitle={ordersDetails?.amountTitle}
					displayAmountUnit={ordersDetails?.displayAmountUnit}
					sectionTitle={`${investmentType === INVESTMENT_TYPE.SWP ? 'SWP' : 'Withdrawal'} Details`}
					on:infoIconClick={toggleShowExpectedNavDateModal}
				/>

				<!-- Order Timeline -->
				<div class="mx-2 mt-2 rounded-lg bg-white p-4 shadow-csm md:mx-0 md:mt-4 md:p-6">
					<div class="mb-5 text-lg font-normal text-black-title">
						{investmentType === INVESTMENT_TYPE.SWP ? 'SWP' : 'Withdrawal'} Status
					</div>
					<OrderTimeLine
						items={ordersDetails?.orderStatusItems || []}
						titleClass="!font-normal"
						subTitleClass="!font-normal"
					/>
				</div>

				<!-- Mobile view footer button -->
				<article class="mx-3 mt-4 block md:hidden">
					<section class="fixed inset-0 top-auto bg-white px-4 py-2 {$$props?.class}">
						<Button
							class="w-full"
							onClick={() => handleCtaRedirection(true, ordersDetails?.eventMetadata)}
						>
							GO TO ORDERS
						</Button>
					</section>
				</article>

				<!-- Desktop view footer button -->
				<article class="mt-6 hidden w-full text-right md:block {$$props?.class}">
					<Button
						class="w-6/12 sm:max-w-21"
						onClick={() => handleCtaRedirection(true, ordersDetails?.eventMetadata)}
					>
						GO TO DASHBOARD
					</Button>
				</article>

				<!-- Expected NAV Date Modal -->
				<InfoModal
					showModal={showExpectedNavDateModal}
					heading="Expected NAV Date"
					detailText="NAV date for withdrawal is subject to order being successful on BSE STAR before cut-off. Your actual NAV date may differ."
					on:crossClicked={toggleShowExpectedNavDateModal}
				/>
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
