<script lang="ts">
	import Button from '$components/Button.svelte';
	import { createEventDispatcher } from 'svelte';

	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	import { xirrFilterModalImpressionEvent } from '../../analytics';

	export let isXIRRModalOpen = false;

	const dispatch = createEventDispatcher();

	const onCloseModal = () => {
		dispatch('closeModal');
	};
</script>

<ModalWithAnimation
	closeModal={onCloseModal}
	isModalOpen={isXIRRModalOpen}
	on:modalMounted={() => xirrFilterModalImpressionEvent()}
>
	<div
		class="w-screen rounded-b-none rounded-t-2xl bg-background-alt px-4 py-6 sm:!w-[460px] sm:rounded-lg sm:p-8"
	>
		<div
			data-testid="investmentXirrModal"
			class=" pb-6 text-lg font-normal text-title sm:pb-3 sm:text-xl"
		>
			What is XIRR?
		</div>
		<div class=" text-sm font-normal text-body">
			XIRR stands for Extended Internal Rate of Return. XIRR helps calculate the annualized rate of
			return of your mutual fund investment, considering the specific dates and amounts of your
			purchases and withdrawal. XIRR gives you a more accurate picture of how well your investment
			is doing compared to other measures.
		</div>
		<div data-testid="investmentXirrModalBtn" class="hidden pt-8 text-center sm:block">
			<Button class="px-12" variant="outlined" onClick={onCloseModal}>GOT IT</Button>
		</div>
	</div>
</ModalWithAnimation>
