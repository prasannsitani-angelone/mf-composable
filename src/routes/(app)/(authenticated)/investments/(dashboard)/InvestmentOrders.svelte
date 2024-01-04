<script lang="ts">
	import { goto } from '$app/navigation';
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import HeaderComponent from './OrderCardComponents/OrderCardHeader.svelte';
	import BodyComponent from './OrderCardComponents/OrderCardBody.svelte';
	import FooterComponent from './OrderCardComponents/OrderCardFooter.svelte';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { onMount, tick } from 'svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import type {
		OrdersSummary,
		ProtfolioData,
		ProtfolioDataEntity,
		OrdersEntity
	} from '$lib/types/IInvestments';
	import {
		failedOrdersRetryCtaClickAnalytics,
		ordersDropdownClickAnalytics
	} from '$lib/analytics/orders/orders';
	import { userStore } from '$lib/stores/UserStore';

	let ordersSummary: OrdersSummary = {
		totalFailedOrders: 0,
		totalProcessingOrders: 0,
		totalScheduledOrders: 0
	};

	const userType = userStore.userType();

	/**
	 * handleFooterCtaClick: Function to redirect user to payments page for the particular order.
	 *
	 */
	const handleFooterClick = async (e: { detail: OrdersEntity }) => {
		failedOrdersRetryCtaClickAnalytics();
		const orderItem = e.detail || {};
		const schemeUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${orderItem?.isin}`;
		const res = await useFetch(schemeUrl, {}, fetch);
		let schemeDetails = res.data;

		//TODO: This redirect to be revisited post order pad implementation to handle retry link
		const reRouteUrl = './schemes';
		const encodedQuery = encodeObject({
			orderId: orderItem?.orderId,
			pgTxnId: orderItem?.pgTxnId,
			investmentType: orderItem?.investmentType,
			investmentAmount: orderItem?.amount,
			require2FA: false
		});

		let redirectPath = `${reRouteUrl}/${normalizeFundName(
			schemeDetails?.schemeName,
			schemeDetails?.isin,
			schemeDetails?.schemeCode
		)}?orderpad=INVEST&params=${encodedQuery}`;
		goto(redirectPath);
	};

	function hasPassedAllChecks(dRes: { ok: any; data: { status: string; data: { orders: any } } }) {
		return dRes.ok && dRes.data?.status === 'success' && Array.isArray(dRes?.data?.data?.orders);
	}

	const handleCardToggleEvent = () => {
		const eventMetaData = {
			InProgress: protfolioData.inProgress?.orders?.length || 0,
			Upcoming: protfolioData?.upComing?.orders?.length || 0,
			Failed: protfolioData?.failed?.orders?.length || 0
		};
		ordersDropdownClickAnalytics(eventMetaData);
	};

	const protfolioData: ProtfolioData = {
		upComing: {
			countIdentifier: 'totalScheduledOrders',
			orderCountStyles: 'text-blue-primary  bg-blue-600',
			title: 'Upcoming',
			orders: [],
			textString: 'Next payment',
			status: '',
			orderType: 'UPCOMING'
		}
	};
	let availablePortfolios: Array<ProtfolioDataEntity>;
	$: availablePortfolios =
		(Object.keys(protfolioData) as Array<keyof ProtfolioData>)
			.filter((key: keyof ProtfolioData) => protfolioData[key]?.orders?.length > 0)
			.map((key: keyof ProtfolioData) => protfolioData[key]) || [];

	onMount(async () => {
		await tick();
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;

		try {
			const res = await useFetch(url + '?summary=true', {}, fetch);

			if (res?.ok) {
				const summaryData = await res.data;

				ordersSummary = summaryData.data.summary;
				if (ordersSummary.totalScheduledOrders > 0) {
					useFetch(url + '?status=ORDER_SCHEDULED', {}, fetch)
						.then((res) => {
							protfolioData.upComing.orders = hasPassedAllChecks(res)
								? res?.data?.data?.orders || []
								: [];
						})
						.catch(() => {
							// TODO: Add Logger
						});
				}
			}
		} catch (e) {
			//TODO: Add Logger
		}
	});
</script>

<section>
	{#each availablePortfolios as portfolio (portfolio.countIdentifier)}
		<AccordianCardComponent
			data={{
				title: portfolio.title
			}}
			titleFontSize="text-base"
			titleStyle="ml-1"
			on:cardToggled={handleCardToggleEvent}
		>
			<svelte:fragment slot="titleIcon"
				><div
					class={`flex h-4 w-4 items-center justify-center rounded-full bg-opacity-10 text-[10px] font-normal ${
						portfolio.orderCountStyles || ''
					}`}
				>
					<span>
						{ordersSummary[portfolio.countIdentifier]}
					</span>
				</div></svelte:fragment
			>
			<svelte:fragment slot="accordionBody">
				<section class="border-t px-3 pb-2">
					<!-- Card -->
					{#each portfolio.orders as item (item?.orderId + item?.isin)}
						<article class="my-4 rounded-lg border">
							<!-- Header -->
							<HeaderComponent
								textString={portfolio.textString}
								status={portfolio.title !== 'Upcoming'
									? portfolio.status
									: getDateTimeString(item?.createdTs, 'DATE')}
								orderType={portfolio.orderType}
							/>

							<!-- Body -->
							<BodyComponent {item} />

							<!-- Footer -->
							{#if portfolio.title === 'Failed'}
								{#if isInvestmentAllowed(userType, item?.schemePlan) && item?.paymentStatus === 'failure' && item?.investmentType !== 'XSIP'}
									<FooterComponent {item} on:buttonCta={handleFooterClick} />
								{/if}
							{/if}
						</article>
					{/each}
				</section>
			</svelte:fragment>
		</AccordianCardComponent>
	{/each}
</section>
