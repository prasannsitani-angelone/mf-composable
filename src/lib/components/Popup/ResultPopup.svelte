<script lang="ts">
	import Button from '$components/Button.svelte';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import FailedIcon from '$lib/images/icons/FailedIcon.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import SuccessTickInCircleIcon from '$lib/images/icons/SuccessTickInCircleIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	let popupType = '';
	let title = '';
	let text = '';
	let buttonTitle = '';
	let secondaryButtonTitle = '';
	let titleClass = '';
	let textClass = '';
	let buttonClass = '';
	let secondaryButtonClass = '';
	let isModalOpen = false;
	let buttonVariant: 'outlined' | 'contained' | 'transparent' = 'outlined';
	let secondaryButtonVariant: 'outlined' | 'contained' | 'transparent' = 'outlined';
	let closeModal: (() => void) | null = null;
	let handleButtonClick: () => void;
	let preventBackDropClick = false;
	export {
		popupType,
		title,
		text,
		buttonTitle,
		secondaryButtonTitle,
		titleClass,
		textClass,
		buttonClass,
		secondaryButtonClass,
		isModalOpen,
		closeModal,
		handleButtonClick,
		buttonVariant,
		secondaryButtonVariant,
		preventBackDropClick
	};

	const dispatch = createEventDispatcher();

	const handleSecondaryButtonClick = () => {
		dispatch('secondaryButtonClick');
	};
</script>

<ModalWithAnimation {isModalOpen} {closeModal} {preventBackDropClick}>
	<div
		class={`flex flex-col items-center justify-between overflow-y-auto bg-white shadow-clg sm:w-120 sm:rounded-lg ${$$props.class}`}
	>
		<slot name="popupHeader">
			{#if popupType?.toUpperCase() === STATUS_ARR?.SUCCESS}
				<SuccessTickInCircleIcon />
			{/if}
			{#if popupType?.toUpperCase() === STATUS_ARR?.FAILURE}
				<FailedIcon />
			{/if}
			{#if popupType?.toUpperCase() === STATUS_ARR?.PENDING}
				<WMSIcon name="clock-yellow" width={92} height={92} />
			{/if}
		</slot>

		<slot name="popupBody">
			<article class="mt-6 text-center">
				<div class={`text-2xl font-normal text-black-title ${titleClass}`}>
					{title}
				</div>

				<div class={`mt-3 text-sm font-normal text-grey-body ${textClass}`}>
					{text}
				</div>
				<slot name="middleSection" />
			</article>
		</slot>

		<slot name="popupFooter">
			<Button variant={buttonVariant} class={buttonClass} onClick={handleButtonClick}>
				{buttonTitle}
			</Button>

			{#if secondaryButtonTitle?.length}
				<Button
					variant={secondaryButtonVariant}
					class={secondaryButtonClass}
					onClick={handleSecondaryButtonClick}
				>
					{secondaryButtonTitle}
				</Button>
			{/if}
		</slot>
	</div>
</ModalWithAnimation>
