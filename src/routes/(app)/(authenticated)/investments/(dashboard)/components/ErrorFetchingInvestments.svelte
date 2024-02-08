<script lang="ts">
	import ErrorFetchingData from '$lib/images/ErrorFetchingData.svg';
	import Button from '$components/Button.svelte';
	export let onConfirmation = () => '';
	import { tefTryAgainClickAnlytics } from '../../analytics';

	const onConfirmationClick = () => {
		onConfirmation();
		tefTryAgainClickAnlytics({ message: 'Import Funds Failed' });
	};
</script>

<section class="rounded-lg bg-background-alt px-4 py-6 text-center max-sm:shadow-csm sm:py-7">
	<div class="m-auto max-w-[500px] text-center">
		<img
			src={ErrorFetchingData}
			class="inline-block"
			loading="lazy"
			alt="Illustration shoeing first time import"
		/>
		<div class="mb-3 mt-5 text-base font-normal text-title sm:mt-8">Error Fetching Investments</div>
		<div class="mb-6 text-sm text-body">
			We could not fetch your investment information due to a technical error. Please try again
		</div>
		<Button variant="outlined" class="w-40" onClick={onConfirmationClick}>TRY AGAIN</Button>
	</div>
</section>
