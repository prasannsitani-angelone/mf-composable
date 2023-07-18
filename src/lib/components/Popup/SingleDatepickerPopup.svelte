<script setup lang="ts">
	import Modal from '$components/Modal.svelte';
	import Button from '$components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	import CalendarIcon from '$lib/images/icons/CalendarIcon.svelte';
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';
	import SingleDatepicker from '$components/Datepickers/SingleDatepicker.svelte';
	import type { DatepickerEntity } from '$lib/types/IDatepicker';

	export let date = new Date();
	export let displayDate = '';
	export let heading = '';
	export let minDate = '';

	const dispatch = createEventDispatcher();

	$: isMobile = $page?.data?.deviceType?.isMobile;
	const applyDate = () => {
		dispatch('applyDate');
	};
	const backdropClick = () => {
		dispatch('backdropClick');
	};
	const handleDateChange = (newDate: DatepickerEntity) => {
		dispatch('onChange', newDate?.selected);
	};
</script>

<Modal closeModal={backdropClick} isModalOpen>
	<div class="rounded-b-none rounded-t-2xl bg-white sm:rounded-lg">
		<div class="flex items-center justify-between border-b border-grey-line px-8">
			<p class="py-6 text-xl font-medium text-black-title">
				{heading}
			</p>
			{#if !isMobile}
				<CrossInCircleIcon class="cursor-pointer" onClick={backdropClick} />
			{/if}
		</div>
		<div class="mx-8 py-6">
			<p class="pb-4 text-sm font-normal text-grey-body">Date</p>
			<div class="flex items-center justify-between border-b border-grey-line pb-3">
				{#if date}
					<span class="tetx-black-title text-base font-medium">{displayDate}</span>
				{:else}
					<span class="text-base font-medium text-grey-disabled">DD/MM/YYYY</span>{/if}
				<CalendarIcon class="mb-1 ml-auto" />
			</div>
			<SingleDatepicker class="mt-3" {minDate} selected={date} onChange={handleDateChange} />
			{#if !isMobile}
				<section class="mt-2 flex items-center justify-center">
					<div class="w-[190px]">
						<Button class="w-full rounded" onClick={applyDate}>
							<div class="flex items-center justify-center">APPLY</div>
						</Button>
					</div>
				</section>
			{/if}
		</div>
	</div>
</Modal>
