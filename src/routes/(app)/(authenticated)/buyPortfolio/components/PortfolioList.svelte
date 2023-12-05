<script lang="ts">
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
	import { WMSIcon } from 'svelte-components';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import BasicDetails from './BasicDetails.svelte';

	export let portfolioData: PortfolioPack[];
	let showChevron = true;

	function gotoPortfolioPackDetails(packId: string) {
		goto(`${base}/buyPortfolio/${packId}`);
	}
</script>

<section>
	{#each portfolioData as portfolioPack}
		<section class="mx-2 mt-2 justify-center rounded-lg bg-white p-4 text-black-key shadow-csm">
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="flex w-full items-center"
				on:click={() => {
					gotoPortfolioPackDetails(portfolioPack.packId);
				}}
			>
				<BasicDetails {showChevron} {portfolioPack} />
			</div>
			<div class="mt-3 flex flex-col text-black-bolder">
				<div class="text-xs font-medium">Key Benefits:</div>
				<div class="text-[11px]">
					{#each portfolioPack.benefits as benefit}
						<div class="flex pt-3">
							<div>
								<WMSIcon name="star-bullet-point" height={14} width={14} />
							</div>
							<span class="pl-2">{benefit.description}</span>
						</div>
					{/each}
				</div>
			</div>
			{#if portfolioPack.totalUsersInvested > 1000}
				<div class="mt-3 flex rounded-sm bg-[#E0F2EE] px-3 py-2 text-black-bolder">
					<div class="flex items-center text-xs">
						<WMSIcon name="people-icon" height={12} width={14} /><span class="pl-2 font-medium"
							>{portfolioPack.totalUsersInvested}</span
						> people have invested in this fund
					</div>
				</div>
			{/if}
		</section>
	{/each}
</section>
