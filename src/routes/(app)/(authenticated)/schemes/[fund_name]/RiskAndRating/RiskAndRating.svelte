<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import RatingAgency from './RatingAgency.svelte';
	import RiskInvolved from './RiskInvolved.svelte';

	let schemeDetails: SchemeDetails;
	export { schemeDetails };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white text-sm shadow-csm">
	<header>
		<section
			class="flex cursor-pointer items-center justify-between p-4 pb-3 text-lg md:px-6 md:pt-6"
		>
			<section class="flex items-center">
				<h2 class="flex items-center text-left text-base font-medium text-black-title">
					<span> Risk and Ratings</span>
				</h2>
			</section>
		</section>
	</header>
	<section class="flex flex-col gap-8 px-4 sm:flex-row sm:px-6">
		<RiskInvolved {schemeDetails} />
		<section class="flex flex-grow basis-0 flex-col">
			<section class="mb-3 mt-7 flex flex-grow basis-0 flex-row gap-8 sm:m-0 sm:flex-col sm:gap-0">
				<RatingAgency name="Angel one" rating={schemeDetails?.arqRating} />
				<RatingAgency name="Crisil" rating={schemeDetails?.crisilRating} />
			</section>
			<section class="mb-6 flex flex-grow basis-0 gap-8 sm:flex-col sm:gap-0">
				<RatingAgency name="Morningstar" rating={schemeDetails?.morningstarRating} />
				<RatingAgency name="Value Research" rating={schemeDetails?.valueResearchRating} />
			</section>
		</section>
	</section>
</article>
