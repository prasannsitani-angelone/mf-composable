<script lang="ts">
	import { WMSIcon, Button } from 'svelte-components';

	export let bankLogo = '';
	export let bankName = '';
	export let selectedBankAccount = '';
	export let bankAccounts: number;
	export let showWhyThisBank = false;

	export let showBankSelectionPopup = (): void => undefined;
	export let openWhyThisBank = (): void => undefined;
</script>

<section class="mb-2 flex justify-between rounded border border-grey-line py-2.5">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click={showBankSelectionPopup} class="flex items-center">
		<div class="flex h-8 w-11 items-center justify-center rounded-sm">
			<img src={bankLogo} class="h-5 w-5" alt="bank logo" />
		</div>
		<div class="ml-1">
			<div class="flex flex-row items-start">
				<div class="flex items-center text-sm font-normal text-black-title">
					<div>{bankName}</div>
					{#if bankAccounts > 1}
						<div class="ml-1 min-w-[12px] flex-1">
							<WMSIcon name="arrow-up-solid" height={8} width={10} />
						</div>
					{/if}
				</div>
			</div>

			<div class="mt-1 flex flex-row items-center text-xs font-normal text-grey-body">
				<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
				<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
				<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
				<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
				{selectedBankAccount?.substring(selectedBankAccount.length - 4)}
			</div>
		</div>
	</div>
	{#if showWhyThisBank}
		<Button
			class=" !text-xs !font-normal normal-case text-blue-primary"
			variant="transparent"
			on:click={openWhyThisBank}>Why this bank?</Button
		>
	{/if}
</section>
