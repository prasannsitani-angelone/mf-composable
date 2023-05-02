<script lang="ts">
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import Button from '$components/Button.svelte';
	import { getDateTimeString, getTimestampDaysDifference } from '$lib/utils/helpers/date';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import NudgeComponent from '$lib/components/Nudge/NudgeComponent.svelte';
	import OctagonalYellowWarningIcon from '$lib/images/icons/OctagonalYellowWarningIcon.svelte';
	import BigDotIcon from '$lib/images/icons/BigDotIcon.svelte';
	import BigTimePendingIcon from '$lib/images/icons/BigTimePendingIcon.svelte';
	import type { ISip } from '$lib/types/ISipType';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/object';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext, onMount } from 'svelte';
	import DateFns from '$lib/utils/asyncDateFns';
	import { sipCardClickAnalytics } from '$lib/analytics/sipbook/sipbook';
	import { OnNavigation } from '$lib/utils/navigation';

	let sipCount = 0;
	let alertSleeveText = '';
	let skipSipText = '';
	let sip: ISip;
	let bankLogo = '';
	let isUpcomingSip = false;
	let isCurrentDateEqualToT3Date = false;
	let inactiveSip = false;

	const timezoneOffset = -330; // should be constant in minutes, as our app should be handled based on Indian Timezone
	const daysLeft = getTimestampDaysDifference(
		sip?.nextSipDueDate - timezoneOffset * 60 * 1000,
		Date.now()
	);
	const appContext: AppContext = getContext('app');
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
		})} ${lastSkipDate.getFullYear()}.`;
	};
	const handleSipPaymentClick = (isCta: boolean) => {
		// TODO: To change the navigation after the proper release
		if (isCta) {
			const reRouteUrl = $page?.data?.deviceType?.isBrowser ? 'schemes' : 'schemes/invest';
			const path = `${reRouteUrl}/${normalizeFundName(
				sip?.schemeName,
				sip?.isin,
				sip?.schemeCode
			)}`;
			const { format } = DateFns.DateFns;
			const params = encodeObject({
				investmentType: 'SIP',
				investmentAmount: sip?.installmentAmount,
				sipDate: new Date(sip?.sipPaymentDate)?.getDate(),
				ftp: true,
				skipOrderPad: true,
				redirectedFrom: 'SIP_PAYMENTS',
				sipId: sip?.sipId,
				sipRegistrationNumber: sip?.sipRegistrationNo,
				sipDueDate: format(new Date(sip?.sipPaymentDate), 'yyyy-MM-dd')
			});
			OnNavigation();
			goto(
				`${getNavigationBaseUrl(base, appContext.scheme, appContext.host)}/${path}?params=${params}`
			);
		} else if (!isCta) {
			OnNavigation();
			goto(
				`${getNavigationBaseUrl(base, appContext.scheme, appContext.host)}/sipbook/${sip?.sipId}`
			);
		}
	};

	const sipCardClickAnalyticsFunc = () => {
		const eventMetaData = {
			FundName: sip?.schemeName,
			SIPSchedule: {
				InstallmentAmount: sip?.installmentAmount,
				NextSIPPayment: getDateTimeString(sip?.nextSipDueDate, 'DATE', true)
			},
			BankDetails: {
				BankName: sip?.bankName,
				BankAccountNumber: sip?.accountNo
			}
		};
		sipCardClickAnalytics(eventMetaData);
	};

	const handleClick = (event: any, isCta = false) => {
		// TODO: to handle during details page
		event.stopPropagation();
		sipCardClickAnalyticsFunc();
		if (inactiveSip) {
			return;
		}

		if (sipCount) {
			if (sipCount > 1) {
				if (isCta) {
					goto(`${base}/orders/orderspage/sipbook`);
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
	export { sip, sipCount, bankLogo, inactiveSip };
</script>

<article
	class="mb-2 rounded-lg bg-white shadow-csm"
	on:click={handleClick}
	on:keydown={handleClick}
>
	<!-- Header section -->
	{#if sip?.isSipPaymentNudge && !sip?.installmentSkip}
		<section
			class="flex items-center justify-between rounded-t-lg border-l-4 border-yellow-primary bg-gradient-to-r from-white to-yellow-primary/10 py-2 px-3.5 font-medium text-black"
		>
			<article class="flex items-center">
				<OctagonalYellowWarningIcon class="mr-3.5" />
				<div class="text-xs">SIP Payment Due</div>
			</article>
			<article class="mr-3.5 text-[9px]" class:text-red-errorDark={isCurrentDateEqualToT3Date}>
				{alertSleeveText}
			</article>
		</section>
	{/if}

	<!-- Upper section -->
	<section
		class="py-4"
		class:border-b={sip?.accountNo || isUpcomingSip}
		class:border-grey-line={sip?.accountNo || isUpcomingSip}
		class:pt-2={sipCount > 1}
	>
		<!-- Scheme Details section -->
		<section class="mx-3">
			<ResultItem
				class={`border-none !p-0 ${sipCount > 1 ? '!pb-2' : '!pb-4'}`}
				data={sip}
				categoryName={`${sipCount > 1 ? '' : sip?.schemePlan?.toLowerCase()}`}
				categoryStyle="text-[10px] capitalize"
				logoStyle="w-9 h-9 p-0.5"
			>
				{#if sipCount > 1}
					<img
						src={sip?.logoUrl}
						alt="logo"
						class="mr-3 h-9 w-9 rounded-full border object-cover p-0.5 shadow-csm group-hover:bg-white"
					/>
					<div
						class="mr-3 -ml-7 flex h-9 w-9 items-center justify-center rounded-full border bg-white object-cover p-0.5 text-xs font-medium opacity-100 shadow-csm group-hover:bg-white"
					>
						+ {sipCount - 1}
					</div>
				{/if}
				<span slot="ratingSection" />
				<span slot="returns" />
			</ResultItem>
		</section>

		<!-- SIP Details section -->
		<section class="mx-3 flex items-center justify-between rounded bg-grey-light px-4 py-2">
			<slot name="sipCardDetailsLeftSection">
				<article class="flex-1">
					<div class="text-[11px] font-medium text-grey-body">Amount</div>
					<div class="text-base font-medium text-black-title">
						₹{addCommasToAmountString(sip?.installmentAmount?.toFixed(0))}
					</div>
				</article>
			</slot>

			<!-- Line Separator (mobile layout) -->
			<div class="block h-7 border-r border-grey-line md:hidden" />

			<slot name="sipCardDetailsRightSection">
				{#if sip?.isSipPaymentNudge}
					<article class="flex-1 text-right">
						<div class="text-[11px] font-medium text-red-errorDark">SIP Date</div>
						<div class="text-base font-medium text-black-title">
							{getDateTimeString(sip?.sipPaymentDate, 'DATE', true)}
						</div>
					</article>
				{:else}
					<article class="flex-1 text-right">
						<div class="text-[11px] font-medium text-grey-body">Next SIP Payment</div>
						<div class="text-base font-medium text-black-title">
							{getDateTimeString(sip?.nextSipDueDate, 'DATE', true)}
						</div>
					</article>
				{/if}
			</slot>
		</section>

		<!-- Pay Now button for SIP payment -->
		{#if sip?.isSipPaymentNudge}
			<section class="px-3 pt-2 pb-1">
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
		{#if sip?.accountNo}
			<section class="px-3 py-2">
				<section class="flex items-center justify-between">
					<article class="flex items-center text-black-title">
						<div class="px-3 py-1.5">
							<img src={bankLogo} alt="bank logo" class="h-4 w-4" />
						</div>
						<div class="text-sm font-medium">
							{sip?.bankName}
						</div>
					</article>

					<article class="flex items-center">
						{#each Array(4) as item}
							<BigDotIcon class="mr-1" />
						{/each}
						<div class="text-xs font-medium text-grey-body">
							{sip?.accountNo?.slice(sip?.accountNo?.length - 4)}
						</div>
					</article>
				</section>

				<!-- Upcoming SIP nudge -->
				{#if isUpcomingSip}
					<NudgeComponent
						nudgeText="Upcoming SIP. Please maintain required balance in bank account"
						nudgeClasses="mt-2 px-4"
					>
						<div slot="nudgeIcon">
							<BigTimePendingIcon class="mr-3" />
						</div>
					</NudgeComponent>
				{/if}
			</section>
		{/if}
		{#if sip?.installmentSkip}
			<section class="px-3 pb-4">
				<NudgeComponent nudgeText={skipSipText} nudgeClasses="!p-1" />
			</section>
		{/if}
	</slot>
</article>
