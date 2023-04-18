<script lang="ts">
	import Button from '$components/Button.svelte';
	import Modal from '$components/Modal.svelte';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import FailedIcon from '$lib/images/icons/FailedIcon.svelte';
	import SuccessTickInCircleIcon from '$lib/images/icons/SuccessTickInCircleIcon.svelte';
	let popupType = '';
	let title = '';
	let text = '';
	let buttonTitle = '';
	let titleClass = '';
	let textClass = '';
	let buttonClass = '';
	let isModalOpen = false;
	let closeModal: (() => void) | null = null;
	let handleButtonClick: () => void;
	export {
		popupType,
		title,
		text,
		buttonTitle,
		titleClass,
		textClass,
		buttonClass,
		isModalOpen,
		closeModal,
		handleButtonClick
	};
</script>

<Modal {isModalOpen} {closeModal}>
	<div
		class={`animate-bottomTransition flex flex-col items-center justify-between overflow-y-auto bg-white shadow-clg sm:w-120 sm:animate-none sm:rounded-lg ${$$props.class}`}
	>
		<slot name="popupHeader">
			{#if popupType?.toUpperCase() === STATUS_ARR?.SUCCESS}
				<SuccessTickInCircleIcon />
			{/if}
			{#if popupType?.toUpperCase() === STATUS_ARR?.FAILURE}
				<FailedIcon />
			{/if}
		</slot>

		<slot name="popupBody">
			<article class="mt-6 text-center">
				<div class={`text-2xl font-medium text-black-title ${titleClass}`}>
					{title}
				</div>

				<div class={`mt-3 text-sm font-normal text-grey-body ${textClass}`}>
					{text}
				</div>
			</article>
		</slot>

		<slot name="popupFooter">
			<Button variant="outlined" class={buttonClass} onClick={handleButtonClick}>
				{buttonTitle}
			</Button>
		</slot>
	</div>
</Modal>
