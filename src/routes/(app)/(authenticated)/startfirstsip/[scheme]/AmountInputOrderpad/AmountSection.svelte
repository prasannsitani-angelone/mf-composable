<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import Button from '$components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import AmountInput from './AmountInput.svelte';

	export let amount: number;
	export let quickInputs: Array<number>;

	const dispatch = createEventDispatcher();

	const handlePlusClick = () => {
		dispatch('plusClick');
	};

	const handleMinusClick = () => {
		dispatch('minusClick');
	};

	const handleQuickInputClick = (amount: number) => {
		dispatch('quickInputClick', amount);
	};
</script>

<article class={$$props?.class}>
	<section>
		<AmountInput {amount} on:plusClick={handlePlusClick} on:minusClick={handleMinusClick} />
	</section>

	<section class="mt-2.5">
		<div class="text-xs text-black-bolder">Most chosen</div>

		<div class="mb-6 mt-2">
			{#each quickInputs as pill, index (pill)}
				<Button
					variant="outlined"
					class="!h-fit !min-h-0 px-3 py-1 {index > 0 ? 'ml-2' : ''} text-xs font-medium"
					onClick={() => handleQuickInputClick(pill)}
				>
					<AmountText amount={pill} />
				</Button>
			{/each}
		</div>
	</section>
</article>
