<script lang="ts">
	import type { PageData } from './$types';
	import { afterUpdate, onMount } from 'svelte';
	import { SEO, SkeletonRectangle } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	import type { FAQ, FaqParams } from './type';
	import { page } from '$app/stores';
	import FaqsSkeletonLoader from './components/FaqsSkeletonLoader.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import { faqClickAnalytics } from '$lib/analytics/orders/orders';
	import { goto } from '$app/navigation';
	import { decodeToObject, encodeObject, getQueryParamsObj } from '$lib/utils/helpers/params';
	import { base } from '$app/paths';
	import FaqHeader from './components/FAQHeader.svelte';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import OrderCardHeader from '../(authenticated)/orders/orderspage/OrdersDashboard/OrderCardComponent/OrderCardHeader.svelte';
	import OrderCardBody from '../(authenticated)/orders/orderspage/OrdersDashboard/OrderCardComponent/OrderCardBody.svelte';
	import {
		faqTicketCtaClick,
		faqsScreenFaqsViewAllCtaClick,
		faqsScreenImpression,
		faqsScreenOrdersViewAllCtaClick
	} from '$lib/analytics/faqs/faqs';
	import { browser } from '$app/environment';
	import { PUBLIC_TICKETING_URL } from '$env/static/public';

	export let data: PageData;

	$: deviceType = $page?.data?.deviceType;
	$: queryParamsObj = <FaqParams>{};

	let viewAll = false;
	let faqsSource = '';

	const setFaqsSource = () => {
		if (data?.tag === 'investments') {
			faqsSource = 'Investments';
		} else if (data?.tag === 'sips') {
			faqsSource = 'SIPBook';
		} else if (data?.tag === 'orders') {
			faqsSource = 'Orders';
		} else if (data?.tag === 'all') {
			faqsSource = 'All';
		}
	};

	setFaqsSource();

	const navigateToFAQDetails = (faqData: FAQ, idx: number) => {
		if (data?.Status?.length) {
			faqClickAnalytics({
				Status: data?.Status,
				Message: faqData?.question
			});
		}

		if ($page?.url?.search?.length && $page?.url?.search?.includes('params=')) {
			const encodedParamsString = $page?.url?.search?.split('params=')[1]?.split('&')[0] || '';
			const paramsObj = decodeToObject(encodedParamsString) || {};
			paramsObj.selectedFaqIndex = idx;
			paramsObj.showRecentOrders = data?.showRecentOrders;
			const faqParams = encodeObject(paramsObj);

			goto(`${base}/faqs/solution?params=${faqParams}`);
		}
	};

	const breadCrumbs = [
		{
			text: 'Home',
			href: '/discoverfunds'
		}
	];

	if (!data?.showRecentOrders) {
		breadCrumbs.push({
			text: 'Orders',
			href: '/orders/orderspage'
		});
		breadCrumbs.push({
			text: 'Order Details',
			href: `/orders/${data.orderId}`
		});
	}

	breadCrumbs.push({
		text: 'FAQs',
		href: `/faqs`
	});

	const updateCurrentParams = () => {
		const pathName = window?.location?.pathname;
		const searchParams = window?.location?.search;
		const redirectPath = `${pathName}${searchParams}&viewAll=true`;

		goto(redirectPath, { replaceState: true });
	};

	const toggleViewAll = () => {
		faqsScreenFaqsViewAllCtaClick({
			Source: faqsSource
		});
		updateCurrentParams();
	};

	const setQueryParamsData = () => {
		if (queryParamsObj?.viewAll === 'true') {
			viewAll = true;
		} else {
			viewAll = false;
		}
	};

	const redirectToOrdersDashbboard = () => {
		faqsScreenOrdersViewAllCtaClick({
			Source: faqsSource
		});

		goto(`${base}/orders/orderspage`);
	};

	afterUpdate(() => {
		queryParamsObj = getQueryParamsObj();
		setQueryParamsData();
	});

	onMount(() => {
		faqsScreenImpression({
			Source: faqsSource
		});
	});

	const openTicketApplication = () => {
		faqTicketCtaClick({
			Source: faqsSource
		});
		window.open(PUBLIC_TICKETING_URL, '_blank');
	};
</script>

<SEO seoTitle="FAQs for orders | Angel One" seoDescription="Get your order related FAQs" />
<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />
{#await data?.api?.getFAQS}
	<FaqsSkeletonLoader />
{:then faqData}
	<section class="mb-2 grid grid-cols-[100%] md:grid-cols-[66%,34%] md:gap-x-6">
		{#await data?.api?.getOrders}
			<span class="col-start-1 row-start-1 md:col-start-2 md:row-span-3" />
		{:then ordersData}
			{#if data?.showRecentOrders && ordersData?.data?.data?.orders?.length}
				{@const ordersList = ordersData?.data?.data?.orders?.splice(0, 2) || []}
				<article class="col-start-1 row-start-1 md:col-start-2 md:row-span-3">
					<section
						class="mb-2 mt-2 rounded-b-lg rounded-t-lg bg-white px-3 shadow-csm md:mb-0 md:mt-0 md:px-4"
					>
						<div class="rounded-t-lg py-3 text-base font-normal md:py-4">Recent orders</div>

						{#each ordersList as item (item?.orderId)}
							<article class="mb-3 rounded-lg bg-white px-2 py-4 shadow-csm md:px-4">
								<OrderCardHeader textString={getDateTimeString(item?.createdTs, 'DATE', true)} />
								<OrderCardBody {item} />
							</article>
						{/each}

						<article class="flex items-center justify-end py-4">
							<ButtonMedium
								variant="transparent"
								class="!h-fit !min-h-0 cursor-default !px-0 md:cursor-pointer"
								onClick={redirectToOrdersDashbboard}
							>
								VIEW ALL
							</ButtonMedium>

							<WMSIcon class="ml-1" name="right-arrow" stroke="#3F5BD9" width={18} height={18} />
						</article>
					</section>
				</article>
			{/if}
		{/await}

		{#if faqData?.ok && faqData?.data?.faqs?.length}
			{@const faqsArray = viewAll ? faqData?.data?.faqs : faqData?.data?.faqs?.slice(0, 5)}

			<article class="col-start-1 row-start-2 md:row-span-6 md:row-start-1">
				{#if !data?.showRecentOrders && !deviceType?.isMobile}
					<FaqHeader
						title={data?.redirectedFrom === 'ordersummary' ? 'Order FAQs' : 'FAQs'}
						handleBackNavigation={() => {
							history?.back();
						}}
					/>
				{/if}
				<section
					class="rounded-b-lg rounded-t-lg bg-white px-3 md:px-4 {!data?.showRecentOrders
						? 'md:rounded-t-none'
						: ''} shadow-csm"
				>
					{#if data?.showRecentOrders}
						<div class="rounded-t-lg py-3 text-base font-normal md:py-4">
							<span class="capitalize">{data?.tag === 'sips' ? 'SIPs' : data?.tag}</span> FAQs
						</div>
					{/if}

					{#each faqsArray as faq, index (index)}
						<ButtonMedium
							color="white"
							class="flex !h-auto w-full !transform-none flex-nowrap justify-between rounded-none border-b-[1px] border-b-grey-line !px-0 !pb-2 !pt-3 text-left !font-normal !normal-case text-grey-body hover:!transform-none hover:!border-b-grey-line focus:!border-b-grey-line active:!transform-none md:!pb-5 md:!pt-5 {index ===
								faqData?.data?.faqs?.length - 1 && 'border-none !pb-4 md:!pb-5'}"
							on:click={() => navigateToFAQDetails(faq, index)}
						>
							<div>
								{faq?.question}
							</div>
							<div>
								<WMSIcon name="right-arrow" width={18} height={18} />
							</div>
						</ButtonMedium>
					{/each}

					{#if !viewAll && faqData?.data?.faqs?.length > 5}
						<article class="flex items-center justify-center py-4">
							<ButtonMedium
								variant="transparent"
								class="!h-fit !min-h-0 cursor-default !px-0 md:cursor-pointer"
								onClick={toggleViewAll}
							>
								VIEW ALL
							</ButtonMedium>
						</article>
					{/if}
				</section>
			</article>
		{/if}

		<div class="row-start-3 mt-2 md:col-start-2 md:row-start-auto">
			{#if browser}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="w-full rounded-lg bg-white p-2 shadow-csm active:opacity-60"
					on:click={openTicketApplication}
				>
					<div class="flex flex-row items-center justify-between rounded bg-grey p-3">
						<div class="flex flex-row items-center">
							<WMSIcon name="ticket" class="h-8 w-8" />
							<div class="ml-2 flex flex-col">
								<div class="text-sm font-normal text-black-title">Your Tickets</div>
								<div class="text-xs font-normal text-grey-body">Create and track your Ticket</div>
							</div>
						</div>
						<WMSIcon name="right-arrow" />
					</div>
				</div>
			{:else}
				<SkeletonRectangle class="h-20 w-full" />
			{/if}
		</div>
	</section>
{:catch}
	Error
{/await}
