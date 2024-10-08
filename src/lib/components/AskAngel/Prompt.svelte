<script lang="ts">
	import type { ChatItem, PromptSchemeDetails } from '$lib/types/IAskAngel';
	import { createEventDispatcher } from 'svelte';
	import Choices from './Choices.svelte';
	import Message from './Message.svelte';
	import TrendingCarouselItems from '$components/MostBought/TrendingCarouselItems.svelte';
	import { addCommasToAmountString } from 'svelte-components';

	export let chatItem: ChatItem;

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
				<div class="mb-1 text-[10px] font-normal text-body">Angel</div>
			{/if}
			<Message
				owner={chatItem?.owner}
				type={chatItem?.type}
				class={text?.type === 'emoji' ? 'max-w-fit' : ''}
			>
				<svelte:fragment slot="messageData">
					{#if text?.type === 'emoji'}
						<div class="px-1 text-2xl">👋</div>
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
						clazz="p-3 bg-background-alt rounded-lg border w-[90%]"
						footerClass="bg-tint24-primary"
						topSectionClass="mb-3"
						detailsClass="divide-x p-2"
						schemes={scheme}
						index={0}
						disableRedirection
					>
						<svelte:fragment slot="topRightSection">
							<span />
						</svelte:fragment>

						<svelte:fragment slot="detailsFooterDescription">
							<p class="text-xs text-body">
								<span class=" font-medium">
									{addCommasToAmountString(scheme?.noOfClientInvested)}
								</span>
								people have invested in this fund
							</p>
						</svelte:fragment>
					</TrendingCarouselItems>
				</article>
			{/each}
		</section>
	{/if}
</section>
