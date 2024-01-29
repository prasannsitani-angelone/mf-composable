<script lang="ts">
	import { base } from '$app/paths';
	import { WMSIcon } from 'svelte-components';
	import { onMount } from 'svelte';
	import {
		firstSipCardGetStartedButtonClickAnalytics,
		firstSipCardMountedAnalytics
	} from '$lib/analytics/startFirstSip/startFirstSip';
	import { BtnSize } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { modifiedGoto } from '$lib/utils/goto';

	export let version: string;

	const redirectToStartFirstSipLandingPage = () => {
		firstSipCardGetStartedButtonClickAnalytics({ version });

		const redirectUrl = `${base}/startfirstsip`;
		modifiedGoto(redirectUrl);
	};

	onMount(() => {
		firstSipCardMountedAnalytics({ version });
	});
</script>

<article
	class="bg-image mt-2 flex flex-row items-center justify-between sm:-mx-2 {$$props.class}"
	data-testid="startFirstSipNudge"
>
	<div class="mr-2 flex flex-1 items-center p-4">
		<div class="mr-1 flex h-9 w-9 items-center justify-center rounded-full bg-white p-2">
			<WMSIcon name="angel" />
		</div>
		<p class="pl-1 text-sm text-black-key">Start your first SIP with Angel One today!</p>
	</div>

	<ButtonMedium
		size={BtnSize.SM}
		onClick={redirectToStartFirstSipLandingPage}
		class="z-0 mr-4 w-fit px-6 text-xs"
	>
		INVEST NOW
	</ButtonMedium>
</article>

<style>
	.bg-image {
		background-image: url('../../images/StartFirstSip.svg');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
</style>
