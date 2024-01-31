<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { STATUS_ARR } from '../constant';
	import type { StatusHistoryItem } from '../type';

	export let item: StatusHistoryItem = {};
	export let index = 0;
	export let itemsCount = 0;
</script>

<div class="flex w-full flex-row">
	<div class="-mt-5 mr-5 flex flex-col items-center">
		<div
			class={`flex flex-1 border-l border-grey-line ${index === 0 ? 'border-transparent' : ''}`}
		/>
		{#if item.status === STATUS_ARR.SUCCESS}
			<WMSIcon name="tick-in-circle" height={20} width={20} stroke="#fff" bgStroke="#008F75" />
		{:else if item.status === STATUS_ARR.PENDING}
			<WMSIcon name="status-in-progress" height={21} width={21} class="animate-pulse" />
		{:else if item.status === STATUS_ARR.FAILED}
			<WMSIcon name="status" class="bg-red-sell" />
		{:else}
			<div class="m-0.5 h-4 w-4 rounded-full bg-grey-line" />
		{/if}
		<div
			class={`flex flex-1 border-l border-grey-line ${
				index === itemsCount - 1 ? 'border-transparent' : ''
			}`}
		/>
	</div>
	<div class="pb-2 pt-2 text-start">
		<div
			class="mb-1 text-xs {item?.currentState ? 'font-medium' : 'font-normal'} text-black-key
			{item.status === STATUS_ARR.NONE ? 'text-grey-body' : ''}
			{item.status === STATUS_ARR.FAILED ? 'text-red-sell' : ''}
			{item.status === STATUS_ARR.PAYMENT_PENDING ? 'text-yellow-primary' : ''}"
		>
			{item.title}
		</div>
		<div class="text-[10px] font-normal text-grey-body">
			{item.subTitle}
		</div>
	</div>
</div>
