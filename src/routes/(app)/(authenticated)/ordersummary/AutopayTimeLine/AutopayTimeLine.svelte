<script lang="ts">
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import type { AutopayTimelineItems } from '../type';
	let items: Array<AutopayTimelineItems>;
	export { items };
</script>

<div class="flex w-full flex-row">
	{#each items as item, index (index)}
		<div class="flex flex-col" class:flex-1={index < items.length - 1}>
			<div class="mb-2 ml-1 text-sm text-black-bolder {$$props?.titleClass || ''}">
				{item.title}
			</div>
			<div class="flex items-center">
				{#if item.status === STATUS_ARR.SUCCESS}
					<div class="my-1 rounded-full bg-[#E0F2EE]">
						<WMSIcon
							name="tick-in-circle"
							height={32}
							width={32}
							stroke="#008F75"
							bgStroke="#E0F2EE"
						/>
					</div>
				{:else if item.status === STATUS_ARR.PAYMENT_PENDING}
					<div class="rounded-full bg-[#FEEED4]">
						<WMSIcon name="status-in-progress" height={40} width={40} />
					</div>
				{:else if item.status === STATUS_ARR.PENDING}
					<div class="rounded-full bg-[#FEEED4]">
						<WMSIcon name="status-in-progress" height={40} width={40} />
					</div>
				{:else if item.status === STATUS_ARR.FAILED}
					<div class="flex items-center justify-center rounded-full border border-[#FAEAEA] p-1">
						<WMSIcon name="alert-in-circle" height={30} width={30} />
					</div>
				{:else}
					<div class="my-1 h-8 w-8 rounded-full bg-grey" />
				{/if}
				<div
					class="flex border-t {item.status === STATUS_ARR.SUCCESS
						? 'border-[#E0F2EE]'
						: 'border-grey-line'}"
					class:flex-1={index < items.length - 1}
					class:w-4={index === items.length - 1}
					class:sm:w-20={index === items.length - 1}
				/>
			</div>
		</div>
	{/each}
</div>
