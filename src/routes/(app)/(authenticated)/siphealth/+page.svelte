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
					footerType: 'AUTOPAY_SETUP'
				},
				{
					title: `${Math?.floor(
						sipHealthData?.pecrcentageOfInstalmentPaid
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

	const fetchSipHealthData = async () => {
		data?.api?.sipHealthData?.then((res: ISipHealth) => {
			sipHealthData = res;
		});
	};

	onMount(() => {
		fetchSipHealthData();
	});

	const redirectToAutopaySetup = () => {
		goto(`${base}/autopay/manage`);
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

				<SipHealthDetailsScoreNudge score={sipHealth?.score} class="border-b md:mt-4" />

				<article class="mt-6 px-4 md:px-6">
					{#if sipHealth?.score >= 68}
						<HighScoreHealhScoreBanner
							betterThanOthers={sipHealth?.betterThanOthers}
							scorePercentile={sipHealth?.scorePercentile}
						/>
					{:else if sipHealth?.score >= 41}
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
						{sipHealth?.score >= 68
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
							</DetailItem>
						</section>
					{/each}
				</article>

				<article class="border-t p-4 pb-0 text-center">
					<ButtonMedium
						class="!h-fit !min-h-0 !w-fit rounded md:w-60"
						variant="transparent"
						onClick={() => {
							// TODO: open cue card
						}}
					>
						{sipHealth?.score >= 65 ? 'How is SIP health calculated?' : 'IMPROVE your SIP Health'}
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
