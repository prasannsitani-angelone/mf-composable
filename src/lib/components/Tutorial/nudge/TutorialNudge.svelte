<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import NudgeIcon from '$components/Tutorial/nudge/NudgeIcon.svelte';
	import { base } from '$app/paths';
	import { modifiedGoto } from '$lib/utils/goto';

	export let title = 'Mutual Funds: Explained';
	export let subTitle = 'Everything you need to know about mutual funds to start investing';

	const toGoToTutorialDetails = async () => {
		await modifiedGoto(`${base}/tutorials`);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-csm {$$props.class}"
	on:click={toGoToTutorialDetails}
>
	<div class="my-3 flex flex-1 flex-row items-center gap-3 px-3">
		<NudgeIcon />
		<div class="flex-1">
			<p class="text-base font-semibold text-black-bolder">{title}</p>
			<p class="text-sm font-normal text-black-bolder">{subTitle}</p>
		</div>
		<WMSIcon name="arrow-collapse" width={20} height={20} class="rotate-90" />
	</div>
</div>
