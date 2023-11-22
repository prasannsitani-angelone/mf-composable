<script lang="ts">
	import { BtnSize, BtnVariant, WMSIcon } from 'svelte-components';
	import ClevertapNotificationViewed from '$components/clevertap/ClevertapNotificationViewed.svelte';
	import Clevertap from '$lib/utils/Clevertap.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { ClevertapEvent } from '$lib/types/IctTrackExternalInvestmentsStoreStore';
	import { CLEVERTAP_NUDGE_TOPICS } from '$components/clevertap/constants';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { canShowClevertapNudge, hideClevertapNudge } from '$components/clevertap/utils';

	const dispatch = createEventDispatcher();

	export let data: ClevertapEvent;

	const onCloseClicked = () => {
		hideClevertapNudge(data?.kv?.topic);
		showCTNudge = false;
		dispatch('onCloseClicked');
	};

	const onCTAClicked = () => {
		Clevertap.renderNotificationClicked(data);
		dispatch('onCTAClicked', { url: data?.kv?.ctaurl });
	};

	$: clevertapnudgetopic = CLEVERTAP_NUDGE_TOPICS[data?.kv?.topic] ?? null;
	$: icon = clevertapnudgetopic?.icon;

	let showCTNudge = false;
	onMount(() => {
		showCTNudge = canShowClevertapNudge(data?.kv?.topic);
	});
</script>

{#if showCTNudge}
	<aside
		class="flex w-full flex-col px-3 pt-3 {$$props.class}"
		style="background-color: {clevertapnudgetopic?.bgColor}"
	>
		<ClevertapNotificationViewed {data} />

		<div class="flex w-full flex-col">
			<div class="flex flex-row items-center">
				{#if icon}
					<div class="mr-2 {data?.kv?.title ? `self-start` : 'self-center'}">
						<svelte:component this={icon} />
					</div>
				{/if}

				<div class="flex flex-1 flex-col">
					{#if data?.kv?.title}
						<p class="mb-1 w-full text-sm font-medium text-black-title">{data?.kv?.title}</p>
					{/if}
					{#if data?.kv?.subtext}
						<p class="w-full text-xs font-normal text-black-bolder">{data?.kv?.subtext}</p>
					{/if}
				</div>

				{#if !clevertapnudgetopic?.secondaryCtas}
					{#if data?.kv?.ctatext}
						<ButtonMedium
							variant={BtnVariant.Transparent}
							size={BtnSize.XS}
							onClick={onCTAClicked}
							class="!text-sm !uppercase"
						>
							{data?.kv?.ctatext}
						</ButtonMedium>
					{/if}

					<WMSIcon name="cross" class="ml-2" width={24} height={24} on:click={onCloseClicked} />
				{/if}
			</div>

			{#if clevertapnudgetopic?.secondaryCtas}
				<div class="mb-1 flex flex-row items-center">
					<div class="flex-1" />

					{#if data?.kv?.secondarytext}
						<ButtonMedium
							variant={BtnVariant.Transparent}
							size={BtnSize.SM}
							onClick={onCloseClicked}
							class="!text-sm !uppercase !text-black-bolder"
						>
							{data?.kv?.secondarytext}
						</ButtonMedium>
					{/if}

					{#if data?.kv?.ctatext}
						<ButtonMedium
							variant={BtnVariant.Transparent}
							size={BtnSize.SM}
							onClick={onCTAClicked}
							class="text-sm !uppercase"
						>
							{data?.kv?.ctatext}
						</ButtonMedium>
					{/if}
				</div>
			{:else}
				<div class="h-3" />
			{/if}
		</div>
	</aside>
{/if}
