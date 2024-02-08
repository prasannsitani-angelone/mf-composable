<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import type { AutopayTimelineItems } from '../type';
	import AutopayTimeLine from './AutopayTimeLine.svelte';

	export let autopayTimelineItems: Array<AutopayTimelineItems> = [];
</script>

<article class="flex h-full flex-col justify-center {$$props.class}">
	<div class="my-2 rounded-lg bg-background-alt py-2 sm:mx-2">
		<div class="mb-2 flex items-center">
			<WMSIcon name="alert-in-circle" class="mr-2" />
			<p class="text-base font-medium text-title">Autopay Not Active</p>
		</div>
		<p class="mb-4 text-xs font-normal text-body">
			Future SIP instalments will not be auto-paid. Set up UPI Autopay in 2 simple steps
		</p>
		<AutopayTimeLine items={autopayTimelineItems} />
		<div class="mt-4 flex">
			<WMSIcon name="info-in-circle-dark" class="mr-1" width={16} height={16} />
			<p class="text-xs font-normal text-body">
				With Autopay, SIP amount is debited automatically from your bank account on the monthly SIP
				date
			</p>
		</div>
	</div>
</article>
