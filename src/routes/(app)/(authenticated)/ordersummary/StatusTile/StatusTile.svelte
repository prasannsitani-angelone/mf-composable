<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { STATUS_ARR } from '../constant';
	import type { StatusHistoryItem } from '../type';

	export let item: StatusHistoryItem = {};
	export let index = 0;
	export let itemsCount = 0;
</script>

<div class="flex w-full flex-row sm:flex-col">
	<div class="mr-5 flex flex-col items-center sm:mr-0 sm:w-full sm:flex-row">
		<div
			class={`flex flex-1 border-l border-grey-line sm:border-t ${
				index === 0 ? 'border-transparent' : ''
			}`}
		/>
		{#if item.status === STATUS_ARR.SUCCESS}
			<WMSIcon name="tick-in-circle" height={16} width={16} />
		{:else if item.status === STATUS_ARR.PAYMENT_PENDING}
			<WMSIcon name="status" class="bg-yellow-primary" />
		{:else if item.status === STATUS_ARR.PENDING}
			<WMSIcon name="status" class="bg-green-buy" />
		{:else if item.status === STATUS_ARR.FAILED}
			<WMSIcon name="status" class="bg-red-sell" />
		{:else}
			<div class="h-4 w-4 rounded-full bg-grey" />
		{/if}
		<div
			class={`flex flex-1 border-l border-grey-line sm:border-t ${
				index === itemsCount - 1 ? 'border-transparent' : ''
			}`}
		/>
	</div>
	<div class="pb-2 pt-2 text-start sm:pb-0 sm:text-center">
		<div
			class={`mb-1 text-sm font-medium text-black-title sm:mt-2 ${
				item.status === STATUS_ARR.NONE ? 'text-grey-body' : ''
			} ${item.status === STATUS_ARR.FAILED ? 'text-red-sell' : ''} ${
				item.status === STATUS_ARR.PAYMENT_PENDING ? 'text-yellow-primary' : ''
			}`}
		>
			{item.title}
		</div>
		<div class="text-xs font-medium text-grey-body">
			{item.subTitle}
		</div>
	</div>
</div>
