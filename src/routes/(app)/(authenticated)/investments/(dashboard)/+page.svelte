<script lang="ts">
	import { page } from '$app/stores';
	import { appStore } from '$lib/stores/SparkStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { familyStore } from '$lib/stores/FamilyStore';
	import ExternalInvestments from './ExternalInvestments.svelte';
	import type { PageData } from './$types';
	import { SEO, Tabs } from 'svelte-components';
	import { tabs } from '../constants';
	import { onDestroy, onMount, tick } from 'svelte';
	import type {
		HoldingsPromise,
		IOPtimsiePortfolioData,
		InvestmentEntity,
		InvestmentSummary,
		SummaryPromise
	} from '$lib/types/IInvestments';
	import {
		allTabClickedAnalytics,
		angeloneTabClickedAnalytics,
		fundForYouClickAnalytics,
		fundForYouImpressionAnalytics,
		investmentDashboardImpressionAnalytics,
		switchToDirectImpressionAnalytics
	} from '../analytics';
	import { regularToDirectFundsStore } from '$lib/stores/RegularToDirectFundStore';
	import { goto } from '$app/navigation';
	import { ctNudgeStore } from '$lib/stores/CtNudgeStore';
	import Clevertap from '$lib/utils/Clevertap';
	import ClevertapNudgeComponent from '$components/clevertap/ClevertapNudgeComponent.svelte';
	import type { ITab } from '$lib/types/ITab';
	import { debounce } from '$lib/utils/helpers/debounce';
	import InternalInvestmentsTab from './components/Internal/InternalInvestmentsTab.svelte';
	import InternalRightSide from './components/Internal/InternalRightSide.svelte';
	import ExternalInvestmentsRightSide from './components/External/ExternalInvestmentsRightSide.svelte';
	import { partialImportCheck } from '../utils';
	import PortfolioCardLoader from '$components/PortfolioCards/PortfolioCardLoader.svelte';
	import { INVESTMENT_TABS } from '$lib/constants/portfolio';
	import type { FamilyMemberTypes } from '$lib/types/IFamilyPortfolio';
	import FamilyPortfolioEntryPoint from '$components/FamilyPortfolio/FamilyPortfolioEntryPoint.svelte';
	import { getFamilyMembers } from '$lib/api/familyPortfolio';
	import XirrModal from './components/Internal/XirrModal.svelte';
	import OptimisePortfolioModal from './components/OptimisePortfolioModal.svelte';

	export let data: PageData;

	let isXIRRModalOpen = false;
	let isOptimisePortfolioOpen = false;
	let externalInvestmentSummary: Promise<SummaryPromise> | InvestmentSummary;
	let externalInvestmentHoldings: Promise<HoldingsPromise> | InvestmentEntity[];
	$: externalInvestmentSummary = data.api.externalInvestmentSummary;
	$: externalInvestmentHoldings = data.api.externalInvestment;
	let partialImportedFundCount = 0;
	let totalImportedFundCount = data.length;
	let isPartialImport = false;
	let optimisePorfolioData: IOPtimsiePortfolioData = {
		isin: '',
		schemeCode: '',
		schemeName: '',
		logoUrl: ''
	};
	let holdings: Array<InvestmentEntity>;
	let investmentSummary: InvestmentSummary;
	let isFamilyPortfolio: boolean = appStore?.isFamilyPortfolioSelected($profileStore?.clientId);
	let currentOptimised: InvestmentEntity;

	$: isExternal = data?.isExternal;
	$: isMobile = $page?.data?.deviceType?.isMobile;

	const toggleXirrModal = () => {
		isXIRRModalOpen = !isXIRRModalOpen;
	};

	let cleavertap;
	const toggleOptimisePorfolioCard = () => {
		const investmentSummary = data?.investementSummary;
		fundForYouClickAnalytics({
			'Current Value': investmentSummary?.currentValue,
			'Total Investment': investmentSummary?.investedValue,
			'Overall Gain': `${investmentSummary?.returnsValue}(${investmentSummary?.returnsAbsolutePer}%)`,
			'Todays Loss': `${investmentSummary?.previousDayReturns}(${investmentSummary?.previousDayReturnPercentage}%)`,
			'Fund Name': holdings?.filter((holding) => {
				return {
					'Fund Name': holding?.schemeName,
					'Current Value': holding?.currentValue,
					'Total Investment': holding?.investedValue,
					'Overall Gain': `${holding?.returnsValue}(${holding?.returnsAbsolutePer}%)`
				};
			})
		});
		isOptimisePortfolioOpen = !isOptimisePortfolioOpen;
	};

	const switchToDirectFundsImpression = async () => {
		const response = await data.api.investment;
		if (
			$page?.data?.userDetails?.userType?.toUpperCase() === 'B2C' &&
			response?.status === 'success' &&
			Array.isArray(response.data.holdings) &&
			response.data.holdings.length > 0
		) {
			const regularFunds = regularToDirectFundsStore.filterRegularFunds(response.data.holdings);
			if (regularFunds?.length > 0) {
				switchToDirectImpressionAnalytics({
					switchableFunds: regularFunds?.length
				});
			}
		}
	};

	const initializeClevertapData = debounce(async () => {
		cleavertap = await Clevertap.initialized;
		cleavertap.event.push('MF Inv Dash Internal', {
			event_type: 'impression'
		});
	});

	const getFormattedFetchedFamilyMembers = (familyMembersList: FamilyMemberTypes[]) => {
		const selectedLinkedMembersFromStore = appStore?.getLinkedMembers()?.selected || [];

		if (selectedLinkedMembersFromStore?.length) {
			return (familyMembersList || [])?.map((member) => {
				member.selected =
					selectedLinkedMembersFromStore?.findIndex(
						(linkedMember) => linkedMember?.toLowerCase() === member?.party_code?.toLowerCase()
					) > -1;
				return member;
			});
		}

		return familyMembersList;
	};

	const filterAcceptedFamilyMembers = (list: FamilyMemberTypes[]) => {
		return list?.filter((member) => member?.status?.toLowerCase() === 'accepted');
	};

	const setFamilyMembersData = async () => {
		const token = $page?.data?.tokenObj?.userToken?.NTAccessToken;
		const { clientId } = $page?.data?.profile || {};

		const familyMembersData = await getFamilyMembers(token, clientId);

		const selfProfile: FamilyMemberTypes = {
			party_code: $profileStore?.clientId,
			nickname: $page.data?.profile?.clientDetails?.fullName,
			relation: 'Self',
			status: 'Accepted',
			selected: true
		};

		let familyMembersList: FamilyMemberTypes[] = familyMembersData?.data?.child_list || [];
		familyMembersList = [selfProfile, ...familyMembersList];
		familyMembersList = getFormattedFetchedFamilyMembers(familyMembersList);
		familyMembersList = filterAcceptedFamilyMembers(familyMembersList);

		familyStore?.set(familyMembersList);
		isFamilyPortfolio = appStore?.isFamilyPortfolioSelected($profileStore?.clientId);
	};

	let impressionEventInterval: ReturnType<typeof setInterval>;

	const investmentDashboardImpressionAnalyticsFunc = (investmentSummary) => {
		let familyList = familyStore?.getFamilyMembersDetails() || [];
		let Allclients = familyList?.map((member) => member?.party_code);
		let Selected_client_codes: string[] = [];
		familyList?.forEach((member) => {
			if (member?.selected) {
				Selected_client_codes.push(member?.party_code);
			}
		});

		impressionEventInterval = setInterval(() => {
			Allclients = [];
			Selected_client_codes = [];
			familyList = familyStore?.getFamilyMembersDetails() || [];
			Allclients = familyList?.map((member) => member?.party_code);
			familyList?.forEach((member) => {
				if (member?.selected) {
					Selected_client_codes.push(member?.party_code);
				}
			});

			if (familyList?.length) {
				clearInterval(impressionEventInterval);
				const eventMetaData = {
					'Current Value': investmentSummary?.currentValue,
					'Total Investment': investmentSummary?.investedValue,
					'Overall Gain': `${investmentSummary?.returnsValue}(${investmentSummary?.returnsAbsolutePer}%)`,
					'Todays Loss': `${investmentSummary?.previousDayReturns}(${investmentSummary?.previousDayReturnPercentage}%)`,
					Funds: holdings?.filter((holding) => {
						return {
							'Fund Name': holding?.schemeName,
							'Current Value': holding?.currentValue,
							'Total Investment': holding?.investedValue,
							'Overall Gain': `${holding?.returnsValue}(${holding?.returnsAbsolutePer}%)`
						};
					}),
					family_portfolio_visible: familyList?.length > 1,
					portfoliotype: familyList?.length > 1 ? (isFamilyPortfolio ? 'Family' : 'Self') : 'Null',
					Allclients,
					Selected_client_codes
				};

				investmentDashboardImpressionAnalytics(eventMetaData);
			}
		}, 100);
	};

	const fundForYouImpressionAnalyticsFunc = (investmentSummary) => {
		const eventMetaData = {
			'Current Value': investmentSummary?.currentValue,
			'Total Investment': investmentSummary?.investedValue,
			'Overall Gain': `${investmentSummary?.returnsValue}(${investmentSummary?.returnsAbsolutePer}%)`,
			'Todays Loss': `${investmentSummary?.previousDayReturns}(${investmentSummary?.previousDayReturnPercentage}%)`,
			Funds: holdings?.filter((holding) => {
				return {
					'Fund Name': holding?.schemeName,
					'Current Value': holding?.currentValue,
					'Total Investment': holding?.investedValue,
					'Overall Gain': `${holding?.returnsValue}(${holding?.returnsAbsolutePer}%)`
				};
			})
		};

		fundForYouImpressionAnalytics(eventMetaData);
	};

	onMount(async () => {
		initializeClevertapData();
		await tick();

		setFamilyMembersData();

		investmentSummary = data?.investementSummary;

		investmentDashboardImpressionAnalyticsFunc(investmentSummary);
		switchToDirectFundsImpression();

		let optimizedData = await data?.api?.getOptimisePortfolioData;
		optimisePorfolioData = optimizedData?.recommendedScheme?.[0];
		if (
			optimisePorfolioData?.schemeCode &&
			optimisePorfolioData?.schemeName &&
			optimisePorfolioData?.isin
		) {
			fundForYouImpressionAnalyticsFunc(investmentSummary);
		}
		let holdingsData = await data?.api?.investment;
		holdings = holdingsData?.data?.holdings;
		currentOptimised = holdings?.find((x) => x.sipEnabled) || ({} as InvestmentEntity);

		return () => {
			if (impressionEventInterval !== undefined) {
				clearInterval(impressionEventInterval);
			}
		};
	});

	onDestroy(() => {
		initializeClevertapData.cancel();
	});

	let activeTab: string;
	$: activeTab =
		new Map($page.url.searchParams)?.get('type')?.toLocaleLowerCase() ||
		(data?.isExternal ? INVESTMENT_TABS.ALL.value : INVESTMENT_TABS.ANGEL_ONE.value);

	const navigateToTef = () => {
		const tefTab: ITab[] = tabs.filter((tab) => tab.name === 'All');
		tefTab[0]?.onClick();
	};
	const initiateTabClickAnalyticsClientSide = (data: InvestmentSummary) => {
		const summary = data?.data?.summary;

		if (summary?.lastImportStatus === 'FAILED' && summary?.investedValue === 0) {
			// ERROR FETCHING YOUR INVESTMENTS
			allTabClickedAnalytics({ Status: 'Failure', message: 'Import Funds Failed' });
		} else if (
			(summary?.lastImportStatus === 'STARTED' || summary?.lastImportStatus === 'PENDING') &&
			summary?.investedValue === 0
		) {
			// FETCHING IN PROGRESS
			allTabClickedAnalytics({ Status: 'Success', message: 'Fetching External Investments' });
		} else if (summary?.lastImportStatus === 'COMPLETED' && summary?.investedValue === 0) {
			//NO INVESTMENT FOUND
			allTabClickedAnalytics({ Status: 'Success', message: 'No investments found' });
		} else if (summary?.lastImportStatus === 'COMPLETED' && summary?.investedValue !== 0) {
			// SUCCESS SCENARIO - Full / Partial import
			allTabClickedAnalytics({ Status: 'Success' });
		}
	};
	const switchTabs = async (val: string) => {
		if (val !== activeTab) {
			activeTab = val;
			if (val === 'Angel One') {
				angeloneTabClickedAnalytics();
				goto('./investments');
			} else if (val === INVESTMENT_TABS.ALL.value) {
				const summaryResponse = await externalInvestmentSummary;
				initiateTabClickAnalyticsClientSide(summaryResponse);
				goto('./investments?type=all');
			}
		}
	};
	const setSuccessScenarioParams = (data: InvestmentEntity[]) => {
		const partialImports =
			(Array.isArray(data) &&
				data.filter((fund) => {
					return partialImportCheck(fund);
				})) ||
			[];
		partialImportedFundCount = partialImports.length;
		totalImportedFundCount = data.length;
		isPartialImport = isExternal && partialImports.length > 0;
		return true;
	};
</script>

<SEO
	seoTitle="Your Mutual Funds Investment | Angel One"
	seoDescription="Get Access to your Mutual Funds investment here. Check and enhance mutual funds investment portfolio better with Angel One."
/>

<section>
	<section class="mb-6 mt-3 hidden md:block">
		<FamilyPortfolioEntryPoint />
	</section>
	<Tabs
		class="!shadow-csm "
		{activeTab}
		items={[
			{
				tabId: 'Angel One',
				title: {
					label: 'Angel One'
				},
				styles: {
					default:
						'h-16 !text-body !text-sm !font-normal rounded-none normal-case pt-4 pb-4 w-1/2 hover:border-border bg-background',
					active: '!border-b-[3px] !text-primary !pb-4 !border-primary hover:!border-primary'
				},
				content: {
					component: InternalInvestmentsTab,
					props: {
						data
					}
				},
				animation: {
					animation: isMobile,
					x: '-100%',
					duration: 500
				}
			},
			{
				tabId: INVESTMENT_TABS.ALL.value,
				title: {
					label: INVESTMENT_TABS.ALL.label
				},
				styles: {
					default:
						'h-16 !text-body !text-sm !font-normal rounded-none normal-case pt-4 pb-4 w-1/2 hover:border-border',
					active: '!border-b-[3px] !text-primary !pb-4 !border-primary hover:!border-primary'
				},
				content: {
					component: ExternalInvestments,
					props: {
						data,
						isFamilyPortfolio
					}
				},
				animation: {
					animation: isMobile,
					x: '100%',
					duration: 500
				}
			}
		]}
		classes={{
			tabsContainer:
				'scroll-lock overflow-auto sticky md:static top-0 z-60 !border-b-0 !bg-background-alt !shadow-csm rounded-t-lg'
		}}
		onChange={switchTabs}
	/>
</section>

{#if !isMobile && activeTab === INVESTMENT_TABS.ANGEL_ONE.value}
	<InternalRightSide
		{data}
		on:showXirr={toggleXirrModal}
		on:openOptimisePortfolio={toggleOptimisePorfolioCard}
	/>
{/if}
{#if !isMobile && activeTab === INVESTMENT_TABS.ALL.value}
	{#await externalInvestmentSummary}
		<section class="col-span-1 row-start-1 sm:col-span-1 sm:col-start-2 sm:row-span-3">
			<PortfolioCardLoader />
		</section>
	{:then response}
		{#await externalInvestmentHoldings}
			<section class="col-span-1 row-start-1 sm:col-span-1 sm:col-start-2 sm:row-span-3">
				<PortfolioCardLoader />
			</section>
		{:then res}
			{#if setSuccessScenarioParams(res.data?.holdings || []) && !isFamilyPortfolio}
				<ExternalInvestmentsRightSide
					investmentSummary={response.data?.summary}
					{partialImportedFundCount}
					{totalImportedFundCount}
					{isPartialImport}
				/>
			{/if}
		{/await}
	{/await}
{/if}

{#if isXIRRModalOpen}
	<!-- XIRR Modal -->
	<XirrModal {isXIRRModalOpen} on:closeModal={toggleXirrModal} />
{/if}

{#if $ctNudgeStore?.kv?.topic === 'mf_trackext_invdash_type_a'}
	<ClevertapNudgeComponent
		class="fixed bottom-18 -ml-2 flex w-full items-center align-middle sm:hidden"
		data={$ctNudgeStore}
		on:onCTAClicked={navigateToTef}
	/>
{/if}

{#if isOptimisePortfolioOpen}
	<OptimisePortfolioModal
		currentScheme={currentOptimised}
		{investmentSummary}
		{toggleOptimisePorfolioCard}
		{optimisePorfolioData}
	/>
{/if}
