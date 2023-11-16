<script lang="ts">
	import { base } from '$app/paths';
	import InfoModal from '$components/InfoModal.svelte';
	import { getDateSuperscript } from '$lib/utils/helpers/date';
	import type { dateArrayTypes } from '$lib/types/Calendar/ICalendar';
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import { goto } from '$app/navigation';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { CalendarComponent, Modal } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { onMount } from 'svelte';
	import {
		investWithExpertAmountDecrementEvent,
		investWithExpertAmountIncrementEvent,
		investWithExpertProceedClickEvent,
		investWithExpertQuickSelectEvent,
		investWithExpertScreenImpressionEvent
	} from './analytics';
	import AmountSection from '$components/AmountInputOrderpad/AmountSection.svelte';

	const descriptionItems = [
		'Simply choose your monthly investment amount',
		'Your money will be invested in multiple mutual funds to maximise returns',
		'This is a diversified investment across small, mid and large market caps'
	];

	export let amount = 1000;
	const minSipAmount = 1000;
	const maxSipAmount = 15000;
	const quickInputs = [1500, 2000, 5000];

	const defaultSipStartSate = 4;
	let sipStartDate = defaultSipStartSate;

	let showCalendarLearnMoreModal = false;
	let showCalendar = false;

	const handlePlusClick = () => {
		if (amount >= maxSipAmount) {
			amount = maxSipAmount;
			return;
		}
		amount += 100;
		investWithExpertAmountIncrementEvent(amount);
	};

	const handleMinusClick = () => {
		if (amount <= minSipAmount) {
			amount = minSipAmount;
			return;
		}
		amount -= 100;
		investWithExpertAmountDecrementEvent(amount);
	};

	const handleQuickInputClick = (pillAmount: number) => {
		amount = pillAmount;
		investWithExpertQuickSelectEvent(amount);
	};

	const toggleShowCalendarLearnMoreModal = () => {
		showCalendarLearnMoreModal = !showCalendarLearnMoreModal;
	};

	const toggleCalendar = () => {
		showCalendar = !showCalendar;
	};

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

	const handleDateChange = (value: unknown) => {
		sipStartDate = value?.detail;
		toggleCalendar();
	};

	const handleProceedButtonClick = async () => {
		const params = encodeObject({
			amount: amount,
			date: sipStartDate,
			packId: '',
			requestId: ''
		});
		const path = `${base}/investwithexperts/confirm?params=${params}`;
		await goto(path);

		const eventMetaData = {
			amount: amount,
			date: sipStartDate
		};
		investWithExpertProceedClickEvent(eventMetaData);
	};

	onMount(() => {
		investWithExpertScreenImpressionEvent();
	});
</script>

<article class="mb-3 mt-1 max-w-4xl rounded-lg bg-white p-4 py-6 shadow-csm">
	<p class="alignment-center mb-6 text-center text-xl font-medium text-black-title">
		Earn more returns with a high performance portfolio
	</p>

	<img
		class="mx-auto px-6"
		src={`${base}/images/invest_with_experts.webp`}
		alt="Explore Mutual Funds"
	/>

	<ul class="px-4">
		{#each descriptionItems as item}
			<li class="list-disc text-sm font-normal text-black-title">
				{item}
			</li>
		{/each}
	</ul>
</article>

<article class="mb-24 max-w-4xl rounded-lg bg-white p-4 shadow-csm">
	<p class="mb-4 text-base font-normal text-black-title">Choose Monthly Investment Amount</p>

	<AmountSection
		{amount}
		quickInputsLabel="Popular"
		{quickInputs}
		on:plusClick={handlePlusClick}
		on:minusClick={handleMinusClick}
		on:quickInputClick={(e) => handleQuickInputClick(e?.detail)}
	/>

	<section class="flex flex-row items-center">
		<section class="flex flex-col">
			<div class="text-sm font-normal text-black-key">Monthly SIP Date</div>
			<button
				class="w-fit text-xs font-normal text-blue-primary"
				on:click={toggleShowCalendarLearnMoreModal}
			>
				Learn More
			</button>
		</section>
		<span class="flex-1" />
		<section
			on:keydown={() => {
				//
			}}
			role="button"
			tabindex="0"
			aria-pressed="false"
			class="flex w-[100px] flex-row items-center rounded border"
			on:click={toggleCalendar}
		>
			<div class="m-2 mr-6 text-xs font-normal text-black-title">
				{`${sipStartDate}${getDateSuperscript(sipStartDate)}`}
			</div>
			<div class="flex-1" />
			<section class=" border-l p-2">
				<CalendarSmallIcon height={16} width={16} />
			</section>
		</section>
	</section>
</article>

<article class="mx-3 mt-4 block md:hidden">
	<section class="fixed inset-0 top-auto bg-white px-4 py-5">
		<ButtonMedium onClick={handleProceedButtonClick} class="w-full">CONTINUE</ButtonMedium>
	</section>
</article>

{#if showCalendarLearnMoreModal}
	<InfoModal
		showModal={showCalendarLearnMoreModal}
		heading="Monthly SIP Date"
		detailText="Date on which your monthly instalment is due for investment"
		headingClass={'!font-normal'}
		on:crossClicked={toggleShowCalendarLearnMoreModal}
	>
		<svelte:fragment slot="crossIconSlot">
			<span />
		</svelte:fragment>
	</InfoModal>
{/if}

{#if showCalendar}
	<Modal isModalOpen={showCalendar} on:backdropclicked={toggleCalendar}>
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
	</Modal>
{/if}
