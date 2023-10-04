<script lang="ts">
	import TickInStarIcon from '$lib/images/icons/TickInStarIcon.svelte';
	import PendingIcon from '$lib/images/icons/PendingHexagonIcon.svelte';
	import ErrorIcon from '$lib/images/icons/FailureCrossIcon.svelte';
	import { STATUS_ARR } from '../constant';
	import type { SubHeadingArr } from '../type';

	export let heading = '';
	export let subHeadingArr: Array<SubHeadingArr> = [];
	export let subHeaderClass = '';
	export let status = '';
	export let clazz = '';
</script>

<article class={`flex flex-col items-center bg-white px-4 py-3 ${clazz}`}>
	{#if heading}
		<div class="flex flex-row items-center text-lg font-normal text-black-title">
			{#if STATUS_ARR.FAILED === status}
				<ErrorIcon />
			{:else if STATUS_ARR.PENDING === status}
				<PendingIcon />
			{:else if STATUS_ARR.SUCCESS === status}
				<TickInStarIcon />
			{/if}
			<div class="ml-2">
				{heading}
			</div>
		</div>
	{/if}
	{#if subHeadingArr && subHeadingArr.length > 0}
		<div class={`mt-2 flex w-full flex-col gap-2 px-6 py-2 text-sm ${subHeaderClass}`}>
			{#each subHeadingArr as subHeading, i}
				<div class="flex flex-row justify-center">
					{#if subHeadingArr.length > 1}
						<div class="mr-1.5 mt-2 h-1.5 w-1.5 rounded-full bg-black-title" />
					{/if}
					<div class={`flex text-center text-sm text-grey-body ${subHeading.class}`}>
						{subHeading.text}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</article>
