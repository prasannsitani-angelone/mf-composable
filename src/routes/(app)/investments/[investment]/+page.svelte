<script lang="ts">
	import InvestmentPad from './InvestmentPad/InvestmentPad.svelte';
	import type { PageData } from '../$types';

	export let data: PageData;
</script>

{#await data?.api?.schemeData}
	<div>Loading</div>
{:then schemeData}
	<article class="rounded-lg bg-white text-black-title">
		<InvestmentPad {schemeData} />
	</article>
{/await}
