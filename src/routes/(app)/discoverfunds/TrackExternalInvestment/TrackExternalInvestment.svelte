<script lang="ts">
	import { BtnVariant, Button, WMSIcon } from 'svelte-components';
	import RightChevron from '../../sipCalculator/icons/RightChevron.svelte';
	import Link from '$components/Link.svelte';
	import type { EcasImportNudgeType } from '$lib/types/INudge.js';
	import { onMount } from 'svelte';
	import {
		externalFundsNudgeClickAnalytics,
		externalFundsNudgeImpressionAnalytics
	} from './analytics';

	export let nudge: EcasImportNudgeType;

	onMount(() => {
		externalFundsNudgeImpressionAnalytics();
	});
</script>

<div
	class="flex w-full flex-col items-center rounded-lg bg-background-alt p-4 shadow-csm {$$props.class}"
>
	<WMSIcon name="external-funds-download" class="mb-2" />

	<div class="mb-2 text-sm font-medium capitalize leading-none text-title">{nudge?.heading}</div>

	<div class="max-w-[212px] text-center text-xs font-normal text-body sm:mb-3">
		{nudge?.description}
	</div>

	<Link to={nudge.link} on:linkClicked={externalFundsNudgeClickAnalytics}>
		<Button endAdornment={RightChevron} variant={BtnVariant.Transparent}>
			{nudge?.linkHeading}
		</Button>
	</Link>
</div>
