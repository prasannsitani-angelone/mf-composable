<script lang="ts">
	import NFODetails from '$components/Scheme/NFODetails/NFODetails.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails.js';

	export let schemeDetails: SchemeDetails;
</script>

<NFODetails {schemeDetails} class="mx-2 h-[500px] {$$props.class}" />
