<script lang="ts">
	import { trackExternalInvestmentsClickAnalytics } from '../../analytics';
	import FirstTimeImportSVG from '$lib/images/FirstTimeImport.svg';
	import { Button } from 'svelte-components';
	export let onConfirmation = () => '';

	const onConfirmationClick = () => {
		onConfirmation();
		trackExternalInvestmentsClickAnalytics();
	};
</script>

<section class="rounded-lg bg-background-alt px-4 py-5 sm:py-14">
	<div class="m-auto max-w-[350px] text-center">
		<div class="mb-2 text-xl font-normal text-title sm:mb-3">Already Invested Somewhere?</div>
		<div class="mb-10 text-base font-normal leading-5 text-body">
			View your entire mutual fund portfolio in one place, including investments on other platforms
		</div>
		<img
			class="ml-[5%]"
			src={FirstTimeImportSVG}
			loading="lazy"
			alt="Illustration shoeing first time import"
		/>
		<Button class="mt-8 w-full px-2 text-sm !uppercase" onClick={onConfirmationClick}
			>Track All Investments</Button
		>

		<div class="mt-2 text-xs text-title">
			This will not affect your external investments in any way
		</div>
	</div>
</section>
