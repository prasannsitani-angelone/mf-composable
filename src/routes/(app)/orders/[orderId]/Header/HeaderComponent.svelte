<script lang="ts">
	import ErrorIcon from '$lib/images/icons/FailureCrossIcon.svelte';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import { WMSIcon } from 'wms-ui-component';

	export let heading = '';
	export let subHeadingText = '';
	export let subHeaderClass = '';
	export let status = '';
	export let title = '';
</script>

<article class={`hidden rounded-t-lg bg-white px-5 py-4 text-center md:flex ${$$props?.class}`}>
	<article class="flex w-full cursor-pointer items-center justify-start">
		<LeftArrowIcon class="mr-4 cursor-pointer" onClick={() => history.back()} />
		<h1 class="text-lg font-medium text-black-title">
			<div class="truncate text-left">
				{title}
			</div>
		</h1>
	</article>
</article>
<article
	class={`flex flex-col bg-white px-5 py-2 ${$$props?.class} ${
		status === STATUS_ARR.SUCCESS && '!bg-green-buy/20'
	} ${(status === STATUS_ARR.FAILED || status === STATUS_ARR.FAILURE) && '!bg-red-sell/20'}`}
	class:!bg-yellow-background={status === STATUS_ARR.PENDING}
>
	{#if heading}
		<div class="flex flex-row items-center font-medium text-black-title">
			{#if STATUS_ARR.FAILED === status || status === STATUS_ARR.FAILURE}
				<ErrorIcon />
			{:else if STATUS_ARR.PENDING === status}
				<WMSIcon name="time-pending" />
			{:else if STATUS_ARR.SUCCESS === status}
				<WMSIcon name="tick-star" />
			{/if}
			<div class="ml-2 text-sm md:text-base">
				{heading}
			</div>
		</div>
	{/if}
	{#if subHeadingText}
		<div class={`mt-2 flex w-full flex-col text-sm ${subHeaderClass}`}>
			<div class={`text-sm`}>
				{subHeadingText}
			</div>
		</div>
	{/if}
</article>
