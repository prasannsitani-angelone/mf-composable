<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import type { ISipOrderHistory } from '$lib/types/ISipType';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import SipTransactions from './SipTransactions.svelte';
	import WmsIcon from '$components/WMSIcon.svelte';
	let sipId: number;
	let sipOrderHistory: Array<ISipOrderHistory>;
	let sipCreatedTs: number;
	let disableCollapse = true;
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
	let editedTxns = 0;
	let transactionItems: Array<txnItem> = [];

	const setTxnCounts = () => {
		const transactionList: Array<txnItem> = [];
		sipOrderHistory?.forEach((item) => {
			if (item?.orderStatus?.toUpperCase() === 'VALID') {
				successfulTxns++;
			} else if (item?.orderStatus?.toUpperCase() === 'INVALID') {
				failedTxns++;
			} else if (item?.orderStatus?.toUpperCase() === 'SKIP') {
				skippedTxns++;
			} else if (item?.orderStatus?.toUpperCase() === 'EDIT') {
				editedTxns++;
			}

			const statusObj = {
				title: `${
					item?.orderStatus?.toUpperCase() === 'VALID'
						? 'Success'
						: item?.orderStatus?.toUpperCase() === 'SKIP'
						? 'Skipped'
						: item?.orderStatus?.toUpperCase() === 'EDIT'
						? 'Edited'
						: 'Failed'
				}: ${getDateTimeString(item?.orderCompletionTs, 'DATE', true)}`,
				subTitle: item?.Message,
				status:
					item?.orderStatus?.toUpperCase() === 'VALID'
						? 'SUCCESS'
						: item?.orderStatus?.toUpperCase() === 'SKIP'
						? 'SKIP'
						: item?.orderStatus?.toUpperCase() === 'EDIT'
						? 'EDIT'
						: 'FAILED'
			};

			transactionList.push(statusObj);
		});

		transactionItems = transactionList;
	};

	const goToSipHistory = () => {
		goto(`${base}/sipbook/${sipId}-history`);
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
		class="mt-2 rounded-lg bg-background-alt text-sm font-normal text-title shadow-csm {$$props.class}"
	>
		<svelte:fragment slot="accordionHeader">
			<section class="p-4">
				<slot name="headerTitle">
					<article class="flex items-baseline justify-between">
						<article class="flex items-baseline">
							<div class="mr-2 text-base">SIP History</div>
						</article>
					</article>
					<div class="mb-5 mt-2 flex items-center text-xs text-body">
						<div class="">
							SIP created on {getDateTimeString(sipCreatedTs, 'DATE', true)}
						</div>
						<div class="px-3"><WmsIcon class=" !h-1 !w-1" name="eclipse" /></div>
						<div class="">
							SIP ID: {Math?.abs(sipId)}
						</div>
					</div>
				</slot>

				<article>
					<div class="flex items-center font-normal">
						<span
							class="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-tint12-buy text-xs text-buy"
							class:px-1.5={successfulTxns}
						>
							{successfulTxns}
						</span>
						<span class="mr-2 text-sm text-body"> Successful </span>
						{#if skippedTxns > 0}
							<span
								class="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 bg-opacity-10 text-xs text-body"
								class:px-1.5={skippedTxns > 9}
							>
								{skippedTxns}
							</span>
							<span class="mr-2 text-sm text-body"> Skipped </span>
						{/if}
						{#if editedTxns > 0}
							<span
								class="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-tint12-secondary-alt text-xs text-body"
								class:px-1.5={editedTxns > 9}
							>
								{editedTxns}
							</span>
							<span class="mr-2 text-sm text-body"> Edited </span>
						{/if}
						<span
							class="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-tint12-sell text-xs text-sell"
							class:px-1.5={failedTxns}
						>
							{failedTxns}
						</span>
						<span class="text-sm text-body"> Failed </span>
					</div>
				</article>
			</section>
		</svelte:fragment>

		<svelte:fragment slot="accordionBody">
			{#if transactionItems?.length}
				<section class="border-t">
					<SipTransactions
						class="mt-2 rounded-lg pb-0.5 pt-2.5"
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
