<script lang="ts">
	import { page } from '$app/stores';
	import BankAutopayCard from '$components/mandate/components/BankAutopayCard.svelte';
	import InvalidUrl from '$components/Error/InvalidUrl.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getBankLogoUrl } from '$lib/utils';
	import SipDetailsBasic from '../SipDetails/SipDetailsBasic.svelte';
	import SipHistory from '../SipDetails/SipHistory.svelte';
	import SipSchedule from '../SipDetails/SipSchedule.svelte';
	import type { PageData } from './$types';
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
	import DropDownOptions from './DropDownOptions.svelte';

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
		switchAutopaySuccessImpressionAnalytics,
		sipCancelStayInvestedButtonClickAnalytics,
		sipDetailsCancelSipOptionClickAnalytics,
		skipSipSuccessModalClickDone,
		clickOnEditSipAnalytics,
		clickOnThreeDots
	} from '$lib/analytics/sipbook/sipbook';
	import AutopaySelectionPopup from '$components/AutopaySelectionPopup.svelte';
	import type { ISip } from '$lib/types/ISipType';
	import { Modal, SEO, WMSIcon } from 'svelte-components';
	import WmsIcon from '$components/WMSIcon.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import type { IInvestmentTypeSIP } from '$lib/types/ISipType';
	import type { MandateWithBankDetails } from '$lib/types/IEmandate';
	import SipBookAutoPayNudge from '$components/AutopaySetupTile/SipBookAutoPayNudge.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import PageTitle from '$components/PageTitle.svelte';
	import { onMount } from 'svelte';
	import CancelSip from '$components/Sip/CancelSip.svelte';
	import EditSip from './EditSip.svelte';
	import { sipBookStore } from '$lib/stores/SipBookStore';
	import clickOutside from '$lib/utils/useClickOutside';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';

	$: bankDetails = $profileStore?.bankDetails;
	let showCancelSipModal = false;
	let showCancelSipActionModal = false;
	let showSuccessModal = false;
	let showFailureModal = false;
	let showSkipModal = false;
	let showSkipSuccessModal = false;
	let showSkipFailureModal = false;
	let disableConfirmCancelSip = false;
	let disableConfirmSkipSip = false;
	let showEditSipModal = false;
	$: bottomHeight = 128;
	const maxTransactionsCap = 5;

	let showAutopaySelectionLoader = false;
	let mandateList: MandateWithBankDetails[] = [];
	let selectedMandate: MandateWithBankDetails;
	let bankPopupVisible = false;
	let autopayType: 'switch' | 'link' = 'switch';
	let selectedSipCancelReasonText = '';
	let showOptions = false;

	$: profileData = $page?.data?.profile;
	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	const { isExternal = false, showEditSip = false } = $page.data.urlSource;

	const autopayRedirectParams = () =>
		encodeObject({
			acc: bankDetails?.[0]?.accNO
		});

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

	const toggleShowCancelSipModal = (stayInvestedButtonClicked = false) => {
		showCancelSipModal = !showCancelSipModal;

		if (stayInvestedButtonClicked) {
			sipCancelStayInvestedButtonClickAnalytics();
		}
	};
	const handleCancelSipEntryPointClick = () => {
		showEditSipModal = false;
		if (isMobile || isTablet) {
			goto(`${base}/sipbook/${data?.sipId}-cancel`);
		} else {
			toggleShowCancelSipModal();
		}

		sipDetailsCancelSipOptionClickAnalytics();
	};

	const toggleShowCancelSipActionModal = () => {
		showCancelSipActionModal = !showCancelSipActionModal;
		if (showCancelSipActionModal) {
			cancelSipButtonClickAnalytics({
				ReasonName: selectedSipCancelReasonText
			});
			sipCancelConfirmationModalOpenAnalytics({
				value:
					'Cancelling will stop ALL your upcoming investments in this SIP, Proceed to Cancel? (YES CANCEL)/(NO)'
			});
		}
	};

	const handleCancelSipClick = (reason = '') => {
		selectedSipCancelReasonText = reason;
		toggleShowCancelSipModal();
		toggleShowCancelSipActionModal();
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
				)}`,
				fundName: sipData?.schemeName,
				amount: sipData?.installmentAmount
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
		showEditSipModal = false;
		showSkipModal = !showSkipModal;
		if (showSkipModal) {
			skipSipButtonClickAnalytics();
			skipSipConfirmationModalOpenAnalytics();
		}
	};

	const handleCancelSip = async () => {
		disableConfirmCancelSip = true;
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${data?.sipId}`;
		const res = await useFetch(sipUrl, {
			method: 'DELETE',
			headers: {
				'x-cancel-reason': selectedSipCancelReasonText
			}
		});
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
			value: 'Yes, Skip',
			fundName: sipData?.schemeName,
			amount: sipData?.installmentAmount
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

	const scrollToTop = () => {
		document?.getElementsByTagName?.('main')?.[0]?.scrollTo(0, 0);
	};

	onMount(() => {
		if (isExternal) {
			showEditSipModal = showEditSip;
		}
		scrollToTop();
		sipBookStore.updateStore({ showdropdown: false });
	});

	const handleLinkAutopayCtaClick = () => {
		goto(`${base}/autopay/manage/setup?params=${autopayRedirectParams()}`);
	};
	const onOptionSelect = (event: { detail: { key: any } }) => {
		updateSipBookStore();
		const { key } = event.detail;
		key === 'skipSip'
			? toggleShowSkipModal()
			: key === 'editSip'
			? editSipShowModal()
			: handleCancelSipEntryPointClick();
	};

	const editSipShowModal = () => {
		showEditSipModal = !showEditSipModal;
		if (showEditSipModal) {
			clickOnEditSipAnalytics();
		}
	};
	const updateSipBookStore = () => {
		showOptions = !$sipBookStore.showdropdown;
		if (showOptions) {
			clickOnThreeDots();
		}
		sipBookStore.updateStore({ showdropdown: showOptions });
	};
</script>

<article>
	<SEO
		seoTitle="SIP Details | Angel One"
		seoDescription="Get your sip details with one click including sip id, amount etc."
	/>
	{#if (!isMobile && !isTablet) || !showEditSipModal}
		<header class="hidden sm:block">
			<PageTitle
				title="SIP Details"
				source="sipBook"
				class="mb-4 flex bg-background-alt"
				on:onHeaderButtonClick={updateSipBookStore}
			/>
		</header>
		{#await data?.api?.getSipData}
			<SipDetailLoader />
		{:then sipData}
			{#if sipData}
				<ModalWithAnimation
					isModalOpen={$sipBookStore.showdropdown && (isMobile || isTablet)}
					closeModal={updateSipBookStore}
				>
					<DropDownOptions
						isSipInprocess={sipData?.isSipInprocess}
						installmentSkip={sipData?.installmentSkip}
						isSipPaymentNudge={sipData?.isSipPaymentNudge}
						sipType={sipData?.sipType}
						packId={sipData?.packId}
						on:onButtonClick={onOptionSelect}
					/>
				</ModalWithAnimation>
				{#if $sipBookStore.showdropdown && !isMobile && !isTablet}
					<div
						class="relative flex flex-col rounded-lg bg-background-alt shadow-csm"
						use:clickOutside
						on:outclick={updateSipBookStore}
					>
						<DropDownOptions
							isSipInprocess={sipData?.isSipInprocess}
							installmentSkip={sipData?.installmentSkip}
							isSipPaymentNudge={sipData?.isSipPaymentNudge}
							sipType={sipData?.sipType}
							packId={sipData?.packId}
							on:onButtonClick={onOptionSelect}
						/>
					</div>
				{/if}
				<article class="mb-36">
					{#if !sipData?.mandateRefId}
						{#await createMandateWithBankList(sipData) then mandateList}
							{@const nudgeData = {
								description:
									mandateList.length > 0 ? linkSipNudgeDescription : setupNudgeDescription,
								heading: 'Automate Future SIP Payments',
								link: `/autopay/manage/setup?params=${autopayRedirectParams()}`,
								linkHeading: mandateList.length > 0 ? linkAutopayHeading : setupAutopayHeading,
								type: 'warn'
							}}
							{#if mandateList.length > 0}
								<DiscoverFundsNudge
									nudge={nudgeData}
									onAction={() => onAction(sipData)}
									clickEvent={() => nudgeClick(sipData, mandateList.length > 0)}
									impressionEvent={() => nudgeImpression(sipData, mandateList.length > 0)}
									class="mb-2 sm:mt-4"
								/>
							{:else}
								<SipBookAutoPayNudge
									amount={sipData.installmentAmount}
									on:autoPayClick={handleLinkAutopayCtaClick}
								/>
							{/if}
						{/await}
					{/if}

					<SipDetailsBasic
						schemeName={sipData?.schemeName}
						logoUrl={sipData?.logoUrl}
						isin={sipData?.isin}
						schemeCode={sipData?.schemeCode}
					/>
					<section class="rounded-lg bg-background-alt pb-4 shadow-csm">
						<SipSchedule
							amount={sipData?.installmentAmount}
							nextSipDateTs={sipData?.nextSipDueDate}
							class="mt-2 pb-2 !shadow-none"
						/>

						{#if sipData?.accountNo}
							<BankAutopayCard
								bankAccountNumber={sipData?.accountNo}
								bankName={sipData?.bankName}
								bankLogo={getBankLogoUrl(bankDetails, sipData?.accountNo)}
								class="!rounded-none !rounded-b-lg !pb-0 !shadow-none"
							>
								<svelte:fragment slot="autopayStatusSlot">
									<section class="flex items-center">
										<WMSIcon
											name="tick-in-circle"
											height={12}
											width={12}
											stroke="#fff"
											bgStroke="#008F75"
											class="mr-0.5 min-w-[12px]"
										/>
										<div class="text-xs font-normal text-body">Autopay Enabled</div>
									</section>
								</svelte:fragment>
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
													class="!h-auto min-h-fit !px-0 text-xs font-medium text-primary"
													>SWITCH AUTOPAY</Button
												>
											</div>
										{/if}
									{/await}
								</svelte:fragment>
							</BankAutopayCard>
						{/if}
					</section>

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
								value: 'No',
								fundName: sipData?.schemeName,
								amount: sipData?.installmentAmount
							});
						}}
						isModalOpen={showSkipModal}
						confirm={() => handleSkipSip(sipData?.nextSipDueDate, sipData)}
						titleClass="!font-normal"
						title="Skip Next SIP Instalment?"
						confirmButtonTitle="YES, SKIP"
						confirmButtonDisable={disableConfirmSkipSip}
					>
						<svelte:fragment slot="body">
							<p class="font-normal text-body">
								Your SIP instalment <span class="font-normal text-title"
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
						class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-10 sm:py-6 md:!w-96 md:rounded-lg"
						buttonClass="mt-8 w-40 border border-primary rounded !bg-background-alt !text-primary cursor-default md:cursor-pointer"
						handleButtonClick={handleSuccessModalCta}
					/>

					<ResultPopup
						closeModal={toggleShowFailureModal}
						isModalOpen={showFailureModal}
						popupType={STATUS_ARR.FAILURE}
						title="Cancellation Error"
						text="We could not cancel your SIP due to a tecnhical error. Please try again"
						buttonTitle="RETRY"
						class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-10 sm:py-6 md:!w-96 md:rounded-lg"
						buttonClass="mt-8 w-40 border border-primary rounded !bg-background-alt !text-primary cursor-default md:cursor-pointer"
						handleButtonClick={handleFailureModalCta}
					/>

					<!-- SKIP SIP MODAL SUCCESS FAILURE POPUPS -->
					<ResultPopup
						closeModal={toggleSkipSuccessModal}
						isModalOpen={showSkipSuccessModal}
						popupType={STATUS_ARR.SUCCESS}
						buttonTitle="DONE"
						class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
						buttonClass="mt-8 w-40 border border-primary rounded !bg-background-alt !text-primary cursor-default md:cursor-pointer"
						handleButtonClick={() => {
							invalidate('skipsip');
							showSkipSuccessModal = false;
							skipSipSuccessModalClickDone();
						}}
					>
						<svelte:fragment slot="popupBody">
							<article class="mt-6 text-center">
								<div class={`text-2xl font-normal text-title`}>SIP Instalment Skipped</div>

								<div class={`mt-3 text-sm font-normal text-body`}>
									Your SIP instalment for {sipData?.schemeName}
									<span class="font-normal text-title"
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
						buttonClass="mt-8 w-40 border border-primary rounded !bg-background-alt !text-primary cursor-default md:cursor-pointer"
						handleButtonClick={toggleSkipFailureModal}
					/>

					<!--SIP Cancel Reason Modal-->
					<Modal closeModal={toggleShowCancelSipModal} isModalOpen={showCancelSipModal}>
						<div class="overflow-auto rounded-lg bg-background-alt p-8 md:!h-[737px] md:!w-[436px]">
							<CancelSip
								class="!m-0"
								instalmentAmount={sipData?.installmentAmount}
								categoryName={sipData?.category}
								subCategoryName={sipData?.subCategory}
								on:cancelSipClick={(e) => handleCancelSipClick(e?.detail)}
								on:stayInvestedClick={() => toggleShowCancelSipModal(true)}
							/>
						</div>
					</Modal>
				</article>
			{:else}
				<InvalidUrl />
			{/if}
		{:catch}
			<InvalidUrl />
		{/await}
	{/if}
</article>
{#if showEditSipModal}
	<!-- svelte-ignore empty-block -->
	{#await data?.api?.getSipData then sipData}
		{#if !isMobile && !isTablet}
			<EditSip
				{editSipShowModal}
				nextSipDueDate={sipData?.nextSipDueDate}
				installmentAmount={sipData?.installmentAmount}
				logoUrl={sipData?.logoUrl}
				schemeName={sipData?.schemeName}
				isin={sipData?.isin}
				schemeCode={sipData?.schemeCode}
				sipId={sipData?.sipId}
				{isMobile}
				{isTablet}
			/>
		{/if}

		<Modal isModalOpen={showEditSipModal && (isMobile || isTablet)}>
			<EditSip
				{editSipShowModal}
				nextSipDueDate={sipData?.nextSipDueDate}
				installmentAmount={sipData?.installmentAmount}
				logoUrl={sipData?.logoUrl}
				schemeName={sipData?.schemeName}
				isin={sipData?.isin}
				schemeCode={sipData?.schemeCode}
				sipId={sipData?.sipId}
				{isMobile}
				{isTablet}
			/>
		</Modal>
	{/await}
{/if}
