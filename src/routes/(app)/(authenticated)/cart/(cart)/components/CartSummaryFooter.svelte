<script lang="ts">
	import Button from '$components/Button.svelte';
	import { WMSIcon } from 'wms-ui-component';
	import { maxCheckoutItems } from '../../constants';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import type { CartEntity } from '$lib/types/ICartStore';

	export let onProceedButtonClick = () => '';
	export let cartItems: CartEntity[];
	export let selectedFunds: CartEntity[];

	const notAllowedToProceed = (items: CartEntity[]) => {
		return (
			selectedFunds?.length === 0 ||
			(Array.isArray(items) && items.some((item) => item.isSelected && item.inputError))
		);
	};

	$: totalSelectedAmount = (selectedFunds || []).reduce((acc, curr) => acc + curr.amount, 0);
</script>

<section class="fixed bottom-18 left-0 right-0 bg-white px-3 py-4 max-sm:shadow-top sm:static">
	<div class="grid grid-cols-1 gap-y-4 sm:grid-cols-[1fr_2fr]">
		<div class="col-span-1 col-start-1 row-span-1 row-start-1">
			<div class="flex justify-between">
				<div class=" text-left">
					<div class="text-sm font-normal text-black-bolder">Funds selected</div>
					<div class="font-sm flex items-center font-medium text-black-key">
						{#if selectedFunds?.length > maxCheckoutItems}
							<div>
								<WMSIcon name="polygon-yellow-warning" width={16} height={16} class="mr-1" />
							</div>
						{/if}
						<span>{String(selectedFunds?.length) || '-'} out of {cartItems?.length || '-'}</span>
					</div>
				</div>
				<div class=" text-right">
					<div class="text-sm font-normal text-black-bolder">Total Amount</div>
					<div class="font-sm font-medium text-black-key">
						₹ {addCommasToAmountString(totalSelectedAmount) || '0'}
					</div>
				</div>
			</div>
		</div>
		<div
			class="col-span-1 col-start-1 row-span-1 row-start-2 sm:col-start-2 sm:row-start-1 sm:text-right"
		>
			<Button
				disabled={notAllowedToProceed(cartItems)}
				class="w-full !font-medium disabled:bg-grey-line disabled:text-white sm:max-w-fit sm:px-16 "
				onClick={onProceedButtonClick}>PROCEED TO PLACE ORDER</Button
			>
		</div>
	</div>
</section>
