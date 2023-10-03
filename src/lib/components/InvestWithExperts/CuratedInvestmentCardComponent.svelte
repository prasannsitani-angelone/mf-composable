<script lang="ts">
	import type { Start4SipsNudgeType } from '$lib/types/INudge';
	import CuratedInvestmentCardBackground from '../../images/CuratedInvestmentCardBackground.svelte';
	import { Button } from 'svelte-components';
	import { onMount } from 'svelte';
	import {
		curatedCardClickEvent,
		curatedCardImpressionEvent
	} from '$components/InvestWithExperts/analytics';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

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
		goto(`${base}/investwithexperts`);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="relative overflow-hidden rounded-lg {$$props.class}" on:click={handleCardClick}>
	<CuratedInvestmentCardBackground class="absolute h-full w-full" />
	<div class="relative px-4 py-3 pb-6">
		<p class="mb-3 text-base font-semibold text-white">{nudgeData.heading}</p>
		<p class="mb-2 max-w-[67%] text-sm font-normal text-white">
			{nudgeData.description}
		</p>
		<p class="mb-3 text-2xs font-semibold text-white">
			Returns &nbsp;&nbsp;<span class="text-xs"
				>{nudgeData.data.returnPercentage.toFixed(2)}% p.a</span
			>
		</p>

		<Button
			text={{
				label: nudgeData.linkHeading,
				customClass: 'text-xs font-semibold uppercase text-blue-primary'
			}}
			variant="contained"
			size="btn-sm"
			color="white"
		/>
	</div>
</div>
