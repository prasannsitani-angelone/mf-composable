<script lang="ts">
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
	import BasicDetails from '../../components/BasicDetails.svelte';

	export let portfolioPack: PortfolioPack;
	let showChevron = false;
</script>

<section>
	<div class="mx-2 flex items-center justify-between rounded-lg bg-white px-4 py-3">
		<BasicDetails {portfolioPack} {showChevron} />
	</div>
</section>
