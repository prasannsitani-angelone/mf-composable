<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import Link from '$lib/components/Link.svelte';
	import Table from '$components/Table/Table.svelte';
	import THead from '$components/Table/THead.svelte';
	import Th from '$components/Table/TH.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import { onMount } from 'svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';

	const trendingTable = {
		col: ['Funds', '3Y return', 'Min SIP Invetsments']
	};
	let tableData: Array<WeeklyTopSchemesEntity>;
	onMount(() => {
		console.log(tableData);
	});
	export { tableData };
</script>

<section class="mt-2 max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-4">
	<header class="flex flex-col p-6">
		<h2 class="text-lg font-medium text-black-title">Popular With Other Investors</h2>
	</header>
	<Table>
		<THead slot="thead">
			<Th class="text-start">Funds</Th>
			<Th class="text-center">3Y return</Th>
			<Th>Min SIP Invetsments</Th>
		</THead>
		<TBody slot="tbody">
			{#each tableData as schemes}
				<tr
					><Th>
						<SchemeLogo src={schemes?.logoUrl} alt={schemes?.schemeName} />
					</Th>
					<Th>{schemes?.returns3yr}</Th>
					<Th>{schemes?.minSipAmount}</Th></tr
				>
			{/each}
		</TBody>
	</Table>
</section>
