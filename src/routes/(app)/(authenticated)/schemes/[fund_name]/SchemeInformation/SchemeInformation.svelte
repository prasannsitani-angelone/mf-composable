<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	import BasicInformation from './BasicInformation.svelte';
	import SchemeInformationHeader from './SchemeInformationHeader.svelte';

	let schemeDetails: SchemeDetails;
	let isNFO = false;
	export { schemeDetails, isNFO };
</script>

<article
	class="mt-4 max-w-4xl rounded-lg border border-b border-grey-line bg-white text-sm shadow-csm"
>
	{#if !isNFO}
		<SchemeInformationHeader />
	{/if}
	<section class="origin-top transition duration-100">
		<BasicInformation {schemeDetails} />
	</section>
</article>
