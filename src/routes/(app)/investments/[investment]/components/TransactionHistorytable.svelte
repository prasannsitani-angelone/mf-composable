<script lang="ts">
	import { page } from '$app/stores';
	import Table from '$components/Table/Table.svelte';
	import THead from '$components/Table/THead.svelte';
	import Th from '$components/Table/TH.svelte';
	import Td from '$components/Table/TD.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import type { OrdersEntity } from '$lib/types/IInvestments';
	$: deviceType = $page.data.deviceType;
	export let modifiedTransactionList: OrdersEntity[] = [];

	const getTransactionTypeLabel = (transactionType = '') => {
		const transactionTypeLabelMap = {
			PURCHASE: 'BUY',
			REDEEM: 'WITHDRAW',
			['SWITCH OUT']: 'SWITCH OUT',
			['SWITCH IN']: 'SWITCH IN'
		};
		return transactionTypeLabelMap[transactionType] ? transactionTypeLabelMap[transactionType] : '';
	};

	const getTranscationTypeCss = (data: OrdersEntity) => {
		const cssMap = {
			PURCHASE: 'bg-green-buy bg-opacity-[12%]',
			REDEEM: 'bg-red-sell bg-opacity-[12%]',
			['SWITCH OUT']: 'bg-yellow-primary bg-opacity-[12%]',
			['SWITCH IN']: 'bg-purple-primary bg-opacity-[12%]'
		};

		return data?.transactionType ? cssMap[data?.transactionType] : '';
	};
</script>

<Table class={`rounded-lg ${$$props.class || ''}`}>
	<THead slot="thead">
		<Th class={`border-t text-start capitalize`}>
			{#if deviceType?.isMobile}
				<div class="flex flex-row items-center justify-start">Order/Date</div>{:else}
				<div class="flex flex-row items-center justify-start">Date</div>
			{/if}
		</Th>
		{#if deviceType && !deviceType.isMobile}
			<Th class={`border-t text-start capitalize`} wrapperClass="w-full justify-center">Order</Th>
		{/if}
		<Th class={`border-t text-start capitalize`} wrapperClass="w-full justify-center">Units/Nav</Th>
		<Th class={`border-t text-start capitalize`} wrapperClass="w-full justify-end">Value</Th>
	</THead>
	<TBody slot="tbody">
		{#each modifiedTransactionList as data (data.orderId + data.createdTs)}
			<tr>
				<Td class={`border-b border-grey-line py-4 pl-5 pr-6 text-left text-grey-body`}>
					<div
						class="flex flex-col font-medium text-black-title md:flex-row md:items-baseline md:justify-start"
					>
						{#if deviceType?.isMobile}
							<div
								class={`mb-2 block w-fit rounded-sm bg-opacity-20 px-1 text-[10px] font-medium md:hidden ${getTranscationTypeCss(
									data
								)}`}
							>
								<div>
									{getTransactionTypeLabel(data?.transactionType)}
								</div>
							</div>
						{/if}
						<div class="text-xs text-black-title md:text-sm">
							{getDateTimeString(data?.createdTs, 'DATE', true)}
						</div>
					</div>
				</Td>
				{#if deviceType && !deviceType.isMobile}
					<Td class={`border-b border-grey-line py-4 pl-5 pr-6 text-center text-grey-body`}>
						<article class="flex items-center justify-end text-black-title md:justify-center">
							<div
								class={`rounded-sm bg-opacity-20 px-1 text-[10px] font-medium ${getTranscationTypeCss(
									data
								)}`}
							>
								<div>
									{getTransactionTypeLabel(data?.transactionType)}
								</div>
							</div>
						</article>
					</Td>
				{/if}
				<Td class={`border-b border-grey-line py-4 pl-5 pr-6 text-center text-grey-body`}>
					<div
						class="flex flex-col font-medium text-black-title md:flex-row md:items-baseline md:justify-center"
					>
						<div class="text-base text-black-title md:mr-1">
							{data?.units?.toFixed(3)}
						</div>
						<div class="text-xs text-gray-500">
							{data?.nav !== undefined ? '₹' : ''}{data?.nav !== undefined
								? addCommasToAmountString(data?.nav?.toFixed(2))
								: '-'}
						</div>
					</div>
				</Td>
				<Td class={`border-b border-grey-line py-4 pl-5 pr-6 text-right text-grey-body`}>
					<div
						class="flex items-start justify-end text-base font-medium text-black-title md:block md:items-center md:justify-center md:text-sm"
					>
						{data?.amount !== undefined ? '₹' : ''}{data?.amount !== undefined
							? addCommasToAmountString(data?.amount?.toFixed(2))
							: '-'}
					</div>
				</Td>
			</tr>
		{/each}
	</TBody>
</Table>
