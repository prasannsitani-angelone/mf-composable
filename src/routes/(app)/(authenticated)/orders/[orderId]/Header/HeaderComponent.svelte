<script lang="ts">
	import ErrorIcon from '$lib/images/icons/FailureCrossIcon.svelte';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { getRGBACssVar } from '$lib/utils/colors';

	export let heading = '';
	export let subHeadingText = '';
	export let subHeaderClass = '';
	export let status = '';
	export let title = '';
	const handleBackNavigation = async () => {
		if (window.history.length === 1) {
			await goto(`${base}/orders/orderspage`);
		} else {
			history.back();
		}
	};
</script>

<article
	class={`hidden rounded-t-lg bg-background-alt px-5 py-4 text-center md:flex ${$$props?.class}`}
>
	<article class="flex w-full cursor-pointer items-center justify-start">
		<LeftArrowIcon class="mr-4 cursor-pointer" onClick={handleBackNavigation} />
		<h1 class="text-lg font-normal text-title">
			<div class="truncate text-left">
				{title}
			</div>
		</h1>
	</article>
</article>
<article
	class={`flex flex-col bg-background-alt px-5 py-2 ${$$props?.class}`}
	class:!bg-tint12-secondary={status === STATUS_ARR.PENDING}
	style="background-color: {status === STATUS_ARR.SUCCESS
		? getRGBACssVar('--BUY', 0.2)
		: status === STATUS_ARR.FAILED || status === STATUS_ARR.FAILURE
		? getRGBACssVar('--SELL', 0.2)
		: ''}"
>
	{#if heading}
		<div class="flex flex-row items-center font-normal text-title">
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
			<div class="text-sm text-title">
				{subHeadingText}
			</div>
		</div>
	{/if}
</article>
