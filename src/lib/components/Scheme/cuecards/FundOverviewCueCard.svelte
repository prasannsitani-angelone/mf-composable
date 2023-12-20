<script lang="ts">
	import FundOverview from '$components/Scheme/FundOverview/FundOverview.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails.js';
	export let schemeDetails: SchemeDetails;
</script>

<FundOverview
	{schemeDetails}
	class="mx-2 mt-4 h-[500px] {$$props.class}"
	innerStyle="flex flex-col gap-1"
	onMountEvent={false}
/>
