<script lang="ts">
	import ErrorFetchingData from '$lib/images/ErrorFetchingData.svg';
	import Button from '$components/Button.svelte';
	export let onConfirmation = () => '';
</script>

<section class="rounded-lg bg-white px-4 py-6 text-center max-sm:shadow-csm sm:py-7">
	<div class="m-auto max-w-[500px] text-center">
		<img
			src={ErrorFetchingData}
			class="inline-block"
			loading="lazy"
			alt="Illustration shoeing first time import"
		/>
		<div class="mt-5 mb-3 text-base font-medium text-black-title sm:mt-8">
			Error Fetching Investments
		</div>
		<div class="mb-6 text-sm text-grey-body">
			We could not fetch your investment information due to a technical error. Please try again
		</div>
		<Button variant="outlined" class="w-40" onClick={onConfirmation}>TRY AGAIN</Button>
	</div>
</section>
