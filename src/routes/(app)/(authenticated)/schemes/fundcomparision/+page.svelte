<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ChipArqRating from '$components/ChipArqRating.svelte';
	import type { NavDetails } from './type';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { tags } from '$lib/constants/tags';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { calculateYearDiffrence } from '$lib/utils';
	import { encodeObject } from '$lib/utils/helpers/params';
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
	import {
		addFundButtonClickEvent,
		compareFundChartIntervalSelectionEvent,
		compareFundChartMetaDataToggleEvent,
		compareFundDeleteClickEvent,
		compareFundFundBasicsToggleEvent,
		compareFundHoldingsToggleEvent,
		compareFundImpressionEvent,
		compareFundPastReturnsToggleEvent,
		compareFundRatingsToggleEvent,
		compareFundSectorsToggleEvent,
		comparefundInvestSelectClickEvent
	} from './analytics';
	import { browser } from '$app/environment';
	import { format, parse, set } from 'date-fns';
	import { formatIntoK } from '$lib/utils/helpers/formatAmount';

	export let data: PageData;

	const rowsConfig = {
		lf: 3,
		mf: 2
	};
	const chartDatasetConfig = [
		{
			label: '',
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
			label: '',
			borderColor: '#F9BA4D',
			yAxisID: 'y',
			fill: true,
			backgroundColor: 'transparent'
		},
		{
			label: '',
			borderColor: '#581DBE',
			yAxisID: 'y',
			fill: true,
			backgroundColor: 'transparent'
		}
	];

	let chartDataLoading = false;
	let pastReturns = [];
	let fundBasics = [];
	let ratings = [];
	let sectors = [];
	let holdings = [];
	let meta = [];
	let chartMetaData = [];
	let chartNavData: Array<Array<NavDetails>> = [];
	let lineData = {};
	let chartId = 'fund-comparison-line-chart';
	let tooltipLength = 10;

	const formatDate = (navDate) => {
		navDate = navDate.split(',');
		navDate.pop();
		navDate = navDate.join(',');
		const date = new Date(navDate);
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'short' });
		const year = date.getFullYear()?.toString();

		return `${day} ${month} ${year}`;
	};

	const getFormattedDate = (originalDateString: string) => {
		let originalDate = parse(originalDateString, 'MMM dd, yyyy, h:mm:ss a', new Date());
		originalDate = set(originalDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
		originalDate = set(originalDate, { timeZone: 'UTC' });
		const iso8601Date = format(originalDate, "yyyy-MM-dd'T'HH:mm:ss");
		return iso8601Date;
	};

	const getDataLabelIndex = (originalDateString) => {
		const formattedDate = getFormattedDate(originalDateString);

		const selectedIndex = lineData?.labels?.findIndex((label) => {
			return (label || '')?.includes(formattedDate);
		});
		return selectedIndex;
	};

	const getNavDataList = (title: string) => {
		const selectedIndex = getDataLabelIndex(title) || 0;
		let navData = [];

		lineData?.datasets?.forEach((data) => {
			navData.push({
				nav: data?.data[selectedIndex],
				color: data?.pointHoverBackgroundColor
			});
		});

		return navData;
	};

	const lineChartOptions = {
		maintainAspectRatio: false,
		elements: {
			point: {
				borderWidth: 4,
				pointRadius: 3,
				hoverRadius: 3,
				hoverBorderWidth: 4,
				pointHoverBorderColor: '#3F5BD966',
				pointHoverBackgroundColor: '#3F5BD9',
				pointBackgroundColor: 'transparent',
				pointBorderColor: 'transparent',
				pointStyle: 'circle'
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
							return '₹' + formatIntoK(value);
						else return '₹' + formatIntoK(value);
					}
				}
			},
			x: {
				display: false
			}
		},
		layout: {
			padding: {
				left: 5
			}
		},
		plugins: {
			tooltip: {
				enabled: false,
				callbacks: {},
				external: function (context) {
					// Tooltip Element
					let tooltipEl = document.getElementById(`${chartId}-tooltip`);

					// const chartParent = document.getElementById(chartParentId);
					const chartParent = document.getElementById(chartId)?.parentNode;

					// Create element on first render
					if (!tooltipEl) {
						tooltipEl = document.createElement('div');
						tooltipEl.id = `${chartId}-tooltip`;
						tooltipEl.style =
							'display: flex; flex-direction: column; align-items: flex-start; width: fit-content; padding: 8px; font-size: 10px; font-weight: 400; font-family: Roboto; color: var(--BODY); background: var(--BACKGROUND-ALT); box-shadow: 0px 1px 4px 0px rgba(24, 31, 41, 0.08); border-radius: 4px;';
						tooltipEl.innerHTML = '';
						chartParent.appendChild(tooltipEl);
					}

					// Hide if no tooltip
					const tooltipModel = context.tooltip;
					if (tooltipModel.opacity === 0) {
						tooltipEl.style.opacity = 0;
						return;
					}

					// Set caret Position
					tooltipEl.classList.remove('above', 'below', 'no-transform');
					if (tooltipModel.yAlign) {
						tooltipEl.classList.add(tooltipModel.yAlign);
					} else {
						tooltipEl.classList.add('no-transform');
					}

					const getBody = (bodyItem) => {
						return bodyItem.lines;
					};

					// Set Tooltip Text
					if (tooltipModel.body) {
						const titleLines = tooltipModel.title || [];
						const bodyLines = tooltipModel.body.map(getBody);

						let innerHtml = '';

						const title = titleLines?.[0];

						if (title) {
							const style = '';
							innerHtml += `<span style="${style}">${formatDate(title)}</span>`;
						}
						innerHtml += '</div>';

						const body = bodyLines?.[0];

						const navDataList = getNavDataList(title);

						if (body) {
							const style = 'display: flex; align-items: center; margin-top: 4px; font-size: 12px';
							navDataList?.forEach((nav) => {
								const div = `<div style="${style}">
									<div style="width: 8px; height: 8px; background: ${nav?.color}; border-radius: 100%;"></div>
									<div style="margin-left: 4px">
										${nav?.nav > 0 ? `₹${addCommasToAmountString(parseFloat(nav?.nav?.toFixed(2)))}` : 'NA'}
									</div>
									<div class="ml-1 text-buy">
										(${nav?.nav > 0 ? `+${parseFloat(((nav?.nav - 1000) / 10)?.toFixed(2))}%` : 'NA'})
									</div>
								</div>`;
								innerHtml += div;
							});
						}
						tooltipEl.innerHTML = innerHtml;
					}

					const canvas = context.chart.canvas;

					// // Display, position, and set styles for font
					tooltipEl.style.opacity = 1;
					tooltipEl.style.position = 'absolute';
					const centerX = tooltipModel._active[0].element.x;
					if (centerX > tooltipModel.caretX) {
						const xfromParent = canvas.offsetLeft + tooltipModel.caretX - tooltipLength;
						let startPoint = 0;
						if (xfromParent - tooltipEl.offsetWidth >= 0) {
							startPoint = xfromParent - tooltipEl.offsetWidth;
						}
						tooltipEl.style.left = startPoint + 'px';
					} else {
						const parentWidth = chartParent.offsetWidth;
						const xfromParent = canvas.offsetLeft + tooltipModel.caretX + tooltipLength;
						let startPoint = parentWidth - tooltipEl.offsetWidth;
						if (parentWidth - xfromParent - tooltipEl.offsetWidth >= 0) {
							startPoint = xfromParent;
						}
						tooltipEl.style.left = startPoint + 'px';
					}
					tooltipEl.style.transform = 'translate(-50%, -110%)';
					tooltipEl.style.top = canvas.offsetTop + tooltipModel.caretY + 'px';
					tooltipEl.style.pointerEvents = 'none';
				}
			}
		}
	};
	let schemeDetailsList: SchemeDetails[] = [];
	let selectedTag = '3Y';

	$: schemesSelected = schemeDetailsList?.reduce((accumulator, element) => {
		if (element?.schemeCode) {
			return accumulator + 1;
		}
		return accumulator;
	}, 0);

	let showSearch = data?.showSearch || false;

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

	const handleAddFundClick = (index: number) => {
		const eventMetaData = {
			rank: index + 1
		};
		addFundButtonClickEvent(eventMetaData);
		toggleSearch();
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

	const handleDeleteFund = (index: number, schemeDetails: SchemeDetails) => {
		const eventMetaData = {
			fundnameDeleted: schemeDetails?.schemeName,
			fundnameDeletedIsin: schemeDetails?.isin,
			fundDeleted3YReturn: schemeDetails?.returns3yr,
			fundDeletedMinSipAmount: schemeDetails?.minSipAmount,
			rank: index + 1
		};
		compareFundDeleteClickEvent(eventMetaData);
		deleteFund(index);
	};

	const handleInvestClick = (index: number) => {
		const eventMetaData = {
			investButtonRank: index + 1
		};
		(schemeDetailsList || []).forEach((item, index) => {
			if (item) {
				eventMetaData[`fundName${index + 1}`] = item?.schemeName;
				eventMetaData[`investMFIsin${index + 1}`] = item?.isin;
			}
		});
		comparefundInvestSelectClickEvent(eventMetaData);
	};

	const compareFundImpressionAnalytics = () => {
		const data = {
			comparefundcardfunds: [],
			comparefundcardfundsISIN: [],
			comparefundcardfunds3YReturn: [],
			comparefundcardfundsMinSIPAmount: [],
			comparefundcardfundsNoofInvestors: [],
			numberOfFunds: schemeDetailsList?.length
		};
		schemeDetailsList.forEach((scheme) => {
			data.comparefundcardfunds.push(scheme?.schemeName);
			data.comparefundcardfundsISIN.push(scheme?.isin);
			data.comparefundcardfunds3YReturn.push(scheme?.returns3yr);
			data.comparefundcardfundsMinSIPAmount.push(scheme?.minSipAmount);
			data.comparefundcardfundsNoofInvestors.push(scheme?.noOfClientInvested);
		});
		compareFundImpressionEvent(data);
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
			let pointHoverColor = '#3F5BD966';
			let pointHoverBgColor = '#3F5BD9';
			if (index === 0) {
				pointHoverColor = '#1EC7B666';
				pointHoverBgColor = '#1EC7B6';
			} else if (index === 1) {
				pointHoverColor = '#F9BA4D66';
				pointHoverBgColor = '#F9BA4D';
			} else if (index === 2) {
				pointHoverColor = '#581DBE66';
				pointHoverBgColor = '#581DBE';
			}
			return {
				...(chartDatasetConfig[index] || {}),
				data: nav,
				borderWidth: 1.5, // make responsive
				pointRadius: 3, // make responsive
				hoverRadius: 3, // make responsive
				hoverBorderWidth: 6, // make responsive
				pointHoverBorderColor: pointHoverColor,
				pointHoverBackgroundColor: pointHoverBgColor,
				pointBackgroundColor: 'transparent',
				pointBorderColor: 'transparent',
				pointStyle: 'circle'
			};
		});

		// decrease the min by 2.5% and increase max by 2.5% as directed by product for scales
		minAmount = Math.round(0.975 * minAmount * 10) / 10;
		maxAmount = Math.round(1.025 * maxAmount * 10) / 10;
		let stepSize = Math.round((maxAmount - minAmount) / 2);
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
	const formatCurrentValue = (navData: Array<Array<NavDetails>>) => {
		const totalRows = $page?.data?.deviceType?.isMobile ? rowsConfig['mf'] : rowsConfig['lf'];
		const length = totalRows - navData.length;
		for (let i = 0; i < length; i++) {
			navData.push([]);
		}
		navData.forEach((element, index: number) => {
			// chart meta data
			chartMetaData[0].push(
				element?.[0]?.amount
					? {
							component: ValueComponent,
							type: 'component',
							props: {
								dotColor: chartDatasetConfig[index]?.borderColor,
								text: `₹${addCommasToAmountString(element?.[0]?.amount)}`
							}
					  }
					: ''
			);
		});
	};
	const onTagClick = async (tagLabel: string, index: number, tagsClicked = true) => {
		if (tagsClicked === false) {
			chartDataLoading = true;
		}
		selectedTag = tagLabel;

		const promiseArray = data?.comparisionArr?.map(({ isin }) => {
			return getChartData(isin, tags[index].months);
		});

		const response = await Promise.all(promiseArray);
		chartNavData = response;
		fillChartData(chartNavData);
		chartMonthTagSelectionAnalytics();
		if (tagsClicked === false) {
			formatCurrentValue(response);
			chartDataLoading = false;
		}
	};

	const initialiseData = () => {
		selectedTag = '3Y';
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
		ratings = [['Angel One'], ['Morningstar'], ['Crisil'], ['Value Research']];
		sectors = [['1'], ['2'], ['3'], ['4'], ['5']];
		holdings = [['1'], ['2'], ['3'], ['4'], ['5']];
		meta = [['3Y Returns'], ['Minimum  SIP Investment'], ['Investors']];
		schemeDetailsList = [];
		chartMetaData = [['Current Value'], ['Return %']];
		chartNavData = [];
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
		onTagClick('3Y', 4, false); // 4th index for 3Y nav

		response.forEach((element) => {
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
				element.schemeData?.aum ? `₹${addCommasToAmountString(element.schemeData?.aum)} Cr.` : ''
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
								headingClass: '!text-title',
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
								headingClass: '!text-title',
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
								headingClass: '!text-title',
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
								headingClass: '!text-title',
								class: '!bg-transparent !border-none',
								arqRating: element.schemeData?.valueResearchRating
							}
					  }
					: ''
			);

			//charts meta data
			chartMetaData[1].push(
				element.schemeData?.returns3yr ? `${element.schemeData?.returns3yr?.toFixed(2)}%` : ''
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
		if (browser) {
			compareFundImpressionAnalytics();
		}
	};

	const chartMonthTagSelectionAnalytics = () => {
		const data = {
			comparefundcardfunds: [],
			comparefundcardfundsISIN: [],
			ChartTimeIntervalSelected: selectedTag,
			CurrentValue: [],
			Returns: []
		};
		schemeDetailsList.forEach((scheme, index) => {
			data.comparefundcardfunds.push(scheme?.schemeName);
			data.comparefundcardfundsISIN.push(scheme?.isin);
			data.CurrentValue.push(lineData.datasets?.[index]?.data?.[0]);
			data.Returns.push(chartMetaData?.[1]?.[index + 1]);
		});
		compareFundChartIntervalSelectionEvent(data);
	};
	const chartMetaDataToggled = () => {
		const data = {
			comparefundcardfunds: [],
			comparefundcardfundsISIN: [],
			comparefundcardfunds3YReturn: []
		};
		schemeDetailsList.forEach((scheme) => {
			data.comparefundcardfunds.push(scheme?.schemeName);
			data.comparefundcardfundsISIN.push(scheme?.isin);
			data.comparefundcardfunds3YReturn.push(scheme?.returns3yr);
		});
		compareFundChartMetaDataToggleEvent(data);
	};
	const pastReturnsToggled = () => {
		const data = {
			OneYearReturn: [],
			ThreeYearsReturns: [],
			FiveYearReturns: [],
			AlltimeReturns: []
		};
		schemeDetailsList.forEach((scheme) => {
			data.OneYearReturn.push(scheme?.returns1yr);
			data.ThreeYearsReturns.push(scheme?.returns3yr);
			data.FiveYearReturns.push(scheme?.returns5yr);
			data.AlltimeReturns.push(scheme?.returns5yr);
		});
		compareFundPastReturnsToggleEvent(data);
	};
	const fundBasicsToggled = () => {
		compareFundFundBasicsToggleEvent();
	};
	const ratingsToggled = async () => {
		const data = {
			AngelOneRatings: [],
			Morningstar: [],
			crisil: []
		};
		schemeDetailsList?.forEach((scheme) => {
			data.AngelOneRatings.push(scheme?.arqRating);
			data.Morningstar.push(scheme?.morningstarRating);
			data.crisil.push(scheme?.crisilRating);
		});
		compareFundRatingsToggleEvent(data);
	};
	const sectorsToggled = () => {
		compareFundSectorsToggleEvent();
	};
	const holdingsToggled = () => {
		compareFundHoldingsToggleEvent();
	};
</script>

{#await formatComparisionData(data.api.comparisionData)}
	<FundComparisonLoader />
{:then}
	<div class="flex flex-col gap-2 sm:gap-6">
		<div class="sticky -top-2 z-60 -mb-6 flex border-b bg-background-alt">
			<div class=" flex flex-[4] items-center p-2 text-xs text-title sm:flex-[5] md:p-4">
				Add funds to compare
			</div>
			{#each schemeDetailsList as schemeDetails, idx (idx)}
				<div class="flex flex-[5] items-center justify-center border-l p-2 md:p-4">
					<FundOverviewTile
						{schemeDetails}
						showCompact={true}
						isRemovable={true}
						showCTA={true}
						on:addFund={() => handleAddFundClick(idx)}
						on:removeFund={() => handleDeleteFund(idx, schemeDetails)}
						on:invest={() => handleInvestClick(idx)}
					/>
				</div>
			{/each}
		</div>
		<div class="mt-4 md:mt-0">
			<Table data={meta} />
		</div>

		<!-- Graph Accordian -->
		{#if chartDataLoading}
			<TableWithAccordian
				title="If ₹1,000 invested 3 years ago"
				cardToggled={chartMetaDataToggled}
				loading={true}
				isDefaultExpanded={true}
			/>
		{:else}
			<TableWithAccordian
				data={chartMetaData}
				title="If ₹1,000 invested 3 years ago"
				cardToggled={chartMetaDataToggled}
				isDefaultExpanded={true}
			>
				<svelte:fragment slot="footer">
					<Chart {lineData} {lineChartOptions} {tags} {onTagClick} {selectedTag} {chartId} />
				</svelte:fragment>
			</TableWithAccordian>
		{/if}

		<TableWithAccordian data={pastReturns} title="Past Returns" cardToggled={pastReturnsToggled} />
		<TableWithAccordian data={fundBasics} title="Fund Basics" cardToggled={fundBasicsToggled} />
		<TableWithAccordian data={ratings} title="Ratings" cardToggled={ratingsToggled} />
		<TableWithAccordian data={sectors} title="Top 5 Sectors" cardToggled={sectorsToggled} />
		<TableWithAccordian data={holdings} title="Top 5 holdings" cardToggled={holdingsToggled} />
	</div>
{/await}

{#if showSearch}
	<FundSearch
		selectedSchemesList={schemeDetailsList}
		isin={schemesSelected >= 1 ? schemeDetailsList?.[schemesSelected - 1]?.isin : ''}
		firstFund={schemesSelected === 0}
		bind:showModal={showSearch}
		on:close={toggleSearch}
		on:schemeSelect={(e) => addFund(e.detail?.schemeCode, e.detail?.isin)}
	/>
{/if}
