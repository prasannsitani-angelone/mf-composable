<script lang="ts">
	import ChipOverview from '$components/ChipOverview.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	let schemeDetails: SchemeDetails;

	export { schemeDetails };
</script>

<article
	class="-m-2 mb-2 max-w-4xl rounded-none bg-white pb-4 text-sm shadow-csm sm:mb-4 sm:rounded-lg"
>
	<header class="">
		<section class="flex cursor-pointer flex-col p-4 !pb-0 text-lg md:px-6 md:py-5">
			<ChipOverview
				headingPrimary={schemeDetails?.categoryName}
				headingSecondary={schemeDetails?.subcategoryName}
			/>
			<div class="flex items-center">
				<SchemeLogo src={schemeDetails?.logoUrl} />
				<div>{schemeDetails?.schemeName}</div>
			</div>
		</section>
	</header>
</article>
