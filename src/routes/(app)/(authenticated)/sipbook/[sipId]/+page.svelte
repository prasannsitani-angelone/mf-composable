<script lang="ts">
	import { page } from '$app/stores';
	import BankAutopayCard from '$components/mandate/components/BankAutopayCard.svelte';
	import InvalidUrl from '$components/Error/InvalidUrl.svelte';
	import NudgeComponent from '$components/Nudge/NudgeComponent.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getBankLogoUrl } from '$lib/utils';
	import SipDetailsBasic from '../SipDetails/SipDetailsBasic.svelte';
	import SipHistory from '../SipDetails/SipHistory.svelte';
	import SipSchedule from '../SipDetails/SipSchedule.svelte';
	import type { PageData } from './$types';
	import HexagonalYellowWarningIcon from '$lib/images/icons/HexagonalYellowWarningIcon.svelte';
	import Button from '$components/Button.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import ConfirmationPopup from '$components/Popup/ConfirmationPopup.svelte';
	import { getEmandateDataFunc } from '$components/Payment/api';
	import DiscoverFundsNudge from '$components/Nudge/DiscoverFundsNudge.svelte';

	import { toastStore } from '$lib/stores/ToastStore';
	import {
		getDateTimeProperties,
		getDateTimeString,
		getNextMonthDate
	} from '$lib/utils/helpers/date';
	import SipDetailLoader from './SipDetailLoader.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import {
		cancelSipButtonClickAnalytics,
		sipCancelConfirmationModalOpenAnalytics,
		sipCancelFailureModalRetryButtonClickAnalytics,
		sipCancelledFailureModalOpenAnalytics,
		sipCancelledSuccessModalDoneButtonClickAnalytics,
		sipCancelledSuccessModalOpenAnalytics,
		skipSipButtonClickAnalytics,
		skipSipConfirmationModalOpenAnalytics,
		skipSipModalButtonClickAnalytics,
		skipSipSkippedSuccessModalOpenAnalytics,
		setupAutopayOnNudgeClickAnalytics,
		linkAutopayOnNudgeClickAnalytics,
		autopayNudgeImpressionAnalytics,
		switchAutopayClickAnalytics,
		switchAutopaySuccessImpressionAnalytics
	} from '$lib/analytics/sipbook/sipbook';
	import AutopaySelectionPopup from '$components/AutopaySelectionPopup.svelte';
	import type { ISip } from '$lib/types/ISipType';
	import { SEO } from 'svelte-components';
	import WmsIcon from '$components/WMSIcon.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import type { IInvestmentTypeSIP } from '$lib/types/ISipType';
	import type { MandateWithBankDetails } from '$lib/types/IEmandate';
	import SipBookAutoPayNudge from '$components/AutopaySetupTile/SipBookAutoPayNudge.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import PageTitle from '$components/PageTitle.svelte';

	$: bankDetails = $profileStore?.bankDetails;
	let showCancelSipActionModal = false;
	let showSuccessModal = false;
	let showFailureModal = false;
	let showSkipModal = false;
	let showSkipSuccessModal = false;
	let showSkipFailureModal = false;
	let disableConfirmCancelSip = false;
	let disableConfirmSkipSip = false;
	$: bottomHeight = 128;
	const maxTransactionsCap = 6;

	let showAutopaySelectionLoader = false;
	let mandateList: MandateWithBankDetails[] = [];
	let selectedMandate: MandateWithBankDetails;
	let bankPopupVisible = false;
	let autopayType: 'switch' | 'link' = 'switch';

	$: profileData = $page?.data?.profile;

	const bankAccNumToLogoMap = () => {
		const accNumToLogoMap = {};
		const bankList = profileData.bankDetails;

		(bankList || []).forEach((bank: BankDetailsEntity) => {
			accNumToLogoMap[bank.accNO] = bank.bankLogo;
		});

		return accNumToLogoMap;
	};

	const getAllMandates = (madateMap: { [propKey: string]: MandateWithBankDetails }) => {
		const all = (Object.values(madateMap) || []).flat();
		return all;
	};

	const createMandateWithBankList = async (sipData: IInvestmentTypeSIP) => {
		if (mandateList && Array.isArray(mandateList) && mandateList.length > 0) {
			return mandateList;
		}
		const accNumToLogoMap = bankAccNumToLogoMap();
		const emandateResponse = await getEmandateDataFunc({
			amount: sipData?.installmentAmount,
			sipDate: new Date(sipData.nextSipDueDate)
		});
		mandateList = getAllMandates(emandateResponse?.data);
		mandateList = mandateList.map((mandate) => {
			const updatedMandate = {
				...mandate,
				bankLogo: accNumToLogoMap[mandate.accountNo]
			};
			if (sipData.mandateRefId === mandate.mandateId) {
				selectedMandate = updatedMandate;
			}
			return updatedMandate;
		});
		return mandateList;
	};

	const orderPurchasePatchFunc = async (
		sipData: IInvestmentTypeSIP,
		selected: MandateWithBankDetails
	) => {
		const emandateId = selected?.mandateId;
		const sipID = sipData?.sipId;

		showAutopaySelectionLoader = true;
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/${sipID}`;
			const res = await useFetch(url, {
				method: 'PATCH',
				body: JSON.stringify({
					emandateId
				})
			});
			showAutopaySelectionLoader = false;
			hideAutopaySelectionPopup();
			if (res.data?.status === 'success') {
				toastStore.updateToastQueue({
					type: 'SUCCESS',
					message: `Autopay ${autopayType}ed.`,
					class: '!justify-start'
				});
				const eventMetaData = {
					FundName: sipData.schemeName,
					ISINCode: sipData.isin,
					'SIP Schedule': {
						'Installment Amount': sipData.installmentAmount,
						'Next SIP Payment': getDateTimeString(sipData.nextSipDueDate, 'DATE', true)
					},
					'Bank Name': selected.bankName
				};
				selectedMandate = selected;
				switchAutopaySuccessImpressionAnalytics(eventMetaData);
				invalidate('skipsip');
			} else {
				toastStore.updateToastQueue({
					type: 'SUCCESS',
					message: `Unable to ${autopayType} autopay. Try again after sometime.`,
					class: '!justify-start'
				});
			}
		} catch (e) {
			return;
		} finally {
			showAutopaySelectionLoader = false;
		}
	};

	const onAccountChange = async (selected: MandateWithBankDetails, sipData: IInvestmentTypeSIP) => {
		await orderPurchasePatchFunc(sipData, selected);
	};

	const showAutopaySelectionPopup = (sipData: IInvestmentTypeSIP) => {
		bankPopupVisible = true;
		const eventMetaData = {
			FundName: sipData.schemeName,
			ISINCode: sipData.isin,
			'SIP Schedule': {
				'Installment Amount': sipData.installmentAmount,
				'Next SIP Payment': getDateTimeString(sipData.nextSipDueDate, 'DATE', true)
			},
			'Bank Name': sipData.bankName
		};
		switchAutopayClickAnalytics(eventMetaData);
	};
	const hideAutopaySelectionPopup = () => {
		bankPopupVisible = false;
	};

	const toggleShowCancelSipActionModal = () => {
		showCancelSipActionModal = !showCancelSipActionModal;
		if (showCancelSipActionModal) {
			cancelSipButtonClickAnalytics();
			sipCancelConfirmationModalOpenAnalytics({
				value:
					'Cancelling will stop ALL your upcoming investments in this SIP, Proceed to Cancel? (YES CANCEL)/(NO)'
			});
		}
	};

	const toggleShowSuccessModal = () => {
		showSuccessModal = !showSuccessModal;
		if (showSuccessModal) {
			sipCancelledSuccessModalOpenAnalytics();
		}
	};

	const toggleSkipSuccessModal = (sipData: ISip) => {
		showSkipSuccessModal = !showSkipSuccessModal;
		if (showSkipSuccessModal) {
			skipSipSkippedSuccessModalOpenAnalytics({
				value: `SIP Instalment skipped,Your SIP instalment for ${sipData?.schemeName} for ${
					getDateTimeProperties(sipData?.nextSipDueDate).month
				} ${
					getDateTimeProperties(sipData?.nextSipDueDate).year
				} will be skipped. Next SIP order is scheduled for ${getNextMonthDate(
					sipData?.nextSipDueDate
				)}`
			});
		}
	};

	const toggleSkipFailureModal = () => {
		showSkipFailureModal = !showSkipFailureModal;
	};

	const toggleShowFailureModal = () => {
		showFailureModal = !showFailureModal;
		if (showFailureModal) {
			sipCancelledFailureModalOpenAnalytics({
				value: 'We could not cancel your SIP due to technical error, Please try again.'
			});
		}
	};

	const toggleShowSkipModal = () => {
		showSkipModal = !showSkipModal;
		if (showSkipModal) {
			skipSipButtonClickAnalytics();
			skipSipConfirmationModalOpenAnalytics();
		}
	};

	const handleCancelSip = async () => {
		disableConfirmCancelSip = true;
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${data?.sipId}`;
		const res = await useFetch(sipUrl, { method: 'DELETE' });
		toggleShowCancelSipActionModal();
		if (res.ok && res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			toggleShowSuccessModal();
		} else {
			toggleShowFailureModal();
		}
		disableConfirmCancelSip = false;
	};

	const handleSkipSip = async (nextSipDueDate: number, sipData: ISip) => {
		disableConfirmSkipSip = true;
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${data?.sipId}`;
		const res = await useFetch(sipUrl, {
			method: 'PATCH',
			body: JSON.stringify({
				action: 'skip',
				nextSipDueDate: nextSipDueDate
			})
		});
		toggleShowSkipModal();
		skipSipModalButtonClickAnalytics({
			value: 'Yes, Skip'
		});
		if (res.ok && res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			toggleSkipSuccessModal(sipData);
		} else {
			toggleSkipFailureModal();
		}
		disableConfirmSkipSip = false;
	};

	const handleFailureModalCta = () => {
		toggleShowFailureModal();
		sipCancelFailureModalRetryButtonClickAnalytics();
	};

	const handleSuccessModalCta = () => {
		toggleShowSuccessModal();
		sipCancelledSuccessModalDoneButtonClickAnalytics();
		goto(`${base}/sipbook/dashboard`);
	};

	const onAction = (sipData: IInvestmentTypeSIP) => {
		autopayType = 'link';
		showAutopaySelectionPopup(sipData);
	};

	const linkSipNudgeDescription =
		'Linking your SIP with an existing autopay will automate all your future instalments for this SIP.';
	const setupNudgeDescription =
		'Set up an eMandate with your bank to enable Autopay. This is a one-time process';
	const setupAutopayHeading = 'SET UP AUTOPAY';
	const linkAutopayHeading = 'LINK AUTOPAY';

	const nudgeClick = (sipData: IInvestmentTypeSIP, isLinkAutopayNudge: boolean) => {
		const eventMetaData = {
			FundName: sipData.schemeName,
			'SIP Schedule': {
				'Installment Amount': sipData.installmentAmount,
				'Next SIP Payment': getDateTimeString(sipData.nextSipDueDate, 'DATE', true)
			},
			'Bank Name': ''
		};
		if (isLinkAutopayNudge) {
			eventMetaData.ISINCode = sipData.isin;
			linkAutopayOnNudgeClickAnalytics(eventMetaData);
		} else {
			setupAutopayOnNudgeClickAnalytics(eventMetaData);
		}
	};

	const nudgeImpression = (sipData: IInvestmentTypeSIP, isLinkAutopayNudge: boolean) => {
		const eventMetaData = {
			Message: setupNudgeDescription,
			Bankname: '',
			Autopaytype: '',
			type: 'SetupAutopay'
		};

		if (isLinkAutopayNudge) {
			eventMetaData.type = 'LinkAutopay';
			eventMetaData.Message = linkSipNudgeDescription;
		}
		autopayNudgeImpressionAnalytics(eventMetaData);
	};

	export let data: PageData;
</script>

<SEO
	seoTitle="SIP Details | Angel One"
	seoDescription="Get your sip details with one click including sip id, amount etc."
/>
<header class="hidden sm:block">
	<PageTitle title="SIP Details" class="mb-4 flex" />
</header>
{#await data?.api?.getSipData}
	<SipDetailLoader />
{:then sipData}
	{#if sipData}
		<article class="mb-36">
			{#if !sipData?.mandateRefId}
				{#await createMandateWithBankList(sipData) then mandateList}
					{@const nudgeData = {
						description: mandateList.length > 0 ? linkSipNudgeDescription : setupNudgeDescription,
						heading: 'Automate Future SIP Payments',
						link: '/autopay/manage',
						linkHeading: mandateList.length > 0 ? linkAutopayHeading : setupAutopayHeading,
						type: 'warn'
					}}
					<SipBookAutoPayNudge
						amount={sipData.installmentAmount}
						on:autoPayClick={() => {
							if (mandateList.length > 0) {
								onAction(sipData);
							} else {
								const params = encodeObject({ amount: sipData.installmentAmount, showAlert: true });
								goto(`${base}/autopay/manage?params=${params}`);
							}
						}}
					/>
					{#if false}
						<DiscoverFundsNudge
							nudge={nudgeData}
							onAction={mandateList.length > 0 ? () => onAction(sipData) : null}
							clickEvent={() => nudgeClick(sipData, mandateList.length > 0)}
							impressionEvent={() => nudgeImpression(sipData, mandateList.length > 0)}
							class="mb-2 sm:mt-4"
						/>
					{/if}
				{/await}
			{/if}

			<SipDetailsBasic
				schemeName={sipData?.schemeName}
				schemePlan={sipData?.schemePlan}
				logoUrl={sipData?.logoUrl}
				isin={sipData?.isin}
				schemeCode={sipData?.schemeCode}
			/>
			<SipSchedule
				amount={sipData?.installmentAmount}
				nextSipDateTs={sipData?.nextSipDueDate}
				class="mt-2"
			/>

			{#if sipData?.accountNo}
				<BankAutopayCard
					bankAccountNumber={sipData?.accountNo}
					bankName={sipData?.bankName}
					bankLogo={getBankLogoUrl(bankDetails, sipData?.accountNo)}
					class="mt-2"
				>
					<svelte:fragment slot="footer">
						{#await createMandateWithBankList(sipData)}
							<SkeletonWrapper class=" mt-2 flex justify-end border-t pt-3">
								<SkeletonRectangle class="h-4 w-24" />
							</SkeletonWrapper>
						{:then mandateList}
							{#if mandateList.length > 1}
								<div class=" mt-2 border-t pt-1 text-right">
									<Button
										onClick={() => {
											autopayType = 'switch';
											showAutopaySelectionPopup(sipData);
										}}
										variant="transparent"
										size="xs"
										class="!h-auto min-h-fit !px-0 text-xs font-semibold text-blue-primary"
										>SWITCH AUTOPAY</Button
									>
								</div>
							{/if}
						{/await}
					</svelte:fragment>
				</BankAutopayCard>
			{/if}

			{#if bankPopupVisible}
				<AutopaySelectionPopup
					{mandateList}
					{selectedMandate}
					onMandateChange={(choosenMandate) => onAccountChange(choosenMandate, sipData)}
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
				</AutopaySelectionPopup>
			{/if}

			<SipHistory
				sipId={sipData?.sipId}
				sipOrderHistory={sipData?.sipOrderHistory}
				sipCreatedTs={sipData?.createdTs}
				maxTxnShowCount={maxTransactionsCap}
				class="!max-w-full"
			/>

			<section style={`bottom: ${bottomHeight}px`} class={`w-full`}>
				{#if sipData?.isSipInprocess}
					<NudgeComponent
						nudgeText="Your SIP order is already in progress. Skip and cancel are not available."
						nudgeClasses={`m-4 mb-2`}
					>
						<svelte:fragment slot="nudgeIcon">
							<HexagonalYellowWarningIcon class="mr-3" />
						</svelte:fragment>
					</NudgeComponent>
				{/if}

				{#if sipData?.installmentSkip}
					<NudgeComponent
						nudgeText="You have already skipped your next SIP instalment."
						nudgeClasses={`m-4 mb-2`}
					>
						<svelte:fragment slot="nudgeIcon">
							<HexagonalYellowWarningIcon class="mr-3" />
						</svelte:fragment>
					</NudgeComponent>
				{/if}

				{#if sipData?.isSipPaymentNudge}
					<NudgeComponent
						nudgeText={`Please complete the payment for your current SIP instalment. Skip will be available after ${getDateTimeString(
							sipData?.sipAmountPayTillDate,
							'DATE',
							true
						)}.`}
						nudgeClasses={`m-4 mb-2`}
					>
						<svelte:fragment slot="nudgeIcon">
							<HexagonalYellowWarningIcon class="mr-3" />
						</svelte:fragment>
					</NudgeComponent>
				{/if}
			</section>

			<section
				bind:offsetHeight={bottomHeight}
				class="fixed inset-0 top-auto block bg-white px-4 py-3 md:hidden"
			>
				{#if sipData?.sipType === 'SIP'}
					{@const isSkipSipDisabled =
						sipData?.isSipInprocess ||
						sipData?.installmentSkip ||
						sipData?.isSipPaymentNudge ||
						false}
					<Button
						size="md"
						variant={`${isSkipSipDisabled ? 'outlined' : 'contained'}`}
						class={`mb-2 w-full ${
							isSkipSipDisabled
								? 'pointer-events-none !cursor-not-allowed border-grey-disabled !bg-white !text-grey-disabled'
								: ''
						}`}
						onClick={toggleShowSkipModal}>SKIP NEXT INSTALMENT</Button
					>
				{/if}
				<Button
					size="md"
					variant="transparent"
					class={`bottom-0  w-full ${
						sipData?.isSipInprocess
							? 'pointer-events-none !cursor-not-allowed !bg-white !text-grey-disabled'
							: ''
					}`}
					onClick={toggleShowCancelSipActionModal}
				>
					CANCEL SIP
				</Button>
			</section>

			<!-- CANCEL MODAL -->
			<ConfirmationPopup
				closeModal={toggleShowCancelSipActionModal}
				isModalOpen={showCancelSipActionModal}
				confirm={handleCancelSip}
				title="Cancel SIP?"
				confirmButtonDisable={disableConfirmCancelSip}
				confirmButtonTitle="YES, CANCEL"
			/>

			<!-- SKIP MODAL -->
			<ConfirmationPopup
				closeModal={() => {
					toggleShowSkipModal();
					skipSipModalButtonClickAnalytics({
						value: 'No'
					});
				}}
				isModalOpen={showSkipModal}
				confirm={() => handleSkipSip(sipData?.nextSipDueDate, sipData)}
				titleClass="!font-medium"
				title="Skip Next SIP Instalment?"
				confirmButtonTitle="YES, SKIP"
				confirmButtonDisable={disableConfirmSkipSip}
			>
				<svelte:fragment slot="body">
					<p class="font-normal text-grey-body">
						Your SIP instalment <span class="font-medium text-black-title"
							>for {getDateTimeProperties(sipData?.nextSipDueDate).month}
							{getDateTimeProperties(sipData?.nextSipDueDate).year}</span
						> will be skipped. Skip instalment?
					</p>
				</svelte:fragment>
			</ConfirmationPopup>

			<!-- CANCEL MODAL SUCCESS FAILURE POPUPS -->
			<ResultPopup
				closeModal={toggleShowSuccessModal}
				isModalOpen={showSuccessModal}
				popupType={STATUS_ARR.SUCCESS}
				title="SIP Cancelled"
				text={`You have cancelled your SIP for ${sipData?.schemeName}`}
				buttonTitle="DONE"
				class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-blue-primary rounded !bg-white !text-blue-primary cursor-default md:cursor-pointer"
				handleButtonClick={handleSuccessModalCta}
			/>

			<ResultPopup
				closeModal={toggleShowFailureModal}
				isModalOpen={showFailureModal}
				popupType={STATUS_ARR.FAILURE}
				title="Cancellation Error"
				text="We could not cancel your SIP due to a tecnhical error. Please try again"
				buttonTitle="RETRY"
				class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-blue-primary rounded !bg-white !text-blue-primary cursor-default md:cursor-pointer"
				handleButtonClick={handleFailureModalCta}
			/>

			<!-- SKIP SIP MODAL SUCCESS FAILURE POPUPS -->
			<ResultPopup
				closeModal={toggleSkipSuccessModal}
				isModalOpen={showSkipSuccessModal}
				popupType={STATUS_ARR.SUCCESS}
				buttonTitle="DONE"
				class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-blue-primary rounded !bg-white !text-blue-primary cursor-default md:cursor-pointer"
				handleButtonClick={() => {
					invalidate('skipsip');
					showSkipSuccessModal = false;
				}}
			>
				<svelte:fragment slot="popupBody">
					<article class="mt-6 text-center">
						<div class={`text-2xl font-medium text-black-title`}>SIP Instalment Skipped</div>

						<div class={`mt-3 text-sm font-normal text-grey-body`}>
							Your SIP instalment for {sipData?.schemeName}
							<span class="font-medium text-black-title"
								>for {getDateTimeProperties(sipData?.nextSipDueDate).month}
								{getDateTimeProperties(sipData?.nextSipDueDate).year}</span
							>
							will be skipped. Next SIP order is scheduled for {getNextMonthDate(
								sipData?.nextSipDueDate
							)}
						</div>
					</article>
				</svelte:fragment>
			</ResultPopup>

			<ResultPopup
				closeModal={toggleSkipFailureModal}
				isModalOpen={showSkipFailureModal}
				popupType={STATUS_ARR.FAILURE}
				title="Something Went Wrong"
				text="We could not process your skip request due to a technical error. Please try again"
				buttonTitle="RETRY"
				class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-blue-primary rounded !bg-white !text-blue-primary cursor-default md:cursor-pointer"
				handleButtonClick={toggleSkipFailureModal}
			/>
		</article>
	{:else}
		<InvalidUrl />
	{/if}
{:catch}
	<InvalidUrl />
{/await}
