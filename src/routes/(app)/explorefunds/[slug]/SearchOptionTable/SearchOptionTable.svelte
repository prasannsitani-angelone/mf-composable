<script lang="ts">
	import SchemeCard from '$components/SchemeCard.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import Table from '$components/Table/Table.svelte';
	import type { ExploreFundsOptions } from '../../types';

	let searchOption: ExploreFundsOptions[];

	const getNavDiffrence = (navValue = 0, previousNavValue = 0) => {
		const navChange = parseFloat(
			(((navValue - previousNavValue) / previousNavValue) * 100)?.toFixed(2)
		);
		let result: string = navChange?.toString();
		if (navChange > 0) {
			result = `+${navChange}`;
		}
		return result;
	};

	export { searchOption };
</script>

<Table>
	<THead slot="thead">
		<Th class="w-5/12">Funds</Th>
		<Th wrapperClass="justify-center">3Y Return</Th>
		<Th wrapperClass="justify-center">5Y Return</Th>
		<Th wrapperClass="justify-center">Current NAV</Th>
		<Th wrapperClass="justify-center">Min SIP Investments</Th>
	</THead>
	<TBody slot="tbody">
		{#each searchOption || [] as scheme}
			{@const isNavTrendingUp = scheme?.navValue >= scheme?.previousNavValue}
			<Tr class="hover cursor-pointer">
				<Td>
					<SchemeCard schemes={scheme} />
				</Td>
				<Td class="text-center">
					{scheme?.returns3yr}%
				</Td>
				<Td class="text-center">
					{scheme?.returns5yr}%
				</Td>
				<Td class="text-center">
					<div
						class="flex flex-col justify-center text-center align-middle text-base font-medium text-black-title md:text-sm"
					>
						<span>₹{scheme?.navValue}</span>
						<span class:text-green-buy={isNavTrendingUp} class:text-red-sell={!isNavTrendingUp}>
							{getNavDiffrence(scheme?.navValue, scheme?.previousNavValue)}%
						</span>
					</div>
				</Td>
				<Td class="text-center">
					₹{scheme?.minSipAmount}
				</Td>
			</Tr>
		{/each}
	</TBody>
</Table>
