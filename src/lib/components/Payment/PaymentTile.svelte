<script lang="ts">
	import Button from '$components/Button.svelte';
	import RadioButton from '$components/RadioButton.svelte';
	import UpiHandlerDropDown from '$components/UPIHandlerDropDown.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { afterUpdate, onDestroy } from 'svelte';
	import { PAYMENT_MODE_STATUS } from './constants';
	import type { PaymentMethodsStatusTypes } from '$lib/types/IPayments';

	export let identifier = '';
	export let selected = false;
	export let bankLogo = '';
	export let bankAccount = '';
	export let bankName = '';
	export let amount = '';
	export let showChangeBank = false;
	export let showInput = '';
	export let inputError = '';
	export let defaultInputVal = '';
	export let isLoading = false;
	export let isSchemeDisabled = false;
	export let paymentModesStatus: PaymentMethodsStatusTypes;
	export let submitButtonText = '';
	export let subIdentifier = '';
	export let showExtraInfo = true;
	export let showPayCta = true;
	export let extraInfoText = 'Registered with Angel One. Use the same bank account to pay';

	export let onSelect: (identifier: string, subIdentifier: string) => void = () => undefined;
	export let onSubmit: (text: string, subIdentifier: string) => void = () => undefined;
	export let resetInputError = (): void => undefined;
	export let changeBank = (): void => undefined;

	onDestroy(() => {
		if (showInput) {
			resetInputError();
		}
	});

	const onChangeBankClick = () => {
		changeBank();
	};

	let inputText = defaultInputVal || '';

	const onInputChange = (data: string) => {
		resetInputError();
		inputText = data;
	};

	let paymentModeStatus = PAYMENT_MODE_STATUS?.enabled;

	const setPaymentModeStatus = () => {
		if (identifier === 'NET_BANKING') {
			paymentModeStatus = paymentModesStatus?.net_banking?.status || PAYMENT_MODE_STATUS?.enabled;
		} else {
			paymentModeStatus = paymentModesStatus?.upi?.status || PAYMENT_MODE_STATUS?.enabled;
		}
	};

	setPaymentModeStatus();

	afterUpdate(() => {
		setPaymentModeStatus();
	});

	const lowSuccessRateStatusRemark =
		'Facing high failure rates currently. Please use another payment method';
	const disabledStatusRemark =
		'Facing high failure rates currently. Please use another payment method';
</script>

<div
	class={`flex flex-1 flex-col px-4 ${selected ? 'bg-background' : 'bg-background-alt'} ${
		$$props.class
	}`}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="flex flex-row items-center py-4" on:click={() => onSelect(identifier, subIdentifier)}>
		<RadioButton {selected} clazz="mr-2" />
		<div
			class="mr-3 flex h-8 w-[46px] items-center justify-center rounded-sm border bg-background-alt"
		>
			<slot name="icon" />
		</div>
		<div class="text-sm font-normal text-title">
			<slot name="content" />
		</div>
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<slot name="statusRemark">
		{#if paymentModeStatus !== PAYMENT_MODE_STATUS?.enabled}
			<section
				class="-mt-2 mb-3 ml-6 text-[11px] font-normal text-sell"
				on:click={() => onSelect(identifier, subIdentifier)}
			>
				{#if paymentModeStatus === PAYMENT_MODE_STATUS?.low_success_rate}
					<div>
						{lowSuccessRateStatusRemark}
					</div>
				{:else if paymentModeStatus === PAYMENT_MODE_STATUS?.disabled}
					<div>
						{disabledStatusRemark}
					</div>
				{/if}
			</section>
		{/if}
	</slot>

	{#if selected}
		<div class="ml-6 flex flex-col pb-4 {$$props.innerClass}">
			{#if showInput}
				<UpiHandlerDropDown {inputText} {onInputChange} {inputError} />
			{/if}
			{#if showExtraInfo}
				<div class="mb-4 mt-2 flex flex-row justify-between">
					<div class="flex flex-row {showChangeBank ? 'w-9/12' : 'w-full'}">
						<div
							class="ml-2 mr-3 flex h-5 w-[30px] items-center justify-center rounded-sm border bg-background-alt"
						>
							<img src={bankLogo} class="h-3 w-3" alt="bank logo" />
						</div>
						<div class="flex flex-col">
							<div class="mb-1 text-sm text-body">
								{bankName} - *{bankAccount?.substring(bankAccount.length - 4)}
							</div>
							<div class="text-xs text-body">
								{extraInfoText}
							</div>
						</div>
					</div>
					{#if showChangeBank}
						<Button
							variant="transparent"
							class="!h-fit !min-h-0 !px-0 text-xs !font-normal !uppercase"
							onClick={onChangeBankClick}
						>
							Change
						</Button>
					{/if}
				</div>
			{/if}
			{#if showPayCta}
				<Button
					class="rounded"
					disabled={!amount?.length ||
						isLoading ||
						isSchemeDisabled ||
						paymentModeStatus === PAYMENT_MODE_STATUS?.disabled}
					onClick={() => onSubmit(inputText, subIdentifier)}
				>
					{submitButtonText
						? submitButtonText
						: `PAY ${amount?.length ? `₹${addCommasToAmountString(amount)}` : ''}`}
				</Button>
			{/if}
		</div>
	{/if}
</div>
