<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import OrderCardBody from '../../../investments/(dashboard)/OrderCardComponents/OrderCardBody.svelte';
	import OrderCardHeader from '../../../investments/(dashboard)/OrderCardComponents/OrderCardHeader.svelte';
	import type { OrdersSummary } from '$lib/types/IInvestments';
	import type { orderItem } from '$lib/types/IOrderItem';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	let ordersSummary: OrdersSummary;
	let inProgressOrders: orderItem[];
	const InProgressPortofolioData = {
		title: 'In Progress'
	};
	export { ordersSummary, inProgressOrders };
</script>

{#if ordersSummary?.totalProcessingOrders && inProgressOrders?.length}
	<AccordianCardComponent
		class="mt-2 max-w-4xl rounded-lg bg-white text-sm text-black-title shadow-csm lg:mt-4"
		data={InProgressPortofolioData}
		titleFontSize="text-base"
		titleStyle="ml-1"
		disableCollapse={true}
		header-class="!cursor-default"
	>
		<div slot="titleIcon">
			<div
				class="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 bg-opacity-10 text-[10px] font-medium text-blue-primary"
				class:px-1.5={ordersSummary?.totalProcessingOrders > 9}
			>
				<span>
					{ordersSummary?.totalProcessingOrders}
				</span>
			</div>
		</div>

		<div slot="accordionBody">
			<section class="-mt-4 px-3 pb-2">
				<!-- Card -->
				{#each inProgressOrders as item}
					<article class="my-4 rounded-lg border">
						<OrderCardHeader
							textString="Order Date"
							status={getDateTimeString(item?.createdTs, 'DATE', true)}
							orderType="PROCESSING"
						/>
						<OrderCardBody {item} />
					</article>
				{/each}
			</section>
		</div>
	</AccordianCardComponent>
{/if}
