<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import HoldingTable from './HoldingTable.svelte';
	import type { TopHolding } from '$components/Scheme/types';
	import { fundHoldingsInfo } from '$components/Scheme/analytics';
	import Modal from '$components/Modal.svelte';
	let holdings: TopHolding[];
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

	export { isModalOpen, toggleSchemeIformationModal, holdings, isin, schemeName };
</script>

<Modal {isModalOpen} on:backdropclicked={toggleSchemeIformationModal}>
	<article
		class="h-[70vh] overflow-x-scroll rounded-t-2xl bg-white px-6 pb-8 pt-6 md:w-120 md:rounded-lg"
	>
		<header class="mb-3 flex align-middle text-lg font-medium text-black-title md:text-xl">
			<span> Fund Holdings</span>
			<WMSIcon
				name="cross-circle"
				class="ml-auto hidden cursor-pointer sm:block"
				on:click={toggleSchemeIformationModal}
			/>
		</header>

		<section>
			<HoldingTable {holdings} />
		</section>
	</article>
</Modal>
