<script lang="ts">
	import {
		homepageExternalFundsClickAnalytics,
		homepageSipCalculatorClickAnalytics
	} from '$lib/analytics/DiscoverFunds';
	import { onMount, tick } from 'svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import QuickEntryPointsCard from './QuickEntryPointsCard.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { slide } from 'svelte/transition';
	import {
		homepageFundCompareClickAnalytics,
		homepageFundCompareButtonImpressionAnalytics
	} from '../../(authenticated)/schemes/fundcomparision/analytics';
	import viewport from '$lib/utils/useViewPortAction';

	let isGuest: boolean;
	let impressionEventSent = false;

	onMount(async () => {
		await tick();
		handleFundCompareButtonAnanlytics('N');
	});

	const getParams = () => {
		const params = {
			comparisionArr: [],
			showSearch: true
		};
		return params;
	};

	const handleFundCompareButtonAnanlytics = (isVisible: string) => {
		const metaData = {
			comparefundsvisible: isVisible
		};
		homepageFundCompareButtonImpressionAnalytics(metaData);
	};

	const returnEstimatorInViewPort = () => {
		if (!impressionEventSent) {
			impressionEventSent = true;
			handleFundCompareButtonAnanlytics('Y');
		}
	};

	export { isGuest };
</script>

<article
	class="item grid grid-cols-1 justify-between sm:grid-rows-1 {$$props.class} slide-down divide-y divide-border"
	in:slide={{ duration: 300 }}
>
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
		onLinkClicked={homepageFundCompareClickAnalytics}
		to={`/schemes/fundcomparision?params=${encodeObject(getParams())}`}
	>
		<div
			use:viewport
			on:enterViewport={returnEstimatorInViewPort}
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
