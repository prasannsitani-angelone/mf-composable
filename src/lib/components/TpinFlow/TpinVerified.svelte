<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Button from '$components/Button.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';

	export let heading: string;
	export let subHeading: string;
	export let primaryButtonTitle: string;
	export let secondaryButtonTitle: string;

	const dispatch = createEventDispatcher();

	const onPrimaryButtonClick = () => {
		dispatch('primaryButtonClick');
	};

	const onSecondaryButtonClick = () => {
		dispatch('secondaryButtonClick');
	};

	onMount(() => {
		dispatch('tpinVerifiedOpen');
	});
</script>

<ResultPopup
	popupType="SUCCESS"
	title={heading}
	text={subHeading}
	class="w-full rounded-b-none rounded-t-2xl p-6 pb-9 pt-12 md:rounded-lg md:p-12 {$$props?.class}"
	isModalOpen
	handleButtonClick={onPrimaryButtonClick}
	closeModal={onSecondaryButtonClick}
>
	<svelte:fragment slot="popupFooter">
		<div class="mt-8 flex w-full flex-row justify-around bg-white md:mt-12">
			{#if secondaryButtonTitle?.length}
				<Button
					class="w-32 rounded border border-blue-primary !bg-white !text-blue-primary md:w-40"
					variant="outlined"
					onClick={onSecondaryButtonClick}
				>
					{secondaryButtonTitle}
				</Button>
			{/if}

			{#if primaryButtonTitle?.length}
				<Button class="w-32 rounded md:w-40" onClick={onPrimaryButtonClick}>
					{primaryButtonTitle}
				</Button>
			{/if}
		</div>
	</svelte:fragment>
</ResultPopup>
