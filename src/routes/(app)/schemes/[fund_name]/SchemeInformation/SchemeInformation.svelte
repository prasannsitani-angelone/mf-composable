<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	import BasicInformation from './BasicInformation.svelte';
	import Rating from './Rating.svelte';
	import RiskInvolved from './RiskInvolved.svelte';
	import SchemeInformationHeader from './SchemeInformationHeader.svelte';
	import TaxImplications from './TaxImplications.svelte';

	let schemeDetails: SchemeDetails;

	export { schemeDetails };
</script>

<article
	class="mt-4 max-w-4xl rounded-lg border border-b border-grey-line bg-white text-sm shadow-csm"
>
	<SchemeInformationHeader />
	<section class="origin-top transition duration-100">
		<BasicInformation {schemeDetails} />
		<TaxImplications {schemeDetails} />
		<RiskInvolved {schemeDetails} />
		<Rating {schemeDetails} />
	</section>
</article>
