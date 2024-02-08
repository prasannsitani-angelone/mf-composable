<script lang="ts">
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import type { AutopayTimelineItems } from '../type';
	import { page } from '$app/stores';
	let items: Array<AutopayTimelineItems>;
	export { items };

	$: isMobile = $page?.data?.deviceType?.isMobile;
</script>

<div class="flex w-full flex-row">
	{#each items as item, index (index)}
		<div class="flex flex-col" class:flex-1={index < items.length - 1}>
			<div
				class="mb-2 text-xs text-body {$$props?.titleClass || ''}"
				class:ml-1={item.status === STATUS_ARR.FAILED}
			>
				{item.title}
			</div>
			<div class="flex items-center">
				{#if item.status === STATUS_ARR.SUCCESS}
					<div class="my-1 rounded-full bg-[#E0F2EE]">
						<WMSIcon
							name="tick-in-circle"
							height={isMobile ? 20 : 30}
							width={isMobile ? 20 : 30}
							stroke="#008F75"
							bgStroke="#E0F2EE"
						/>
					</div>
				{:else if item.status === STATUS_ARR.PAYMENT_PENDING}
					<div class="rounded-full bg-[#FEEED4]">
						<WMSIcon
							name="status-in-progress"
							height={isMobile ? 20 : 30}
							width={isMobile ? 20 : 30}
						/>
					</div>
				{:else if item.status === STATUS_ARR.PENDING}
					<div class="rounded-full bg-[#FEEED4]">
						<WMSIcon
							name="status-in-progress"
							height={isMobile ? 20 : 30}
							width={isMobile ? 20 : 30}
						/>
					</div>
				{:else if item.status === STATUS_ARR.FAILED}
					<div
						class="flex items-center justify-center rounded-full border border-[#FAEAEA] p-[2px]"
					>
						<WMSIcon
							name="alert-in-circle"
							height={isMobile ? 24 : 30}
							width={isMobile ? 24 : 30}
							class="-mt-[1px]"
						/>
					</div>
				{:else}
					<div class="my-1 h-5 w-5 rounded-full bg-disabled sm:h-[30px] sm:w-[30px]" />
				{/if}
				<div
					class="flex border-t {item.status === STATUS_ARR.SUCCESS ? 'border-[#E0F2EE]' : 'border'}"
					class:flex-1={index < items.length - 1}
					class:w-4={index === items.length - 1}
					class:sm:w-20={index === items.length - 1}
				/>
			</div>
		</div>
	{/each}
</div>
