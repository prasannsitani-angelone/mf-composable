<script lang="ts">
	import HelloEmojiIcon from '$lib/images/icons/HelloEmojiIcon.svelte';
	import type { ChatItem, PromptSchemeDetails } from '$lib/types/IAskAngel';
	import { createEventDispatcher } from 'svelte';
	import Choices from './Choices.svelte';
	import Message from './Message.svelte';
	import TrendingCarouselItems from '$components/TrendingFunds/TrendingCarouselItems.svelte';
	import { addCommasToAmountString } from 'svelte-components';
	import CuratedInvestmentCardComponent from '$components/InvestWithExperts/CuratedInvestmentCardComponent.svelte';

	export let chatItem: ChatItem;
	export let isMobileOrTablet: boolean;

	const dispatch = createEventDispatcher();

	const handleChoiceClick = (e: CustomEvent) => {
		dispatch('promptChoiceSelect', e?.detail);
	};

	const handleSchemeCardClick = (scheme: PromptSchemeDetails) => {
		dispatch('schemeCardClick', scheme);
	};
</script>

<section class="{$$props?.class} flex flex-col {chatItem?.owner === 'user' ? 'items-end' : ''}">
	{#if chatItem?.type === 'message' || chatItem?.texts?.length}
		<!-- Show Message(s) -->
		{#each chatItem?.texts || [] as text, index (index)}
			{#if text?.type === 'emoji'}
				<div class="mb-1 text-[10px] font-medium text-black-bolder">Angel</div>
			{/if}
			<Message
				owner={chatItem?.owner}
				type={chatItem?.type}
				class={text?.type === 'emoji' ? 'max-w-fit' : ''}
			>
				<svelte:fragment slot="messageData">
					{#if text?.type === 'emoji'}
						<HelloEmojiIcon />
					{:else}
						{text?.displayText}
					{/if}
				</svelte:fragment>
			</Message>
		{/each}
	{/if}

	{#if chatItem?.type === 'choices' && chatItem?.data?.choices?.length}
		<!-- Display Choices -->
		<Choices
			owner={chatItem?.owner}
			question={chatItem?.question || ''}
			choiceList={chatItem?.data?.choices}
			on:choiceSelect={handleChoiceClick}
		/>
	{:else if chatItem?.type === 'schemes' && chatItem?.data?.schemes?.length}
		<section>
			<!-- Schemes List -->
			{#each chatItem?.data?.schemes || [] as scheme, index (index)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<article class="mt-2" on:click={() => handleSchemeCardClick(scheme)}>
					<TrendingCarouselItems
						clazz="p-3 bg-white rounded-lg border w-[90%]"
						schemes={scheme}
						index={0}
						disableRedirection
					>
						<svelte:fragment slot="topRightSection">
							<span />
						</svelte:fragment>

						<svelte:fragment slot="detailsFooterDescription">
							<p class="text-xs">
								<span class=" font-semibold">
									{addCommasToAmountString(scheme?.noOfClientInvested)}
								</span>
								people have invested in this fund
							</p>
						</svelte:fragment>
					</TrendingCarouselItems>
				</article>
			{/each}
		</section>
	{:else if chatItem?.type === 'nudges' && chatItem?.data?.nudges?.length}
		<section>
			<!-- Nudges List -->
			{#each chatItem?.data?.nudges || [] as nudge, index (index)}
				<article class="mt-5">
					{#if nudge}
						<CuratedInvestmentCardComponent nudgeData={nudge} stopRedirection={!isMobileOrTablet} />
					{/if}
				</article>
			{/each}
		</section>
	{/if}
</section>
