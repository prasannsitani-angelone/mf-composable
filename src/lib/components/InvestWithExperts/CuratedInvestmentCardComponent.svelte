<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { Start4SipsNudgeType } from '$lib/types/INudge';
	import CuratedInvestmentCardBackground from '../../images/CuratedInvestmentCardBackground.svelte';
	import { Button } from 'svelte-components';

	export let nudgeData: Start4SipsNudgeType;

	async function openInvestWithExperts() {
		await goto(`${base}/investwithexperts`);
	}
</script>

<div class="relative overflow-hidden rounded-lg {$$props.class}">
	<CuratedInvestmentCardBackground class="absolute h-full w-full" />
	<div class="relative px-4 py-3 pb-6">
		<p class="mb-3 text-base font-semibold text-white">{nudgeData.heading}</p>
		<p class="mb-2 max-w-[60%] text-sm font-normal text-white">
			{nudgeData.description}
		</p>
		<p class="mb-3 text-xs font-semibold text-white">
			Returns <span class="text-xs">{nudgeData.data.returnPercentage.toFixed(2)}% p.a</span>
		</p>

		<Button
			text={{
				label: nudgeData.linkHeading,
				customClass: 'text-xs font-semibold uppercase text-blue-primary'
			}}
			onClick={openInvestWithExperts}
			variant="contained"
			size="btn-sm"
			color="white"
		/>
	</div>
</div>
