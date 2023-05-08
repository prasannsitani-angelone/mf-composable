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
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import { base } from '$app/paths';
	import { WMSIcon } from 'wms-ui-component';
	const appContext: AppContext = getContext('app');
	$: breadCrumbs = [
		{
			text: 'Home',
			href: `${getNavigationBaseUrl('', appContext.scheme, appContext.host)}/`
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
	// const icon = <WMSIcon name="order-details-error"/>
	export let data: PageData;
</script>

<article class="flex flex-col">
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
						<div class="mb-5 text-lg font-medium text-black-title">
							{ordersData?.data?.investmentType?.toUpperCase() === 'REDEEM'
								? 'Withdrawal Timeline'
								: 'Order Timeline'}
						</div>
						<OrderTimeLine items={ordersData?.orderStatusItems || []} />
					</div>
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
