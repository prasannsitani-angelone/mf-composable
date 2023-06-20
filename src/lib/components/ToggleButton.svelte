<script lang="ts">
	import Button from './Button.svelte';
	import type { ToggleButtonParam } from '$lib/types/IInvestments';
	export let onToggle = (a: ToggleButtonParam) => a;

	export let buttonParams: ToggleButtonParam[] = [
		{
			name: 'one',
			id: 'ONE',
			primary: true,
			disabled: false
		},
		{
			name: 'two',
			id: 'TWO'
		}
	];

	$: toggleButtonParams = buttonParams.slice(0, 2);

	const onButtonToggle = (btn: ToggleButtonParam) => {
		onToggle(btn);
		const anotherButtonIndex = toggleButtonParams.findIndex(
			(item: ToggleButtonParam) => item.name !== btn.name
		);

		if (toggleButtonParams[anotherButtonIndex]) {
			toggleButtonParams[anotherButtonIndex].primary = false;
		}
		btn.primary = true;
	};
</script>

<section>
	{#each toggleButtonParams as btn, index (btn.name)}
		<Button
			onClick={() => onButtonToggle(btn)}
			size="sm"
			class=" rounded-none !text-1xs !font-medium {index === 0 ? 'rounded-l-sm' : 'rounded-r-sm'} "
			variant={btn.primary ? 'contained' : 'outlined'}
			disabled={btn.disabled}>{btn.name}</Button
		>
	{/each}
</section>
