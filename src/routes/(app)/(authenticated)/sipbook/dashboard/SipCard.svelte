<script lang="ts">
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import { getDateTimeString, getTimestampDaysDifference } from '$lib/utils/helpers/date';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import NudgeComponent from '$lib/components/Nudge/NudgeComponent.svelte';
	import OctagonalYellowWarningIcon from '$lib/images/icons/OctagonalYellowWarningIcon.svelte';
	import BigTimePendingIcon from '$lib/images/icons/BigTimePendingIcon.svelte';
	import type { ISip } from '$lib/types/ISipType';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { onMount } from 'svelte';
	import DateFns from '$lib/utils/asyncDateFns';
	import { sipCardClickAnalytics } from '$lib/analytics/sipbook/sipbook';
	import { WMSIcon, Button } from 'svelte-components';
	import SchemeLogo from '$components/SchemeLogo.svelte';

	let sipCount = 0;
	let alertSleeveText = '';
	let skipSipText = '';
	let sip: ISip;
	let isUpcomingSip = false;
	let isCurrentDateEqualToT3Date = false;
	let inactiveSip = false;

	const timezoneOffset = -330; // should be constant in minutes, as our app should be handled based on Indian Timezone
	const daysLeft = getTimestampDaysDifference(
		sip?.nextSipDueDate - timezoneOffset * 60 * 1000,
		Date.now()
	);
	isUpcomingSip = daysLeft <= 4 && daysLeft >= -1;
	const setAlertSleeveText = () => {
		const currentDate = new Date()?.getDate(); // current date
		const tDayDate = new Date(sip?.sipPaymentDate)?.getDate(); // sip date
		const t3DayDate = new Date(sip?.sipAmountPayTillDate)?.getDate(); // sip date + 3

		if (currentDate > tDayDate && currentDate < t3DayDate) {
			alertSleeveText = `Pay by ${getDateTimeString(sip?.sipAmountPayTillDate, 'DATE', true)}`;
		} else if (currentDate === t3DayDate) {
			alertSleeveText = `Pay by ${getDateTimeString(
				sip?.sipAmountPayTillDate,
				'DATE',
				true
			)}, today`;
			isCurrentDateEqualToT3Date = true;
		}
	};
	const setSkipPaymentText = () => {
		const lastSkipDate = new Date(sip?.skipSipDueDate);
		skipSipText = `SIP instalment skipped for ${lastSkipDate.toLocaleString('default', {
			month: 'long'
		})} ${lastSkipDate.getFullYear()}`;
	};
	const handleSipPaymentClick = (isCta: boolean) => {
		// TODO: To change the navigation after the proper release
		if (isCta) {
			const reRouteUrl = 'schemes';
			const path = `${reRouteUrl}/${normalizeFundName(
				sip?.schemeName,
				sip?.isin,
				sip?.schemeCode
			)}`;
			const { format } = DateFns.DateFns;

			let params = null;
			if (sip?.sipPaymentMonthNudge) {
				params = encodeObject({
					investmentType: 'LUMPSUM',
					investmentAmount: sip?.installmentAmount,
					skipOrderPad: true,
					sipInstalmentId: sip?.sipInstalmentId,
					isAdditionalFlag: true,
					require2FA: false,
					redirectedFrom: 'MONTHLY_PAYMENT_NUDGE'
				});
			} else {
				params = encodeObject({
					investmentType: 'SIP',
					investmentAmount: sip?.installmentAmount,
					sipDate: new Date(sip?.sipPaymentDate)?.getDate(),
					ftp: true,
					skipOrderPad: true,
					redirectedFrom: 'SIP_PAYMENTS',
					sipId: sip?.sipId,
					sipRegistrationNumber: sip?.sipRegistrationNo,
					sipDueDate: format(new Date(sip?.sipPaymentDate), 'yyyy-MM-dd'),
					require2FA: false
				});
			}
			goto(`${base}/${path}?params=${params}&orderpad=INVEST`);
		} else if (!isCta) {
			goto(`${base}/sipbook/${sip?.sipId}`);
		}
	};

	const sipCardClickAnalyticsFunc = () => {
		const eventMetaData = {
			FundName: sip?.schemeName,
			ISINCode: sip?.isin,
			SIPSchedule: {
				InstallmentAmount: sip?.installmentAmount,
				NextSIPPayment: getDateTimeString(sip?.nextSipDueDate, 'DATE', true)
			},
			BankDetails: {
				BankName: sip?.bankName,
				BankAccountNumber: sip?.accountNo
			},
			portfoliotag: sip?.packId ? 'Y' : 'N',
			portfolioName: sip?.packId
		};
		sipCardClickAnalytics(eventMetaData);
	};

	const handleClick = (
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
		isCta = false
	) => {
		// TODO: to handle during details page
		event.stopPropagation();
		sipCardClickAnalyticsFunc();
		if (inactiveSip) {
			return;
		}

		if (sipCount) {
			if (sipCount > 1) {
				if (isCta) {
					goto(`${base}/sipbook/dashboard`);
				}
			} else if (sipCount === 1) {
				handleSipPaymentClick(isCta);
			}
		} else {
			handleSipPaymentClick(isCta);
		}
	};

	onMount(async () => {
		await DateFns.init();
	});
	setAlertSleeveText();
	$: if (sip?.skipSipDueDate) {
		setSkipPaymentText();
	}
	export { sip, sipCount, inactiveSip };
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<article
	class="mb-2 rounded-lg bg-background-alt py-3 shadow-csm {$$props.class}"
	on:click={handleClick}
	on:keydown={handleClick}
>
	<!-- Header section -->
	{#if sip?.isSipPaymentNudge && !sip?.installmentSkip}
		<section
			class="to-secondary/10 -mt-3 flex items-center justify-between rounded-t-lg border-l-4 border-secondary bg-gradient-to-r from-background-alt px-3.5 py-2 font-normal text-title"
		>
			<article class="flex items-center">
				<OctagonalYellowWarningIcon class="mr-3.5" />
				<div class="text-xs">
					{sip?.sipPaymentMonthNudge
						? 'Missed SIP date? Pay now to continue your SIP'
						: 'SIP Payment Due'}
				</div>
			</article>
			<article class="mr-3.5 text-[9px]" class:text-sell={isCurrentDateEqualToT3Date}>
				{alertSleeveText}
			</article>
		</section>
	{/if}

	<!-- Upper section -->
	<section class:pt-2={sipCount > 1} class="mb-2">
		<!-- Scheme Details section -->
		{#if sip?.packId}
			<section class="mx-3 mb-2">
				<div
					class="flex h-5 max-w-fit rounded-sm bg-tint12-primary px-2 py-0.5 text-[10px] text-primary"
				>
					<div>
						<WMSIcon name="open-folder-icon" height={15} width={15} />
					</div>
					<span class="pl-1">{sip?.packId}</span>
				</div>
			</section>
		{/if}

		<section class="mx-3">
			<ResultItem
				categoryContainerStyle="flex-1 flex"
				class="border-none !p-0 !pb-2"
				data={sip}
				categoryName={`${sipCount > 1 ? '' : sip?.schemePlan?.toLowerCase()}`}
				categoryStyle="text-[10px] capitalize"
				logoStyle="w-9 h-9"
			>
				<div slot="schemeInfo" />
				<svelte:fragment slot="schemeLogo">
					{#if sipCount > 1}
						<SchemeLogo size="sm" src={sip?.logoUrl} alt="logo" />
						<div
							class="-ml-7 mr-3 flex h-12 w-12 items-center justify-center rounded-full border bg-background-alt object-cover p-0.5 text-xs font-normal opacity-100 shadow-csm group-hover:bg-background-alt"
						>
							+ {sipCount - 1}
						</div>
					{:else}
						<SchemeLogo size="sm" src={sip?.logoUrl} alt="logo" />
					{/if}
				</svelte:fragment>
				<span slot="ratingSection" />
				<span slot="returns" />
			</ResultItem>
		</section>

		<!-- SIP Details section -->
		<section class="mx-3 flex items-center justify-between rounded bg-background px-4 py-2">
			<slot name="sipCardDetailsLeftSection">
				<article class="flex-1">
					<div class="text-[11px] font-normal text-body">Amount</div>
					<div class="text-base font-normal text-title">
						₹{addCommasToAmountString(sip?.installmentAmount?.toFixed(0))}
					</div>
				</article>
			</slot>

			<!-- Line Separator (mobile layout) -->
			<div class="block h-7 border-r md:hidden" />

			<slot name="sipCardDetailsRightSection">
				{#if sip?.isSipPaymentNudge}
					<article class="flex-1 text-right">
						<div class="text-[11px] font-normal text-sell">
							{sip?.sipPaymentMonthNudge ? 'Pay SIP by' : 'SIP Date'}
						</div>
						<div class="text-base font-normal text-title">
							{getDateTimeString(
								sip?.sipPaymentMonthNudge ? sip?.orderDate * 1000 : sip?.sipPaymentDate,
								'DATE',
								true
							)}
						</div>
					</article>
				{:else}
					<article class="flex-1 text-right">
						<div class="text-[11px] font-normal text-body">Next SIP Payment</div>
						<div class="text-base font-normal text-title">
							{getDateTimeString(sip?.nextSipDueDate, 'DATE', true)}
						</div>
					</article>
				{/if}
			</slot>
		</section>

		<!-- Pay Now button for SIP payment -->
		{#if sip?.isSipPaymentNudge}
			<section class="mt-3 px-3">
				<Button
					class="flex h-12 w-full items-center justify-center rounded"
					onClick={(e) => handleClick(e, true)}
				>
					{sipCount > 1 ? 'VIEW PENDING SIPs' : 'PAY NOW'}
				</Button>
			</section>
		{/if}
	</section>

	<!-- Lower section -->
	<slot name="cardFooter">
		<section class="px-3">
			{#if sip?.accountNo}
				<!-- Upcoming SIP nudge -->
				{#if isUpcomingSip}
					<NudgeComponent
						nudgeText="Upcoming SIP. Please maintain required balance in bank account"
						nudgeClasses="px-3 py-2 rounded !justify-start"
					>
						<div slot="nudgeIcon">
							<BigTimePendingIcon class="mr-1" />
						</div>
					</NudgeComponent>
				{:else}
					<section class="flex items-center text-xs font-normal text-buy">
						<WMSIcon
							name="tick-in-circle"
							height={12}
							width={12}
							stroke="#fff"
							bgStroke="#008F75"
							class="mr-0.5 min-w-[12px]"
						/>
						Autopay Enabled
					</section>
				{/if}
			{:else}
				<section class="flex items-center text-xs font-normal text-sell">
					<WMSIcon name="filledInfo" height={12} width={12} class="mr-0.5 min-w-[12px]" />
					Autopay Pending
				</section>
			{/if}
		</section>
		{#if sip?.installmentSkip}
			<section class="mt-2 px-3">
				<NudgeComponent nudgeText={skipSipText} nudgeClasses="!p-1" />
			</section>
		{/if}
	</slot>
</article>
