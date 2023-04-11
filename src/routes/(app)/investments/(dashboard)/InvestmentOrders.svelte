<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import HeaderComponent from './OrderCardComponents/OrderCardHeader.svelte';
	import BodyComponent from './OrderCardComponents/OrderCardBody.svelte';
	import FooterComponent from './OrderCardComponents/OrderCardFooter.svelte';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import type {
		OrdersSummary,
		ProtfolioData,
		ProtfolioDataEntity,
		OrdersResponse
	} from '$lib/types/IInvestments';

	let ordersSummary: OrdersSummary = {
		totalFailedOrders: 0,
		totalProcessingOrders: 0,
		totalScheduledOrders: 0
	};

	const userType = profileStore.userType();

	const handleFooterClick = () => {
		// TODO: Add redirection on footer click
	};

	function hasPassedAllChecks(dRes: { ok: any; data: { status: string; data: { orders: any } } }) {
		return dRes.ok && dRes.data?.status === 'success' && Array.isArray(dRes?.data?.data?.orders);
	}

	const handleCardToggleEvent = () => {
		// TODO: Implement the analytics
		//   const eventMetaData = {
		//     InProgress: inProgressOrders?.value?.length || 0,
		//     Upcoming: upcomingOrders?.value?.length || 0,
		//     Failed: failedOrders?.value?.length || 0
		//   }
		//   ordersDropdownClickAnalytics(eventMetaData)
	};

	const protfolioData: ProtfolioData = {
		inProgress: {
			countIdentifier: 'totalProcessingOrders',
			orderCountStyles: 'text-blue-primary  bg-blue-600',
			title: 'In Progress',
			orders: [],
			textString: 'Status',
			status: 'Processing',
			orderType: 'PROCESSING'
		},
		upComing: {
			countIdentifier: 'totalScheduledOrders',
			orderCountStyles: 'text-blue-primary  bg-blue-600',
			title: 'Upcoming',
			orders: [],
			textString: 'Next payment',
			status: '',
			orderType: 'UPCOMING'
		},
		failed: {
			countIdentifier: 'totalFailedOrders',
			orderCountStyles: 'text-red-500 rounded-full bg-red-500',
			title: 'Failed',
			orders: [],
			textString: 'Status',
			status: '',
			orderType: 'FAILED'
		}
	};
	let availablePortfolios: Array<ProtfolioDataEntity>;
	$: availablePortfolios =
		(Object.keys(protfolioData) as Array<keyof ProtfolioData>)
			.filter((key: keyof ProtfolioData) => protfolioData[key]?.orders?.length > 0)
			.map((key: keyof ProtfolioData) => protfolioData[key]) || [];

	onMount(async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;

		try {
			const res = await useFetch(url + '?summary=true', {}, fetch);

			if (res?.ok) {
				const summaryData = await res.data;

				ordersSummary = summaryData.data.summary;
				let failedOrders: [] | Promise<OrdersResponse> = [];
				let inProgressOrders: [] | Promise<OrdersResponse> = [];
				let upcomingOrders: [] | Promise<OrdersResponse> = [];
				if (ordersSummary.totalFailedOrders > 0) {
					failedOrders = useFetch(url + '?status=ORDER_REJECTED', {}, fetch);
				}
				if (ordersSummary.totalProcessingOrders > 0) {
					inProgressOrders = useFetch(url + '?status=ORDER_PROCESSING', {}, fetch);
				}
				if (ordersSummary.totalScheduledOrders > 0) {
					upcomingOrders = useFetch(url + '?status=ORDER_SCHEDULED', {}, fetch);
				}

				Promise.all([failedOrders, inProgressOrders, upcomingOrders])
					.then((res: any[]) => {
						protfolioData.failed.orders = hasPassedAllChecks(res[0])
							? res[0]?.data?.data?.orders
							: [];
						protfolioData.inProgress.orders = hasPassedAllChecks(res[1])
							? res[1]?.data?.data?.orders
							: [];
						protfolioData.upComing.orders = hasPassedAllChecks(res[2])
							? res[2]?.data?.data?.orders
							: [];
					})
					.catch(() => {
						// TODO: Add Logger
					});
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
					class={`flex h-4 w-4 items-center justify-center rounded-full bg-opacity-10 text-[10px] font-medium ${
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
					{#each portfolio.orders as item (item?.orderId)}
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
