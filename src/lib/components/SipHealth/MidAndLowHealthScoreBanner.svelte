<script lang="ts">
	import TargetDart from '$lib/images/TargetDart.svelte';
	import PeoplesIcon from '$lib/images/icons/PeoplesIcon.svelte';
	import { addCommasToAmountString } from 'svelte-components';

	export let betterThanOthers: number;
	export let scorePercentile: number;
	export let title: string;

	$: calculatedScorePercentage = scorePercentile > 1 ? `${scorePercentile?.toFixed(0)}%` : '1%';
</script>

<article
	class="bgGradient relative overflow-hidden rounded-lg p-4 text-black-bolder md:pl-6 md:pr-9"
>
	<div
		class="-z-1 absolute -top-36 left-32 h-[25rem] w-11 rotate-[-30deg] rounded-lg bg-gradient-to-b from-[#646566] to-[#393A3D00] opacity-50 bg-blend-screen mix-blend-screen md:-top-44 md:left-1/3 md:w-20 md:rotate-[-60deg]"
	/>
	<section class="flex items-start justify-between">
		<div class="w-[70%]">
			<div class="text-2xl font-medium">{title}</div>
			<div class="mt-2">
				You are in the <span class="font-medium text-red-errorDark"
					>bottom {calculatedScorePercentage}</span
				> of investors on Angel One
			</div>
			<section class="mt-6 hidden items-center md:flex">
				<PeoplesIcon fill={'#2A394E'} />
				<div class="ml-1 text-xs">
					<span class="font-medium">{addCommasToAmountString(betterThanOthers)}</span> investors are
					doing better than you
				</div>
			</section>
		</div>
		<div class="object-covers -mb-10 -ml-10 -mr-4 -mt-4">
			<TargetDart class="right-0" />
		</div>
	</section>

	<section class="mt-4 flex items-center md:hidden">
		<PeoplesIcon fill={'#2A394E'} />
		<div class="ml-1 text-xs">
			<span class="font-medium">{addCommasToAmountString(betterThanOthers)}</span> investors are doing
			better than you
		</div>
	</section>
</article>

<style>
	.bgGradient {
		background: linear-gradient(180deg, #f9bf4d 29.8%, #fff 128.29%);
	}
</style>
