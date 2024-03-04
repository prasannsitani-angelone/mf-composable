<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import type { NFOList } from '$lib/types/INFOList';
	import NFOTable from './NFOTable.svelte';
	import NoNfo from '$lib/images/icons/NoNFO.svelte';
	import { appStore } from '$lib/stores/SparkStore';
	import { goBackToSpark } from '$lib/utils';

	let closedNfo: NFOList[] = [];

	const handleBackNavigation = async () => {
		if (window.history.length === 1) {
			if ($appStore.openViaTabView) {
				goBackToSpark();
			} else {
				await goto(`${base}/discoverfunds`);
			}
		} else {
			history.back();
		}
	};

	export { closedNfo };
</script>

<header class="mb-6 mt-1 flex hidden items-center sm:block">
	<div class="flex items-center">
		<LeftArrowIcon class="mr-3 cursor-pointer" onClick={handleBackNavigation} />
		<h2 class="text-lg font-normal text-title">New Fund Offerings (NFO)</h2>
	</div>
</header>
<div class="flex flex-col items-center justify-center gap-4 rounded-lg bg-background-alt py-6">
	<NoNfo />
	<p class="text-sm font-normal text-body">There are no NFOs open currently</p>
</div>
<h2 class="mb-4 mt-5 text-lg font-medium text-title">Recently Closed NFOs</h2>
<NFOTable class="rounded-lg" searchOption={closedNfo} clickable={false} isClosedNFO />
