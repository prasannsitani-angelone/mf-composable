<script lang="ts">
	import SipHealthScoreComponent from '$components/SipHealth/Nudge/SipHealthScoreComponent.svelte';
	import { createEventDispatcher } from 'svelte';
	import { getSipHealth } from '../api';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import SipHealthLoader from '$components/SipHealth/Nudge/SipHealthLoader.svelte';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { SIP_HEALTH_SCORE_LIMIT_AVERAGE } from '$components/SipHealth/constants';
	import SIPHealthCardBG from '$components/SipHealth/Images/SIPHealthCardBG.svelte';

	const dispatch = createEventDispatcher();

	export let cardStyle = '';

	const onViewReportClicked = async () => {
		await goto(`${base}/siphealth`);
		dispatch('viewReport');
	};

	const getLabel = (score: number) => {
		if (score < SIP_HEALTH_SCORE_LIMIT_AVERAGE) {
			return 'Learn how to improve your SIP health';
		}
		return 'Understand your SIP health report';
	};
</script>

<div class={$$props.class}>
	{#await getSipHealth()}
		<slot name="loading">
			<SipHealthLoader />
		</slot>
	{:then result}
		<div class="relative overflow-hidden rounded-lg shadow-csm">
			<div class="absolute h-full w-full">
				<SIPHealthCardBG class="absolute h-full w-full" />
			</div>

			<div class="flex flex-row items-center px-3 py-2 opacity-[.99] {cardStyle}">
				<div class="flex flex-1 flex-col">
					<p class="text-base font-medium text-black-title">Your SIP Health</p>
					<p class="text-xs font-normal text-black-title">{getLabel(result?.score)}</p>
					<ButtonMedium on:click={onViewReportClicked} class="w-fit p-0" variant="transparent">
						VIEW REPORT
					</ButtonMedium>
				</div>

				<SipHealthScoreComponent score={result?.score} class="drop-shadow-xl" />
			</div>
		</div>
	{:catch _}
		<slot name="error" />
	{/await}
</div>
