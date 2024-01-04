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
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import SipBookAutoPayNudge from '$components/AutopaySetupTile/SipBookAutoPayNudge.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import SipHealthNudge from '$components/SipHealth/Nudge/SipHealthNudge.svelte';
	import { sipScoreViewDetailsCtaClickAnalytics } from '$lib/analytics/siphealth/siphealth';
	import { ctNudgeStore } from '$lib/stores/CtNudgeStore';
	import ClevertapNudgeComponent from '$components/clevertap/ClevertapNudgeComponent.svelte';
	import Clevertap from '$lib/utils/Clevertap';
	import { page } from '$app/stores';
	import DiscoverFundsNudge from '$components/Nudge/DiscoverFundsNudge.svelte';
	import AutopaySelectionPopup from '$components/AutopaySelectionPopup.svelte';
	import type { MandateWithBankDetails } from '$lib/types/IEmandate';
	import { toastStore } from '$lib/stores/ToastStore';
	import WmsIcon from '$components/WMSIcon.svelte';

	const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips`;
	let showInactiveSipsCta = false;
	let sipbookSummary: ISipBookSummary;
	let sipBookData: ISipBookData;
	let updatedSipList: ISip = sipBookData?.sips || [];
	let normalSipsArray: ISip[] = [];
	let paymentSipsArray: ISip[] = [];
	let bankDetails = profileStore?.bankAccounts();
	let data: PageData;
	let nudgeData: INudge[];
	let automatedSipsCount = 0;

	$: isMobile = $page?.data?.deviceType?.isMobile;

	const resetSipData = () => {
		normalSipsArray = [];
		paymentSipsArray = [];
		automatedSipsCount = 0;
	};

	const setSipLists = (sipList: ISip[] = []) => {
		resetSipData();

		(sipList || sipBookData?.sips || [])?.forEach((sip) => {
			if (sip?.isSipPaymentNudge) {
				paymentSipsArray.push(sip);
			} else {
				normalSipsArray.push(sip);
			}

			if (sip?.mandateRefId?.length) {
				automatedSipsCount++;
			}
		});

		paymentSipsArray?.sort((a) => (a?.sipPaymentMonthNudge ? 1 : -1));
	};

	$: setSipLists();
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
				setSipCardNudges();
			});
	};

	const setSipCardNudges = () => {
		updatedSipList = sipBookData?.sips;
		sipBookData?.sips?.forEach((sip, index) => {
			nudgeData?.forEach((nudge) => {
				if (nudge?.nudgesType === 'SIP_TWENTY_DAY_NUDGE' && sip?.sipId === nudge?.data?.sipId) {
					updatedSipList[index].isSipPaymentNudge = true;
					updatedSipList[index].sipPaymentMonthNudge = true;
					updatedSipList[index].sipInstalmentId = (nudge?.data?.orderID || '')?.toString();
					updatedSipList[index].orderDate = nudge?.data?.orderDate;
				}
			});
		});

		setSipLists(updatedSipList);
	};

	const handleInactiveSipsClick = () => {
		inactiveSipsButtonClickAnalytics();
	};

	const initializeClevertapData = async () => {
		const cleavertap = await Clevertap.initialized;
		cleavertap.event.push('MF SIP Book', {
			event_type: 'impression'
		});
	};

	onMount(async () => {
		await Promise.allSettled([getNudges(), getSipbookSummary()]);

		await initializeClevertapData();
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

	const handleViewReportCtaClick = () => {
		sipScoreViewDetailsCtaClickAnalytics();
	};

	let mandateList: MandateWithBankDetails[] = [];
	let selectedMandate: MandateWithBankDetails;
	let bankPopupVisible = false;
	let selectedSip: ISip;
	let showAutopaySelectionLoader = false;

	const createMandateWithBankList = async () => {
		let mandateList: MandateWithBankDetails[] = [];

		mandateList = await data?.api?.getMandates({
			amount: selectedSip?.installmentAmount,
			sipDate: new Date(selectedSip.nextSipDueDate)
		});

		selectedMandate = mandateList.find((mandate) => {
			return selectedSip.mandateRefId === mandate.mandateId;
		});

		return mandateList;
	};

	const showAutopaySelectionPopup = async (sip: ISip) => {
		selectedSip = sip;
		mandateList = await createMandateWithBankList();
		bankPopupVisible = true;
	};

	const hideAutopaySelectionPopup = () => {
		bankPopupVisible = false;
	};

	const orderPurchasePatchFunc = async (sipData: ISip, selected: MandateWithBankDetails) => {
		const emandateId = selected?.mandateId;
		const mandateAmount = selected?.availableAmount;

		showAutopaySelectionLoader = true;
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/bulk`;
			const res = await useFetch(url, {
				method: 'PATCH',
				body: JSON.stringify({
					emandateId,
					mandateAmount
				})
			});
			showAutopaySelectionLoader = false;
			hideAutopaySelectionPopup();
			if (res.data?.status === 'success') {
				toastStore.updateToastQueue({
					type: 'SUCCESS',
					message: `Autopay Linked.`,
					class: '!justify-start'
				});
				await invalidate(`app:sipbook`);
			} else {
				toastStore.updateToastQueue({
					type: 'SUCCESS',
					message: `Unable to link autopay. Try again after sometime.`,
					class: '!justify-start'
				});
			}
		} catch (e) {
			return;
		} finally {
			showAutopaySelectionLoader = false;
		}
	};
</script>

<section>
	{#if sipBookData?.sips?.length}
		<section class="mb-24 grid grid-cols-[100%] sm:grid-cols-[70%_30%] sm:gap-x-5">
			<!-- SIP Summary Section -->
			<div class="col-start-1 row-start-1 h-min sm:col-start-2">
				{#if sipBookData?.bookOverView}
					<SipSummary bookSummary={sipBookData?.bookOverView} {automatedSipsCount} />
				{/if}

				{#if $ctNudgeStore?.kv?.topic === 'mf_sips_inpage1_type_d' || (['mf_sips_bottomsticky_type_b', 'mf_sips_bottomsticky_type_c', 'mf_sips_bottomsticky_type_d'].includes($ctNudgeStore?.kv?.topic) && !isMobile)}
					<ClevertapNudgeComponent
						class="mb-2 w-full items-center rounded-lg"
						data={$ctNudgeStore}
						on:onCTAClicked={(e) => goto(e.detail.url)}
					/>
				{/if}

				<SipHealthNudge class="mb-2" on:viewReport={handleViewReportCtaClick} />
			</div>

			<!-- SIP Cards section -->
			<section class="col-start-1 row-start-2 sm:row-start-1">
				<!-- SIPs with payment due -->
				{#each paymentDueSips || [] as sip, index (sip?.sipId)}
					<SipCard {sip} bankLogo={getBankLogoUrl(bankDetails, sip?.accountNo)} />
					<!-- Nudges section -->
					{#if index === (paymentDueSips || [])?.length - 1}
						<section class="mb-2">
							{#each nudgeData || [] as nudge, idx (idx)}
								{#if nudge?.nudgesType === 'mandate'}
									<SipBookAutoPayNudge
										heading={nudge.heading}
										description={nudge.description}
										amount={nudge.amount}
										on:autoPayClick={() => {
											navigateToEMandate(nudge.amount);
										}}
									/>
								{:else if nudge?.nudgesType === 'link_mandate'}
									<DiscoverFundsNudge
										{nudge}
										onAction={() => showAutopaySelectionPopup(sip)}
										class="mb-2 sm:mt-4"
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
										heading={nudge.heading}
										description={nudge.description}
										amount={nudge.amount}
										on:autoPayClick={() => {
											navigateToEMandate(nudge.amount);
										}}
									/>
								{:else if nudge?.nudgesType === 'link_mandate'}
									{'normalSips'}
									<DiscoverFundsNudge
										{nudge}
										onAction={() => showAutopaySelectionPopup(sip)}
										class="mb-2 sm:mt-4"
									/>
								{/if}
							{/each}
						</section>
					{/if}
				{/each}
			</section>

			<!-- Inactive SIPs CTA section -->
			<Link
				to="/sipbook/inactivesips"
				on:linkClicked={handleInactiveSipsClick}
				class="col-start-1 row-start-3 sm:row-start-2"
			>
				{#if showInactiveSipsCta}
					<section class="mt-8 cursor-default text-center text-sm font-medium text-blue-primary">
						INACTIVE SIPs
					</section>
				{/if}
			</Link>
		</section>
	{:else}
		{#if $ctNudgeStore?.kv?.topic === 'mf_sips_inpage1_type_d' || (['mf_sips_bottomsticky_type_b', 'mf_sips_bottomsticky_type_c', 'mf_sips_bottomsticky_type_d'].includes($ctNudgeStore?.kv?.topic) && !isMobile)}
			<ClevertapNudgeComponent
				class="mb-4 w-full items-center rounded-lg"
				data={$ctNudgeStore}
				on:onCTAClicked={(e) => goto(e.detail.url)}
			/>
		{/if}
		<NoSipScreen {data} {showInactiveSipsCta} />
	{/if}

	{#if ['mf_sips_bottomsticky_type_b', 'mf_sips_bottomsticky_type_c', 'mf_sips_bottomsticky_type_d'].includes($ctNudgeStore?.kv?.topic) && isMobile}
		<ClevertapNudgeComponent
			class="fixed bottom-18 -ml-2 flex w-full items-center"
			data={$ctNudgeStore}
			on:onCTAClicked={(e) => goto(e.detail.url)}
		/>
	{/if}
</section>

{#if bankPopupVisible}
	<AutopaySelectionPopup
		{mandateList}
		{selectedMandate}
		onMandateChange={async (choosenMandate) => {
			await orderPurchasePatchFunc(selectedSip, choosenMandate);
		}}
		onClose={hideAutopaySelectionPopup}
		class=" relative"
	>
		<svelte:fragment slot="loader">
			{#if showAutopaySelectionLoader}
				<div class="absolute inset-0 flex items-center justify-center">
					<WmsIcon class=" !h-24 !w-24" name="loading-indicator" />
				</div>
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="infoText">
			<div class="ml-3 text-sm font-normal text-grey-body">
				If your SIP order is already in progress, autopay will be used from the next instalment.
				Only Autopays with limit above your SIP amount are listed here
			</div>
		</svelte:fragment>
	</AutopaySelectionPopup>
{/if}
