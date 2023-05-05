<script lang="ts">
	import Header from './Header/HeaderComponent.svelte';
	import type { PageData } from './$types';
	import OrderCard from './Card/OrderCard.svelte';
	import OrderTimeLine from './TimeLine/OrderTimeLine.svelte';
	import OrderTransactions from './Transactions/OrderTransactions.svelte';
	import Footer from './Footer/Footer.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import OrderDetailLoader from './Loader/OrderDetailLoader.svelte';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
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
	export let data: PageData;
</script>

<article class="flex flex-col">
	<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />
	{#await data?.api?.getOrdersData}
		<OrderDetailLoader />
	{:then ordersData}
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
				<OrderCard orderDetails={ordersData.data} showStatusNote={data.showStatusNote} />
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
	{:catch}
		<OrderDetailLoader />
	{/await}
</article>
