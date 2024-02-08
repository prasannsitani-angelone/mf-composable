<script lang="ts">
	import type { Start4SipsNudgeType } from '$lib/types/INudge';
	import CuratedInvestmentCardBackground from '../../images/CuratedInvestmentCardBackground.svelte';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { onMount } from 'svelte';
	import {
		curatedCardClickEvent,
		curatedCardImpressionEvent
	} from '$components/InvestWithExperts/analytics';
	import { base } from '$app/paths';
	import { modifiedGoto } from '$lib/utils/goto';
	import { slide } from 'svelte/transition';

	export let nudgeData: Start4SipsNudgeType;
	export let stopRedirection = false;

	onMount(() => {
		curatedCardImpressionEvent();
	});

	const handleCardClick = () => {
		if (stopRedirection) {
			return;
		}

		curatedCardClickEvent();
		modifiedGoto(`${base}/investwithexperts`);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="slide-down relative overflow-hidden rounded-lg {$$props.class}"
	on:click={handleCardClick}
	in:slide={{ duration: 300 }}
>
	<CuratedInvestmentCardBackground class="absolute h-full w-full" />
	<div class="relative px-4 py-3 pb-6">
		<p class="mb-3 text-base font-medium text-background-alt">{nudgeData.heading}</p>
		<p class="mb-2 max-w-[67%] text-sm font-normal text-background-alt">
			{nudgeData.description}
		</p>
		<p class="mb-3 text-2xs font-medium text-background-alt">
			Returns &nbsp;&nbsp;<span class="text-xs"
				>{nudgeData.data.returnPercentage.toFixed(2)}% p.a</span
			>
		</p>

		<ButtonMedium
			text={{
				label: nudgeData.linkHeading,
				customClass: 'text-xs font-medium uppercase text-primary'
			}}
			variant="contained"
			size="btn-sm"
			color="white"
		/>
	</div>
</div>

<style>
	.slide-down {
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transform: translateY(0%);
	}
</style>
