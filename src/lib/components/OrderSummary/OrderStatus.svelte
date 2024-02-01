<script lang="ts">
	import { BtnVariant, Button, WMSIcon } from 'svelte-components';
	import OrderStatusDetails from './OrderStatusDetails.svelte';
	import StatusTile from '../../../routes/(app)/(authenticated)/ordersummary/StatusTile/StatusTile.svelte';
	import type {
		OrderSummarySchemeDataTypes,
		StatusHistoryItem
	} from '../../../routes/(app)/(authenticated)/ordersummary/type';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';

	let cardHeading = 'Order Status';
	let schemeData: OrderSummarySchemeDataTypes;
	let statusData: Array<StatusHistoryItem> = [];
	let showTimeline = false;
	let collapsibleTimeline = false;
	let isRedeem = false;
	let isSwitch = false;
	let switchData = {
		schemeName: '',
		toSchemeName: '',
		amount: ''
	};
	let timelineCollapsed = collapsibleTimeline || false;
	let modifiedStatusData = statusData || [];
	let headerContent = {};

	const setStatusTimeline = () => {
		if (!showTimeline) {
			return;
		}

		if (timelineCollapsed) {
			let pendingElementIndex = modifiedStatusData?.findIndex(
				(item) => item?.status === STATUS_ARR?.PENDING
			);
			let modifiedStatusDataLength = (modifiedStatusData || [])?.length;

			if (pendingElementIndex > -1) {
				if (pendingElementIndex < modifiedStatusDataLength - 1) {
					modifiedStatusData = modifiedStatusData?.slice(
						pendingElementIndex,
						pendingElementIndex + 2
					);
				} else {
					modifiedStatusData = modifiedStatusData?.slice(pendingElementIndex);
				}
			} else {
				modifiedStatusData = modifiedStatusData?.slice(
					modifiedStatusDataLength - 1,
					modifiedStatusDataLength
				);
			}
		} else {
			modifiedStatusData = statusData || [];
		}
	};

	setStatusTimeline();

	const handleToggleClick = () => {
		timelineCollapsed = !timelineCollapsed;
		setStatusTimeline();
	};

	export {
		cardHeading,
		schemeData,
		statusData,
		showTimeline,
		collapsibleTimeline,
		isRedeem,
		isSwitch,
		switchData,
		headerContent
	};
</script>

<section class="{$$props?.class} rounded-lg border border-grey-line bg-white">
	<slot name="orderSchemeDetails">
		<!-- Order Scheme Details -->
		<section class="p-3">
			<div class="text-base font-medium text-black-key">
				{cardHeading}
			</div>

			<slot name="orderSchemeDetailsData">
				{#if isSwitch && switchData?.toSchemeName?.length}
					<section class="mt-3">
						<div
							class="w-[68px] rounded-sm bg-yellow-background px-1 py-0.5 text-[10px] font-normal text-black-key"
						>
							SWITCH OUT
						</div>
						<OrderStatusDetails
							schemeName={switchData?.schemeName}
							amount={switchData?.amount}
							title="Amount"
						/>
					</section>

					<section class="mt-3">
						<div
							class="w-[60px] rounded-sm bg-purple-background px-1 py-0.5 text-[10px] font-normal text-black-key"
						>
							SWITCH IN
						</div>
						<OrderStatusDetails
							schemeName={switchData?.toSchemeName}
							amount={switchData?.amount}
							title="Amount"
						/>
					</section>
				{:else}
					<OrderStatusDetails
						schemeName={schemeData?.schemeName}
						amount={schemeData?.amount}
						title="Amount"
					/>
				{/if}
			</slot>
		</section>
	</slot>

	<slot name="partition">
		{#if showTimeline && statusData?.length}
			<div class="mx-3 border-t border-grey-line md:border-dashed" />
		{/if}
	</slot>

	<slot name="orderStatusTimeline">
		<!-- Order Status Timeline -->
		{#if showTimeline && statusData?.length}
			<section class="mt-3 flex items-start justify-between p-3 pb-1 pt-1">
				<article>
					{#each modifiedStatusData as item, index}
						<StatusTile {headerContent} {item} {index} itemsCount={modifiedStatusData.length} />
					{/each}
				</article>

				{#if collapsibleTimeline}
					<Button
						variant={BtnVariant?.Transparent}
						onClick={handleToggleClick}
						class="-mr-3 mt-3 !h-0 !min-h-0"
						ariaLabel="toggle"
					>
						<WMSIcon
							name="arrow-collapse"
							width={12}
							height={12}
							onClick={handleToggleClick}
							class={timelineCollapsed ? 'rotate-180' : ''}
						/>
					</Button>
				{/if}
			</section>
		{/if}
	</slot>

	<slot name="remarks">
		{#if isRedeem}
			<div
				class="mx-3 mb-3 flex items-center rounded-md bg-purple-background px-3 py-2 text-xs text-black-title"
			>
				<div>
					<WMSIcon name="info-doughnut" />
				</div>
				<div class="pl-2">
					Funds are credited to your bank account <span class="font-medium"
						>within 5 working days</span
					> of placing the withdrawal order.
				</div>
			</div>
		{/if}
	</slot>
</section>
