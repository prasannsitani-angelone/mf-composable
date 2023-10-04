<script lang="ts">
	import { page } from '$app/stores';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import type { StatusHistoryItem } from '../../../ordersummary/type';
	$: deviceType = $page?.data?.deviceType;
	let items: Array<StatusHistoryItem>;
	export { items };
</script>

<div class="flex flex-col sm:flex-row">
	{#each items as item, index (index)}
		<div class="flex-1">
			{#if !deviceType?.isMobile}
				<div class="flex flex-1 flex-col items-center text-center">
					<div class="flex w-full flex-row items-center">
						<div
							class="flex flex-1 border-t border-grey-line"
							class:border-transparent={index === 0}
						/>
						{#if item.status === STATUS_ARR.SUCCESS}
							<div>
								<WMSIcon name="tick-in-circle" height={20} width={20} />
							</div>
						{:else if item.status === STATUS_ARR.PAYMENT_PENDING}
							<div>
								<WMSIcon name="status" class="h-5 w-5 bg-yellow-primary" />
							</div>
						{:else if item.status === STATUS_ARR.PENDING}
							<div>
								<WMSIcon name="status" class="h-5 w-5 bg-green-buy" />
							</div>
						{:else if item.status === STATUS_ARR.FAILED}
							<div>
								<WMSIcon name="status" class="h-5 w-5 bg-red-sell" />
							</div>
						{:else}
							<div class="h-5 w-5 rounded-full bg-grey" />
						{/if}
						<div
							class="flex flex-1 border-t border-grey-line"
							class:border-transparent={index === items.length - 1}
						/>
					</div>
					<div
						class="mb-1 mt-2 text-sm text-black-title {$$props?.titleClass || ''}"
						class:font-normal={item?.currentState}
						class:!text-black-title={item?.currentState}
						class:text-grey-body={item.status === STATUS_ARR.NONE}
						class:text-red-sell={item.status === STATUS_ARR.FAILED}
						class:text-yellow-primary={item.status === STATUS_ARR.PAYMENT_PENDING}
					>
						{item.title}
					</div>
					{#if item?.message}
						<div
							class={`rounded p-2 text-xs text-grey-body ${
								item.status === STATUS_ARR.SUCCESS && '!bg-green-buy/20'
							} ${
								(item.status === STATUS_ARR.FAILED || item.status === STATUS_ARR.FAILURE) &&
								'!bg-red-sell/20'
							}`}
							class:!bg-yellow-background={item.status === STATUS_ARR.PENDING}
							class:!bg-purple-background={item.status === STATUS_ARR.PAYMENT_PENDING}
							class:!text-black-title={item?.currentState}
						>
							{#if item?.showSubTitle}
								<p
									class="mb-1 {$$props?.subTitleClass || ''}"
									class:font-normal={item?.currentState}
								>
									{item.subTitle}
								</p>
							{/if}
							<p>{item?.message}</p>
						</div>
					{:else}
						<div
							class="text-xs text-grey-body"
							class:!text-black-title={item?.currentState}
							class:font-normal={item?.currentState}
						>
							{#if item?.showSubTitle}
								{item.subTitle}
							{/if}
						</div>
					{/if}
				</div>
			{:else}
				<div class="flex w-full flex-row">
					<div class="mr-5 flex flex-col items-center">
						{#if item.status === STATUS_ARR.SUCCESS}
							<div>
								<WMSIcon name="tick-in-circle" height={16} width={16} />
							</div>
						{:else if item.status === STATUS_ARR.PAYMENT_PENDING}
							<div>
								<WMSIcon name="status" class="bg-yellow-primary" />
							</div>
						{:else if item.status === STATUS_ARR.PENDING}
							<div>
								<WMSIcon name="status" class="bg-green-buy" />
							</div>
						{:else if item.status === STATUS_ARR.FAILED}
							<div>
								<WMSIcon name="status" class="bg-red-sell" />
							</div>
						{:else}
							<div class="h-4 w-4 rounded-full bg-grey" />
						{/if}

						{#if index !== items.length - 1}
							<div class="flex flex-1 border-l border-grey-line" />
						{/if}
					</div>
					<div class="pb-4">
						<div
							class="mb-1 text-sm text-grey-body {$$props?.titleClass || ''}"
							class:!text-black-title={item?.currentState}
							class:font-normal={item?.currentState}
							class:!text-grey-body={item.status === STATUS_ARR.NONE}
							class:!text-red-sell={item.status === STATUS_ARR.FAILED}
							class:!text-yellow-primary={item.status === STATUS_ARR.PAYMENT_PENDING}
						>
							{item.title}
						</div>

						{#if item?.message}
							<div
								class={`rounded p-2 text-xs text-grey-body ${
									item.status === STATUS_ARR.SUCCESS && '!bg-green-buy/20'
								} ${
									(item.status === STATUS_ARR.FAILED || item.status === STATUS_ARR.FAILURE) &&
									'!bg-red-sell/20'
								}`}
								class:!bg-yellow-background={item.status === STATUS_ARR.PENDING}
								class:!bg-purple-background={item.status === STATUS_ARR.PAYMENT_PENDING}
								class:!text-black-title={item?.currentState}
							>
								{#if item?.showSubTitle}
									<p class="mb-1" class:font-normal={item?.currentState}>
										{item.subTitle}
									</p>
								{/if}
								<p>{item?.message}</p>
							</div>
						{:else}
							<div
								class="text-xs text-grey-body {$$props?.subTitleClass || ''}"
								class:!text-black-title={item?.currentState}
								class:font-normal={item?.currentState}
							>
								{#if item?.showSubTitle}
									{item.subTitle}
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
