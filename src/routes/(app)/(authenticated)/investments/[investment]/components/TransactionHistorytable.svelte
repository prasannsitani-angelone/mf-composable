<script lang="ts">
	import { page } from '$app/stores';
	import Table from '$components/Table/Table.svelte';
	import THead from '$components/Table/THead.svelte';
	import Th from '$components/Table/TH.svelte';
	import Td from '$components/Table/TD.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import type { Transaction } from '$lib/types/IInvestments';
	import { getRGBACssVar } from '$lib/utils/colors';
	$: deviceType = $page.data.deviceType;
	export let modifiedTransactionList: Transaction[] = [];

	const getTransactionTypeLabel = (transactionType = '') => {
		const transactionTypeLabelMap = {
			PURCHASE: 'BUY',
			REDEEM: 'WITHDRAW',
			['SWITCH OUT']: 'SWITCH OUT',
			['SWITCH IN']: 'SWITCH IN',
			BUY: 'BUY',
			WITHDRAW: 'WITHDRAW'
		};
		return transactionTypeLabelMap[transactionType] ? transactionTypeLabelMap[transactionType] : '';
	};

	const getTranscationTypeCss = (data: Transaction) => {
		const cssMap = {
			PURCHASE: `background-color : ${getRGBACssVar('--BUY', 0.12)}`,
			REDEEM: `background-color : ${getRGBACssVar('--SELL', 0.12)}`,
			['SWITCH OUT']: `background-color : ${getRGBACssVar('--SECONDARY', 0.12)}`,
			['SWITCH IN']: `background-color : ${getRGBACssVar('--SECONDARY-ALT', 0.12)}`,
			BUY: `background-color : ${getRGBACssVar('--BUY', 0.12)}`,
			WITHDRAW: `background-color : ${getRGBACssVar('--SELL', 0.12)}`
		};

		return data?.transactionType ? cssMap[data?.transactionType] : '';
	};
</script>

<Table class={`rounded-lg ${$$props.class || ''}`}>
	<THead slot="thead">
		<Th class={`border-t text-start capitalize first:!z-[0]`}>
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
		{#each modifiedTransactionList as data, index (index)}
			<tr>
				<Td class={`border-b py-4 pl-5 pr-6 text-left text-body`}>
					<div
						class="flex flex-col font-normal text-title md:flex-row md:items-baseline md:justify-start"
					>
						{#if deviceType?.isMobile}
							<div
								style={getTranscationTypeCss(data)}
								class="mb-2 block w-fit rounded-sm px-1 text-[10px] font-normal md:hidden"
							>
								<div>
									{getTransactionTypeLabel(data?.transactionType)}
								</div>
							</div>
						{/if}
						<div class="text-xs text-title md:text-sm">
							{getDateTimeString(data?.transactionDate, 'DATE', true)}
						</div>
					</div>
				</Td>
				{#if deviceType && !deviceType.isMobile}
					<Td class={`border-b py-4 pl-5 pr-6 text-center text-body`}>
						<article class="flex items-center justify-end text-title md:justify-center">
							<div
								style={getTranscationTypeCss(data)}
								class="rounded-sm px-1 text-[10px] font-normal"
							>
								<div>
									{getTransactionTypeLabel(data?.transactionType)}
								</div>
							</div>
						</article>
					</Td>
				{/if}
				<Td class={`border-b py-4 pl-5 pr-6 text-center text-body`}>
					<div
						class="flex flex-col font-normal text-title md:flex-row md:items-baseline md:justify-center"
					>
						<div class="text-base text-title md:mr-1">
							{data?.units?.toFixed(3)}
						</div>
						<div class="text-xs text-gray-500">
							{data?.nav !== undefined ? '₹' : ''}{data?.nav !== undefined
								? addCommasToAmountString(data?.nav?.toFixed(2))
								: '-'}
						</div>
					</div>
				</Td>
				<Td class={`border-b py-4 pl-5 pr-6 text-right text-body`}>
					<div
						class="flex items-start justify-end text-base font-normal text-title md:block md:items-center md:justify-center md:text-sm"
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
