<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ChipArqRating from '$components/ChipArqRating.svelte';
	import type { NavDetails } from '$components/Scheme/types';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { tags } from '$lib/constants/tags';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { calculateYearDiffrence } from '$lib/utils';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { calculateLumpsumReturns } from '$lib/utils/helpers/returns';
	import { useFetch } from '$lib/utils/useFetch';
	import { addCommasToAmountString } from 'svelte-components';
	import FundOverviewTile from '../[fund_name]/FundComparison/FundOverviewTile.svelte';
	import type { PageData } from './$types';
	import Chart from './components/Chart.svelte';
	import FundComparisonLoader from './components/FundComparisonLoader.svelte';
	import FundSearch from './components/FundSearch.svelte';
	import Table from './components/Table.svelte';
	import TableWithAccordian from './components/TableWithAccordian.svelte';
	import ValueComponent from './components/ValueComponent.svelte';

	export let data: PageData;

	const rowsConfig = {
		lf: 3,
		mf: 2
	};
	const chartDatasetConfig = [
		{
			label: 'Amount',
			backgroundColor: (context: { chart: { chartArea; ctx } }) => {
				if (!context.chart.chartArea) {
					return;
				}
				const {
					ctx,
					chartArea: { top, bottom }
				} = context.chart;
				const bgGradient = ctx.createLinearGradient(0, top, 0, bottom);
				bgGradient.addColorStop(0, 'rgba(30, 199, 182, 0.24)');
				bgGradient.addColorStop(1, 'rgba(30, 199, 182, 0)');
				return bgGradient;
			},
			borderColor: '#1EC7B6',
			yAxisID: 'y',
			fill: true
		},
		{
			label: 'Amount',
			borderColor: '#F9BA4D',
			yAxisID: 'y',
			fill: true,
			backgroundColor: 'transparent'
		},
		{
			label: 'Amount',
			borderColor: '#581DBE',
			yAxisID: 'y',
			fill: true,
			backgroundColor: 'transparent'
		}
	];

	let pastReturns = [];
	let fundBasics = [];
	let ratings = [];
	let sectors = [];
	let holdings = [];
	let meta = [];
	let chartMetaData = [];
	let chartNavData: Array<Array<NavDetails>> = [];
	let lineData = {};
	const lineChartOptions = {
		maintainAspectRatio: false,
		elements: {
			point: {
				borderWidth: 6, // make responsive
				pointRadius: 10, // make responsive
				hoverRadius: 10, // make responsive
				hoverBorderWidth: 6 // make responsive
			}
		},
		scales: {
			y: {
				type: 'linear',
				display: 'auto',
				position: 'left',
				grid: {
					display: true,
					drawOnChartArea: true
				},
				border: {
					display: false
				},
				min: 0,
				max: 100,
				ticks: {
					stepSize: 50,
					beginAtZero: false,
					autoSkip: false,
					callback: function (value: number) {
						if (lineChartOptions.scales.y.max - lineChartOptions.scales.y.min >= 10)
							return '₹' + value.toFixed(0).toString();
						else return '₹' + value.toFixed(1).toString();
					}
				}
			}
		},
		layout: {
			padding: {
				left: 5
			}
		}
	};
	let schemeDetailsList: SchemeDetails[] = [];
	let selectedTag = 4;

	$: schemesSelected = schemeDetailsList?.reduce((accumulator, element) => {
		if (element?.schemeCode) {
			return accumulator + 1;
		}
		return accumulator;
	}, 0);

	let showSearch = false;

	const toggleSearch = () => {
		showSearch = !showSearch;
	};

	const addFund = (schemeCode: string, isin: string) => {
		const params = {
			comparisionArr: [
				...data.comparisionArr,
				{
					isin,
					schemeCode
				}
			]
		};
		goto(`fundcomparision?params=${encodeObject(params)}`, {
			replaceState: true
		});
	};

	const deleteFund = (index: number) => {
		data.comparisionArr.splice(index, 1);
		const params = {
			comparisionArr: data.comparisionArr
		};
		goto(`fundcomparision?params=${encodeObject(params)}`, {
			replaceState: true
		});
	};

	// chart helpers
	const getChartData = async (isin: string, months: number) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/nav?months=${months}&simulate=true&initialFund=1000`;
		const res = await useFetch(url, {});
		if (res.ok) {
			return res.data || [];
		}
		return [];
	};
	const fillChartData = (mutipleNavs: Array<Array<NavDetails>>) => {
		const lineChartData = {
			time: [],
			navs: []
		};

		let minAmount = Number.MAX_VALUE,
			maxAmount = 0;

		let maxNavsLength = 0,
			maxNavsIndex = 0;

		mutipleNavs.forEach((navs, navIndex) => {
			lineChartData.navs.push([]);
			if (maxNavsLength < navs?.length) {
				maxNavsLength = navs?.length;
				maxNavsIndex = navIndex;
			}
			navs?.forEach((nav) => {
				if (minAmount > nav.amount) {
					minAmount = nav.amount;
				}
				if (maxAmount < nav.amount) {
					maxAmount = nav.amount;
				}
				lineChartData.navs[navIndex].push(nav.amount);
			});
		});

		mutipleNavs?.[maxNavsIndex]?.forEach((nav) => {
			lineChartData.time.push(nav.date);
		});

		const datasets = lineChartData.navs.map((nav, index) => {
			return {
				...(chartDatasetConfig[index] || {}),
				data: nav
			};
		});

		// decrease the min by 2.5% and increase max by 2.5% as directed by product for scales
		minAmount = Math.round(0.975 * minAmount * 10) / 10;
		maxAmount = Math.round(1.025 * maxAmount * 10) / 10;
		let stepSize = Math.round(((minAmount + maxAmount) / 2) * 10) / 10;
		if (maxAmount - minAmount >= 10) {
			maxAmount = Math.round(maxAmount);
			minAmount = Math.round(minAmount);
			stepSize = Math.round(stepSize);
		}
		lineChartOptions.scales.y.max = maxAmount;
		lineChartOptions.scales.y.min = minAmount;
		lineChartOptions.scales.y.ticks.stepSize = stepSize;

		lineData = {
			labels: lineChartData.time,
			datasets
		};
	};
	const onTagClick = async (index: number) => {
		selectedTag = index;

		const promiseArray = data?.comparisionArr?.map(({ isin }) => {
			return getChartData(isin, tags[index].months);
		});

		const response = await Promise.all(promiseArray);
		chartNavData = response;
		fillChartData(chartNavData);
	};

	const initialiseData = () => {
		selectedTag = 4;
		pastReturns = [['1 Year'], ['3 Years'], ['5 Years'], ['All Time']];
		fundBasics = [
			['NAV'],
			['Expense Ratio'],
			['Exit Load'],
			['Fund Size'],
			['Fund Age'],
			['Asset Class'],
			['Sub Asset Class'],
			['Fund Type']
		];
		ratings = [['Angel One'], ['Morningstar'], ['Crisl'], ['Value Research']];
		sectors = [['1'], ['2'], ['3'], ['4'], ['5']];
		holdings = [['1'], ['2'], ['3'], ['4'], ['5']];
		meta = [['3Y Returns'], ['Minimum  SIP Investment'], ['Investors']];
		chartMetaData = [['Current Value'], ['Return %']];
		chartNavData = [];
		schemeDetailsList = [];
		fillChartData(chartNavData);
	};
	const formatComparisionData = async (promise) => {
		const totalRows = $page?.data?.deviceType?.isMobile ? rowsConfig['mf'] : rowsConfig['lf'];
		const response = await promise;
		const length = totalRows - response.length;
		for (let i = 0; i < length; i++) {
			response.push([
				{
					schemeData: {},
					holdingsData: [],
					chartsData: [],
					sectorData: []
				}
			]);
		}

		// initilaising everything
		initialiseData();

		response.forEach((element, index) => {
			schemeDetailsList.push(element.schemeData);
			//meta data
			meta[0].push(
				element.schemeData?.returns3yr ? `${element.schemeData?.returns3yr?.toFixed(2)}%` : ''
			);
			meta[1].push(
				element.schemeData?.minSipAmount
					? `₹${addCommasToAmountString(element.schemeData?.minSipAmount)}`
					: ''
			);
			meta[2].push(
				element.schemeData?.noOfClientInvested
					? `${addCommasToAmountString(element.schemeData?.noOfClientInvested)}`
					: ''
			);

			// chart meta data
			chartMetaData[0].push(
				element.schemeData?.returns3yr
					? {
							component: ValueComponent,
							type: 'component',
							props: {
								dotColor: chartDatasetConfig[index]?.borderColor,
								text: `₹${addCommasToAmountString(
									calculateLumpsumReturns(
										1000,
										3,
										element.schemeData?.returns3yr
									).matuarityAmount.toFixed(2)
								)}`
							}
					  }
					: ''
			);
			chartMetaData[1].push(
				element.schemeData?.returns3yr ? `${element.schemeData?.returns3yr?.toFixed(2)}%` : ''
			);
			// chart nav data
			chartNavData.push(element?.chartsData);

			// past returns
			pastReturns[0].push(
				element.schemeData?.returns1yr ? `${element.schemeData?.returns1yr?.toFixed(2)}%` : ''
			);
			pastReturns[1].push(
				element.schemeData?.returns3yr ? `${element.schemeData?.returns3yr?.toFixed(2)}%` : ''
			);
			pastReturns[2].push(
				element.schemeData?.returns5yr ? `${element.schemeData?.returns5yr?.toFixed(2)}%` : ''
			);
			pastReturns[3].push(
				element.schemeData?.returns5yr ? `${element.schemeData?.returns5yr?.toFixed(2)}%` : ''
			);

			// fund basics
			fundBasics[0].push(
				element.schemeData?.navValue ? `₹${element.schemeData?.navValue?.toFixed(2)}` : ''
			);
			fundBasics[1].push(
				element.schemeData?.expenseRatio ? `${element.schemeData?.expenseRatio?.toFixed(2)}%` : ''
			);
			fundBasics[2].push(element.schemeData?.exitLoadValue);
			fundBasics[3].push(
				element.schemeData?.aum ? `${addCommasToAmountString(element.schemeData?.aum)} Cr.` : ''
			);
			fundBasics[4].push(
				element.schemeData?.launchDate
					? `${calculateYearDiffrence(new Date(element.schemeData?.launchDate))} Yrs`
					: ''
			);
			fundBasics[5].push(element.schemeData?.categoryName);
			fundBasics[6].push(element.schemeData?.subcategoryName);
			fundBasics[7].push(element.schemeData?.reInvestmentPlan);

			//Ratings
			ratings[0].push(
				element.schemeData?.arqRating
					? {
							component: ChipArqRating,
							type: 'component',
							props: {
								headingClass: '!text-black-title',
								class: '!bg-transparent !border-none',
								arqRating: element.schemeData?.arqRating
							}
					  }
					: ''
			);
			ratings[1].push(
				element.schemeData?.morningstarRating
					? {
							component: ChipArqRating,
							type: 'component',
							props: {
								headingClass: '!text-black-title',
								class: '!bg-transparent !border-none',
								arqRating: element.schemeData?.morningstarRating
							}
					  }
					: ''
			);
			ratings[2].push(
				element.schemeData?.crisilRating
					? {
							component: ChipArqRating,
							type: 'component',
							props: {
								headingClass: '!text-black-title',
								class: '!bg-transparent !border-none',
								arqRating: element.schemeData?.crisilRating
							}
					  }
					: ''
			);
			ratings[3].push(
				element.schemeData?.valueResearchRating
					? {
							component: ChipArqRating,
							type: 'component',
							props: {
								headingClass: '!text-black-title',
								class: '!bg-transparent !border-none',
								arqRating: element.schemeData?.valueResearchRating
							}
					  }
					: ''
			);

			// sectors
			for (let i = 0; i < 5; i++) {
				const sector = element.sectorData?.[i];
				sectors[i].push(sector ? `${sector?.sector} (${sector?.percentage?.toFixed(2)}%)` : '');
			}

			// holdings
			for (let i = 0; i < 5; i++) {
				const holding = element.holdingsData?.[i];
				holdings[i].push(
					holding ? `${holding?.companyName} (${holding?.percentageHold?.toFixed(2)}%)` : ''
				);
			}
		});
		fillChartData(chartNavData);
	};
</script>

{#await formatComparisionData(data.api.comparisionData)}
	<FundComparisonLoader />
{:then}
	<div class="flex flex-col gap-2 sm:gap-6">
		<div class="sticky -top-2 z-60 -mb-6 flex border-b border-grey-line bg-white">
			<div class=" flex flex-[4] p-2 sm:flex-[5] md:p-4" />
			{#each schemeDetailsList as schemeDetails, idx (idx)}
				<div class="flex flex-[5] items-center justify-center border-l border-grey-line p-2 md:p-4">
					<FundOverviewTile
						{schemeDetails}
						showCompact={true}
						isRemovable={true}
						showCTA={true}
						on:addFund={toggleSearch}
						on:removeFund={() => deleteFund(idx)}
					/>
				</div>
			{/each}
		</div>
		<div class="mt-4 md:mt-0">
			<Table data={meta} />
		</div>
		<TableWithAccordian data={chartMetaData} title="If ₹1,000 invested 3 years ago">
			<svelte:fragment slot="footer">
				<Chart {lineData} {lineChartOptions} {tags} {onTagClick} {selectedTag} />
			</svelte:fragment>
		</TableWithAccordian>
		<TableWithAccordian data={pastReturns} title="Past Returns" />
		<TableWithAccordian data={fundBasics} title="Fund Basics" />
		<TableWithAccordian data={ratings} title="Ratings" />
		<TableWithAccordian data={sectors} title="Top 5 Sectors" />
		<TableWithAccordian data={holdings} title="Top 5 holdings" />
	</div>
{/await}

{#if showSearch}
	<FundSearch
		isin={schemesSelected >= 1 ? schemeDetailsList?.[schemesSelected - 1]?.isin : 'INF200KA1DB2'}
		firstFund={schemesSelected === 0}
		bind:showModal={showSearch}
		on:close={toggleSearch}
		on:schemeSelect={(e) => addFund(e.detail?.schemeCode, e.detail?.isin)}
	/>
{/if}
