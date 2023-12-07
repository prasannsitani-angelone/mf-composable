<script lang="ts">
	import { OrderType } from '$lib/constants/transactionType';
	import type { FolioObject } from '$lib/types/IInvestments';
	import type { VerifyEdisDataTypes } from '$lib/types/ITpinFlow';
	import { createEventDispatcher, onMount } from 'svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getMaskedMobileNumberSuffix } from '$lib/utils/helpers/masked';
	import { useFetch } from '$lib/utils/useFetch';
	import { getCappedUnitString } from '$lib/utils/helpers/formatAmount';
	import Modal from '$components/Modal.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import Button from '$components/Button.svelte';
	import LoadingPopup from '../../../routes/(app)/InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import { base } from '$app/paths';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import { page } from '$app/stores';
	import TpinVerified from './TpinVerified.svelte';

	export let uuid: string;
	export let folio: FolioObject;
	export let quantity: number;
	export let redeemAll: boolean;
	export let orderType = '';

	const dispatch = createEventDispatcher();

	const aboutEdisModalData = [
		{
			text: 'E-DIS (Electronic-Delivery Instruction Slip) is a facility provided to users who wish to sell mutual fund units/shares but have not couriered a physical copy of the POA (Power of Attorney)'
		},
		{ text: 'Once you continue, you will be redirected to the CDSL website' },
		{
			text: 'Please verify your TPIN on the CDSL website to give consent to sell your mutual fund units'
		},
		{
			text: 'If you do not wish to do this activity, then you need to courier the physical copy of the POA form to our corporate office address.'
		}
	];

	let showAboutEdisModal = false;
	let showTpinRegeneratedModal = false;
	let showCdslModal = false;
	let isCdslModalClosedManually = false;
	let verifyEdisData = <VerifyEdisDataTypes>{};
	let edisExecDate = '';
	let tpinVerificationSuccessful = false;
	let showTpinVerifiedModal = false;
	let mobileNo: string = $profileStore?.mobile || '';
	let maskedMobileNumber = getMaskedMobileNumberSuffix(mobileNo, false);

	$: isMobile = $page?.data?.deviceType?.isMobile;

	const closeTpinActionModal = () => {
		dispatch('closeModal');
	};

	const handleShowAboutEdisModal = () => {
		showAboutEdisModal = !showAboutEdisModal;

		if (showAboutEdisModal) {
			dispatch('edisAboutModalOpen');
		} else {
			dispatch('edisAboutModalClose');
		}
	};

	const handleShowTpinRegeneratedModal = (closeAllModals = false) => {
		showTpinRegeneratedModal = !showTpinRegeneratedModal;

		if (closeAllModals) {
			closeTpinActionModal();
		}
	};

	const cdslModalCrossButtonClicked = () => {
		showCdslModal = false;
		clearTimeout(timeoutTimer);
		toggleIsCdslModalClosedManually();
	};

	const toggleIsCdslModalClosedManually = () => {
		isCdslModalClosedManually = !isCdslModalClosedManually;
	};

	const loadingState = {
		heading: '',
		isLoading: false
	};

	const error = {
		visible: false,
		heading: '',
		subHeading: '',
		serverError: false
	};

	const onErrorTryAgain = () => {
		if (error?.heading === AUTH_FAILED_ERROR_HEADING) {
			dispatch('authFailedRetryClick');
		} else if (error?.heading === SERVER_ERROR_HEADING) {
			dispatch('serverErrorRetryClick');
		}

		closeTpinActionModal();
		dispatch('redirectOnError');
	};

	const showLoading = (heading: string) => {
		loadingState.isLoading = true;
		loadingState.heading = heading;
	};

	const stopLoading = () => {
		loadingState.isLoading = false;
		loadingState.heading = '';
	};

	const showErrorModal = (heading = '', subHeading = '', isServerError = false) => {
		stopLoading();

		error.visible = true;
		error.heading = heading;
		error.subHeading = subHeading;
		error.serverError = isServerError;
	};

	const SERVER_ERROR_HEADING = 'Server Error';
	const SERVER_ERROR_SUBHEADING =
		'CDSL servers are not responding currently. Please try again after sometime';

	const AUTH_FAILED_ERROR_HEADING = 'Authorization Failed';
	const AUTH_FAILED_ERROR_SUBHEADING = 'Your TPIN verification failed. Please try again';

	const showServerErrorModal = (
		heading: string = SERVER_ERROR_HEADING,
		subHeading: string = SERVER_ERROR_SUBHEADING
	) => {
		showErrorModal(heading, subHeading, true);

		dispatch('showServerErrorModal');
	};

	const showAuthFailedModal = (
		heading: string = AUTH_FAILED_ERROR_HEADING,
		subHeading: string = AUTH_FAILED_ERROR_SUBHEADING
	) => {
		showErrorModal(heading, subHeading, false);

		dispatch('showAuthFailedModal');
	};

	// eslint-disable-next-line
	let timeoutTimer;

	const redirectionFunc = () => {
		showCdslModal = true;

		// eslint-disable-next-line
		document.forms['redirectToCdsl'].submit();

		stopLoading();

		isCdslModalClosedManually = false;

		if (timeoutTimer !== undefined) {
			clearTimeout(timeoutTimer);
		}

		// for timeout of 10 mins
		timeoutTimer = setTimeout(() => {
			showCdslModal = false;
			isCdslModalClosedManually = true;
		}, 600000);
	};

	const setFormattedEdisExecDate = (edisDate: string) => {
		const edisDateDate = edisDate?.slice(0, 2);
		const edisDateMonth = edisDate?.slice(2, 4);
		const edisDateYear = edisDate?.slice(4);
		edisExecDate = edisDateYear + '-' + edisDateMonth + '-' + edisDateDate; // should be in format: YYYY-MM-DD
	};

	const onTpinVericationSuccessful = async () => {
		dispatch('tpinVerificationSuccessful', edisExecDate);
	};

	const verifyEdisFunc = () => {
		const url = `${window?.location?.origin}${base}/api/VerifyDISMF`;

		return useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': uuid,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				ClientCode: $profileStore?.clientId,
				MobileNo: mobileNo,
				isin: folio?.isin,
				quantity: redeemAll
					? folio?.redemableUnits
					: parseFloat(getCappedUnitString(quantity?.toString(), 3))
			})
		});
	};

	const verifyEdisDetails = async () => {
		showLoading('Connecting to CDSL');
		const res = await verifyEdisFunc();

		if (res?.data?.st && res?.data?.msg?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			verifyEdisData = res?.data?.data;

			setFormattedEdisExecDate(verifyEdisData?.TradeDate);
			stopLoading();

			dispatch('tpinProcessStart');
		} else {
			if (res?.data?.msgcode?.toUpperCase() === 'AG1000') {
				verifyEdisData = res?.data?.data;

				setFormattedEdisExecDate(verifyEdisData?.TradeDate);
				stopLoading();

				onTpinVericationSuccessful();
				return;
			}
			showServerErrorModal(SERVER_ERROR_HEADING, SERVER_ERROR_SUBHEADING);
		}
	};

	const regenerateTpinFunc = async () => {
		showLoading('Connecting to CDSL');
		const url = `${window?.location?.origin}${base}/api/generateBOPin`;

		const res = await useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': uuid,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				ClientCode: $profileStore?.clientId,
				MobileNo: mobileNo,
				dpId: verifyEdisData?.DPId,
				ReqId: verifyEdisData?.ReqId,
				boid: verifyEdisData?.BOID,
				pan: $profileStore?.pan,
				reqFlag: 'N'
			})
		});

		stopLoading();

		if (res?.data?.st && res?.data?.msg?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			handleShowTpinRegeneratedModal();
		} else {
			showServerErrorModal(SERVER_ERROR_HEADING, SERVER_ERROR_SUBHEADING);
		}
	};

	const regenerateProceed = () => {
		dispatch('proceedAfterRegenerateTpin');

		showTpinRegeneratedModal = false;

		handleProceedClick();
	};

	const getTxnStatusFunc = async () => {
		const url = `${window?.location?.origin}${base}/api/GetTranStatus`;

		return useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': uuid,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				ClientCode: $profileStore?.clientId,
				MobileNo: mobileNo,
				ReqId: verifyEdisData?.ReqId
			})
		});
	};

	const handleProceedClick = () => {
		dispatch('tpinProceedClick');

		redirectionFunc();
	};

	const handleRegenerateTpinClick = async () => {
		await regenerateTpinFunc();

		dispatch('regenerateTpinClick');
	};

	const handleTpinVerifiedModalProceedCta = async () => {
		dispatch('tpinVerifiedModalProceedClick');

		showTpinVerifiedModal = false;

		onTpinVericationSuccessful();
	};

	const responseFunc = async (res) => {
		if (res?.data?.st === undefined) {
			// Case: This is to ignore any received events, if 'st' is not coming in response
			return;
		}

		showCdslModal = false;
		clearTimeout(timeoutTimer);

		if (res?.data) {
			if (res?.data?.st) {
				tpinVerificationSuccessful = true;
				showTpinVerifiedModal = true;
			} else {
				showLoading('Taking you back to AngelOne');
				const txnStatus = await getTxnStatusFunc();
				stopLoading();

				if (txnStatus?.data?.st) {
					tpinVerificationSuccessful = true;
					showTpinVerifiedModal = true;
				} else {
					showAuthFailedModal(
						AUTH_FAILED_ERROR_HEADING,
						txnStatus?.data?.msgcode?.length
							? txnStatus?.data?.msg || AUTH_FAILED_ERROR_SUBHEADING
							: AUTH_FAILED_ERROR_SUBHEADING
					);
				}
			}
		} else {
			showAuthFailedModal(AUTH_FAILED_ERROR_HEADING, AUTH_FAILED_ERROR_SUBHEADING);
		}
	};

	verifyEdisDetails();

	onMount(() => {
		const crossButtonEvent = document?.getElementById('crossButton');

		crossButtonEvent?.addEventListener('click', () => {
			window.removeEventListener('message', responseFunc);
			clearTimeout(timeoutTimer);
		});

		window.addEventListener('message', responseFunc);
	});

	$: {
		if (!showCdslModal && isCdslModalClosedManually) {
			showAuthFailedModal(
				AUTH_FAILED_ERROR_HEADING,
				'TPIN verification cancelled by user or Session got expired'
			);
		}
	}

	const tpinVerifiedModalOpenAnalyticsFunc = () => {
		dispatch('tpinVerifiedModalOpen');
	};
</script>

<section>
	{#if !showAboutEdisModal && !showTpinRegeneratedModal && !showCdslModal && !showTpinVerifiedModal && !loadingState?.isLoading && !error?.visible}
		<Modal isModalOpen={true} on:backdropclicked={closeTpinActionModal}>
			<div
				class="flex w-screen flex-col rounded-b-none rounded-t-2xl bg-white shadow-csm md:w-120 md:rounded-lg"
			>
				<slot name="heading">
					<div class="flex items-center justify-between px-4 py-6 md:px-8">
						<div class="flex items-center justify-start">
							<slot name="tpinVerificationHeader">
								<span class="mr-1 text-xl"> Verify Order with E-DIS </span>
							</slot>
							<WMSIcon
								width={16}
								height={16}
								name="info-in-circle"
								class="ml-1 cursor-default md:cursor-pointer"
								on:click={handleShowAboutEdisModal}
							/>
						</div>
						<WMSIcon
							id="crossButton"
							width={24}
							height={24}
							name="cross-circle"
							class="cursor-default md:cursor-pointer"
							on:click={closeTpinActionModal}
						/>
					</div>
				</slot>

				<slot name="horizontalLine">
					<div class="hidden border-t border-grey-line sm:block" />
				</slot>

				<slot name="bodySection">
					<section class="px-4 py-3 text-base font-normal md:px-8 md:py-6">
						<article class="rounded text-sm font-normal text-grey-body md:border md:p-4">
							Once you continue, you will be redirected to the <span
								class="font-normal text-black-title">CDSL</span
							>
							website. Please enter your <span class="font-normal text-black-title">TPIN</span> to verify
							the order.
						</article>

						<article
							class="mt-6 flex items-center justify-start rounded bg-grey px-4 py-3 text-sm font-normal text-grey-body"
						>
							<WMSIcon width={25} height={24} name="message" class="mr-3" />
							<span>
								If you do not have your TPIN available, you can <span
									class="font-normal text-black-title">regenerate TPIN</span
								> below
							</span>
						</article>

						<article
							class="mt-8 flex flex-col-reverse items-center justify-between md:mt-16 md:flex-row"
						>
							<Button
								class="mt-1 w-full rounded border-blue-primary !bg-white !text-blue-primary md:mt-0 md:w-48 md:border"
								variant={isMobile ? 'transparent' : 'outlined'}
								onClick={handleRegenerateTpinClick}
							>
								REGENERATE TPIN
							</Button>

							<Button
								class="w-full rounded border border-blue-primary md:w-48"
								variant="contained"
								onClick={handleProceedClick}
							>
								CONTINUE
							</Button>
						</article>
					</section>
				</slot>
			</div>
		</Modal>
	{/if}

	{#if showAboutEdisModal}
		<!-- Redeem About Order Verification Modal -->
		<InfoModal
			showModal={showAboutEdisModal}
			heading="About E - DIS"
			on:crossClicked={handleShowAboutEdisModal}
		>
			<svelte:fragment slot="bodySection">
				<section class="p-8">
					{#each aboutEdisModalData as statement (statement?.text)}
						<div class="font-base flex items-start justify-start pb-5 text-sm text-grey-body">
							<WMSIcon class="mr-2.5 min-w-[20px]" width={24} height={24} name="setting" />
							<span>
								{statement?.text}
							</span>
						</div>
					{/each}
				</section>
			</svelte:fragment>
		</InfoModal>
	{/if}

	{#if showTpinRegeneratedModal && !loadingState?.isLoading && !error?.visible}
		<!-- TPIN Regenerated Modal -->
		<InfoModal
			showModal={showTpinRegeneratedModal}
			heading="TPIN Regenerated"
			on:crossClicked={() => handleShowTpinRegeneratedModal(true)}
		>
			<svelte:fragment slot="bodySection">
				<section class="p-8">
					Your 6-digit CDSL PIN has been sent to the registered email address and mobile number {maskedMobileNumber}
					<article class="mt-16 flex items-center justify-center">
						<Button class="!w-48 rounded border border-blue-primary" onClick={regenerateProceed}>
							CONTINUE
						</Button>
					</article>
				</section>
			</svelte:fragment>
		</InfoModal>
	{/if}

	<!-- CDSL Website in Modal -->
	<article class="z-60 justify-start {!showCdslModal && 'hidden'}">
		<Modal isModalOpen={true} on:backdropclicked={cdslModalCrossButtonClicked}>
			<section
				class="flex h-full w-screen flex-col rounded-b-none bg-white shadow-csm md:h-96 md:w-5/6 md:rounded-lg"
			>
				<slot name="heading">
					<div class="flex items-center justify-between px-4 py-3 md:px-8 md:py-6">
						<div>
							<span class="mr-1 text-xl"> TPIN Verification </span>
						</div>
						<WMSIcon
							width={24}
							height={24}
							name="cross-circle"
							class="cursor-default md:cursor-pointer"
							on:click={cdslModalCrossButtonClicked}
						/>
					</div>
				</slot>

				<slot name="horizontalLine">
					<div class="hidden border-t border-grey-line sm:block" />
				</slot>

				<slot name="bodySection">
					<section class="w-full">
						<form
							id="redirectToCdsl"
							ref="edisFormRef"
							name="redirectToCdsl"
							method="POST"
							action="https://eDIS.cdslindia.com/EDIS/VerifyDIS"
							target="edisFrame"
						>
							<input type="hidden" name="DPId" value={verifyEdisData?.DPId} />
							<input type="hidden" name="ReqId" value={verifyEdisData?.ReqId} />
							<input type="hidden" name="Version" value={verifyEdisData?.version} />
							<input type="hidden" name="TransDtls" value={verifyEdisData?.TransDtls} />
						</form>

						<iframe
							id="edisFrame"
							title="Transcation Detail"
							name="edisFrame"
							allowfullscreen={true}
							width="80%"
							class="h-screen w-full rounded-b-lg md:h-[400px]"
						/>
					</section>
				</slot>
			</section>
		</Modal>
	</article>

	<!-- TPIN verified modal (to allow user to take action - either PROCEED to place order or GO BACK and cancel) -->
	{#if tpinVerificationSuccessful && showTpinVerifiedModal && !loadingState?.isLoading && !error?.visible}
		<TpinVerified
			heading="TPIN Verified"
			subHeading="Your TPIN verification is successful. Please click on continue to place order"
			primaryButtonTitle="CONTINUE"
			secondaryButtonTitle={orderType === OrderType.SWITCH ? '' : 'GO BACK'}
			on:primaryButtonClick={handleTpinVerifiedModalProceedCta}
			on:secondaryButtonClick={closeTpinActionModal}
			on:tpinVerifiedOpen={tpinVerifiedModalOpenAnalyticsFunc}
		/>
	{/if}

	{#if loadingState.isLoading}
		<LoadingPopup heading={loadingState.heading} />
	{:else if error.visible}
		<ResultPopup
			popupType="FAILURE"
			title={error.heading}
			text={error.subHeading}
			class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
			isModalOpen
			handleButtonClick={onErrorTryAgain}
			closeModal={onErrorTryAgain}
			buttonTitle="RETRY"
			buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
			buttonVariant="outlined"
		/>
	{/if}
</section>
