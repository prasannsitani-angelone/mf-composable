<script lang="ts">
	import type { NFOList } from '$lib/types/INFOList';
	import NFOTable from './NFOTable.svelte';

	let nfo: NFOList[] = [];

	export { nfo };
</script>

<header class="hidden sm:block">
	<h2 class="mb-6 mt-1 text-lg font-normal text-title">Open NFO’s</h2>
</header>
<NFOTable searchOption={nfo} />
