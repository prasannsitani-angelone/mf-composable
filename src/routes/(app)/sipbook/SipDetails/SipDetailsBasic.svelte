<script lang="ts">
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	let sipId: number;
	let schemeName: string;
	let schemePlan: string;
	let logoUrl: string;
	export { sipId, schemeName, schemePlan, logoUrl };
</script>

<section class="rounded-lg bg-white shadow-csm">
	<article class="flex items-center justify-between border-b px-4 py-2 text-sm text-grey-body">
		<div class="font-normal">SIP ID</div>

		<div class="font-medium">
			{Math?.abs(sipId)}
		</div>
	</article>

	<ResultItem
		data={{
			schemeName: schemeName,
			categoryName: schemePlan?.toLowerCase(),
			logoUrl: logoUrl
		}}
		categoryStyle="text-[10px] capitalize"
		logoStyle="w-9 h-9 p-0.5 !mr-2"
		class="!border-b-0 !p-4"
	>
		<div slot="returns">
			<span />
		</div>
	</ResultItem>
</section>
