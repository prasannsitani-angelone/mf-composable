<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import type { ExploreModalData } from '../../types';
	let isModalOpen = false;
	let toggleTaxSavingModal: (() => void) | null = null;
	let modalList: ExploreModalData;
	export { isModalOpen, toggleTaxSavingModal, modalList };
</script>

<Modal {isModalOpen} on:backdropclicked={toggleTaxSavingModal}>
	<article class="rounded-t-2xl bg-white pt-6 pb-8 md:w-120 md:rounded-lg">
		<header class="mb-4 border-b px-8 pb-6 text-lg text-black-title md:text-xl">
			{modalList?.shortDescription}
		</header>
		<section class="text-sm font-normal text-grey-body">
			<ul class="list-disc px-12">
				{#each modalList?.detailedDescription || [] as list}
					<li>{list}</li>
				{/each}
			</ul>
		</section>
	</article>
</Modal>
