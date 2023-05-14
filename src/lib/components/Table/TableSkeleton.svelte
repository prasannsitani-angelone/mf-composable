<script>
	import { page } from '$app/stores';
	import SkeletonCircle from '$components/Skeleton/SkeletonCircle.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import TBody from './TBody.svelte';
	import Td from './TD.svelte';
	import Th from './TH.svelte';
	import THead from './THead.svelte';
	import Tr from './TR.svelte';
	import Table from './Table.svelte';

	$: isBrowser = $page?.data?.deviceType?.isBrowser;

	let rowLength = 6;
	let columnLength = 4;
	export { rowLength, columnLength };
</script>

<SkeletonWrapper class="w-full bg-white ">
	<Table>
		<THead slot="thead" class="border-t border-grey-line">
			<Th class=" w-8/12 !pr-0 sm:w-5/12">
				<SkeletonRectangle class="w-20" />
			</Th>
			{#if isBrowser}
				{#each new Array(columnLength) as _}
					<Th wrapperClass="justify-end sm:justify-center"><SkeletonRectangle class="w-20" /></Th>
				{/each}
			{:else}
				<Th class="flex items-center justify-center !p-0 !pr-1 text-center">
					<SkeletonRectangle class="w-20" />
				</Th>
			{/if}
		</THead>
		<TBody slot="tbody">
			{#each new Array(rowLength) as _}
				<Tr>
					<Td class="!px-0">
						<div class="mt-4 flex gap-3">
							<SkeletonCircle class="ml-4 h-9 w-9" />
							<div>
								<SkeletonRectangle class="mb-2 w-40" />
								<SkeletonRectangle class="mb-2 w-24 sm:w-80" />
							</div>
						</div>
					</Td>

					{#if isBrowser}
						{#each new Array(columnLength) as _}
							<Td class="text-center">
								<SkeletonRectangle class="w-full" />
							</Td>
						{/each}
					{:else}
						<Td class="text-center">
							<SkeletonRectangle class="w-full" />
						</Td>
					{/if}
				</Tr>
			{/each}
		</TBody>
	</Table>
</SkeletonWrapper>
