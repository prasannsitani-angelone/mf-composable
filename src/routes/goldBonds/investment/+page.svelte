<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { createFieldValidator } from '$lib/utils/helpers/validation';
	import { numericValidator, requiredValidator } from '$lib/utils/helpers/validators';
	import SucessPopup from '$lib/components/OrderFlow/SucessPopup.svelte';
	import { page } from '$lib/stores/PageStore.js';
	import { overlay } from '$lib/stores/OverLayStore.js';
	let value = 1;
	let ref: HTMLInputElement;
	const { store: quantityValidity, action: quantityValidate } = createFieldValidator(
		requiredValidator('Quantity'),
		numericValidator('Quantity', 1)
	);
	$page.showBackIcon = true;
	onMount(() => {
		ref.focus();
	});
	onDestroy(() => {
		$overlay.isOpen = false;
		$page.showBackIcon = false;
	});
</script>

<section>
	<article class="rounded-lg bg-green-lite pb-2">
		<!-- Tabs -->
		<section class="flex justify-center rounded-lg rounded-b-none font-semibold text-black-title">
			<button class="h-12 w-40 rounded-t border-t-4 border-t-green-buy"> Delivery </button>
		</section>

		<!-- Max Quantity -->
		<article class="mx-2.5 mt-4 flex justify-between">
			<p class="text-xs text-black-title">Max Qty available on Delivery</p>
			<p class="text-xs text-black-title">
				<span class="font-semibold">4000</span><span class="ml-1 text-grey-body">grams</span>
			</p>
		</article>

		<!-- Input -->
		<section class="mx-2.5 mb-4 mt-4 flex flex-col items-center rounded-lg bg-white p-2">
			<TextInput
				type="number"
				inputClass="text-center text-2xl mt-1"
				bind:value
				labelClass="text-xs text-grey-body"
				name="quantity"
				label="Enter Quantity"
				bind:ref
				actions={[[quantityValidate, value]]}
			/>
			<article class="flex justify-center pb-1">
				{#if $quantityValidity.dirty && !$quantityValidity.valid}
					<span class="validation-hint">
						<p class="text-xs font-light text-red-sell">
							{$quantityValidity?.message}
						</p>
					</span>
				{/if}
			</article>
		</section>
	</article>

	<!-- Proceed button for Mobile UI -->
	<article class="mx-3 mt-4 block">
		<section class="fixed inset-0 top-auto flex flex-col justify-center bg-white px-4 py-3">
			<section class="mb-4 flex justify-between">
				<article>
					<span class="text-xs text-grey-body">Margin Required (Approx) </span>
					<h4 class="text-black-title">₹99,99,99,999</h4>
				</article>
				<article class="text-right">
					<span class="text-xs text-grey-body">Available Margin</span>
					<h4 class="text-black-title">₹99,99,99,999</h4>
				</article>
			</section>
			<Button
				class="py-4"
				color="greenBuy"
				disabled={!$quantityValidity.valid}
				onClick={() => ($overlay.isOpen = true)}>PLACE ORDER</Button
			>
		</section>
	</article>
</section>
{#if $overlay.isOpen}
	<SucessPopup />
{/if}
