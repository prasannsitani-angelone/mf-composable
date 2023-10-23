<script lang="ts">
	import { BtnSize, BtnVariant, Button } from 'svelte-components';
	import SipHealthScoreComponent from '$components/SipHealth/Nudge/SipHealthScoreComponent.svelte';
	import { createEventDispatcher } from 'svelte';
	import { getSipHealth } from '../api';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import SipHealthLoader from '$components/SipHealth/Nudge/SipHealthLoader.svelte';

	const dispatch = createEventDispatcher();

	const onViewReportClicked = async () => {
		await goto(`${base}/siphealth`);
		dispatch('viewReport');
	};
</script>

<div class={$$props.class}>
	{#await getSipHealth()}
		<slot name="loading">
			<SipHealthLoader />
		</slot>
	{:then result}
		<div class="flex flex-row items-center rounded-lg bg-white px-3 py-2 shadow-csm">
			<div class="flex flex-1 flex-col">
				<p class="text-base font-medium text-black-title">Your SIP Health</p>
				<p class="mb-2 text-xs font-normal text-black-title">Understand your SIP health report</p>
				<Button
					on:click={onViewReportClicked}
					class="w-fit p-0"
					variant={BtnVariant.Transparent}
					size={BtnSize.SM}
				>
					view report
				</Button>
			</div>

			<SipHealthScoreComponent score={result?.score} class="drop-shadow-xl" />
		</div>
	{:catch _}
		<slot name="error" />
	{/await}
</div>
