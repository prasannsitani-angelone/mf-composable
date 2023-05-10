<script lang="ts">
	import Button from '$components/Button.svelte';
	import { PAYMENT_MODE } from '../constants';

	export let selectedMode = '';
	export let bankName = '';
	export let bankAccount = '';
	export let upiId = '';
	export let onPaymentMethodChange = (): void => undefined;
</script>

<div class="flex w-full flex-row items-center border-t border-grey-line px-4 py-3">
	<div>
		<svelte:component this={PAYMENT_MODE[selectedMode].sleeveIcon} />
	</div>
	<div class="ml-5 flex w-full flex-col">
		<div class="text-xs font-medium text-black-title">
			{selectedMode === 'UPI'
				? upiId?.length
					? upiId
					: 'Your UPI Id'
				: PAYMENT_MODE[selectedMode].name}
		</div>
		<div class="text-[10px] font-normal text-black-title">
			{bankName} - *{bankAccount?.substring(bankAccount.length - 4)}
		</div>
		<div class="text-[10px] font-normal text-grey-body">
			Use the same bank account on {PAYMENT_MODE[selectedMode].name}
			{selectedMode === 'UPI' ? 'app' : ''}
		</div>
	</div>
	<Button
		variant="transparent"
		class="!h-fit !min-h-0 !px-0 text-xs !uppercase"
		onClick={onPaymentMethodChange}
	>
		Change
	</Button>
</div>
