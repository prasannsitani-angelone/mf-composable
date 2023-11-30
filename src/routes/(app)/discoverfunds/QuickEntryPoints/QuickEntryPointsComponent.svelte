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
		onLinkClicked={() => homepageNfoClickAnalytics(openNfo)}
		to="/nfo"
	>
		<div slot="icon" class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary">
			<WMSIcon name="announcement-white" />
		</div>
		<div slot="bottomLayer">
			<svg width="100%" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					opacity="0.4"
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M300 12.8324V19.679C300 30.4082 293.527 39.106 285.542 39.106C179.679 39.5106 125.785 39.106 14.4578 39.106C6.473 39.106 0 30.7127 0 21.594V3.57153C60.7678 22.2714 140.831 26.5833 224.376 22.2714C249.119 20.9944 275.203 17.3862 300 12.8324Z"
					fill="#D1D8F6"
				/>
				<path
					d="M300 31.2857V0C148.953 42.6604 37.0638 29.1657 0 18.9946V31.2857C0 35.704 3.58171 39.2857 7.99999 39.2857H292C296.418 39.2857 300 35.704 300 31.2857Z"
					fill="#D1D8F6"
				/>
			</svg>
		</div>
	</QuickEntryPointsCard>
	<QuickEntryPointsCard
		title="External Funds"
		onLinkClicked={homepageExternalFundsClickAnalytics}
		to="/investments?type=all"
		preloadData={isGuest ? 'off' : 'hover'}
	>
		<div
			slot="icon"
			class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-green-amount"
		>
			<WMSIcon name="external-funds" />
		</div>
		<div slot="bottomLayer">
			<svg width="100%" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M300 12.8324V19.679C300 30.4082 293.527 39.106 285.542 39.106C179.679 39.5106 125.785 39.106 14.4578 39.106C6.473 39.106 0 30.7127 0 21.594V3.57153C60.7678 22.2714 140.831 26.5833 224.376 22.2714C249.119 20.9944 275.203 17.3862 300 12.8324Z"
					fill="#F3FAF8"
				/>
				<path
					d="M300 31.2857V0C148.953 42.6604 37.0638 29.1657 0 18.9946V31.2857C0 35.704 3.58171 39.2857 7.99999 39.2857H292C296.418 39.2857 300 35.704 300 31.2857Z"
					fill="#C2E4DE"
				/>
			</svg>
		</div>
	</QuickEntryPointsCard>
	<QuickEntryPointsCard title="Buy a Portfolio" to="/buyPortfolio">
		<div
			slot="icon"
			class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-primary"
		>
			<WMSIcon name="folder-star" />
		</div>
		<div slot="bottomLayer">
			<svg width="100%" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M300 12.8324V19.679C300 30.4082 293.527 39.106 285.542 39.106C179.679 39.5106 125.785 39.106 14.4578 39.106C6.473 39.106 0 30.7127 0 21.594V3.57153C60.7678 22.2714 140.831 26.5833 224.376 22.2714C249.119 20.9944 275.203 17.3862 300 12.8324Z"
					fill="#FFF8EE"
				/>
				<path
					d="M300 31.2857V0C148.953 42.6604 37.0638 29.1657 0 18.9946V31.2857C0 35.704 3.58171 39.2857 7.99999 39.2857H292C296.418 39.2857 300 35.704 300 31.2857Z"
					fill="#FEEED4"
				/>
			</svg>
		</div>
	</QuickEntryPointsCard>
	<QuickEntryPointsCard
		title="SIP Calculator"
		onLinkClicked={homepageSipCalculatorClickAnalytics}
		to="/sipCalculator"
	>
		<div
			slot="icon"
			class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-errorDark"
		>
			<WMSIcon name="calculator" />
		</div>
		<div slot="bottomLayer">
			<svg width="100%" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					opacity="0.4"
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M300 12.8324V19.679C300 30.4082 293.527 39.106 285.542 39.106C179.679 39.5106 125.785 39.106 14.4578 39.106C6.473 39.106 0 30.7127 0 21.594V3.57153C60.7678 22.2714 140.831 26.5833 224.376 22.2714C249.119 20.9944 275.203 17.3862 300 12.8324Z"
					fill="#FBEEEE"
				/>
				<path
					d="M300 31.2857V0C148.953 42.6604 37.0638 29.1657 0 18.9946V31.2857C0 35.704 3.58171 39.2857 7.99999 39.2857H292C296.418 39.2857 300 35.704 300 31.2857Z"
					fill="#F5D4D4"
				/>
			</svg>
		</div>
	</QuickEntryPointsCard>
</article>
