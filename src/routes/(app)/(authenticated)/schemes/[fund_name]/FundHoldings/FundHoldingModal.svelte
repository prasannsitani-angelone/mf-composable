<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import HoldingTable from './HoldingTable.svelte';
	import type { TopHolding } from '$components/Scheme/types';
	import { fundHoldingsInfo } from '$components/Scheme/analytics';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	import type { SectorHoldings } from '$lib/types/ISchemeDetails';
	let holdings: TopHolding[];
	let sectorHoldings: SectorHoldings[];
	let activeTab: string;
	let isModalOpen = false;
	let isin: string;
	let schemeName: string;
	let toggleSchemeIformationModal: (() => void) | null = null;

	$: if (isModalOpen) {
		fundHoldingsInfo({
			ISIN: isin,
			FundName: schemeName
		});
	}

	export {
		isModalOpen,
		toggleSchemeIformationModal,
		holdings,
		isin,
		schemeName,
		sectorHoldings,
		activeTab
	};
</script>

<ModalWithAnimation {isModalOpen} on:backdropclicked={toggleSchemeIformationModal}>
	<article
		class="h-[70vh] overflow-x-scroll rounded-t-2xl bg-background-alt px-6 pb-8 pt-6 md:w-120 md:rounded-lg"
	>
		<header class="mb-3 flex align-middle text-lg font-medium text-title md:text-xl">
			<span> Fund Holdings</span>
			<WMSIcon
				name="cross-circle"
				class="ml-auto hidden cursor-pointer sm:block"
				on:click={toggleSchemeIformationModal}
			/>
		</header>

		<section>
			<HoldingTable {holdings} {sectorHoldings} {activeTab} />
		</section>
	</article>
</ModalWithAnimation>
