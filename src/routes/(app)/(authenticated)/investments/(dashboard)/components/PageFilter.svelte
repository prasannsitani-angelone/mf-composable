<script lang="ts">
	import ToggleButton from '$components/ToggleButton.svelte';
	import Button from '$components/Button.svelte';
	import type { ToggleButtonParam } from '$lib/types/IInvestments';

	export let onXirrClick = () => '';
	export let onFilterButtonClick = (a: ToggleButtonParam) => a;

	const buttons = [
		{
			name: 'Absolute',
			id: 'absolute',
			primary: true,
			disabled: false
		},
		{
			name: 'XIRR',
			id: 'xirr'
		}
	];
</script>

<section class="px-1 pt-4 pb-3 sm:bg-white sm:px-6 sm:py-4">
	<div class="flex items-start justify-between sm:justify-end">
		<div class=" text-base font-medium text-black-key sm:hidden">Your Investments</div>
		<div class="flex items-center">
			<span class=" mr-2 text-1xs font-medium text-grey-body">Show</span>
			<ToggleButton buttonParams={buttons} onToggle={onFilterButtonClick} />
		</div>
	</div>
	<div class=" text-right">
		<Button
			variant="transparent"
			size="xs"
			onClick={onXirrClick}
			class=" cursor-pointer px-0 pt-3 text-right text-xs font-medium text-blue-primary"
		>
			What is XIRR?
		</Button>
	</div>
</section>
