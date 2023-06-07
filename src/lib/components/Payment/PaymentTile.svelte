<script lang="ts">
	import BaseInput from '$components/BaseInput.svelte';
	import Button from '$components/Button.svelte';
	import RadioButton from '$components/RadioButton.svelte';
	import { onDestroy } from 'svelte';

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

	export let onSelect: (identifier: string) => void = () => undefined;
	export let onSubmit: (text: string) => void = () => undefined;
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
</script>

<div
	class={`flex flex-1 flex-col border border-grey-line px-4 ${
		selected ? 'bg-blue-background' : 'bg-white'
	}`}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="flex flex-row items-center py-4" on:click={() => onSelect(identifier)}>
		<RadioButton {selected} clazz="mr-2" />
		<div
			class="mr-3 flex h-8 w-[46px] items-center justify-center rounded-sm border border-grey-line bg-white"
		>
			<slot name="icon" />
		</div>
		<div class="text-sm font-medium text-black-title">
			<slot name="content" />
		</div>
	</div>
	{#if selected}
		<div class="ml-6 flex flex-col pb-4">
			{#if showInput}
				<div>
					<BaseInput
						id="inputID"
						value={inputText}
						onChange={onInputChange}
						heading=""
						placeholder="Enter UPI Id"
						classes={{
							label: '',
							error: '',
							container: 'px-3 py-3 shadow-none border',
							input: 'text-base text-start',
							parent: 'flex-1 bg-white'
						}}
					/>
					{#if inputError}
						<div class="text-xs font-medium text-red-sell">
							{inputError}
						</div>
					{/if}
				</div>
			{/if}
			<div class="mb-4 mt-2 flex flex-row justify-between">
				<div class="flex w-9/12 flex-row">
					<div
						class="mr-3 ml-2 flex h-5 w-[30px] items-center justify-center rounded-sm border border-grey-line bg-white"
					>
						<img src={bankLogo} class="h-3 w-3" alt="bank logo" />
					</div>
					<div class="flex flex-col">
						<div class="mb-1 text-sm text-grey-body">
							{bankName} - *{bankAccount?.substring(bankAccount.length - 4)}
						</div>
						<div class="text-xs text-grey-body">
							Registered with Angel One. Use the same bank account to pay
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
			<Button
				class="rounded"
				disabled={!amount?.length || (showInput && !inputText.length) || isLoading}
				onClick={() => onSubmit(inputText)}
			>
				PAY {amount?.length ? `₹${amount}` : ''}
			</Button>
		</div>
	{/if}
</div>
