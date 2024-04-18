<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { WMSIcon } from 'svelte-components';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';

	export let portfolio: PortfolioPack;

	const dispatch = createEventDispatcher();

	const handleCardClick = () => {
		dispatch('onCardClick');
	};
</script>

<div
	class={`mr-3 flex cursor-pointer flex-col rounded-lg border`}
	on:click={handleCardClick}
	on:keypress={handleCardClick}
	role="button"
	tabindex="0"
>
	<div class="flex flex-row items-center p-3 pr-1">
		<slot name="topLeftSection">
			<div
				class="line-clamp-2 w-1/2 flex-0.7 self-center whitespace-normal text-base text-sm font-normal text-title md:text-sm"
			>
				<h2 class="font-medium">{portfolio?.packName}</h2>
				<div class="mt-1">
					{#each portfolio?.tags || [] as tag, index}
						<span
							class="rounded-md bg-tint12-secondary-alt p-1 text-[10px] text-secondary-alt {index >
							0
								? 'ml-1'
								: ''}">{tag}</span
						>
					{/each}
				</div>
			</div>
		</slot>
		<div class="relative h-full w-1/2 flex-0.3">
			{#each portfolio?.schemes as scheme, index}
				<SchemeLogo
					size="xs2"
					class={`absolute top-[-22px] flex`}
					style={`z-index: ${portfolio?.schemes.length - index}; left: ${index * 23}px`}
					src={scheme.logoUrl}
				/>
			{/each}
		</div>
	</div>
	<div class="flex flex-col border-t">
		<slot name="details">
			<div
				class="relative mb-2 mt-2 w-full overflow-hidden px-1 {portfolio?.totalUsersInvested
					? ''
					: 'rounded-b'}"
			>
				<div class="grid grid-cols-2 flex-row justify-between rounded-t-lg px-2 opacity-[.99]">
					<slot name="detailsLeft">
						<div class="flex flex-col items-start">
							<p class="mb-1 text-xs font-normal text-body">Min. SIP Amount</p>
							<p class="text-sm font-medium text-title">
								₹{addCommasToAmountString(portfolio?.minSipAmount?.toString()) ||
									portfolio?.minSipAmount}
							</p>
						</div>
					</slot>
					<slot name="detailsRight">
						<div class="flex flex-col items-end">
							<p class="mb-1 text-xs font-normal text-body">3Y Returns</p>
							<div class="flex flex-row items-center">
								<p class="text-xs font-normal text-title">
									<span
										class="text-sm font-medium {portfolio?.threeYrReturnAvgPer > 0
											? 'text-buy'
											: 'text-title'}">{portfolio?.threeYrReturnAvgPer?.toFixed(2)}% p.a</span
									>
								</p>
							</div>
						</div>
					</slot>
				</div>
			</div>
		</slot>
		<slot name="detailsFooter">
			{#if portfolio?.totalUsersInvested}
				<div class="flex flex-row items-center rounded-b px-3 pb-2">
					<slot name="detailsFooterIcon">
						<WMSIcon
							fill="var(--BODY)"
							name="people-icon"
							class="mr-2 p-1 pl-0"
							decoding="async"
							alt="Number of people invested"
							width={24}
							height={24}
						/>
					</slot>

					<slot name="detailsFooterDescription">
						<p class="text-xs text-body">
							<span class=" font-medium">
								{addCommasToAmountString(portfolio?.totalUsersInvested)}
							</span>
							people invested in this portfolio
						</p>
					</slot>
				</div>
			{/if}
		</slot>
	</div>
</div>
