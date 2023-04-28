<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import OrderCardBody from '../../../investments/(dashboard)/OrderCardComponents/OrderCardBody.svelte';
	import OrderCardHeader from '../../../investments/(dashboard)/OrderCardComponents/OrderCardHeader.svelte';
	import type { OrdersSummary } from '$lib/types/IInvestments';
	import type { orderItem } from '$lib/types/IOrderItem';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import OrderCardFooter from '../../../investments/(dashboard)/OrderCardComponents/OrderCardFooter.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { page } from '$app/stores';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/object';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	import { failedOrdersRetryCtaClickAnalytics } from '$lib/analytics/orders/orders';
	import { OnNavigation } from '$lib/utils/navigation';
	let ordersSummary: OrdersSummary;
	let failedOrders: orderItem[];
	let schemeDetails: SchemeDetails;
	const FailedPortofolioData = {
		title: 'Failed'
	};
	const appContext: AppContext = getContext('app');

	const handleFooterClick = async (e: CustomEvent) => {
		failedOrdersRetryCtaClickAnalytics();
		const orderItem: orderItem = e.detail;
		const schemeUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${orderItem?.isin}`;
		const schemeResponse = await useFetch(schemeUrl);
		if (schemeResponse.ok) {
			schemeDetails = schemeResponse?.data;
			// TODO: To change the navigation after the proper release
			const reRouteUrl = 'schemes';
			const path = `${reRouteUrl}/${normalizeFundName(
				schemeDetails?.schemeName,
				schemeDetails?.isin,
				schemeDetails?.schemeCode
			)}`;
			const params = encodeObject({
				orderId: orderItem?.orderId,
				pgTxnId: orderItem?.pgTxnId,
				investmentType: orderItem?.investmentType,
				investmentAmount: orderItem?.amount
			});
			OnNavigation();
			goto(
				`${getNavigationBaseUrl(
					base,
					appContext.scheme,
					appContext.host
				)}/${path}?orderpad=INVEST&params=${params}`
			);
		}
	};
	const userType = profileStore.userType();
	export { ordersSummary, failedOrders };
</script>

{#if ordersSummary?.totalFailedOrders && failedOrders?.length}
	<AccordianCardComponent
		class="mt-2 max-w-4xl rounded-lg bg-white text-sm shadow-csm lg:mt-4"
		data={FailedPortofolioData}
		titleFontSize="text-base"
		titleStyle="ml-1"
		disableCollapse={true}
		header-class="!cursor-default"
	>
		<div slot="titleIcon">
			<div
				class="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 bg-opacity-10 text-[10px] font-medium text-red-500"
			>
				<span>
					{ordersSummary?.totalFailedOrders}
				</span>
			</div>
		</div>

		<div slot="accordionBody">
			<section class="-mt-4 px-3 pb-2">
				<!-- Card -->
				{#each failedOrders as item}
					<article class="my-4 rounded-lg border">
						<OrderCardHeader
							textString="Order Date"
							status={getDateTimeString(item?.createdTs, 'DATE', true)}
							orderType="FAILED"
						/>
						<OrderCardBody {item} />
						{#if isInvestmentAllowed(userType, item?.schemePlan) && item?.paymentStatus === 'failure' && item?.investmentType !== 'XSIP'}
							<OrderCardFooter {item} on:buttonCta={handleFooterClick} />
						{/if}
					</article>
				{/each}
			</section>
		</div>
	</AccordianCardComponent>
{/if}
