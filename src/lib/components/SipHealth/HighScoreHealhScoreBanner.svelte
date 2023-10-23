<script lang="ts">
	import Trophy from '$lib/images/Trophy.svelte';
	import PeoplesIcon from '$lib/images/icons/PeoplesIcon.svelte';
	import { addCommasToAmountString } from 'svelte-components';

	export let betterThanOthers: number;
	export let scorePercentile: number;

	$: calculatedScorePercentage =
		scorePercentile < 100 ? `${(100 - Math?.floor(scorePercentile))?.toFixed(0)}%` : '1%';
</script>

<article class="bgGradient relative overflow-hidden rounded-lg p-4 text-white md:pl-6 md:pr-9">
	<div
		class="-z-1 absolute -top-36 left-32 h-[25rem] w-11 rotate-[-30deg] rounded-lg bg-gradient-to-b from-[#646566] to-[#393A3D00] opacity-50 bg-blend-screen mix-blend-screen md:-top-44 md:left-1/3 md:w-20 md:rotate-[-60deg]"
	/>
	<section class="flex items-start justify-between">
		<div class="w-[70%]">
			<div class="text-2xl font-medium">Congratulations!</div>
			<div class="mt-2">
				You are in the <span class="font-medium">top {calculatedScorePercentage}</span> of investors
				on Angel One
			</div>
			<section class="mt-6 hidden items-center md:flex">
				<PeoplesIcon />
				<div class="ml-1 text-xs">
					You are doing better than <span class="font-medium"
						>{addCommasToAmountString(betterThanOthers)}</span
					> investors
				</div>
			</section>
		</div>
		<div>
			<Trophy />
		</div>
	</section>

	<section class="mt-2 flex items-center md:hidden">
		<PeoplesIcon />
		<div class="ml-1 text-xs">
			You are doing better than <span class="font-medium"
				>{addCommasToAmountString(betterThanOthers)}</span
			> investors
		</div>
	</section>
</article>

<style>
	.bgGradient {
		background: linear-gradient(180deg, #16907a 17.91%, rgba(120, 240, 218, 0.47) 162.07%);
	}
</style>
