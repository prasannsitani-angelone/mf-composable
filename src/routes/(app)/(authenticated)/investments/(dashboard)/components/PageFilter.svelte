<script lang="ts">
	import ToggleButton from '$components/ToggleButton.svelte';
	import Button from '$components/Button.svelte';
	import type { ToggleButtonParam } from '$lib/types/IInvestments';

	export let onXirrClick = () => '';
	export let onFilterButtonClick = (a: ToggleButtonParam) => a;
	export let activeSelection = '';

	const buttons = [
		{
			name: 'Absolute',
			id: 'absolute',
			primary: true,
			disabled: false,
			class: 'min-w-[4.25rem]'
		},
		{
			name: 'XIRR',
			id: 'xirr',
			class: 'min-w-[4.25rem]'
		}
	];
</script>

<section class="px-1 pb-3 pt-1 sm:bg-white sm:px-6 sm:py-4 sm:pt-4">
	<div class="flex items-center justify-between sm:justify-between">
		<div class=" text-base font-normal text-black-key sm:text-lg">Your Investments</div>
		<div class="flex items-center">
			<!-- <span class=" mr-2 text-1xs font-normal text-grey-body">Show</span> -->
			<ToggleButton buttonParams={buttons} onToggle={onFilterButtonClick} />
		</div>
	</div>
	{#if activeSelection === 'xirr'}
		<div class=" text-right">
			<Button
				variant="transparent"
				size="xs"
				onClick={onXirrClick}
				class=" cursor-pointer px-0 pt-3 text-right text-xs font-normal text-blue-primary"
			>
				What is XIRR?
			</Button>
		</div>
	{/if}
</section>
