<script lang="ts">
	import Card from '$components/Card.svelte';
	import TransactionHistorytable from './components/TransactionHistorytable.svelte';
	import type { Transaction } from '$lib/types/IInvestments';
	import { page } from '$app/stores';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { investmentDetailsExternalFolioSectionCtaClick } from '../analytics';

	export let transactionList: Transaction[] = [];

	const tableListThreshold = 5;

	let showFullTransactionList = false;
	let modifiedTransactionList: Transaction[];
	$: modifiedTransactionList = (transactionList || [])?.slice(0, tableListThreshold) || [];

	const toggleShowFullTransactionList = () => {
		showFullTransactionList = !showFullTransactionList;
		if (showFullTransactionList) {
			modifiedTransactionList = transactionList || [];
		} else {
			modifiedTransactionList = transactionList?.slice(0, tableListThreshold) || [];
		}
		if (isExternal) {
			investmentDetailsExternalFolioSectionCtaClick({ data: transactionList });
		}
	};
	$: isExternal = $page?.data?.isExternal;
</script>

<section class={$$props.class}>
	<Card
		class="mt-2 !p-0 lg:mt-4"
		title="Transaction History"
		defaultHeaderClass="!p-4 !md:px-6 !md:py-5 text-lg"
	>
		{#if transactionList?.length > 0}
			<TransactionHistorytable {modifiedTransactionList} />
		{:else}
			<div class="flex items-end justify-center border-t py-5 text-title">No Data Available!</div>
		{/if}

		{#if transactionList?.length && transactionList?.length > 5 && !isExternal}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="flex cursor-pointer items-center justify-center py-5 text-sm font-medium text-primary"
				on:click={toggleShowFullTransactionList}
			>
				{#if !showFullTransactionList}
					<div>SHOW MORE</div>
					<div><WMSIcon width={14} height={7} name="arrow-expand" class="ml-2" /></div>
				{:else}
					<div>SHOW LESS</div>
					<div><WMSIcon width={14} height={7} name="arrow-collapse" class="ml-2" /></div>
				{/if}
			</div>
		{:else if transactionList?.length && transactionList?.length > 5 && isExternal}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="flex cursor-pointer items-center justify-center py-5 text-sm font-medium text-primary"
				on:click={toggleShowFullTransactionList}
			>
				{#if !showFullTransactionList}
					<div>SHOW MORE</div>
					<div><WMSIcon width={14} height={7} name="arrow-expand" class="ml-2" /></div>
				{:else}
					<div>SHOW LESS</div>
					<div><WMSIcon width={14} height={7} name="arrow-collapse" class="ml-2" /></div>
				{/if}
			</div>
		{/if}
	</Card>
</section>
