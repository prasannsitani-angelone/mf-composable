<script lang="ts">
	import Button from '$components/Button.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import TabNotSupported from './TabNotSupported.svelte';

	export let amountVal: string;
	export let errorMessage: string;
	export let showTabNotSupported: boolean;
	export let tabNotSupportedType: string;
	export let isLumpsumToSipEligible: boolean;
	export let isLumpsumInvestmentAllowed: boolean;

	export let handleAmountInputFocus = (): void => undefined;
	export let handleAmountInputBlur = (): void => undefined;
	export let onInputChange: (param: string | object) => void = () => undefined;
	export let toggleShowLumpsumToSipModal = (): void => undefined;
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

	{#if errorMessage?.length && isLumpsumInvestmentAllowed}
		<article class="flex justify-center pb-1">
			<p class="text-xs font-light text-sell">
				{errorMessage}
			</p>
		</article>
	{/if}

	{#if isLumpsumToSipEligible && !errorMessage?.length}
		<article class="border-t px-2 py-3">
			<section
				class="to from-buy/40 flex items-center justify-between rounded bg-gradient-to-r to-background-alt px-1 py-2"
			>
				<div class="flex items-start">
					<WMSIcon class="mr-1 mt-1" name="double-tick" width={15} height={9} />
					<p class="w-[80%] text-xs font-normal text-title">
						To reduce the risk of market fluctuations, consider investing this amount as SIP
					</p>
				</div>
				<Button
					variant="transparent"
					class="!h-fit !min-h-0 !px-0 !text-[11px] !font-normal"
					onClick={toggleShowLumpsumToSipModal}
				>
					Learn How
				</Button>
			</section>
		</article>
	{/if}

	{#if showTabNotSupported}
		<div class="pb-1">
			<TabNotSupported {tabNotSupportedType} />
		</div>
	{/if}
</article>
