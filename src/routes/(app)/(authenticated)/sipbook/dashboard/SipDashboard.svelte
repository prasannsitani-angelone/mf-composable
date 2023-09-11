<script lang="ts">
	import Link from '$components/Link.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getBankLogoUrl } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { PageData } from '../../../../$types';
	import NoSipScreen from './NoSipScreen.svelte';
	import SipCard from './SipCard.svelte';
	import SipSummary from './SipSummary.svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import type { IDueSips, ISip, ISipBookData, ISipBookSummary } from '$lib/types/ISipType';
	import {
		inactiveSipsButtonClickAnalytics,
		sipPaymentDueNudgeImpressionAnalytics,
		sipbookDashboardScreenOpenAnalytics
	} from '$lib/analytics/sipbook/sipbook';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { format } from 'date-fns';
	import type { INudge } from '$lib/types/INudge';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import SipBookAutoPayNudge from '$components/AutopaySetupTile/SipBookAutoPayNudge.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';

	const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips`;
	let showInactiveSipsCta = false;
	let sipbookSummary: ISipBookSummary;
	let sipBookData: ISipBookData;
	let normalSipsArray: ISip[] = [];
	let paymentSipsArray: ISip[] = [];
	let bankDetails = profileStore?.bankAccounts();
	let data: PageData;
	let nudgeData: INudge[];
	let automatedSipsCount = 0;

	$: sipBookData?.sips?.forEach((sip) => {
		if (sip?.isSipPaymentNudge) {
			paymentSipsArray.push(sip);
		} else {
			normalSipsArray.push(sip);
		}

		if (sip?.mandateRefId?.length) {
			automatedSipsCount++;
		}
	});
	$: paymentDueSips = paymentSipsArray;
	$: normalSips = normalSipsArray;

	const getSipbookSummary = async () => {
		await useFetch(sipUrl + '?summary=true')
			.then((res) => res.data)
			.then(({ data }) => {
				sipbookSummary = data?.summary;
				showInactiveSipsCta = sipbookSummary?.totalInActiveSip > 0;
			});
	};

	const getNudges = async () => {
		return await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/nudges`)
			.then((res) => res.data)
			.then(({ nudges }) => {
				nudgeData = nudges;
			});
	};

	const handleInactiveSipsClick = () => {
		inactiveSipsButtonClickAnalytics();
	};

	onMount(async () => {
		await Promise.allSettled([getNudges(), getSipbookSummary()]);
	});

	const sipPaymentDueNudgeImpressionAnalyticsFunc = () => {
		let dueSips: IDueSips[] = [];
		paymentDueSips?.forEach((sip) => {
			dueSips.push({
				FundName: sip?.schemeName,
				Amount: sip?.installmentAmount,
				SipPaymentDue: sip?.installmentAmount,
				SipDate: format(new Date(sip?.sipPaymentDate), 'dd-MMM-yyyy'),
				PayBefore: format(new Date(sip?.sipAmountPayTillDate), 'dd-MMM-yyyy')
			});
		});
		const eventMetaData = {
			dueSips
		};
		sipPaymentDueNudgeImpressionAnalytics(eventMetaData);
	};

	const sipbookDashboardScreenOpenAnalyticsFunc = () => {
		const eventMetaData = {
			ActiveSIPs: sipBookData?.sips?.length,
			MonthlySIPTotal: sipBookData?.bookOverView?.totalSipInstallmentAmount,
			AutomatedSips: automatedSipsCount,
			SipList: sipBookData?.sips?.map((sip) => ({
				FundName: sip?.schemeName,
				Amount: sip?.installmentAmount,
				NextSIPDate: getDateTimeString(sip?.nextSipDueDate, 'DATE', true)
			}))
		};
		sipbookDashboardScreenOpenAnalytics(eventMetaData);
	};

	onMount(() => {
		sipbookDashboardScreenOpenAnalyticsFunc();
	});
	$: if (paymentDueSips.length) {
		sipPaymentDueNudgeImpressionAnalyticsFunc();
	}

	export { sipBookData, data };

	const navigateToEMandate = (amount) => {
		const params = encodeObject({ amount: amount, showAlert: true });
		goto(`${base}/autopay/manage?params=${params}`);
	};
</script>

<section>
	{#if sipBookData?.sips?.length}
		<section>
			<!-- SIP Summary Section -->
			{#if sipBookData?.bookOverView}
				<SipSummary bookSummary={sipBookData?.bookOverView} {automatedSipsCount} />
			{/if}

			<!-- SIP Cards section -->
			<section>
				<!-- SIPs with payment due -->
				{#each paymentDueSips || [] as sip, index (sip?.sipId)}
					<SipCard {sip} bankLogo={getBankLogoUrl(bankDetails, sip?.accountNo)} />
					<!-- Nudges section -->
					{#if index === (paymentDueSips || [])?.length - 1}
						<section class="mb-2">
							{#each nudgeData || [] as nudge, idx (idx)}
								{#if nudge?.nudgesType === 'mandate'}
									<SipBookAutoPayNudge
										amount={nudge.amount}
										on:autoPayClick={() => {
											navigateToEMandate(nudge.amount);
										}}
									/>
								{/if}
							{/each}
						</section>
					{/if}
				{/each}

				<!-- Normal SIPs -->
				{#each normalSips || [] as sip, index (sip?.sipId)}
					<SipCard {sip} bankLogo={getBankLogoUrl(bankDetails, sip?.accountNo)} />
					<!-- Nudges section -->
					{#if !paymentDueSips?.length && index === 0}
						<section class="mb-2">
							{#each nudgeData || [] as nudge, idx (idx)}
								{#if nudge?.nudgesType === 'mandate'}
									<SipBookAutoPayNudge
										amount={nudge.amount}
										on:autoPayClick={() => {
											navigateToEMandate(nudge.amount);
										}}
									/>
								{/if}
							{/each}
						</section>
					{/if}
				{/each}
			</section>

			<!-- Inactive SIPs CTA section -->
			<Link to="/sipbook/inactivesips" on:linkClicked={handleInactiveSipsClick}>
				{#if showInactiveSipsCta}
					<section class="mt-8 cursor-default text-center text-sm font-semibold text-blue-primary">
						INACTIVE SIPs
					</section>
				{/if}
			</Link>
		</section>
	{:else}
		<NoSipScreen {data} {showInactiveSipsCta} />
	{/if}
</section>
