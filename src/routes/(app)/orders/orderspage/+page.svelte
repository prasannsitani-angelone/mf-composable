<script lang="ts">
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount, tick } from 'svelte';
	import type { IOrdersResponse, orderItem } from '$lib/types/IOrderItem';
	import Dashboard from './OrdersDashboard/Dashboard.svelte';
	import type { OrdersSummary } from '$lib/types/IInvestments';
	import TabSelection from './TabSelection/TabSelection.svelte';
	import SipDashboard from './SipBook/SipDashboard.svelte';
	import type { ISipBookData } from '$lib/types/ISipType';
	import { page } from '$app/stores';

	const sipbook = $page.url.searchParams.get('sipbook');
	let activeTab = sipbook ? 'SIPBOOK' : 'ORDERS';
	let inProgressOrders: orderItem[];
	let failedOrders: orderItem[];
	let sipBookData: ISipBookData;
	let ordersSummary: OrdersSummary;
	let ordersDataFetched = false;
	let sipBookDataFetched = false;
	const ordersUrl = `${PUBLIC_MF_CORE_BASE_URL}/orders`;
	const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips`;

	export let data: PageData;
	const getOrders = async () => {
		if (activeTab === 'ORDERS') {
			await getOrdersData();
		} else if (activeTab === 'SIPBOOK') {
			await getSipBookData();
		}
	};

	const getOrdersData = async () => {
		if (ordersDataFetched) {
			return;
		}

		await useFetch(ordersUrl + '?summary=true')
			.then((res) => res.data)
			.then(({ data }: { data: IOrdersResponse }) => {
				ordersSummary = data?.summary;
			});
		let promises = [];
		if (ordersSummary?.totalProcessingOrders) {
			promises.push(
				useFetch(ordersUrl + '?status=ORDER_PROCESSING')
					.then((res) => res.data)
					.then(({ data }: { data: IOrdersResponse }) => {
						inProgressOrders = data?.orders;
					})
			);
		}

		if (ordersSummary?.totalFailedOrders) {
			promises.push(
				useFetch(ordersUrl + '?status=ORDER_REJECTED')
					.then((res) => res.data)
					.then(({ data }: { data: IOrdersResponse }) => {
						failedOrders = data?.orders;
					})
			);
		}
		await Promise.allSettled(promises);
		ordersDataFetched = true;
	};

	const getSipBookData = async () => {
		if (sipBookDataFetched && sipBookData) {
			return;
		}

		await useFetch(sipUrl + '?InvestmentType=SIP')
			.then((res) => res.data)
			.then(({ data }: { data: ISipBookData }) => {
				sipBookData = data;
			});

		sipBookDataFetched = true;
	};

	const handleTabSelection = (tab: string) => {
		if (activeTab !== tab) {
			activeTab = tab;

			if (activeTab === 'ORDERS') {
				goto(`${base}/orders/orderspage`, { replaceState: true });
			} else if (activeTab === 'SIPBOOK') {
				goto(`${base}/orders/orderspage?sipbook=true`, { replaceState: true });
			}
		}
		getOrders();
	};

	onMount(async () => {
		await tick();
		await getOrders();
	});
</script>

<article>
	<!-- Tab Selection -->
	<TabSelection {activeTab} {handleTabSelection} />
	<section class="mt-0 pt-12 pb-8">
		<!-- Orders Dashboard Page -->
		{#if activeTab === 'ORDERS'}
			<Dashboard {ordersSummary} {ordersDataFetched} {inProgressOrders} {failedOrders} {data} />
		{/if}
		<!-- Sip Dashboard -->
		{#if activeTab === 'SIPBOOK' && sipBookDataFetched}
			<SipDashboard {sipBookData} {data} />
		{/if}
	</section>
</article>
