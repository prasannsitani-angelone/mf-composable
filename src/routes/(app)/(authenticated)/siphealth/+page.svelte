<script lang="ts">
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import DetailItem from '$components/SipHealth/DetailItem.svelte';
	import HighScoreHealhScoreBanner from '$components/SipHealth/HighScoreHealhScoreBanner.svelte';
	import MidAndLowHealthScoreBanner from '$components/SipHealth/MidAndLowHealthScoreBanner.svelte';
	import type { ISipHealth, ISipHealthDetails } from '$lib/types/ISipType.js';
	import { onMount } from 'svelte';
	import { Breadcrumb } from 'svelte-components';
	import SipHealthSkeletonLoader from '$components/SipHealth/SipHealthSkeletonLoader.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import ErrorView from '$components/ErrorView.svelte';
	import SipHealthDetailsScoreNudge from '$components/SipHealth/Nudge/SipHealthDetailsScoreNudge.svelte';
	import ActiveAutopay from '$components/SipHealth/Cards/Details/ActiveAutopay.svelte';
	import ConsistentSip from '$components/SipHealth/Cards/Details/ConsistentSip.svelte';
	import LongTermSips from '$components/SipHealth/Cards/Details/LongTermSips.svelte';
	import CueCardCarouselComponent from '$components/CueCardCarouselComponent.svelte';
	import InActiveAutopay from '$components/SipHealth/Cards/Details/InActiveAutopay.svelte';
	import WhatIsSipHealth from '$components/SipHealth/Cards/LearnMore/WhatIsSipHealth.svelte';
	import ImproveSipHealth from '$components/SipHealth/Cards/LearnMore/ImproveSipHealth.svelte';
	import {
		sipHealthDetailsPageCueCardImpressionAnalytics,
		sipHealthDetailsPageCueCardOpenCtaClickAnalytics,
		sipHealthDetailsPageImpressionAnalytics,
		sipHealthDetailsPageLearnMoreCtaClickAnalytics,
		sipHealthDetailsPageSetupAutopayCtaClickAnalytics
	} from '$lib/analytics/siphealth/siphealth.js';
	import {
		SIP_HEALTH_SCORE_LIMIT_AVERAGE,
		SIP_HEALTH_SCORE_LIMIT_GOOD
	} from '$components/SipHealth/constants.js';

	export let data;

	let sipHealthData: ISipHealth;

	let sipHealthDetails: ISipHealthDetails[] = [];

	$: {
		if (sipHealthData?.score !== undefined) {
			sipHealthDetails = [
				{
					title: sipHealthData?.autoPayEnabled ? 'Autopay Enabled' : 'Autopay Setup Pending',
					description: 'Autopay enhances your SIP health by building investing discipline',
					icon: sipHealthData?.autoPayEnabled ? 'green' : 'yellow',
					showFooter: !sipHealthData?.autoPayEnabled || false,
					footerType: 'AUTOPAY_SETUP',
					titleTag: sipHealthData?.autoPayEnabled ? 'HIGH IMPACT' : ''
				},
				{
					title: `${sipHealthData?.pecrcentageOfInstalmentPaid?.toFixed(
						0
					)}% Instalments Paid on Time`,
					description: 'Punctual and consistent with SIP payments improve your SIP health',
					icon: sipHealthData?.pecrcentageOfInstalmentPaid >= 65 ? 'green' : 'yellow'
				},
				{
					title: `${sipHealthData?.totalInstalments} Instalments: Active SIP Age`,
					description:
						'Staying invested longer improves SIP health and gives you a better chance to build wealth',
					icon: sipHealthData?.totalInstalments >= 3 ? 'green' : 'yellow'
				}
			];
		} else {
			sipHealthDetails = [];
		}
	}

	const sipHealthDetailsPageImpressionAnalyticsFunc = () => {
		const eventMetaData = {
			Score: sipHealthData?.score,
			Status:
				sipHealthData?.score >= SIP_HEALTH_SCORE_LIMIT_GOOD
					? 'Great'
					: sipHealthData?.score >= SIP_HEALTH_SCORE_LIMIT_AVERAGE
					? 'Average'
					: 'Bad',
			Autopay: sipHealthData?.autoPayEnabled ? 'Enabled' : 'Pending',
			SIPInstallmentPaidPercentage: sipHealthData?.pecrcentageOfInstalmentPaid,
			InstalmentPaid: sipHealthData?.noOfSuccessfulInstalmnets
		};

		sipHealthDetailsPageImpressionAnalytics(eventMetaData);
	};

	const fetchSipHealthData = async () => {
		data?.api?.sipHealthData?.then((res: ISipHealth) => {
			sipHealthData = res;
		});

		sipHealthDetailsPageImpressionAnalyticsFunc();
	};

	onMount(() => {
		fetchSipHealthData();
	});

	const redirectToAutopaySetup = () => {
		sipHealthDetailsPageSetupAutopayCtaClickAnalytics({ Page: 'SipHealthCheck' });

		goto(`${base}/autopay/manage`);
	};

	let showCarousel = false;
	let isSipHealthDetailsCueCard = false;
	let carouselItems = [];

	const getSipHealthCalculationCarouselItems = () => {
		let carouselItems = [];
		const props = { class: 'mx-2 sm:mx-auto sm:w-[450px]' };
		if (sipHealthData?.autoPayEnabled) {
			carouselItems.push({ component: ActiveAutopay, props });
		} else {
			carouselItems.push({ component: InActiveAutopay, props });
		}
		carouselItems.push({ component: ConsistentSip, props });
		carouselItems.push({ component: LongTermSips, props });

		return carouselItems;
	};

	const getLearnMoreCarouselItems = () => {
		let carouselItems = [];
		const props = { class: 'mx-2 sm:mx-auto sm:w-[450px]' };
		carouselItems.push({ component: WhatIsSipHealth, props });
		carouselItems.push({ component: ImproveSipHealth, props });
		return carouselItems;
	};

	const breadCrumbs = [{ text: 'Home ', href: '/discoverfunds' }];

	breadCrumbs.push({
		text: 'SIPs',
		href: `/sipbook/dashboard`
	});

	breadCrumbs.push({
		text: 'SIP Health Check',
		href: `/siphealth`
	});

	const handleErrorNavigation = () => {
		history?.back();
	};

	const handleLearnMoreClick = () => {
		carouselItems = getLearnMoreCarouselItems();
		showCarousel = true;

		sipHealthDetailsPageLearnMoreCtaClickAnalytics();
	};

	const handleCueCardCtaClick = () => {
		carouselItems = getSipHealthCalculationCarouselItems();
		showCarousel = true;
		isSipHealthDetailsCueCard = true;

		sipHealthDetailsPageCueCardOpenCtaClickAnalytics({
			msg:
				sipHealthData?.score >= SIP_HEALTH_SCORE_LIMIT_GOOD
					? 'How is SIP health calculated?'
					: 'Improve your SIP Health'
		});
	};

	const handleCueCardClose = () => {
		isSipHealthDetailsCueCard = false;
	};

	const sipHealthDetailsPageCueCardImpressionAnalyticsFunc = (rank = 0) => {
		const eventMetaData = {
			msg:
				sipHealthData?.score >= SIP_HEALTH_SCORE_LIMIT_GOOD
					? 'How is SIP health calculated?'
					: 'Improve your SIP Health',
			Rank: rank + 1
		};

		sipHealthDetailsPageCueCardImpressionAnalytics(eventMetaData);
	};

	const handleCueCardLoad = (e) => {
		if (showCarousel && isSipHealthDetailsCueCard) {
			const cardRank = e?.detail?.index || 0;
			sipHealthDetailsPageCueCardImpressionAnalyticsFunc(cardRank);
		}
	};
</script>

{#await data?.api?.sipHealthData}
	<SipHealthSkeletonLoader />
{:then sipHealth}
	{#if sipHealth?.score !== undefined}
		<section>
			<Breadcrumb items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />

			<section class="rounded-lg bg-white py-4 shadow-csm md:pt-5">
				<section
					class="hidden border-b px-4 pb-4 text-lg font-medium text-black-title md:block md:px-6"
				>
					SIP Health Check
				</section>

				<SipHealthDetailsScoreNudge
					score={sipHealth?.score}
					class="border-b md:mt-4"
					on:learnMoreClick={handleLearnMoreClick}
				/>

				<article class="mt-6 px-4 md:px-6">
					{#if sipHealth?.score >= SIP_HEALTH_SCORE_LIMIT_GOOD}
						<HighScoreHealhScoreBanner
							betterThanOthers={sipHealth?.betterThanOthers}
							scorePercentile={sipHealth?.scorePercentile}
						/>
					{:else if sipHealth?.score >= SIP_HEALTH_SCORE_LIMIT_AVERAGE}
						<MidAndLowHealthScoreBanner
							betterThanOthers={sipHealth?.betterThanOthers}
							scorePercentile={sipHealth?.scorePercentile}
							title="Go for Greatness"
						/>
					{:else}
						<MidAndLowHealthScoreBanner
							betterThanOthers={sipHealth?.betterThanOthers}
							scorePercentile={sipHealth?.scorePercentile}
							title="SIP Health At Risk"
						/>
					{/if}
				</article>

				<article class="mt-6 px-4 pb-4 text-black-key md:px-6">
					<div class="text-sm">
						{sipHealth?.score >= SIP_HEALTH_SCORE_LIMIT_GOOD
							? 'Learn what makes your SIP health great'
							: 'Here is a detailed report for your SIP Health'}
					</div>

					{#each sipHealthDetails as detail}
						<section class="mt-4">
							<DetailItem sipHealthDetails={detail}>
								<svelte:fragment slot="footer">
									{#if detail?.showFooter}
										{#if detail?.footerType === 'AUTOPAY_SETUP'}
											<div class="mt-4 md:text-center">
												<ButtonMedium
													class="w-[90%] rounded md:w-60"
													onClick={redirectToAutopaySetup}
												>
													SET UP AUTOPAY
												</ButtonMedium>
											</div>
										{/if}
									{:else}
										<span />
									{/if}
								</svelte:fragment>

								<svelte:fragment slot="titleTag">
									{#if detail?.titleTag?.length}
										<div
											class="my-auto ml-2 rounded-br-sm rounded-tl-sm bg-green-amount px-1 py-0.5 text-[8px] font-medium leading-3 text-white"
										>
											{detail?.titleTag}
										</div>
									{:else}
										<span />
									{/if}
								</svelte:fragment>
							</DetailItem>
						</section>
					{/each}
				</article>

				<article class="border-t p-4 pb-0 text-center">
					<ButtonMedium
						class="!h-fit !min-h-0 !w-fit rounded md:w-60"
						variant="transparent"
						onClick={handleCueCardCtaClick}
					>
						{sipHealth?.score >= SIP_HEALTH_SCORE_LIMIT_GOOD
							? 'How is SIP health calculated?'
							: 'Improve your SIP Health'}
					</ButtonMedium>
				</article>
			</section>
		</section>
	{:else}
		<ErrorView
			heading="Something went wrong!"
			contentLine="SIP health details not found"
			textForButton="GO BACK"
			on:errorCTAClicked={handleErrorNavigation}
		/>
	{/if}
{/await}

<CueCardCarouselComponent
	bind:isModalOpen={showCarousel}
	{carouselItems}
	on:cueCardLoad={handleCueCardLoad}
	on:cueCardClose={handleCueCardClose}
/>
