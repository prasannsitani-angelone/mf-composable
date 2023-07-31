<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import FaqDetails from '../components/FAQDetails.svelte';
	import FaqHeader from '../components/FAQHeader.svelte';
	import FaqSolutionSkeletonLoader from './components/FaqSolutionSkeletonLoader.svelte';
	import type { PageData } from './$types';

	$: deviceType = $page?.data?.deviceType;

	export let data: PageData;

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
		href: `/faqs/solution`
	});
</script>

<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />
<section class="-mx-2 -my-2 md:mx-0 md:my-0">
	{#await data?.api?.getFAQS}
		<FaqSolutionSkeletonLoader />
	{:then faqData}
		{#if !deviceType?.isMobile}
			<FaqHeader
				title={''}
				handleBackNavigation={() => {
					history?.back();
				}}
			/>
		{/if}
		<FaqDetails
			faq={faqData?.data?.faqs[data?.selectedFaqIndex]}
			showContactCard={data?.selectedFaqIndex === faqData?.data?.faqs?.length - 1}
		/>
	{/await}
</section>
