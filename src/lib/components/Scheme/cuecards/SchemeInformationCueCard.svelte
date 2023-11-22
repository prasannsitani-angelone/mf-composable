<script lang="ts">
	import SchemeInformation from '$components/Scheme/SchemeInformation/SchemeInformation.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails.js';

	export let schemeDetails: SchemeDetails;
	export let isNFO = false;
</script>

<SchemeInformation
	{isNFO}
	{schemeDetails}
	class="mx-2 h-[580px] {$$props.class}"
	showFooter={false}
	innerStyle="flex flex-col gap-4"
/>
