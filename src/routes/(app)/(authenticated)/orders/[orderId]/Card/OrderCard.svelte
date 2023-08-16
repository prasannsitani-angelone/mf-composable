<script lang="ts">
	import { ORDER_STATUS } from '$lib/constants/orderFlowStatuses';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import OrderCardHeader from './OrderCardHeader.svelte';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { TRANSACTION_MAP, TRANSACTION_TYPE } from '$lib/constants/transactionType';
	import InfoPopup from '$components/Popup/InfoPopup.svelte';
	import { NAV_DETAILS } from '$lib/constants/order';
	import type { IOrderDetails } from '$lib/types/IOrderDetails';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { getExpectedCreditDate, getExpectedNavDate } from '$lib/utils/helpers/order';
	import {
		expectedNavDateCloseAnalytics,
		expectedNavDateOpenAnalytics
	} from '../analytics/navDate';
	let orderDetails: IOrderDetails;
	let showStatusNote: boolean | undefined;
	let isModalOpen: boolean;
	$: amountDecimalPlaces =
		orderDetails?.transactionType === 'REDEEM' || orderDetails?.transactionType === 'SWITCH'
			? 2
			: 0;

	const handleOpenExpectedNavDateModal = () => {
		isModalOpen = true;
		expectedNavDateOpenAnalytics(orderDetails);
	};

	const handleCloseExpectedNavDateModal = () => {
		isModalOpen = false;
		expectedNavDateCloseAnalytics();
	};
	export { orderDetails, showStatusNote };
</script>

<div class="grid grid-cols-1 divide-y rounded-lg bg-white px-3 py-4 shadow-csm">
	<OrderCardHeader {orderDetails} />
	<div class={`grid grid-cols-3 items-center justify-between  divide-x pt-3 ${$$props.class}`}>
		<div class="text-left">
			<span class="text-1xs text-grey-body md:text-xs">Amount</span>
			<p class="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-black-title">
				₹ {addCommasToAmountString(
					parseFloat(orderDetails?.amount.toFixed(amountDecimalPlaces))?.toString()
				)}
			</p>
		</div>
		<div class="text-center">
			<span class="text-1xs text-grey-body md:text-xs">Order Type</span>
			<p class="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-black-title">
				{TRANSACTION_MAP[orderDetails?.investmentType?.toUpperCase()]}
			</p>
		</div>
		<div class="text-right">
			{#if orderDetails?.status?.toUpperCase() === ORDER_STATUS.ORDER_COMPLETE}
				<span class="text-1xs text-grey-body md:text-xs"> NAV date </span>
				<p class="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-black-title">
					{getDateTimeString((orderDetails?.actualNavDate || 0) * 1000, 'DATE', true)}
				</p>
			{:else if orderDetails?.transactionType?.toUpperCase() === TRANSACTION_TYPE.REDEEM}
				<span class="flex items-center justify-end gap-1 text-1xs text-grey-body md:text-xs">
					Ex. Credit Date
				</span>
				<p class="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-black-title">
					{orderDetails?.status?.toUpperCase() === ORDER_STATUS.ORDER_REJECTED
						? '-- --'
						: getExpectedCreditDate(orderDetails)}
				</p>
			{:else}
				<span class="flex items-center justify-end gap-1 text-1xs text-grey-body md:text-xs">
					Ex. NAV Date
					{#if orderDetails?.status?.toUpperCase() !== ORDER_STATUS.ORDER_REJECTED}
						<WMSIcon
							height={16}
							width={16}
							class="ml-1 cursor-pointer"
							name="info-in-circle"
							on:click={handleOpenExpectedNavDateModal}
						/>
						<InfoPopup
							detailText={NAV_DETAILS}
							{isModalOpen}
							closeModal={handleCloseExpectedNavDateModal}
						>
							<svelte:fragment slot="popupHeader">
								<div class="flex items-center justify-between px-4 pb-3 pt-6 md:px-8 md:py-6">
									<span class="text-lg font-medium text-black-title md:text-xl">
										Expected NAV Date
									</span>
								</div>
							</svelte:fragment>
						</InfoPopup>
					{/if}
				</span>
				<p class="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-black-title">
					{orderDetails?.status?.toUpperCase() === ORDER_STATUS.ORDER_REJECTED
						? '-- --'
						: getExpectedNavDate(orderDetails)}
				</p>
			{/if}
		</div>
	</div>
	{#if showStatusNote}
		<div class="mt-3 rounded bg-purple-background px-3 py-2 text-sm text-black-title">
			You will receive a refund to your source bank account in 5-7 working days
		</div>
	{/if}
</div>
