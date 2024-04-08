<script lang="ts">
	import SchemeInformation from '$components/Scheme/SchemeInformation/SchemeInformation.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails.js';

	export let schemeDetails: SchemeDetails;
	export let isNFO = false;
	export let exitLoadInfoIconClicked: () => void;
</script>

<SchemeInformation
	on:exitLoadInfoIconClicked={exitLoadInfoIconClicked}
	{isNFO}
	{schemeDetails}
	class="mx-2 h-[500px] max-w-full {$$props.class}"
	showFooter={false}
	innerStyle="flex flex-col gap-1"
/>
