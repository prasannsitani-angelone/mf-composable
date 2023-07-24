<script setup lang="ts">
	import RadioButton from './RadioButton.svelte';

	export let bankLogo = '';
	export let bankName = '';
	export let bankAccount = '';
	export let showRadioButton = false;
	export let identifier = 0;
	export let selected = false;
	export let clazz = '';

	export let onSelect: (payload: number) => void = () => undefined;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class={`flex w-full flex-col justify-between rounded border border-grey-line bg-white px-4 py-3 ${clazz}`}
	on:click={() => onSelect(identifier)}
>
	<div class="flex items-center justify-between">
		<div class="flex flex-row items-center">
			<div class="flex h-8 w-11 items-center justify-center rounded-sm border border-grey-line">
				<img src={bankLogo} class="h-4 w-4" alt="bank logo" />
			</div>
			<div class="ml-2">
				<div class="flex flex-row">
					<div class="text-sm font-medium text-black-title">
						{bankName}
					</div>
				</div>

				<div class="mt-1 flex flex-row items-center text-xs font-medium text-grey-body">
					<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
					<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
					<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
					<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
					{bankAccount?.substring(bankAccount.length - 4)}
				</div>
			</div>
		</div>
		<slot name="rightSection">
			{#if showRadioButton}
				<RadioButton {selected} />
			{/if}
		</slot>
	</div>
	<slot name="bottomSection" />
</div>
