<script lang="ts">
	import Button from '$components/Button.svelte';
	import SchemeInformationIcon from '$lib/images/icons/SchemeInformationIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	import BasicInformation from './BasicInformation.svelte';
	import Rating from './Rating.svelte';
	import RiskInvolved from './RiskInvolved.svelte';
	import TaxImplications from './TaxImplications.svelte';

	let schemeDetails: SchemeDetails;

	export { schemeDetails };
</script>

<article
	class="mt-4 max-w-4xl rounded-lg border border-b border-grey-line bg-white text-sm shadow-csm"
>
	<header
		class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
	>
		<div class="flex items-center">
			<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
				<SchemeInformationIcon />
			</div>
			<h2 class="ml-3 flex items-center text-left font-medium text-black-title">
				<span>Basic Information</span>
				<Button
					class="ml-2 flex h-max !w-3.5 justify-center rounded-full border border-grey-line !bg-white !px-[10px] !py-0 text-sm font-semibold !text-grey-body active:opacity-95"
					>i</Button
				>
			</h2>
		</div>
	</header>
	<section class="origin-top transition duration-100">
		<BasicInformation {schemeDetails} />
		<TaxImplications {schemeDetails} />
		<RiskInvolved {schemeDetails} />
		<Rating {schemeDetails} />
	</section>
</article>
