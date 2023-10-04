<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$components/Card.svelte';
	import Button from '$components/Button.svelte';
	import GraphTableChart from './components/GraphTableChart.svelte';
	import type {
		DistributionType,
		DistributionListType,
		CompaniesTableObject,
		TableDataTypes,
		ChartAndTable
	} from '$lib/types/IPortfolioDetails';
	import type { FolioSummaryTypes } from '$lib/types/IInvestments';
	import AssetAnalysisIcon from '$lib/images/icons/AssetAnalysisIcon.svelte';
	export let distributions: Array<DistributionType>;
	export let summary: FolioSummaryTypes;
	$: deviceType = $page.data.deviceType;

	import {
		equityDebtTabSwitchAnalytics,
		marketCapShowCompaniesCtaAnalytics,
		sectorsShowCompaniesCtaAnalytics,
		instrumentsShowCompaniesCtaAnalytics,
		ratingsShowCompaniesCtaAnalytics,
		filterByInstrumentsAnalytics,
		filterByRatingsAnalytics
	} from '../analytics';

	const distributionsList: Array<DistributionListType> = [];
	let showFundsFilterTable = '';
	let equityTotalAmount = 0;
	let debtTotalAmount = 0;
	let equityTotalPercentage = 0;
	let debtTotalPercentage = 0;

	Array.isArray(distributions) &&
		distributions.forEach((item) => {
			Array.isArray(distributionsList) &&
				distributionsList.push({
					...item,
					name: item?.companyName,
					percentageHold: item?.allocatedPer,
					amountValue: item?.allocatedValue
				});
		});

	const distributionsCategories = new Map();
	const distributionsMarketCaps = new Map();
	const distributionsSectors = new Map();
	const distributionsInstruments = new Map();
	const distributionsRatings = new Map();

	/**
	 * getDistributionsTypeCount: Get distributions type counts for each distribution data.
	 *
	 */
	const getDistributionsTypeCount = () => {
		distributionsList?.forEach((item: DistributionListType) => {
			if (distributionsCategories?.get(item?.category)) {
				distributionsCategories?.set(
					item?.category,
					distributionsCategories?.get(item?.category) + 1
				);
			} else {
				distributionsCategories?.set(item?.category, 1);
			}

			if (distributionsMarketCaps?.get(item?.marketCap)) {
				distributionsMarketCaps?.set(
					item?.marketCap,
					distributionsMarketCaps?.get(item?.marketCap) + 1
				);
			} else {
				distributionsMarketCaps?.set(item?.marketCap, 1);
			}

			if (distributionsSectors?.get(item?.sector)) {
				distributionsSectors?.set(item?.sector, distributionsSectors?.get(item?.sector) + 1);
			} else {
				distributionsSectors?.set(item?.sector, 1);
			}

			if (distributionsInstruments?.get(item?.instrument)) {
				distributionsInstruments?.set(
					item?.instrument,
					distributionsInstruments?.get(item?.instrument) + 1
				);
			} else {
				distributionsInstruments?.set(item?.instrument, 1);
			}

			if (distributionsRatings?.get(item?.rating)) {
				distributionsRatings?.set(item?.rating, distributionsRatings?.get(item?.rating) + 1);
			} else {
				distributionsRatings?.set(item?.rating, 1);
			}
		});
	};

	getDistributionsTypeCount();

	const distributionsCategoriesCounts = [...distributionsCategories.entries()];
	const distributionsMarketCapsCounts = [...distributionsMarketCaps.entries()];
	const distributionsSectorsCounts = [...distributionsSectors.entries()];
	const distributionsInstrumentsCounts = [...distributionsInstruments.entries()];
	const distributionsRatingsCounts = [...distributionsRatings.entries()];

	/**
	 * getFilterTypesArray: Get filter types list (array) for each distribution, using distributionsCounts for each type.
	 *
	 * @param {Array} countsList
	 *
	 * @return {Array<string>} filterArray
	 */
	const getFilterTypesArray = (countsList: [string, number][] = []) => {
		const filterArray: Array<string> = [];

		countsList?.forEach((item, index) => {
			if (index < 5 && item[0]?.length) {
				filterArray.push(item[0]);
			}
		});

		if (countsList?.length > 5) {
			filterArray.push('All');
		}

		return filterArray;
	};

	const categoriesFilterTypes: string[] = getFilterTypesArray(distributionsCategoriesCounts);
	const marketCapsFilterTypes: string[] = getFilterTypesArray(distributionsMarketCapsCounts);
	const sectorsFilterTypes: string[] = getFilterTypesArray(distributionsSectorsCounts);
	const instrumentsFilterTypes: string[] = getFilterTypesArray(distributionsInstrumentsCounts);
	const ratingsFilterTypes: string[] = getFilterTypesArray(distributionsRatingsCounts);

	/**
	 * filterData: Get filtered data for each distribution type using filteres.
	 *
	 * @param {string} type
	 * @param {string} value
	 *
	 * @return {Array<DistributionListType>} filteredData
	 */
	const filterData = (type: keyof DistributionListType, value: string) => {
		const filteredData: Array<DistributionListType> = [];

		distributionsList?.forEach((item: DistributionListType) => {
			if (item[type] === value || value === 'All') {
				filteredData.push(item);
			}
		});

		const uniqueCompanyNamesList: Array<string> = [];
		const distinctFilteredDistributionList: Array<CompaniesTableObject> = [];

		filteredData?.forEach((item) => {
			if (uniqueCompanyNamesList?.indexOf(item?.companyName) < 0) {
				uniqueCompanyNamesList.push(item?.companyName);
			}
		});

		// this is to get filtered data with unique company names (aggregate duplicate companies data)
		uniqueCompanyNamesList?.forEach((companyName) => {
			const particularCompanyList: Array<DistributionListType> = [];

			filteredData?.forEach((filteredItem) => {
				if (filteredItem?.companyName === companyName) {
					particularCompanyList.push(filteredItem);
				}
			});

			let totalPercentageHold = 0;
			let totalAmountValue = 0;

			particularCompanyList?.forEach((item) => {
				totalPercentageHold += item?.percentageHold;
				totalAmountValue += item?.amountValue;
			});

			const distributionObject: CompaniesTableObject = {
				name: companyName,
				companyName,
				percentageHold: totalPercentageHold,
				amountValue: totalAmountValue
			};

			distinctFilteredDistributionList.push(distributionObject);
		});

		return distinctFilteredDistributionList;
	};

	let categoriesFilteredData: Array<CompaniesTableObject> = filterData(
		'category',
		categoriesFilterTypes?.[0]
	);
	let marketCapsFilteredData: Array<CompaniesTableObject> = filterData(
		'marketCap',
		marketCapsFilterTypes?.[0]
	);
	let sectorsFilteredData: Array<CompaniesTableObject> = filterData(
		'sector',
		sectorsFilterTypes?.[0]
	);
	let instrumentsFilteredData: Array<CompaniesTableObject> = filterData(
		'instrument',
		instrumentsFilterTypes?.[0]
	);
	let ratingsFilteredData: Array<CompaniesTableObject> = filterData(
		'rating',
		ratingsFilterTypes?.[0]
	);

	let selectedCategoryFilterIndex = 0;
	let selectedMarketCapFilterIndex = 0;
	let selectedSectorFilterIndex = 0;
	let selectedInstrumentFilterIndex = 0;
	let selectedRatingFilterIndex = 0;

	/**
	 * handleFilterChange: This function updates filtered table data for the selected distribution filter.
	 *
	 * @param {string} type
	 * @param {number} index
	 */
	const handleFilterChange = (e: { detail: { type: string; index: number } }) => {
		let type = e.detail.type;
		let index = e.detail.index;
		if (type === 'category') {
			selectedCategoryFilterIndex = index;
			categoriesFilteredData = filterData(type, categoriesFilterTypes?.[index]);
		} else if (type === 'marketCap') {
			selectedMarketCapFilterIndex = index;
			marketCapsFilteredData = filterData(type, marketCapsFilterTypes?.[index]);
		} else if (type === 'sector') {
			selectedSectorFilterIndex = index;
			sectorsFilteredData = filterData(type, sectorsFilterTypes?.[index]);
		} else if (type === 'instrument') {
			selectedInstrumentFilterIndex = index;
			instrumentsFilteredData = filterData(type, instrumentsFilterTypes?.[index]);

			filterByInstrumentsAnalytics({
				FilterByInstruments: instrumentsFilterTypes?.[index]
			});
		} else if (type === 'rating') {
			selectedRatingFilterIndex = index;
			ratingsFilteredData = filterData(type, ratingsFilterTypes?.[index]);

			filterByRatingsAnalytics({
				FilterByRatings: ratingsFilterTypes?.[index]
			});
		}
	};

	/**
	 * getChartData: To get chart data (for pie chart and graph table)
	 *
	 * @param {string} type
	 * @param {Array<string>} filterTypeList
	 *
	 * @return {Array<TableDataTypes>} dataArray
	 */
	const getChartData = (
		type: keyof DistributionListType,
		filterTypeList: string[],
		realCount: number
	) => {
		let dataArray: TableDataTypes[] = [];

		filterTypeList?.forEach((filter: string, index: number) => {
			dataArray.push({
				name: filter,
				percentageHold: 0,
				amountValue: 0
			});

			distributionsList?.forEach((item: DistributionListType) => {
				if (item[type] === filter) {
					if (type === 'marketCap' || type === 'sector') {
						if (item.category === 'Equity') {
							dataArray[index].percentageHold += item?.allocatedPer;
							dataArray[index].amountValue += item?.allocatedValue;
						}
					} else if (type === 'instrument' || type === 'rating') {
						if (item.category === 'Debt') {
							dataArray[index].percentageHold += item?.allocatedPer;
							dataArray[index].amountValue += item?.allocatedValue;
						}
					} else {
						dataArray[index].percentageHold += item?.allocatedPer;
						dataArray[index].amountValue += item?.allocatedValue;
					}
				}
			});
		});

		if (realCount >= 5) {
			let totalAllocatedPer = 0;
			let totalAllocatedValue = 0;
			dataArray?.forEach((data) => {
				totalAllocatedPer += data?.percentageHold;
				totalAllocatedValue += data?.amountValue;
			});

			dataArray.push({
				name: 'Others',
				percentageHold:
					100 -
					(type === 'marketCap' || type === 'sector'
						? debtTotalPercentage
						: equityTotalPercentage) -
					totalAllocatedPer,
				amountValue:
					summary?.currentValue -
					(type === 'marketCap' || type === 'sector' ? debtTotalAmount : equityTotalAmount) -
					totalAllocatedValue
			});
		}

		dataArray = dataArray.filter((item) => item.name !== 'All');

		return dataArray;
	};

	const categoriesChartData: Array<TableDataTypes> = getChartData(
		'category',
		categoriesFilterTypes,
		distributionsCategoriesCounts?.length
	);

	/**
	 * setEquityDebtAmounts: This function sets equityTotalAmount, debtTotalAmount, equityTotalPercentage, debtTotalPercentage.
	 *
	 */
	const setEquityDebtAmounts = () => {
		categoriesChartData?.forEach((data) => {
			if (data?.name === 'Equity') {
				equityTotalAmount = data?.amountValue;
				equityTotalPercentage = data?.percentageHold;
			} else if (data?.name === 'Debt') {
				debtTotalAmount = data?.amountValue;
				debtTotalPercentage = data?.percentageHold;
			}
		});
	};

	setEquityDebtAmounts();

	const marketCapsChartData: Array<TableDataTypes> = getChartData(
		'marketCap',
		marketCapsFilterTypes,
		distributionsMarketCapsCounts?.length
	);

	const sectorsChartData: Array<TableDataTypes> = getChartData(
		'sector',
		sectorsFilterTypes,
		distributionsSectorsCounts?.length
	);
	const instrumentsChartData: Array<TableDataTypes> = getChartData(
		'instrument',
		instrumentsFilterTypes,
		distributionsInstrumentsCounts?.length
	);
	const ratingsChartData: Array<TableDataTypes> = getChartData(
		'rating',
		ratingsFilterTypes,
		distributionsRatingsCounts?.length
	);

	const graphColors = ['#667FFF', '#FFD26C', '#3AD5E6', '#8241F2', '#129E90', '#D75B57'];

	const handleToggleFilterTable = (
		val:
			| {
					detail: {
						type: 'string';
					};
			  }
			| string
	) => {
		const value = val && typeof val === 'object' && val?.detail?.type ? val.detail.type : '';
		showCompaniesHoldingsCtaAnalytics(value);
		showFundsFilterTable = showFundsFilterTable === value ? '' : value;

		// reset selected filter
		selectedCategoryFilterIndex = 0;
		selectedMarketCapFilterIndex = 0;
		selectedSectorFilterIndex = 0;
		selectedInstrumentFilterIndex = 0;
		selectedRatingFilterIndex = 0;
	};

	let showEquityDebt: keyof ChartAndTable =
		equityTotalAmount > 0 ? 'EQUITY' : debtTotalAmount > 0 ? 'DEBT' : '';
	const toggleEquityDebt = (value: string) => {
		showEquityDebt = value;
		handleToggleFilterTable('');
		() => toggleShowIndexedChartForMobile(0);
		equityDebtTabSwitchAnalyticsFunc();
	};

	let showIndexedChartForMobile = 0;

	const toggleShowIndexedChartForMobile = (index: number) => {
		showIndexedChartForMobile = index;
	};

	const inactiveButtonClass =
		'font-normal bg-white !text-black-title/80 border hover:bg-inherit border-grey-primary';
	const inactiveMobileButtonClass =
		'font-normal bg-white text-black-title/80 border-0 border-white';
	const disabledClass = '!border-grey-line !bg-white';

	const equityDebtTabSwitchAnalyticsFunc = () => {
		const eventMetaData = {
			MainCategory: `Equity (${equityTotalPercentage?.toFixed(
				2
			)}%) / Debt (${debtTotalPercentage?.toFixed(2)}%)`
		};
		equityDebtTabSwitchAnalytics(eventMetaData);
	};

	const showCompaniesHoldingsCtaAnalytics = (value: string) => {
		if (value === 'marketCap') {
			marketCapShowCompaniesCtaAnalytics();
		} else if (value === 'sector') {
			sectorsShowCompaniesCtaAnalytics();
		} else if (value === 'instrument') {
			instrumentsShowCompaniesCtaAnalytics();
		} else if (value === 'rating') {
			ratingsShowCompaniesCtaAnalytics();
		}
	};
	let tableChartData: ChartAndTable;
	$: tableChartData = {
		EQUITY: [
			{
				type: 'marketCap',
				parentId: 'marketCapsDistributionChart',
				subLabel: 'Market Cap',
				nameColumnHeader: 'Market Cap',
				nameColumnHeaderForFunds: 'Equity Funds',
				footerText: 'Holdings',
				currentValue: equityTotalAmount,
				chartsData: marketCapsChartData,
				filterTypes: marketCapsFilterTypes,
				filteredData: marketCapsFilteredData,
				selectedFilterIndex: selectedMarketCapFilterIndex
			},
			{
				type: 'sector',
				parentId: 'sectorsDistributionChart',
				subLabel: 'Sectors',
				nameColumnHeader: 'Sectors',
				nameColumnHeaderForFunds: 'Sectors',
				footerText: 'Companies',
				currentValue: equityTotalAmount,
				chartsData: sectorsChartData,
				filterTypes: sectorsFilterTypes,
				filteredData: sectorsFilteredData,
				selectedFilterIndex: selectedSectorFilterIndex
			}
		],
		DEBT: [
			{
				type: 'instrument',
				parentId: 'instrumentsDistributionChart',
				subLabel: 'Instruments',
				nameColumnHeader: 'Instrument Type',
				nameColumnHeaderForFunds: 'Issuer name',
				footerText: 'Holdings',
				currentValue: debtTotalAmount,
				chartsData: instrumentsChartData,
				filterTypes: instrumentsFilterTypes,
				filteredData: instrumentsFilteredData,
				selectedFilterIndex: selectedInstrumentFilterIndex
			},
			{
				type: 'rating',
				parentId: 'ratingsDistributionChart',
				subLabel: 'Ratings',
				nameColumnHeader: 'Ratings',
				nameColumnHeaderForFunds: 'Sectors',
				footerText: 'Companies',
				currentValue: debtTotalAmount,
				chartsData: ratingsChartData,
				filterTypes: ratingsFilterTypes,
				filteredData: ratingsFilteredData,
				selectedFilterIndex: selectedRatingFilterIndex
			}
		]
	};
</script>

<section class="mt-2 lg:mt-4">
	<Card class="!p-0">
		<svelte:fragment slot="header">
			<section
				class="flex items-center justify-between border-b border-grey-line p-4 text-lg md:px-6 md:py-5 lg:border-0"
			>
				<section class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
						<AssetAnalysisIcon />
					</div>
					<div class="ml-4 flex flex-col">
						<span class="text-left text-base font-normal text-black-title md:text-lg"
							>Asset Class Analysis</span
						>
						<span class="text-left text-xs font-normal text-grey-body md:text-sm"
							>Category wise fund analysis</span
						>
					</div>
				</section>
			</section>
		</svelte:fragment>

		<section class="border-t lg:block">
			<GraphTableChart
				type="category"
				parentId="categoriesDistributionChart"
				subLabel="Equity vs Debt"
				nameColumnHeader="Category"
				nameColumnHeaderForFunds="Equity Funds"
				footerText="Funds"
				currentValue={summary?.currentValue}
				chartsData={categoriesChartData}
				{graphColors}
				filterTypes={categoriesFilterTypes}
				filteredData={categoriesFilteredData}
				selectedFilterIndex={selectedCategoryFilterIndex}
				showColor={true}
				showCompaniesFooter={true}
				viewMoreFooter={true}
				showFundsFilterTable={showFundsFilterTable === 'category'}
				class="hidden lg:flex"
				on:filterChange={handleFilterChange}
				on:toggleFilterTable={(type) => handleToggleFilterTable(type)}
			/>
			{#if equityTotalAmount > 0 || debtTotalAmount > 0}
				<article class="hidden px-20 pt-8 lg:block">
					<article class="flex">
						<Button
							class={`!w-40 !rounded-r-none !px-6 !py-3 ${
								showEquityDebt === 'DEBT' ? inactiveButtonClass : ''
							} ${equityTotalAmount <= 0 ? disabledClass : ''}`}
							variant={showEquityDebt === 'DEBT' ? 'outlined' : 'contained'}
							color={showEquityDebt === 'DEBT' ? 'secondary' : 'primary'}
							disabled={equityTotalAmount <= 0}
							onClick={() => toggleEquityDebt('EQUITY')}
						>
							Equity
						</Button>
						<Button
							class={`!w-40 !rounded-l-none !px-6 !py-3 ${
								showEquityDebt === 'EQUITY' ? inactiveButtonClass : ''
							} ${debtTotalAmount <= 0 ? disabledClass : ''}`}
							variant={showEquityDebt === 'EQUITY' ? 'outlined' : 'contained'}
							color={showEquityDebt === 'EQUITY' ? 'secondary' : 'primary'}
							disabled={debtTotalAmount <= 0}
							onClick={() => toggleEquityDebt('DEBT')}
						>
							Debt
						</Button>
					</article>
				</article>
			{/if}
			{#if equityTotalAmount > 0 || debtTotalAmount > 0}
				<article class="lg:hidden">
					<article class="flex border-b">
						<Button
							class={`w-1/2 !rounded-none !bg-white !py-5 font-medium !text-blue-primary ${
								showEquityDebt === 'DEBT'
									? inactiveMobileButtonClass
									: 'border-b-[3px] !border-b-blue-primary'
							} `}
							disabled={equityTotalAmount <= 0}
							onClick={() => toggleEquityDebt('EQUITY')}
						>
							Equity ({equityTotalPercentage?.toFixed(2)}%)
						</Button>
						<Button
							class={`w-1/2 !rounded-none !bg-white !py-5 font-medium !text-blue-primary ${
								showEquityDebt === 'EQUITY'
									? inactiveMobileButtonClass
									: 'border-b-[3px] !border-b-blue-primary'
							} `}
							disabled={debtTotalAmount <= 0}
							onClick={() => toggleEquityDebt('DEBT')}
						>
							Debt ({debtTotalPercentage?.toFixed(2)}%)
						</Button>
					</article>
				</article>
			{/if}

			<article class="px-20 pb-5 pt-10 lg:hidden">
				<article class="flex">
					<Button
						class={`mr-1 rounded !py-2 !font-normal ${
							showIndexedChartForMobile === 1 ? inactiveButtonClass : ''
						}`}
						variant={showIndexedChartForMobile === 1 ? 'outlined' : 'contained'}
						color={showIndexedChartForMobile === 1 ? 'secondary' : 'primary'}
						onClick={() => toggleShowIndexedChartForMobile(0)}
					>
						{showEquityDebt === 'EQUITY' ? 'Market Cap' : 'Instruments'}
					</Button>
					<Button
						class={`ml-1 rounded !py-2 !font-normal ${
							showIndexedChartForMobile === 0 ? inactiveButtonClass : ''
						}`}
						variant={showIndexedChartForMobile === 0 ? 'outlined' : 'contained'}
						color={showIndexedChartForMobile === 0 ? 'secondary' : 'primary'}
						onClick={() => toggleShowIndexedChartForMobile(1)}
					>
						{showEquityDebt === 'EQUITY' ? 'Sectors' : 'Ratings'}
					</Button>
				</article>
			</article>

			{#if deviceType?.isMobile}
				<GraphTableChart
					type={tableChartData[showEquityDebt][showIndexedChartForMobile].type}
					parentId={tableChartData[showEquityDebt][showIndexedChartForMobile].parentId}
					subLabel={tableChartData[showEquityDebt][showIndexedChartForMobile].subLabel}
					nameColumnHeader={tableChartData[showEquityDebt][showIndexedChartForMobile]
						.nameColumnHeader}
					nameColumnHeaderForFunds={tableChartData[showEquityDebt][showIndexedChartForMobile]
						.nameColumnHeaderForFunds}
					footerText={tableChartData[showEquityDebt][showIndexedChartForMobile].footerText}
					currentValue={tableChartData[showEquityDebt][showIndexedChartForMobile].currentValue}
					chartsData={tableChartData[showEquityDebt][showIndexedChartForMobile].chartsData}
					{graphColors}
					filterTypes={tableChartData[showEquityDebt][showIndexedChartForMobile].filterTypes}
					filteredData={tableChartData[showEquityDebt][showIndexedChartForMobile].filteredData}
					selectedFilterIndex={tableChartData[showEquityDebt][showIndexedChartForMobile]
						.selectedFilterIndex}
					showColor={true}
					showCompaniesFooter={true}
					viewMoreFooter={true}
					showFundsFilterTable={showFundsFilterTable ===
						tableChartData[showEquityDebt][showIndexedChartForMobile].type}
					on:filterChange={handleFilterChange}
					on:toggleFilterTable={(type) => handleToggleFilterTable(type)}
				/>
			{:else if !deviceType?.isMobile}
				{#each tableChartData[showEquityDebt] as targetData (targetData.type)}
					<GraphTableChart
						type={targetData.type}
						parentId={targetData.parentId}
						subLabel={targetData.subLabel}
						nameColumnHeader={targetData.nameColumnHeader}
						nameColumnHeaderForFunds={targetData.nameColumnHeaderForFunds}
						footerText={targetData.footerText}
						currentValue={targetData.currentValue}
						chartsData={targetData.chartsData}
						{graphColors}
						filterTypes={targetData.filterTypes}
						filteredData={targetData.filteredData}
						selectedFilterIndex={targetData.selectedFilterIndex}
						showColor={true}
						showCompaniesFooter={true}
						viewMoreFooter={true}
						showFundsFilterTable={showFundsFilterTable === targetData.type}
						on:filterChange={handleFilterChange}
						on:toggleFilterTable={(type) => handleToggleFilterTable(type)}
					/>
				{/each}
			{/if}
		</section>
	</Card>
</section>
