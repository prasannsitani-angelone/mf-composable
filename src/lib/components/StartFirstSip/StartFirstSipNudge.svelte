<script lang="ts">
	import { base } from '$app/paths';
	import { WMSIcon } from 'svelte-components';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import {
		firstSipCardGetStartedButtonClickAnalytics,
		firstSipCardMountedAnalytics
	} from '$lib/analytics/startFirstSip/startFirstSip';
	import { BtnSize } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { modifiedGoto } from '$lib/utils/goto';
	import StartFirstSipBg from './StartFirstSipBg.svelte';

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
	class="slide-down relative mt-2 flex {$$props.class}"
	data-testid="startFirstSipNudge"
	in:slide={{ duration: 300 }}
>
	<div class="z-2 absolute h-full w-full rounded-lg bg-yellow-background shadow-csm">
		<StartFirstSipBg class="absolute h-full w-full" />
	</div>
	<div class="z-0 flex w-full flex-row items-center justify-between p-3">
		<div class="mr-2 flex flex-1 items-center">
			<div class="mr-1 flex h-9 w-9 items-center justify-center rounded-full bg-background-alt p-2">
				<WMSIcon name="angel" />
			</div>
			<p class="pl-1 text-sm text-title">Start your first SIP with Angel One today!</p>
		</div>

		<ButtonMedium
			size={BtnSize.XS}
			onClick={redirectToStartFirstSipLandingPage}
			class="z-0 w-fit px-2 text-xs"
		>
			INVEST NOW
		</ButtonMedium>
	</div>
</article>

<style>
	.slide-down {
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transform: translateY(0%);
	}
</style>
