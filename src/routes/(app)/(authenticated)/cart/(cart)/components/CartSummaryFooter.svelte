<script lang="ts">
	import Button from '$components/Button.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { maxCheckoutItems } from '../../constants';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import type { CartEntity } from '$lib/types/ICartStore';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { hydrate } from '$lib/utils/helpers/hydrated';

	export let onProceedButtonClick = () => '';
	export let cartItems: CartEntity[];
	export let selectedFunds: CartEntity[];

	const notAllowedToProceed = (items: CartEntity[]) => {
		return (
			selectedFunds?.length === 0 ||
			(Array.isArray(items) && items.some((item) => item.isSelected && item.inputError))
		);
	};

	$: totalSelectedAmount = (selectedFunds || [])
		.filter((fund) => !fund.inputError)
		.reduce((acc, curr) => acc + curr.amount, 0);
</script>

<section class="absolute bottom-0 left-0 right-0 bg-white px-3 py-4 max-sm:shadow-top sm:static">
	<div class="grid grid-cols-1 gap-y-4 sm:grid-cols-[1fr_2fr]">
		<div class="col-span-1 col-start-1 row-span-1 row-start-1">
			<div class="flex justify-between">
				<div class=" text-left">
					<div class="text-sm font-normal text-black-bolder">Funds selected</div>
					<div class="font-sm flex items-center font-normal text-black-key">
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
					<div class="font-sm font-normal text-black-key">
						₹ {addCommasToAmountString(totalSelectedAmount) || '0'}
					</div>
				</div>
			</div>
		</div>
		<div
			class="col-span-1 col-start-1 row-span-1 row-start-2 sm:col-start-2 sm:row-start-1 sm:text-right"
		>
			{#if hydrate}
				<Button
					disabled={notAllowedToProceed(selectedFunds)}
					class="w-full !font-normal disabled:bg-grey-line disabled:text-grey-disabled sm:max-w-fit sm:px-16 "
					onClick={onProceedButtonClick}>PROCEED TO PLACE ORDER</Button
				>
			{:else}
				<div class="flex w-full justify-end">
					<SkeletonWrapper class="max-sm:w-full sm:mx-0">
						<SkeletonRectangle class="!h-12 w-full sm:w-72" />
					</SkeletonWrapper>
				</div>
			{/if}
		</div>
	</div>
</section>
