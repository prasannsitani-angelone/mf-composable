<script lang="ts">
	import PortfolioAllocation from './PortfolioAllocation.svelte';
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import AmountSection from '$components/AmountInputOrderpad/AmountSection.svelte';
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import CalendarComponent from '$components/Calendar/CalendarComponent.svelte';
	import type { dateArrayTypes } from '$lib/types/Calendar/ICalendar';
	import { getDateSuperscript } from '$lib/utils/helpers/date';
	import PaymentFlow from './PaymentFlow.svelte';
	import OrderpadReturns from '../../../../InvestmentPad/OrderPadComponents/OrderpadReturns.svelte';
	import TncModal from '$components/TnC/TncModal.svelte';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	import {
		minusAmountClick,
		orderPadImpression,
		plusAmountClick,
		popularAmountClick,
		sipDateClick
	} from '$lib/analytics/buyPortfolio/buyPortfolio';

	export let portfolioPack: PortfolioPack;
	export let amount = 500;
	export let sipStartDate = 4;
	export let requestId = '';

	const dispatch = createEventDispatcher();
	const quickInputs = [1500, 2000, 5000];
	let showAmount = true;
	let maxAmounts: number[] = [];
	let sipMaxAmount = 0;
	let showCalendar = false;

	let showTncModal = false;
	let dateArray: Array<dateArrayTypes> = [{ value: 1, disabled: false }];
	$: {
		dateArray.pop();
		for (let i = 1; i <= 28; i++) {
			dateArray.push({
				value: i,
				disabled: false
			});
		}
	}
	onMount(() => {
		portfolioPack.schemes.forEach((x) => {
			maxAmounts.push(x.sipMaxAmount);
		});
		sipMaxAmount = Math.min(...maxAmounts);
		orderPadImpression({
			Portfolio: portfolioPack?.packName,
			'Returnp.a.': portfolioPack?.threeYrReturnAvgPer
		});
	});

	const handleBackButtonClick = () => {
		dispatch('backButtonClicked');
	};
	const handlePlusClick = () => {
		if (amount >= sipMaxAmount) {
			amount = sipMaxAmount;
			return;
		}
		amount += 100;
		plusAmountClick();
	};
	const handleMinusClick = () => {
		if (amount <= portfolioPack.minSipAmount) {
			amount = portfolioPack.minSipAmount;
			return;
		}
		amount -= 100;
		minusAmountClick();
	};
	const handleQuickInputClick = (pillAmount: number) => {
		amount = pillAmount;
		popularAmountClick({ amount: pillAmount });
	};
	const toggleCalendar = () => {
		showCalendar = !showCalendar;
	};
	const handleDateChange = (value: unknown) => {
		sipStartDate = value?.detail;
		toggleCalendar();
		sipDateClick({ DayOfMonth: sipStartDate });
	};
	const toggleTncModal = () => {
		showTncModal = !showTncModal;
	};
</script>

<section class="h-screen w-full bg-background max-sm:overflow-auto md:h-[860px] md:w-[500px]">
	<div class="mb-2 flex items-center bg-background-alt px-4 pb-3 pt-4 text-lg font-medium">
		<LeftArrowIcon class="mr-4 cursor-pointer" onClick={handleBackButtonClick} />
		Start SIP
	</div>
	<div class="mx-2 mb-2 flex items-center justify-between rounded-lg bg-background-alt px-4 py-3">
		<div class="flex items-center">
			<SchemeLogo src={portfolioPack.packLogoUrl} />
			<div class="text-xs">
				<p class="text-base font-medium">{portfolioPack.packName}</p>
			</div>
		</div>
		<div class="flex flex-col items-end">
			<p class="text-xs text-body">Returns p.a</p>
			<div class="flex flex-row items-center">
				<p class="text-base font-medium">{portfolioPack.threeYrReturnAvgPer.toFixed(2)}%</p>
			</div>
		</div>
	</div>
	<div class="mx-2 mb-2 flex flex-col rounded-lg bg-background-alt px-4 py-3">
		<AmountSection
			{amount}
			quickInputsLabel="Popular"
			{quickInputs}
			class="w-full"
			on:plusClick={handlePlusClick}
			on:minusClick={handleMinusClick}
			on:quickInputClick={(e) => handleQuickInputClick(e?.detail)}
		/>
		<section class="flex flex-row items-center justify-between">
			<section class="flex flex-col">
				<div class="text-sm font-normal text-title">Monthly SIP Date</div>
			</section>
			<section
				on:keydown={() => {
					//
				}}
				role="button"
				tabindex="0"
				aria-pressed="false"
				class="flex flex-row items-center"
				on:click={toggleCalendar}
			>
				<div class="text-xs font-normal text-title">
					{`${sipStartDate}${getDateSuperscript(sipStartDate)}`}
				</div>
				<section class="p-2">
					<CalendarSmallIcon height={16} width={16} />
				</section>
			</section>
		</section>
		<section>
			<OrderpadReturns
				investedAmount={Number(amount)}
				threeYearReturns={portfolioPack.threeYrReturnAvgPer}
				class="mt-4 !border-b-0 border-t !px-0 pb-0 pt-3"
				amountClass="text-xl"
				textClass="flex flex-row items-center"
			>
				<span slot="supporting-text" class="ml-1">Expected value in 3 years</span>
			</OrderpadReturns>
		</section>
	</div>
	<div class="mx-2 mb-2 rounded-lg bg-background-alt p-4 max-sm:mb-36">
		<PortfolioAllocation {portfolioPack} {showAmount} {amount} />
	</div>
	<div class="mx-2 rounded-lg">
		<section class="fixed inset-0 top-auto rounded-lg bg-background-alt p-2 md:relative">
			<article class="flex items-center justify-center bg-background-alt px-4 pt-2">
				<p class="text-center text-xs font-normal text-title">
					By proceeding, you accept Angel One's
					<button class="text-primary md:cursor-pointer" on:click={toggleTncModal}>
						Terms and Conditions
					</button>
				</p>
			</article>
			<PaymentFlow {portfolioPack} {amount} date={sipStartDate} {requestId} />
		</section>
	</div>
</section>

{#if showCalendar}
	<ModalWithAnimation isModalOpen={showCalendar} on:backdropclicked={toggleCalendar}>
		<CalendarComponent
			classes={{
				title: 'uppercase mr-auto'
			}}
			visible={showCalendar}
			title={'Select SIP Instalment Date'}
			heading={'CONFIRM'}
			showClose={false}
			showSubmit={true}
			{dateArray}
			defaultValue={sipStartDate}
			on:submit={handleDateChange}
			on:close={toggleCalendar}
			class="z-60 sm:w-120"
		/>
	</ModalWithAnimation>
{/if}

{#if showTncModal}
	<TncModal showModal={showTncModal} on:closeModal={toggleTncModal} />
{/if}
