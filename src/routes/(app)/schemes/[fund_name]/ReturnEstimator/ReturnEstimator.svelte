<script lang="ts">
	import Button from '$components/Button.svelte';
	import ReturnEstimatorIcon from '$lib/images/icons/ReturnEstimatorIcon.svelte';

	$: currentCalculatorMode = 'SIP';

	const changeCalculatorMode = (mode: string) => {
		currentCalculatorMode = mode;
	};
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm">
	<header class="border border-b border-grey-line">
		<section
			class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
		>
			<section class="flex items-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
					<ReturnEstimatorIcon />
				</div>
				<div class="ml-4 flex flex-col">
					<h2 class="flex items-center text-left font-medium text-black-title">
						<span> Calculate Returns</span>
					</h2>
					<h3 class="text-left font-medium">
						<span class="text-sm text-grey-body">Based on past performance of this fund</span>
					</h3>
				</div>
			</section>
		</section>
	</header>
	<section class="origin-top">
		<div class="mt-6 px-4 pb-9 lg:px-20">
			<div class="flex h-10 gap-4">
				<Button
					class={`w-full  rounded !py-0 !text-sm !font-medium uppercase ${
						currentCalculatorMode === 'SIP'
							? '!bg-blue-primary !text-white'
							: 'border border-grey-line !bg-white !text-black-title'
					}`}
					onClick={() => changeCalculatorMode('SIP')}>SIP</Button
				>
				<Button
					class={`w-full  rounded !py-0 !text-sm !font-medium uppercase  ${
						currentCalculatorMode === 'OneTime'
							? '!bg-blue-primary !text-white'
							: 'border border-grey-line !bg-white !text-black-title'
					}`}
					onClick={() => changeCalculatorMode('OneTime')}>One-Time</Button
				>
			</div>
			<div class="mt-11">
				<div class="mb-5 flex justify-between">
					<span class="flex items-center justify-center text-xs font-normal text-black-title">
						Select Amount
					</span>
					<div
						class="flex border-b border-t-0 border-l-0 border-r-0 border-grey-disabled text-2xl font-medium text-black-title"
					>
						₹
						<div>5000</div>
					</div>
				</div>
			</div>
			<div class="mt-11">
				<div class="mb-5 flex justify-between">
					<span class="flex items-center justify-center text-xs font-normal text-black-title">
						Select Duration
					</span>
					<div
						class="border-b border-t-0 border-l-0 border-r-0 border-grey-disabled text-2xl font-medium text-black-title"
					>
						<div>24 Y</div>
					</div>
				</div>

				<div class="mt-4 flex justify-between text-xs text-grey-body">
					<span>1Y</span><span>30Y</span>
				</div>
			</div>
		</div>
	</section>
</article>

<style>
</style>
