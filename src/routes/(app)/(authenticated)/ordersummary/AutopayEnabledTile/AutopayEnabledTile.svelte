<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	export let bankLogo = '';
	export let bankName = '';
	export let accNo = '';
	export let clazz = '';
	export let isFtpWithMandate = false;
</script>

<div
	class={`flex flex-col items-start bg-white px-4 py-2 sm:flex-row sm:items-center sm:justify-between ${clazz}`}
>
	<div class="mb-3 text-sm font-normal text-black-title sm:mb-0">
		Autopay Enabled for SIP Payments
	</div>
	<div
		class="flex w-full flex-row items-center justify-between rounded border border-grey-line bg-grey px-3 py-2 sm:w-80"
	>
		<div class="flex flex-row items-center">
			<div class="flex h-8 w-11 items-center justify-center rounded-sm bg-white">
				<img alt="Bank Logo" src={bankLogo} class="h-5 w-5" />
			</div>
			<div class="ml-2 text-sm font-normal text-black-title">
				{bankName}
			</div>
		</div>
		<div class="mt-1 flex flex-row items-center text-xs font-normal text-grey-body">
			<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
			<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
			<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
			<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
			{accNo?.substring(accNo.length - 4)}
		</div>
	</div>
	<hr />
	{#if isFtpWithMandate}
		<div class="mt-2 flex flex-col border-t border-dashed">
			<div class="flex items-center pt-2 text-xs text-black-key">
				<WMSIcon name="info-in-circle-dark" height={16} width={16} />
				<span class="ml-2">Important</span>
			</div>
			<div class="py-2 text-xs text-black-bolder">
				Please maintain required balance in your bank account. NAV will be based on realisation of
				funds by AMC
			</div>
		</div>
	{/if}
</div>
