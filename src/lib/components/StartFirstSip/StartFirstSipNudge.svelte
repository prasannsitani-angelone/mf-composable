<script lang="ts">
	import type { StartFirstSipNudgeType } from '$lib/types/INudge';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import StartFirstSipImage from '$lib/images/StartFirstSipImage.svelte';
	import { onMount } from 'svelte';
	import {
		firstSipCardGetStartedButtonClickAnalytics,
		firstSipCardMountedAnalytics
	} from '$lib/analytics/startFirstSip/startFirstSip';
	import { BtnSize, Button } from 'svelte-components';

	export let nudgeData: StartFirstSipNudgeType;
	export let version: string;

	const redirectToStartFirstSipLandingPage = () => {
		firstSipCardGetStartedButtonClickAnalytics({ version });

		const redirectUrl = `${base}/startfirstsip`;
		goto(redirectUrl);
	};

	onMount(() => {
		firstSipCardMountedAnalytics({ version });
	});
</script>

<article
	class="mt-2 flex flex-row items-center rounded-lg bg-white p-4 pl-6 pr-3 shadow-csm {$$props.class}"
	data-testid="startFirstSipNudge"
>
	<div class="flex flex-1 flex-col">
		<p class="mb-2 text-base font-medium text-black-title">{nudgeData.heading}</p>
		<p class="mb-2 text-xs font-medium text-grey-body">{nudgeData.description}</p>

		<Button
			size={BtnSize.SM}
			onClick={redirectToStartFirstSipLandingPage}
			class="w-fit px-6 text-xs"
		>
			EXPLORE NOW
		</Button>
	</div>

	<StartFirstSipImage />
</article>
