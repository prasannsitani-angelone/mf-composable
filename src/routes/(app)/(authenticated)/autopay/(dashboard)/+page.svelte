<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import WmsIcon from '$components/WMSIcon.svelte';
	import BankAutopayCard from '$components/mandate/components/BankAutopayCard.svelte';
	import AutopayEnabledIcon from '$lib/images/icons/AutopayEnabledIcon.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import {
		getBankLogoUrl,
		getBankNameUsingAccountNumber,
		getBanksWithoutMandateList
	} from '$lib/utils';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import AutopayDashboardLoader from './components/AutopayDashboardLoader.svelte';
	import {
		autopayDashboardImpressionAnalytics,
		autopayDashboardSetupAutopayCtaClickAnalytics
	} from '$lib/analytics/sipbook/sipbook';
	import type { AutopayDetailsType } from '$lib/types/IEmandate';
	import PageTitle from '$components/PageTitle.svelte';

	$: bankDetails = $profileStore?.bankDetails;

	const handleSetupAutopayClick = (bankAccount: string) => {
		autopayDashboardSetupAutopayCtaClickAnalyticsFunc(bankAccount);

		const params = encodeObject({
			acc: bankAccount
		});

		const redirectPath = `${base}/autopay/manage/setup?params=${params}`;
		goto(redirectPath);
	};

	const redirectToAutopayDetails = (mandateId: string) => {
		const redirectPath = `${base}/autopay/${mandateId}`;
		goto(redirectPath);
	};

	const autopayDashboardImpressionAnalyticsFunc = (mandatesData: AutopayDetailsType[]) => {
		const eventMetadata = {
			mandates: (mandatesData || [])?.map((mandate: AutopayDetailsType) => {
				return {
					BankName: mandate?.bankName,
					status:
						mandate?.mandateStatus?.toLowerCase() !== 'success'
							? 'failed'
							: !mandate?.inProgress
							? 'success'
							: 'in progress',
					AutopayType: mandate?.authenticationMode?.toUpperCase(),
					AutopayId: mandate?.mandateId
				};
			})
		};

		autopayDashboardImpressionAnalytics(eventMetadata);
	};

	const autopayDashboardSetupAutopayCtaClickAnalyticsFunc = (accountNumber: string) => {
		const eventMetadata = {
			BankName: getBankNameUsingAccountNumber(bankDetails, accountNumber)
		};

		autopayDashboardSetupAutopayCtaClickAnalytics(eventMetadata);
	};

	export let data: PageData;

	onMount(() => {
		data?.api?.mandateData?.then((res: unknown) => {
			autopayDashboardImpressionAnalyticsFunc(res?.data);
		});
	});
</script>

<article class="mb-2" data-testid="autopayDashboard">
	<header class="hidden sm:block">
		<PageTitle title="Autopay" class="mb-4 flex" />
	</header>
	{#await data.api.mandateData}
		<AutopayDashboardLoader />
	{:then response}
		<section>
			{#if response && response?.status === 'success' && Array.isArray(response.data) && response.data.length}
				{#each response?.data as mandate, index (mandate?.mandateId)}
					<div
						on:click={() => redirectToAutopayDetails(mandate?.mandateId)}
						on:keypress={() => {
							//
						}}
						role="button"
						tabindex="0"
					>
						<BankAutopayCard
							bankAccountNumber={mandate?.accountNo}
							bankName={mandate?.bankName}
							bankLogo={getBankLogoUrl(bankDetails, mandate?.accountNo)}
							class={`px-3 pl-3 ${index > 0 ? 'mt-2' : ''}`}
							cardBodyClass="pb-3 border-b"
							bankDetailsClass="ml-2"
							bankAccNoClass="mt-1.5"
							bankLogoClass="-mt-1 !px-2 !py-1 h-9 w-9 flex items-center justify-center rounded-full border border-background bg-background-alt"
						>
							<svelte:fragment slot="autopayStatusSlot">
								{#if !mandate?.inProgress}
									<section class="flex items-center">
										<AutopayEnabledIcon class="mr-1" />
										<div class="text-xs font-normal text-body">Autopay Enabled</div>
									</section>
								{:else}
									<div class="bg-secondary/10 flex items-center p-1">
										<WmsIcon name="clock-yellow-bolder" height={16} width={16} class="mr-1" />
										<div class="text-xs font-normal text-title">In Progress</div>
									</div>
								{/if}
							</svelte:fragment>
							<svelte:fragment slot="footer">
								<section class="mt-3 flex items-center justify-between font-normal text-body">
									<div class="flex-1 text-[10px] uppercase">
										{mandate?.authenticationMode} AUTOPAY
									</div>
									<div class="flex-1 truncate text-right text-xs">
										Autopay ID: {mandate?.mandateId}
									</div>
								</section></svelte:fragment
							>
						</BankAutopayCard>
					</div>
				{/each}

				{#each getBanksWithoutMandateList(bankDetails, response?.data) || [] as bank (bank?.accNO)}
					<BankAutopayCard
						bankAccountNumber={bank?.accNO}
						bankName={bank?.bankName}
						bankLogo={getBankLogoUrl(bankDetails, bank?.accNO)}
						class={`px-3 pl-3 ${response?.data?.length ? 'mt-2' : ''}`}
						bankDetailsClass="ml-2"
						bankLogoClass="-mt-1 !px-2 !py-1 h-9 w-9 flex items-center justify-center rounded-full border border-background bg-background-alt"
					>
						<svelte:fragment slot="autopayStatusSlot">
							<Button
								variant="transparent"
								class={'!h-fit !min-h-0 !px-0 text-xs font-medium'}
								ariaLabel="SetupAutopay"
								onClick={() => handleSetupAutopayClick(bank?.accNO)}
							>
								SET UP AUTOPAY
							</Button>
						</svelte:fragment>
					</BankAutopayCard>
				{/each}
			{/if}
		</section>
	{/await}
</article>
