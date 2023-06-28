<script lang="ts">
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import MandateLimitTile from './MandateLimitTile.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	export let buttonTitle: string;
	export let onSubmit = (): void => undefined;
	export let mandateLimit: string;
</script>

<ResultPopup
	{buttonTitle}
	buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
	class="h-full px-4 pb-6 pt-12 sm:h-max sm:px-12 sm:py-20 md:rounded-lg"
	handleButtonClick={onSubmit}
	isModalOpen
	buttonVariant="contained"
>
	<svelte:fragment slot="popupBody">
		<div class="flex flex-col items-center">
			<div>
				<WMSIcon name="success-tick-sparkle" height={112} width={270} />
			</div>
			<div class="my-8 flex flex-col items-center">
				<div class="mt-4 mb-2 text-lg font-medium text-black-title">Autopay Setup Successfully</div>
				<div class="mb-5 text-center text-sm text-grey-body">
					Future SIP instalments will be paid automatically every month. Please note it takes up to
					7 days to activate your eMandate
				</div>
				<MandateLimitTile {mandateLimit} />
			</div>
		</div>
	</svelte:fragment>
</ResultPopup>
