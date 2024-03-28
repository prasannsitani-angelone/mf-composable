<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import PortfolioInput from '../../(authenticated)/buyPortfolio/[portfolioId]/components/PortfolioInput.svelte';
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';

	export let showInputPopup: boolean;
	export let selectedPortfolio: PortfolioPack;
</script>

<Modal isModalOpen={showInputPopup} on:backdropclicked={() => (showInputPopup = !showInputPopup)}>
	<PortfolioInput
		amount={selectedPortfolio.minSipAmount}
		portfolioPack={selectedPortfolio}
		on:backButtonClicked={() => (showInputPopup = !showInputPopup)}
		on:portfolioClick={() => (showInputPopup = !showInputPopup)}
	/>
</Modal>
