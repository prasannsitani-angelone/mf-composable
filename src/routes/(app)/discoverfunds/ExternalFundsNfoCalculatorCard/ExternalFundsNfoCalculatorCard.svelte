<script lang="ts">
	import Link from '$components/Link.svelte';
	import { homepageSipCalculatorClickAnalytics } from '$lib/analytics/DiscoverFunds';
	import getactiveNfo from '$lib/api/nfo';
	import { onMount, tick } from 'svelte';
	import { WMSIcon } from 'wms-ui-component';

	$: openNfo = 0;

	let isGuest: boolean;
	onMount(async () => {
		await tick();
		const nfoList = await getactiveNfo();
		openNfo = nfoList?.length;
	});

	export { isGuest };
</script>

<article class="mt-2 flex justify-around rounded bg-white px-4 py-6 pb-3 shadow-csm">
	<Link preloadData={isGuest ? 'off' : 'hover'} to="/investments?type=all">
		<div class="mb-2 flex flex-col items-center">
			<div
				class="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F9BA4D]/[0.24]"
			>
				<WMSIcon name="import-external-funds" />
			</div>
			<div class="text-title-black mt-2 text-sm font-medium lg:text-base">External Funds</div>
		</div>
	</Link>
	<Link to="/nfo">
		<div class="mb-2 flex flex-col items-center">
			<div class="relative h-9 w-9 items-center justify-center rounded-full bg-[#E1D1FC] p-[6px]">
				<div
					class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-primary text-center text-xs text-white"
				>
					{openNfo}
				</div>

				<WMSIcon name="announcement" />
			</div>
			<div class="text-title-black mt-2 text-sm font-medium lg:text-base">NFO</div>
		</div>
	</Link>
	<Link to="/sipCalculator" on:linkClicked={homepageSipCalculatorClickAnalytics}>
		<div class="mb-2 flex flex-col items-center">
			<div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9F3E1] p-[6px]">
				<WMSIcon name="fund-calculator" />
			</div>
			<div class="text-title-black mt-2 text-sm font-medium lg:text-base">SIP Calculator</div>
		</div>
	</Link>
</article>
