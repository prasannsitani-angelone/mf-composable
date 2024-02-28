<script lang="ts">
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
	import { WMSIcon } from 'svelte-components';
	import Modal from '$components/Modal.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import BasicDetails from './BasicDetails.svelte';
	import { portfolioClicked } from '$lib/analytics/buyPortfolio/buyPortfolio';
	import PortfolioInput from '../[portfolioId]/components/PortfolioInput.svelte';
	import { versionStore } from '$lib/stores/VersionStore';

	export let portfolioData: PortfolioPack[];
	export let showInputPopup = false;
	let showChevron = true;
	let activePortfolioPack: PortfolioPack;

	// default values for amount and date used in Portfolio Input popup
	let amount = 500;
	let date = 4;
	let requestId = '';

	function gotoPortfolioPackDetails(packId: string) {
		goto(`${base}/buyPortfolio/${packId}`);
		const portfolio = portfolioData?.filter((x) => {
			return x.packId === packId;
		})[0];
		const eventMetaData = {
			Portfolio: portfolio?.packName,
			MinSipAmount: portfolio?.minSipAmount,
			'3yReturn': portfolio?.threeYrReturnAvgPer,
			peopleinvetsed: portfolio?.totalUsersInvested
		};
		portfolioClicked(eventMetaData);
	}

	const toggleInput = (portfolioPack: PortfolioPack) => {
		showInputPopup = !showInputPopup;
		activePortfolioPack = portfolioPack;
		if (showInputPopup) {
			const eventMetaData = {
				Portfolio: portfolioPack?.packName,
				MinSipAmount: portfolioPack?.minSipAmount,
				'3yReturn': portfolioPack?.threeYrReturnAvgPer,
				peopleinvetsed: portfolioPack?.totalUsersInvested
			};
			portfolioClicked(eventMetaData);
		}
	};
</script>

<section>
	{#each portfolioData as portfolioPack}
		<section
			class="mx-2 mt-2 justify-center rounded-lg bg-background-alt p-4 text-title shadow-csm"
		>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="flex w-full items-center"
				on:click={() => {
					versionStore.getVersion() === 'B'
						? gotoPortfolioPackDetails(portfolioPack.packId)
						: toggleInput(portfolioPack);
				}}
			>
				<BasicDetails {showChevron} {portfolioPack} />
			</div>
			<div class="mt-3 flex flex-col text-body">
				<div class="text-xs font-medium">Key Benefits:</div>
				<div class="text-xs">
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
				<div class="mt-3 flex rounded-sm bg-[#E0F2EE] px-3 py-2 text-body">
					<div class="flex items-center text-xs">
						<WMSIcon name="people-icon" height={12} width={14} /><span class="pl-2 font-medium"
							>{portfolioPack.totalUsersInvested}</span
						> people have invested in this fund
					</div>
				</div>
			{/if}
		</section>
	{/each}
	<Modal isModalOpen={showInputPopup} on:backdropclicked={() => (showInputPopup = !showInputPopup)}>
		<PortfolioInput
			portfolioPack={activePortfolioPack}
			{amount}
			sipStartDate={date}
			{requestId}
			on:backButtonClicked={() => (showInputPopup = !showInputPopup)}
		/>
	</Modal>
</section>
