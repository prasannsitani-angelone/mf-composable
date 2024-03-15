<script lang="ts">
	import SipHealthScoreComponent from '$components/SipHealth/Nudge/SipHealthScoreComponent.svelte';
	import { createEventDispatcher } from 'svelte';
	import { getSipHealth } from '../api';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import SipHealthLoader from '$components/SipHealth/Nudge/SipHealthLoader.svelte';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { SIP_HEALTH_SCORE_LIMIT_AVERAGE } from '$components/SipHealth/constants';
	import { BtnSize } from 'svelte-components';

	const dispatch = createEventDispatcher();

	export let cardStyle = '';

	const onViewReportClicked = async () => {
		await goto(`${base}/siphealth`);
		dispatch('viewReport');
	};

	const getLabelAndEventDispatch = (score: number) => {
		dispatch('sipHealthNudgeMounted', score);
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
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		{#if result?.score !== undefined}
			<div
				on:click={onViewReportClicked}
				class="flex cursor-pointer flex-row items-center overflow-hidden rounded-lg bg-background-alt shadow-csm {cardStyle} px-3.5 py-3 md:px-5"
			>
				<div class="flex flex-1 flex-col">
					<p class="text-base font-medium text-title">Your SIP Health</p>
					<p class="mb-3 text-xs font-normal text-title">
						{getLabelAndEventDispatch(result?.score)}
					</p>
					<ButtonMedium
						size={BtnSize.XS}
						class="w-fit p-0 text-xs font-medium"
						variant="transparent"
					>
						VIEW REPORT
					</ButtonMedium>
				</div>

				<SipHealthScoreComponent score={result?.score} class="drop-shadow-xl" />
			</div>
		{:else}
			<slot name="error">
				<span class="hidden">{getLabelAndEventDispatch(0)}</span>
			</slot>
		{/if}
	{:catch _}
		<slot name="error">
			<span class="hidden">{getLabelAndEventDispatch(0)}</span>
		</slot>
	{/await}
</div>
