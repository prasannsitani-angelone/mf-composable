<script lang="ts">
	import type { PageData } from './$types';
	import { Button, SEO } from 'svelte-components';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	import type { FAQ } from './type';
	import Modal from '$components/Modal.svelte';
	import FaqHeader from './components/FAQHeader.svelte';
	import { page } from '$app/stores';
	import FaqDetails from './components/FAQDetails.svelte';
	import FaqSkeletonLoader from './components/FAQSkeletonLoader.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import { faqClickAnalytics } from '$lib/analytics/orders/orders';
	export let data: PageData;
	let showAnswer = false;
	let faq: FAQ;
	let title = 'FAQs';
	let selectedIndex = 0;
	const navigateToFAQDetails = (faqData: FAQ, idx: number) => {
		faq = faqData;
		showAnswer = true;
		title = '';
		selectedIndex = idx;
		faqClickAnalytics({
			Status: data?.Status,
			Message: faqData?.question
		});
	};
	const breadCrumbs = [
		{
			text: 'Home',
			href: '/discoverfunds'
		},
		{
			text: 'Orders',
			href: '/orders/orderspage'
		},
		{
			text: 'Order Details',
			href: `/orders/${data.orderId}`
		},
		{
			text: 'FAQs',
			href: `/faq`
		}
	];
	$: deviceType = $page?.data?.deviceType;
	const handleBackNavigation = async () => {
		if (showAnswer) {
			showAnswer = false;
			title = 'FAQs';
			selectedIndex = 0;
		} else {
			history.back();
		}
	};
</script>

<SEO seoTitle="FAQs for orders | Angel One" seoDescription="Get your order related FAQs" />
<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />
{#await data?.api?.getFAQS}
	<FaqSkeletonLoader />
{:then faqData}
	{#if faqData?.ok && faqData?.data?.faqs?.length}
		{#if !deviceType.isMobile}
			<FaqHeader {title} {handleBackNavigation} />
		{/if}
		{#if !showAnswer}
			<section class="rounded-b-lg rounded-t-lg bg-white px-3 md:rounded-t-none md:px-4">
				{#each faqData?.data?.faqs as faq, index (index)}
					<Button
						color="white"
						class="flex !h-auto w-full !transform-none flex-nowrap justify-between rounded-none border-b-[1px] border-b-grey-line !px-0 !pb-2 !pt-3 text-left !font-medium !normal-case text-grey-body hover:!transform-none hover:!border-b-grey-line focus:!border-b-grey-line active:!transform-none md:!pb-5 md:!pt-5 {index ===
							faqData?.data?.faqs?.length - 1 && 'border-none !pb-4 md:!pb-5'}"
						on:click={() => navigateToFAQDetails(faq, index)}
					>
						<div>
							{faq?.question}
						</div>
						<div>
							<WMSIcon name="right-arrow" width={18} height={18} />
						</div>
					</Button>
				{/each}
			</section>
		{/if}
		{#if showAnswer && !deviceType.isMobile}
			<FaqDetails {faq} showContactCard={selectedIndex < faqData?.data?.faqs?.length - 1} />
		{/if}
	{/if}
	<Modal animationDuration={0} isModalOpen={showAnswer && deviceType.isMobile}>
		<div
			class="flex h-full w-screen animate-none flex-col rounded-b-none bg-grey pb-2 shadow-csm md:w-120 md:rounded-lg"
		>
			<FaqHeader {title} {handleBackNavigation} />
			<div class="h-full overflow-auto">
				<FaqDetails {faq} showContactCard={selectedIndex < faqData?.data?.faqs?.length - 1} />
			</div>
		</div>
	</Modal>
{:catch}
	Error
{/await}
