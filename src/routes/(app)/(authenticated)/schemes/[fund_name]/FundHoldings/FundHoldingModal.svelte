<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import { WMSIcon } from 'svelte-components';
	import HoldingTable from './HoldingTable.svelte';
	import type { TopHolding } from '../types';
	let holdings: TopHolding[];
	let isModalOpen = false;
	let toggleSchemeIformationModal: (() => void) | null = null;
	export { isModalOpen, toggleSchemeIformationModal, holdings };
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
