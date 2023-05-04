<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import DownArrowLargeIcon from '$lib/images/icons/DownArrowLargeIcon.svelte';
	import type { ISipOrderHistory } from '$lib/types/ISipType';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import SipTransactions from './SipTransactions.svelte';
	import SipDate from './SipDate.svelte';
	import { createEventDispatcher } from 'svelte';
	let sipId: number;
	let sipOrderHistory: Array<ISipOrderHistory>;
	let sipCreatedTs: number;
	let disableCollapse = false;
	let hideFooter = false;
	let maxTxnShowCount = 0;
	let fullPageList = false;
	const SipHistoryData = {
		title: 'SIP History'
	};

	interface txnItem {
		title: string;
		subTitle: string;
		status: string;
	}

	let successfulTxns = 0;
	let failedTxns = 0;
	let skippedTxns = 0;
	let transactionItems: Array<txnItem> = [];
	let sipHistoryExpanded = false;
	const dispatch = createEventDispatcher();

	const setTxnCounts = () => {
		const transactionList: Array<txnItem> = [];
		sipOrderHistory?.forEach((item) => {
			if (item?.orderStatus?.toUpperCase() === 'VALID') {
				successfulTxns++;
			} else if (item?.orderStatus?.toUpperCase() === 'INVALID') {
				failedTxns++;
			} else if (item?.orderStatus?.toUpperCase() === 'SKIP') {
				skippedTxns++;
			}

			const statusObj = {
				title: `${
					item?.orderStatus?.toUpperCase() === 'VALID'
						? 'Success'
						: item?.orderStatus?.toUpperCase() === 'SKIP'
						? 'Skipped'
						: 'Failed'
				}: ${getDateTimeString(item?.orderCompletionTs, 'DATE', true)}`,
				subTitle: item?.Message,
				status:
					item?.orderStatus?.toUpperCase() === 'VALID'
						? 'SUCCESS'
						: item?.orderStatus?.toUpperCase() === 'SKIP'
						? 'SKIP'
						: 'FAILED'
			};

			transactionList.push(statusObj);
		});

		transactionItems = transactionList;
	};

	const goToSipHistory = () => {
		goto(`${base}/sipbook/${sipId}-history`);
	};

	const handleSipHistoryToggle = () => {
		sipHistoryExpanded = !sipHistoryExpanded;
		dispatch('historyToggled', sipHistoryExpanded);
	};

	onMount(() => {
		setTxnCounts();
	});

	export {
		sipId,
		sipOrderHistory,
		sipCreatedTs,
		hideFooter,
		maxTxnShowCount,
		fullPageList,
		disableCollapse
	};
</script>

<article>
	<AccordianCardComponent
		data={SipHistoryData}
		titleFontSize="text-base"
		{disableCollapse}
		class="mt-2 rounded-lg bg-white text-sm font-medium text-black-title shadow-csm"
		on:cardToggled={handleSipHistoryToggle}
	>
		<svelte:fragment slot="accordionHeader">
			<section class="p-4">
				<slot name="headerTitle">
					<article class="flex items-baseline justify-between">
						<article class="flex items-baseline">
							<div class="mr-2 text-base">SIP History</div>
							{#if transactionItems?.length}
								<div class="text-xs text-grey-body">
									(Last {transactionItems?.length} months)
								</div>
							{/if}
						</article>
						{#if transactionItems?.length}
							<DownArrowLargeIcon
								class={`transition duration-200 ${sipHistoryExpanded ? 'rotate-180' : 'rotate-0'}`}
							/>
						{/if}
					</article>
					<div class="mb-5 text-xs font-medium text-grey-body">
						SIP ID: {Math?.abs(sipId)}
					</div>
				</slot>

				<article>
					<div class="flex items-center font-medium">
						<span
							class="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-buy bg-opacity-10 text-xs text-green-buy"
							class:px-1.5={successfulTxns}
						>
							{successfulTxns}
						</span>
						<span class="mr-2 text-sm text-grey-body"> Successful </span>
						{#if skippedTxns > 0}
							<span
								class="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 bg-opacity-10 text-xs text-grey-body"
								class:px-1.5={skippedTxns > 9}
							>
								{skippedTxns}
							</span>
							<span class="mr-2 text-sm text-grey-body"> Skipped </span>
						{/if}

						<span
							class="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-sell bg-opacity-10 text-xs text-red-sell"
							class:px-1.5={failedTxns}
						>
							{failedTxns}
						</span>
						<span class="text-sm text-grey-body"> Failed </span>
					</div>
				</article>

				<SipDate {sipCreatedTs} />
			</section>
		</svelte:fragment>

		<svelte:fragment slot="accordionBody">
			{#if transactionItems?.length}
				<section class="border-t">
					<SipTransactions
						class="mt-2 rounded-lg py-2.5"
						items={transactionItems}
						{hideFooter}
						maxTxnShowCount={maxTxnShowCount || transactionItems?.length}
						dynamicHeight={fullPageList}
						handleFooterClick={goToSipHistory}
					/>
				</section>
			{:else}
				<span />
			{/if}
		</svelte:fragment>
	</AccordianCardComponent>
</article>
