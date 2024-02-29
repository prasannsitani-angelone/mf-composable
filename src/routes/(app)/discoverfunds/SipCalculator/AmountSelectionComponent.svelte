<script lang="ts">
	import AmountText from '$components/AmountText.svelte';

	export let inputAmountArray = [1000, 2000, 5000, 10000];
	let selectedIndex = 0;
	export let selectedAmount = inputAmountArray[selectedIndex];
	const onAmountSelected = (index: number) => {
		selectedIndex = index;
		selectedAmount = inputAmountArray[selectedIndex];
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="flex justify-start gap-2">
	{#each inputAmountArray as item, index}
		{@const isSelected = selectedIndex === index}
		<div
			on:click={() => onAmountSelected(index)}
			class="rounded-3xl border bg-background-alt px-3 {isSelected
				? 'border-primary'
				: 'border-border'}"
		>
			<AmountText
				class="text-center text-sm font-normal {isSelected ? 'text-primary' : 'text-title'}"
				amount={item}
			/>
		</div>
	{/each}
</div>
