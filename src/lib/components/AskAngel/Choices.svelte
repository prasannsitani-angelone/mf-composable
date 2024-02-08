<script lang="ts">
	import type { ChoiceItem } from '$lib/types/IAskAngel';
	import { createEventDispatcher } from 'svelte';

	export let owner: 'angel' | 'user';
	export let question: string;
	export let choiceList: ChoiceItem[];

	const dispatch = createEventDispatcher();

	const handleChoiceClick = (choice: ChoiceItem) => {
		dispatch('choiceSelect', choice);
	};
</script>

<section
	class="mt-1 w-[84%] rounded-lg rounded-br-none p-2 text-sm font-normal
    {owner === 'user'
		? 'float-right rounded-br-none bg-primary text-background-alt'
		: 'rounded-bl-none bg-tint12-primary text-title'}
    {$$props?.class}"
>
	{question}
</section>

<slot name="choices">
	{#if choiceList?.length}
		<section class="w-[84%] rounded-br-lg border bg-background-alt">
			{#each choiceList as choice, index (index)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<article
					class="cursor-pointer px-2 py-4
						{index === 0 ? 'pt-2.5' : 'border-t'}
						{index === choiceList?.length - 1 ? 'pb-2.5' : ''}"
					on:click={() => handleChoiceClick(choice)}
				>
					{#if choice?.label?.length}
						<div class="flex items-start justify-between text-sm font-normal text-title">
							<div>
								{choice?.label}
							</div>
							{#if choice?.mostChosen}
								<div
									class="ml-1 min-w-[60px] rounded-[100px] bg-background px-2 text-center text-[10px] text-body"
								>
									Top Pick
								</div>
							{/if}
						</div>
					{/if}

					{#if choice?.description?.length}
						<div class="mt-1 text-xs font-normal text-body">
							{choice?.description}
						</div>
					{/if}
				</article>
			{/each}
		</section>
	{/if}
</slot>
