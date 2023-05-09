<script lang="ts">
	import Button from '$components/Button.svelte';
	import FirstTimeImportSVG from '$lib/images/FirstTimeImport.svg';
	export let onConfirmation = () => '';
</script>

<section class="rounded-lg bg-white px-4 py-5 sm:py-14">
	<div class="m-auto max-w-[350px] text-center">
		<div class="mb-3 text-xl font-medium text-black-title">Already Invested Somewhere?</div>

		<div class="mb-10 text-base font-normal leading-5 text-grey-body">
			View all your investments in one place by tracking external investments with Angel One
		</div>
		<img
			class="ml-[5%]"
			src={FirstTimeImportSVG}
			loading="lazy"
			alt="Illustration shoeing first time import"
		/>
		<Button class="mt-8 w-full px-2 text-sm !font-light" onClick={onConfirmation}
			>TRACK EXTERNAL INVESTMENTS</Button
		>

		<div class="mt-2 text-xs text-black">
			This will not affect your external investments in any way
		</div>
	</div>
</section>
