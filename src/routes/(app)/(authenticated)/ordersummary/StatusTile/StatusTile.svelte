<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { STATUS_ARR } from '../constant';
	import type { StatusHistoryItem } from '../type';

	export let item: StatusHistoryItem = {};
	export let index = 0;
	export let itemsCount = 0;
	export let headerContent = {};
</script>

<div class="flex w-full flex-row">
	<div class="mr-5 flex flex-col items-center justify-start">
		{#if item.status === STATUS_ARR.SUCCESS}
			<WMSIcon name="tick-in-circle" height={20} width={20} stroke="#fff" bgStroke="#008F75" />
		{:else if item.status === STATUS_ARR.PENDING}
			<WMSIcon name="status-in-progress" height={21} width={21} class="animate-pulse" />
		{:else if item.status === STATUS_ARR.FAILED}
			<WMSIcon name="status" class="bg-sell" />
		{:else}
			<div class="m-0.5 h-4 w-4 rounded-full bg-border" />
		{/if}
		<div class={`flex flex-1 border-l ${index === itemsCount - 1 ? 'border-transparent' : ''}`} />
	</div>
	<div class="pb-4 text-start">
		<div
			class=" text-xs {item?.currentState ? 'font-medium' : 'font-normal'} text-title
			{item.status === STATUS_ARR.NONE ? 'text-body' : ''}
			{item.status === STATUS_ARR.FAILED ? 'text-sell' : ''}
			{item.status === STATUS_ARR.PAYMENT_PENDING ? 'text-secondary' : ''}"
		>
			{item.title}
		</div>
		{#if item.status === STATUS_ARR.PENDING && headerContent.status === STATUS_ARR.PENDING}
			<p class="mt-1 rounded bg-purple-background p-[6px] text-xs font-normal text-black-key">
				{headerContent?.remarks}
			</p>
		{/if}
		{#if headerContent.status !== STATUS_ARR.PENDING}
			<div class="mt-1 text-[10px] font-normal text-body">
				{item.subTitle}
			</div>
		{/if}
	</div>
</div>
