<script lang="ts">
	import RiskAndRating from '$components/Scheme/RiskAndRating/RiskAndRating.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails.js';
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { goto } from '$app/navigation';
	import ButtonMedium from '$components/ButtonMedium.svelte';

	export let schemeDetails: SchemeDetails;

	export let schemeDetailsClicked: () => void;

	const gotoSchemeDetails = async () => {
		schemeDetailsClicked();

		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			schemeDetails?.schemeName,
			schemeDetails?.isin,
			schemeDetails?.schemeCode
		)}`;
		await goto(schemeDetailsPath, { replaceState: true, invalidateAll: true });
	};
</script>

<RiskAndRating {schemeDetails} class="mx-2 flex h-[500px] max-w-full flex-col {$$props.class}">
	<div slot="footer" class="flex flex-1 flex-col">
		<div class="h-max flex-1" />
		<div class="mx-4 mt-auto border-t py-1 text-center">
			<ButtonMedium
				on:click={gotoSchemeDetails}
				class="text-sm font-semibold uppercase text-primary"
				variant="transparent"
			>
				View fund details
			</ButtonMedium>
		</div>
	</div>
</RiskAndRating>
