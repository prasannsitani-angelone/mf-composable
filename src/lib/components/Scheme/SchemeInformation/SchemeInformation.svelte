<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	import BasicInformation from './BasicInformation.svelte';
	import SchemeInformationHeader from './SchemeInformationHeader.svelte';

	let schemeDetails: SchemeDetails;
	let isNFO = false;
	let innerStyle = '';
	let showFooter = true;
	let fromCueCard = false;
	export { schemeDetails, isNFO, innerStyle, showFooter, fromCueCard };
</script>

<article
	class="mt-2 max-w-4xl rounded-lg border border-b bg-background-alt text-sm shadow-csm md:mt-4 {$$props.class}"
>
	<SchemeInformationHeader />

	<section class="origin-top transition duration-100">
		<BasicInformation
			on:exitLoadInfoIconClicked
			{schemeDetails}
			{isNFO}
			{showFooter}
			{innerStyle}
			{fromCueCard}
		/>
	</section>
</article>
