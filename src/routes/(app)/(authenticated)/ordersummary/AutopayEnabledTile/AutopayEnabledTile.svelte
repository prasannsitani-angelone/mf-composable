<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	export let bankLogo = '';
	export let bankName = '';
	export let accNo = '';
	export let clazz = '';
	export let isFtpWithMandate = false;
</script>

<div class={`flex flex-col rounded-lg border border-grey-line bg-white p-3  ${clazz}`}>
	<div class="flex flex-col items-start">
		<div class="mb-2 text-sm font-medium text-black-key sm:mb-0">
			Autopay enabled for SIP Payments
		</div>
		<div class="mb-1 flex w-full flex-row items-center py-2 sm:w-80">
			<div class="flex flex-row items-center">
				<div
					class="flex h-8 w-11 items-center justify-center rounded-sm border border-grey-line bg-white"
				>
					<img alt="Bank Logo" src={bankLogo} class="h-5 w-5" />
				</div>
				<div class="ml-2 text-sm font-normal text-black-key">
					{bankName}
				</div>
			</div>
			<div class="ml-2 flex flex-row items-center text-xs font-normal text-black-bolder">
				<div class="mr-1 h-1 w-1 rounded-full bg-black-bolder" />
				<div class="mr-1 h-1 w-1 rounded-full bg-black-bolder" />
				<div class="mr-1 h-1 w-1 rounded-full bg-black-bolder" />
				<div class="mr-1 h-1 w-1 rounded-full bg-black-bolder" />
				{accNo?.substring(accNo.length - 4)}
			</div>
		</div>
	</div>
	{#if isFtpWithMandate}
		<div class="mt-2 border-t border-dashed">
			<div class="mt-2 flex">
				<WMSIcon name="info-in-circle-dark" class="mr-1" width={16} height={16} />
				<p class="text-xs font-normal text-black-bolder">
					Please maintain required balance in your bank account. NAV will be based on realisation of
					funds by AMC
				</p>
			</div>
		</div>
	{/if}
</div>
