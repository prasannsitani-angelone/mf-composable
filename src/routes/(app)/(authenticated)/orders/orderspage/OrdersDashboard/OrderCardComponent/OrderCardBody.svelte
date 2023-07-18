<script lang="ts">
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import { goto } from '$app/navigation';
	import type { orderItem } from '$lib/types/IOrderItem';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { base } from '$app/paths';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { format } from 'date-fns';
	import { orderDashboardCardClickAnalytics } from '$lib/analytics/orders/orders';
	import { INVESTMENT_TYPE } from '$lib/constants/transactionType';
	import { ORDER_STATUS } from '$lib/constants/orderFlowStatuses';

	export let item: orderItem;
	let investmentTypeText = '';

	const setInvestmentTypeText = () => {
		if (item?.investmentType === 'XSIP') {
			investmentTypeText = 'SIP';
		} else if (
			item?.investmentType === INVESTMENT_TYPE.SWITCH_IN ||
			item?.investmentType === INVESTMENT_TYPE.SWITCH_OUT
		) {
			investmentTypeText = 'SWITCH';
		} else {
			investmentTypeText = item?.investmentType;
		}
	};

	setInvestmentTypeText();

	const getOrderStatusString = (item: { status: string; paymentStatus: string }) => {
		let orderStatus = 'Created';

		if (
			item?.status?.toUpperCase() === 'ORDER_PROCESSING' ||
			item?.paymentStatus?.toUpperCase() === 'PENDING'
		) {
			orderStatus = 'In Progress';
		} else if (item?.status?.toUpperCase() === 'ORDER_SCHEDULED') {
			orderStatus = 'Upcoming';
		} else if (item?.status?.toUpperCase() === ORDER_STATUS.ORDER_COMPLETE) {
			orderStatus = 'Completed';
		} else if (item?.status?.toUpperCase() === 'ORDER_REJECTED') {
			orderStatus = 'Failed';
		}

		return orderStatus;
	};

	const orderCardAnalytics = () => {
		const eventMetaData = {
			FundName: item?.schemeName,
			Type: item?.investmentType,
			Amount: item?.amount,
			Date: format(new Date(item?.createdTs), 'dd/MM/yyyy'),
			Status: getOrderStatusString(item)
		};
		orderDashboardCardClickAnalytics(eventMetaData);
	};

	const handleBodyClick = () => {
		if (item?.status !== 'ORDER_SCHEDULED') {
			orderCardAnalytics();
			goto(`${base}/orders/${item?.orderId}`);
		}
	};
</script>

<section
	class="flex flex-col"
	class:cursor-pointer={item?.status !== 'ORDER_SCHEDULED'}
	on:click={handleBodyClick}
	on:keydown={handleBodyClick}
>
	<ResultItem
		class="justify-between px-0 !pb-0 !pt-3"
		data={{
			logoUrl: item?.logoUrl || '',
			categoryName: investmentTypeText,
			schemeName: item?.schemeName || '-'
		}}
		itemStyle="items-start !px-0"
		categoryContainerStyle="overflow-hidden"
		containerStyle="w-[70%] !pr-0"
		logoStyle="w-9 h-9"
		titleStyle="font-medium overflow-hidden text-ellipsis whitespace-nowrap"
		categoryStyle="font-medium"
	>
		<svelte:fragment slot="schemeInfo">
			<span />
		</svelte:fragment>
		<svelte:fragment slot="ratingSection">
			<span class="mt-1 rounded-sm bg-grey p-1 text-3xs md:text-1xs">{investmentTypeText}</span>
		</svelte:fragment>
		<div class="w-[30%] pl-2" slot="returns">
			<section class="flex w-full flex-col font-medium">
				<article class="truncate text-end text-sm md:text-base">
					{item?.amount > 0
						? `₹${addCommasToAmountString(item?.amount?.toFixed(0))}`
						: item?.quantity > 0
						? item?.quantity?.toFixed(3)
						: ''}
				</article>
				<article class="mt-1 flex w-full justify-end">
					<span
						class="flex items-center justify-end rounded-sm bg-opacity-12 p-1 text-3xs md:text-1xs"
						class:bg-green-buy={item?.status?.toUpperCase() === 'COMPLETED'}
						class:bg-red-sell={item?.status?.toUpperCase() === 'FAILED'}
						class:bg-yellow-primary={item?.status?.toUpperCase() === 'IN PROGRESS'}
					>
						{#if item?.status?.toUpperCase() === 'FAILED'}
							<WMSIcon name="red-exclamation" height={12} width={12} class="mr-1" />
						{:else if item?.status?.toUpperCase() === 'COMPLETED'}
							<WMSIcon name="success-tick-circle-bolder" height={12} width={12} class="mr-1" />
						{:else}
							<WMSIcon name="clock-yellow-bolder" height={12} width={12} class="mr-1" />
						{/if}
						{item.status}
					</span>
				</article>
			</section>
		</div>
	</ResultItem>
</section>
