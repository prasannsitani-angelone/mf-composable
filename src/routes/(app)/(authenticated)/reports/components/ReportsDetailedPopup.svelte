<script lang="ts">
	import type { FinancialYear } from '$lib/types/IReports';
	import { createEventDispatcher } from 'svelte';
	import ReportsDetailedCard from './ReportsDetailedCard.svelte';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';

	export let selected: FinancialYear = {};
	export let info = '';
	export let heading = '';
	export let subHeading = '';
	export let reportType = '';
	export let fileName = '';
	export let fileExtension = '';
	export let subHeadingClass = '';

	const dispatch = createEventDispatcher();

	const backdropClick = () => {
		dispatch('backdropClick');
	};
</script>

<ModalWithAnimation closeModal={backdropClick} isModalOpen>
	<div
		class="w-screen items-stretch rounded-b-none rounded-t-2xl bg-background-alt max-sm:!p-0 sm:rounded-lg"
	>
		<div class="flex items-center justify-between px-4 pb-4 pt-6">
			<span class="text-lg font-normal text-title">
				{heading}
			</span>
		</div>
		<ReportsDetailedCard
			{selected}
			{info}
			{subHeading}
			{subHeadingClass}
			{reportType}
			{fileName}
			{fileExtension}
			on:onSubmit
		>
			<svelte:fragment slot="content">
				<slot name="content" />
			</svelte:fragment>
		</ReportsDetailedCard>
	</div>
</ModalWithAnimation>
