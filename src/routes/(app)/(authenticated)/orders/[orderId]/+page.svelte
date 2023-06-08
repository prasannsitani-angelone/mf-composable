<script lang="ts">
	import Header from './Header/HeaderComponent.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import OrderCard from './Card/OrderCard.svelte';
	import OrderTimeLine from './TimeLine/OrderTimeLine.svelte';
	import OrderTransactions from './Transactions/OrderTransactions.svelte';
	import Footer from './Footer/Footer.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import OrderDetailLoader from './Loader/OrderDetailLoader.svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import { base } from '$app/paths';
	import { TRANSACTION_TYPE } from '$lib/constants/transactionType';
	import { Button, SEO, WMSIcon } from 'wms-ui-component';
	import RightArrowIcon from './RightArrowIcon.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { needHelpClickAnalytics } from '$lib/analytics/orders/orders';
	$: breadCrumbs = [
		{
			text: 'Home',
			href: `/`
		},
		{
			text: 'Orders',
			href: '/orders/orderspage'
		},
		{
			text: 'Order Details',
			href: `/orders/${data.orderId}`
		}
	];
	const handleErrorNavigation = () => {
		goto(`${base}/orders/orderspage`);
	};

	const navigateToFAQ = (tag: string | undefined, Status: string | undefined) => {
		if (tag) {
			needHelpClickAnalytics({ Status });
			const params = encodeObject({
				tag: tag,
				orderId: data.orderId,
				Status
			});
			goto(`${base}/faq?params=${params}`);
		}
	};
	// const icon = <WMSIcon name="order-details-error"/>
	export let data: PageData;
</script>

<article class="flex flex-col">
	<SEO
		seoTitle="Order Status Details | Angel One"
		seoDescription="Get your order status details with one click including transaction date, id, charges etc."
	/>
	<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />
	{#await data?.api?.getOrdersData}
		<OrderDetailLoader />
	{:then ordersData}
		{#if ordersData.data}
			<div class="pb-5" class:!pb-20={ordersData.showFooterButton}>
				<Header
					heading={ordersData?.headerContent?.heading}
					title={data.layoutConfig.title}
					subHeadingText={ordersData?.headerContent?.subHeadingText}
					subHeaderClass={ordersData?.headerContent?.subHeaderClass}
					status={ordersData?.headerContent?.status}
					class="border-b border-grey-line sm:border-b-0"
				/>
				<div class="mt-3 px-2 md:px-0">
					<OrderCard orderDetails={ordersData.data} showStatusNote={ordersData.showStatusNote} />
					<div class="mt-3 rounded-lg bg-white px-3 py-3">
						<div
							class="mb-5 text-sm font-medium text-black-title"
							class:!text-base={ordersData?.data?.investmentType?.toUpperCase() === 'REDEEM'}
						>
							{ordersData?.data?.investmentType?.toUpperCase() === 'REDEEM'
								? 'Withdrawal Timeline'
								: 'Order Timeline'}
						</div>
						<OrderTimeLine items={ordersData?.orderStatusItems || []} />
					</div>
					{#if ordersData?.data?.transactionType?.toUpperCase() === TRANSACTION_TYPE.PURCHASE}
						<Button
							color="white"
							class="mt-2 !h-auto w-full !transform-none items-center justify-between !rounded-lg !px-3 !py-3 shadow-csm"
							endAdornment={RightArrowIcon}
							on:click={() => navigateToFAQ(ordersData?.tag, ordersData?.headerContent?.heading)}
						>
							<div class="flex items-center">
								<WMSIcon name="question-mark-circle" class="mr-3" width={18} height={18} />
								<div class="text-left">
									<div class="font-medium capitalize">Need help ?</div>
									<div class="text-xs font-normal capitalize text-grey-body">
										Queries related to order status, charges and more
									</div>
								</div>
							</div>
						</Button>
					{/if}
					<OrderTransactions
						orderDetails={ordersData.data}
						statusItems={ordersData?.statusItems || {}}
					/>
				</div>
				{#if ordersData.showFooterButton}
					<Footer
						isOrderFailedAtExchange={ordersData?.isOrderFailedAtExchange}
						schemeDetails={ordersData?.schemeDetails}
						orderDetailsData={ordersData.data}
					/>
				{/if}
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
