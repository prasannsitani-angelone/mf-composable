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
	import { encodeObject } from '$lib/utils/helpers/params';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';

	$: openNfo = 0;
	$: deviceType = $page.data.deviceType;

	let isGuest: boolean;
	onMount(async () => {
		await tick();
		const nfoList = await getactiveNfo();
		openNfo = nfoList?.length;
	});

	const getParams = () => {
		const params = {
			comparisionArr: [],
			showSearch: true
		};
		return params;
	};

	export { isGuest };
</script>

<article
	class="item grid grid-cols-1 justify-between sm:grid-rows-1 {$$props.class} slide-down divide-y divide-border {deviceType.isMobile
		? 'min-h-[403px]'
		: ''}"
	in:slide={{ duration: 300 }}
>
	<QuickEntryPointsCard
		title="New Fund Offerings"
		subtitle={`Explore ${openNfo} NFOs currently live`}
		liveNFO={openNfo}
		onLinkClicked={() => homepageNfoClickAnalytics(openNfo)}
		to="/nfo"
		class="rounded-t-lg"
	>
		<div slot="icon" class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary">
			<WMSIcon name="announcement-white" />
		</div>
	</QuickEntryPointsCard>
	<QuickEntryPointsCard
		title="Track External Investments"
		subtitle="Monitor your entire portfolio, including investments outside Angel One"
		onLinkClicked={homepageExternalFundsClickAnalytics}
		to="/investments?type=all"
		preloadData={isGuest ? 'off' : 'hover'}
	>
		<div slot="icon" class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-buy">
			<WMSIcon name="external-funds" />
		</div>
	</QuickEntryPointsCard>
	<QuickEntryPointsCard
		title="Compare Mutual Funds"
		subtitle="Compare performance of 8,000+ funds"
		to={`/schemes/fundcomparision?params=${encodeObject(getParams())}`}
	>
		<div
			slot="icon"
			class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
		>
			<WMSIcon name="compare-funds" />
		</div>
	</QuickEntryPointsCard>
	<QuickEntryPointsCard
		title="SIP Returns Calculator"
		subtitle="Calculate long term returns for your SIP investments"
		onLinkClicked={homepageSipCalculatorClickAnalytics}
		to="/sipCalculator"
		class="rounded-b-lg"
	>
		<div slot="icon" class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-sell">
			<WMSIcon name="calculator" />
		</div>
	</QuickEntryPointsCard>
</article>

<style>
	.slide-down {
		will-change: transform;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transform: translateY(0) translateZ(0);
	}
</style>
