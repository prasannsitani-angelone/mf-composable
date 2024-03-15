<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { page } from '$app/stores';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import Modal from '$components/Modal.svelte';
	import Button from '$components/Button.svelte';
	import { goto } from '$app/navigation';
	import CartGridTableRows from './components/CartGridTableRows.svelte';
	import CartSummaryFooter from './components/CartSummaryFooter.svelte';
	import CartTableHeader from './components/CartTableHeader.svelte';
	import { maxCheckoutItems } from '../constants';
	import { getCompleteSIPDateBasedonDD } from '$lib/utils/helpers/date';
	import { bulkUpdateCartItems } from '$lib/services/cart';
	import { getEmandateDataFunc } from '$components/Payment/api';
	import { getPrimaryAccountMandateData } from '$lib/utils/helpers/emandate';
	import { getFormattedSIPDate } from '$components/Payment/util';
	import { ProceedToCheckoutClickAnalytics } from '../analytics/cart';
	import type { CartEntity } from '$lib/types/ICartStore';
	import { createCartEventMetaDataAnalytics } from './utils';
	import { toastStore } from '$lib/stores/ToastStore';

	export let cartItems: CartEntity[];

	let isSelectAllChecked = false;
	let proceedNotAllowedMessage = '';

	let showProceedNotAllowedModal = false;
	let selectedItems = getSelectedItems(cartItems);

	let bulkUpdateModalType = '';

	const nextSipDateBufferDaysWithFtp = 30;
	const nextSipDateBufferDaysWithoutFtp = 10;

	const updateStatusToast = () => {
		let statusMessage = 'Something went wrong. Please try again in some time';

		if (!navigator?.onLine) {
			statusMessage =
				'You are not connected to the internet. Please check your connection and retry';
		}

		toastStore?.updateStatusToast({
			type: 'STATUS',
			message: statusMessage
		});
	};

	function upDateLocalStateOnCartUpdate(items: CartEntity[]) {
		selectedItems = getSelectedItems(items);
		isSelectAllChecked = selectedItems.length === items?.length;
	}
	async function toggleSelectAll() {
		isSelectAllChecked = !isSelectAllChecked;
		cartItems.forEach((item) => (item.isSelected = isSelectAllChecked));
		cartItems = cartItems;

		const payload = {
			selectedAll: isSelectAllChecked,
			items: []
		};

		let bulkUpdateCartItemsRes = await bulkUpdateCartItems(payload);

		if (bulkUpdateCartItemsRes instanceof Error) {
			updateStatusToast();
		}
	}
	function isProceedAllowed(selected: CartEntity[]) {
		return (
			Array.isArray(selected) &&
			selected.length > 0 &&
			selected.length <= maxCheckoutItems &&
			selected.every((item) => !item.inputError)
		);
	}
	function getSelectedItems(items: CartEntity[]) {
		return (Array.isArray(items) && items.filter((item) => item.isSelected)) || [];
	}
	const getSIPDate = (calendarDate: number) => {
		const firstSipPayment = true;
		return getCompleteSIPDateBasedonDD(
			calendarDate,
			new Date(),
			firstSipPayment ? nextSipDateBufferDaysWithFtp : nextSipDateBufferDaysWithoutFtp
		);
	};

	function setParamForSIPs(fund: CartEntity, param: string, fallback: string | number) {
		return fund.investmentType === 'SIP' ? fund[param] : fallback;
	}

	const createBulkUpdatePayload = (selections: CartEntity[], emandateId: string) => {
		const items = selections.map((fund) => {
			return {
				amount: fund.amount,
				cartItemId: fund.cartItemId,
				dpNumber: $page.data?.profile?.dpDetails?.dpIdNo || '',
				frequency: setParamForSIPs(fund, 'frequency', ''),
				investmentType: fund.investmentType,
				isSelected: true,
				mandateId: fund.investmentType === 'SIP' ? emandateId : '',
				noOfInstallment: setParamForSIPs(fund, 'installmentNo', 0),
				selectedSipDay: setParamForSIPs(fund, 'sipDay', 4),
				startDate: fund.investmentType === 'SIP' ? getFormattedSIPDate(getSIPDate(fund.sipDay)) : ''
			};
		});
		const payload = {
			items,
			selectedAll: true
		};
		return payload;
	};

	function getMaxAmountForADay(selections: CartEntity[], key: string) {
		if (!Array.isArray(selections)) {
			return {};
		}
		const group = {};
		selections.forEach((item) => {
			if (group[item[key]]) {
				group[item[key]] = group[item[key]] + item.amount;
			} else {
				group[item[key]] = item.amount;
			}
		});
		return Math.max(...Object.values(group));
	}

	async function bulkUpdateSelectedFunds(selections: CartEntity[]) {
		ProceedToCheckoutClickAnalytics(createCartEventMetaDataAnalytics(cartItems));
		const allSipFunds = selections.filter((item) => item.investmentType === 'SIP');

		const maxAmountForADayForSIP = getMaxAmountForADay(allSipFunds, 'sipDay');

		bulkUpdateModalType = 'loading';
		const emandateResponse = await getEmandateDataFunc({
			amount: maxAmountForADayForSIP,
			sipDate: getSIPDate(new Date().getDate())
		});
		const emandateId = getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || '';

		const payload = createBulkUpdatePayload(selections, emandateId);

		const res = await bulkUpdateCartItems(payload);
		if (res.ok) {
			goto('./cart/confirmation');
			bulkUpdateModalType = '';
		} else {
			bulkUpdateModalType = 'failure';
		}
	}
	async function onProceedToConfirmationClick() {
		selectedItems = getSelectedItems(cartItems);
		if (isProceedAllowed(selectedItems)) {
			// Call the BUlk update API API
			await bulkUpdateSelectedFunds(selectedItems);
		} else {
			// Show the modal
			showProceedNotAllowedModal = true;
			if (Array.isArray(selectedItems) && selectedItems.length > maxCheckoutItems) {
				proceedNotAllowedMessage = `You can place order for a maximum of 15 items at a time. Your selection currently has ${selectedItems.length}
				items. Please remove item(s) to place an order`;
			} else {
				proceedNotAllowedMessage = 'One or more of above selected field has an error';
			}
		}
	}
	function closeOrderLimitExceedModal() {
		showProceedNotAllowedModal = false;
		proceedNotAllowedMessage = '';
	}
	function closeBulkUpdateConfirmationModal() {
		bulkUpdateModalType = '';
	}
	$: upDateLocalStateOnCartUpdate(cartItems);
	$: isMobile = $page?.data?.deviceType?.isMobile;
</script>

<CartTableHeader {isSelectAllChecked} handleCheckboxChange={toggleSelectAll} />
<section
	class=" bg-background-alt max-sm:h-[calc(100vh-256px)] max-sm:overflow-auto max-sm:pb-20 sm:mb-4"
>
	<div id="cartGridTable">
		<div id="cartGridTableHeader" class="text-xs font-normal text-body">
			<div
				class="hidden grid-cols-[10%_1fr_28%] border-b px-6 py-3 sm:grid sm:grid-cols-[6%_43%_20%_20%_11%]"
			>
				<div class="col-span-2 col-start-1 row-span-1 row-start-1">Fund</div>

				<div class="col-span-1 col-start-2 row-span-1 row-start-2 sm:col-start-3 sm:row-start-1">
					InvestmentType
				</div>
				<div class="col-span-1 col-start-3 row-span-1 row-start-2 sm:col-start-4 sm:row-start-1">
					SIP Date
				</div>
				<div class="col-span-1 col-start-3 row-span-1 row-start-1 sm:col-start-5">Amount</div>
			</div>
		</div>
		{#each cartItems as item, index (index)}
			<CartGridTableRows bind:cartItem={item} />
		{/each}
	</div>
</section>
<CartSummaryFooter
	onProceedButtonClick={onProceedToConfirmationClick}
	selectedFunds={selectedItems}
	{cartItems}
/>
{#if showProceedNotAllowedModal}
	<Modal closeModal={closeOrderLimitExceedModal} isModalOpen>
		<div
			class="flex w-screen flex-col items-center justify-between rounded-b-none rounded-t-2xl bg-background-alt p-4 text-center sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-8"
		>
			<div class=""><WMSIcon width={92} height={92} name="red-exclamation-thin" /></div>
			<div class="mb-4 mt-6 text-2xl font-normal text-title">Order size limit exceeded</div>

			<div class=" text-sm font-normal text-title">
				{proceedNotAllowedMessage}
			</div>

			<section class="flex w-full flex-row gap-4 bg-background-alt pb-2 pt-6 sm:pt-10">
				<Button
					variant="contained"
					class="flex-1 rounded max-sm:w-full"
					onClick={closeOrderLimitExceedModal}
				>
					GOT IT
				</Button>
			</section>
		</div>
	</Modal>
{/if}

{#if bulkUpdateModalType}
	<Modal closeModal={closeBulkUpdateConfirmationModal} isModalOpen>
		<div
			class=" flex min-h-[40vh] w-screen flex-col items-center justify-center rounded-b-none rounded-t-2xl bg-background-alt p-4 text-center sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-8"
		>
			{#if bulkUpdateModalType === 'loading'}
				<div class="flex h-full">
					<LoadingIndicator
						svgClass={`${isMobile ? '!w-[86px] !h-[86px] mt-10' : '!w-28 !h-28'}`}
					/>
				</div>
			{:else if bulkUpdateModalType === 'failure'}
				<div class=""><WMSIcon width={92} height={92} name="red-cross-circle" /></div>
				<div class="mb-4 mt-6 text-2xl font-normal text-title">Unable to process your request.</div>
			{/if}
			{#if bulkUpdateModalType === 'failure'}
				<section class="flex w-full flex-row gap-4 bg-background-alt pb-2 pt-6 sm:pt-10">
					<Button
						variant="outlined"
						class="flex-1 rounded max-sm:w-full"
						onClick={closeBulkUpdateConfirmationModal}
					>
						GOT IT
					</Button>
				</section>
			{/if}
		</div>
	</Modal>
{/if}
