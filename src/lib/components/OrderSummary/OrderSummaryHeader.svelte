<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import ErrorIcon from '$lib/images/icons/FailureCrossIcon.svelte';
	import type { SubHeadingArr } from '../../../routes/(app)/(authenticated)/ordersummary/type';

	export let heading = '';
	export let subHeadingArr: Array<SubHeadingArr> = [];
	export let subHeaderClass = '';
	export let status = '';
</script>

<article class="flex flex-col bg-white px-4 py-3 pt-4 md:px-0 {$$props?.class}">
	{#if heading}
		<section class="flex flex-row items-center">
			{#if STATUS_ARR.FAILED === status}
				<ErrorIcon />
			{:else if STATUS_ARR.PENDING === status}
				<div class="rounded-full border border-[#FEEED4] p-[1px]">
					<WMSIcon name="clock-grey" height={44} width={44} stroke="#F9BA4D" />
				</div>
			{:else if STATUS_ARR.SUCCESS === status}
				<div class="rounded-full border border-[#E0F2EE] p-[1px]">
					<WMSIcon
						name="tick-in-circle"
						height={44}
						width={44}
						stroke="#fff"
						bgStroke="#008F75"
						class="min-w-[12px]"
					/>
				</div>
			{/if}
			<article class="ml-3 text-base font-medium text-black-key">
				<div>
					{heading}
				</div>

				{#if subHeadingArr && subHeadingArr.length > 0}
					<div
						class={`mt-1 flex w-full flex-col text-xs font-normal text-black-bolder ${subHeaderClass}`}
					>
						{#each subHeadingArr as subHeading, i}
							{#if subHeading?.text}
								<div class="flex flex-row justify-center">
									{#if subHeadingArr.length > 1}
										<div class="mr-1.5 mt-2 h-1.5 w-1.5 rounded-full bg-black-title" />
									{/if}
									<div class={`flex ${subHeading?.class}`}>
										{subHeading?.text}
									</div>
								</div>
							{:else if subHeading?.html}
								{@html subHeading?.html}
							{/if}
						{/each}
					</div>
				{/if}
			</article>
		</section>
	{/if}
</article>
