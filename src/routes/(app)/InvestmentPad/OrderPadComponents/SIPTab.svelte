<script lang="ts">
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import CheckboxCheckedIcon from '$lib/images/icons/CheckboxCheckedIcon.svelte';
	import CheckboxUncheckedIcon from '$lib/images/icons/CheckboxUncheckedIcon.svelte';
	import OrderpadReturns from './OrderpadReturns.svelte';
	import TabNotSupported from './TabNotSupported.svelte';

	export let amountVal: string;
	export let amount: string;
	export let errorMessage: string;
	export let calendarDate: number;
	export let dateSuperscript: string;
	export let paymentMandatory: boolean | undefined;
	export let firstSipPayment: boolean;
	export let showTabNotSupported: boolean;
	export let tabNotSupportedType: string;
	export let threeYearReturns: number;
	export let isSipInvestmentAllowed: boolean;

	export let toggleCalendar = (): void => undefined;
	export let toggleFirstSipPayment = (): void => undefined;
	export let onInputChange: (param: string | object) => void = () => undefined;
	export let handleAmountInputFocus = (): void => undefined;
	export let handleAmountInputBlur = (): void => undefined;
</script>

<article class="flex flex-col p-3">
	<!-- Amount input -->
	<article class="flex flex-col items-center rounded border py-2.5">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="mb-2 text-xs font-normal text-body">ENTER AMOUNT</label>
		<button
			class="flex w-full cursor-text items-center justify-start"
			on:click={handleAmountInputFocus}
		>
			<input
				id="amountInput"
				inputmode="none"
				maxlength="13"
				placeholder="₹"
				value={amountVal}
				class="w-full bg-background-alt text-center text-2xl font-medium leading-none text-title outline-none"
				on:input={onInputChange}
				on:focus={handleAmountInputBlur}
			/>
		</button>
	</article>

	{#if errorMessage?.length && isSipInvestmentAllowed}
		<article class="flex justify-center pb-1">
			<p class="text-xs font-light text-sell">
				{errorMessage}
			</p>
		</article>
	{/if}

	<article class="mt-3 flex w-full flex-row items-center justify-between">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="text-xs font-normal text-title">Monthly SIP Date</label>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<section
			class="flex items-center md:cursor-pointer {isSipInvestmentAllowed
				? 'md:cursor-pointer'
				: 'md:cursor-not-allowed'}"
			on:click={toggleCalendar}
			on:keypress={() => {
				// add logic
			}}
		>
			<div class="text-xs font-normal text-title">
				{`${calendarDate}${dateSuperscript}`} of every month
			</div>
			<section class="pl-1">
				<CalendarSmallIcon height={16} width={16} />
			</section>
		</section>
	</article>

	<!-- Checkbox for SIP payment now -->
	{#if !paymentMandatory}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<article
			class={`mt-4 flex w-fit items-center justify-start text-xs font-normal text-body ${
				isSipInvestmentAllowed ? 'md:cursor-pointer' : 'md:cursor-not-allowed'
			}`}
			on:click={toggleFirstSipPayment}
			on:keypress={() => {
				// add logic
			}}
		>
			{#if firstSipPayment}
				<div class="mr-2">
					<CheckboxCheckedIcon />
				</div>
			{:else}
				<div class="mr-1">
					<CheckboxUncheckedIcon />
				</div>
			{/if}
			<span class="text-title"> Make first SIP payment now </span>
		</article>
	{/if}

	{#if isSipInvestmentAllowed && amount?.length && !errorMessage?.length}
		<OrderpadReturns
			investedAmount={Number(amount)}
			{threeYearReturns}
			class="mt-4 !border-b-0 border-t !px-0 pb-0 pt-3"
			amountClass="text-xl"
			textClass="flex flex-row items-center"
		>
			<span slot="supporting-text" class="ml-1">Expected 3Y Returns</span>
		</OrderpadReturns>
	{/if}

	{#if showTabNotSupported}
		<div class="pb-1">
			<TabNotSupported {tabNotSupportedType} />
		</div>
	{/if}
</article>
