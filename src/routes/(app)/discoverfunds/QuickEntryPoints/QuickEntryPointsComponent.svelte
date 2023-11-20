<script lang="ts">
	import {
		homepageExternalFundsClickAnalytics,
		homepageNfoClickAnalytics,
		homepageSipCalculatorClickAnalytics
	} from '$lib/analytics/DiscoverFunds';
	import getactiveNfo from '$lib/api/nfo';
	import { onMount, tick } from 'svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import QuickEntryPointsCard from './QuickEntryPointsCard.svelte';
	import { base } from '$app/paths';

	$: openNfo = 0;

	let isGuest: boolean;
	onMount(async () => {
		await tick();
		const nfoList = await getactiveNfo();
		openNfo = nfoList?.length;
	});

	export { isGuest };
</script>

<article
	class="item grid grid-cols-2 justify-between sm:grid-cols-4 sm:grid-rows-2 {$$props.class} gap-x-2 gap-y-2"
>
	<QuickEntryPointsCard
		title="NFO"
		src={`${base}/images/BlueLayer.png`}
		onLinkClicked={() => homepageNfoClickAnalytics(openNfo)}
		to="/nfo"
	>
		<div
			slot="icon"
			class="mt-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary"
		>
			<WMSIcon name="announcement-white" />
		</div>
	</QuickEntryPointsCard>
	<QuickEntryPointsCard
		title="External Funds"
		src={`${base}/images/GreenLayer.png`}
		onLinkClicked={homepageExternalFundsClickAnalytics}
		to="/investments?type=all"
		preloadData={isGuest ? 'off' : 'hover'}
	>
		<div
			slot="icon"
			class="mt-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-green-amount"
		>
			<WMSIcon name="external-funds" />
		</div>
	</QuickEntryPointsCard>
	<QuickEntryPointsCard
		title="Buy a Portfolio"
		src={`${base}/images/YellowLayer.png`}
		comingSoon={true}
	>
		<div
			slot="icon"
			class="mt-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-primary"
		>
			<WMSIcon name="folder-star" />
		</div>
	</QuickEntryPointsCard>
	<QuickEntryPointsCard
		title="SIP Calculator"
		src={`${base}/images/PinkLayer.png`}
		onLinkClicked={homepageSipCalculatorClickAnalytics}
		to="/sipCalculator"
	>
		<div
			slot="icon"
			class="mt-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-red-errorDark"
		>
			<WMSIcon name="calculator" />
		</div>
	</QuickEntryPointsCard>
</article>
