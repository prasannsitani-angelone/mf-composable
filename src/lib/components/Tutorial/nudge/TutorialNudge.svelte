<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import NudgeIcon from '$components/Tutorial/nudge/NudgeIcon.svelte';
	import { base } from '$app/paths';
	import { modifiedGoto } from '$lib/utils/goto';
	import { sipBookMutualfundsSIPsexplainedEvent } from '$lib/analytics/sipbook/sipbook';

	export let title = 'Mutual Funds: Explained';
	export let subTitle = 'Everything you need to know about mutual funds to start investing';
	export let isSipBookPage = false;

	const toGoToTutorialDetails = async () => {
		if (isSipBookPage) {
			sipBookMutualfundsSIPsexplainedEvent();
		}
		await modifiedGoto(`${base}/tutorials`);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="relative cursor-pointer overflow-hidden rounded-lg bg-background-alt shadow-csm {$$props.class}"
	on:click={toGoToTutorialDetails}
>
	<div class="my-3 flex flex-1 flex-row items-center gap-3 px-3">
		<NudgeIcon />
		<div class="flex-1">
			<p class="text-base font-semibold text-body">{title}</p>
			<p class="text-sm font-normal text-body">{subTitle}</p>
		</div>
		<WMSIcon name="arrow-collapse" width={20} height={20} class="rotate-90" />
	</div>
</div>
