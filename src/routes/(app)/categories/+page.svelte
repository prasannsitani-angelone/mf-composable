<script lang="ts">
	// import type { PageData } from './$types';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import { onMount } from 'svelte';
	import { SEO } from 'svelte-components';
	import SchemeCardExt from '$components/SchemeCardExt.svelte';
	import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
	import { fundCardClick, sExploreMutualFunds } from '../explorefunds/[slug]/analytics';
	import SearchOptionHeader from './SearchOptionHeader/SearchOptionHeader.svelte';
	import { getCategoriesFundsNavigationPath } from '$lib/utils';
	import { EXPLORE_FUND_PAGE_TYPE } from '$lib/constants/exploreFunds';
	import type { CategoryNavItem } from './types';
	import CategoriesLoader from './CategoriesLoader.svelte';

	// export let data: PageData;
	let data = {
		scheme: 'http:',
		host: 'localhost:8080',
		deviceType: {
			isSmartTV: false,
			isConsole: false,
			isWearable: false,
			isEmbedded: false,
			isMobileSafari: true,
			isChromium: false,
			isMobile: true,
			isTablet: false,
			isBrowser: false,
			isDesktop: false,
			isAndroid: false,
			isWinPhone: false,
			isIOS: true,
			isChrome: false,
			isFirefox: false,
			isSafari: true,
			isOpera: false,
			isIE: false,
			osVersion: '16.6',
			osName: 'iOS',
			fullBrowserVersion: '16.6',
			browserVersion: '16',
			browserName: 'Mobile Safari',
			mobileVendor: 'Apple',
			mobileModel: 'iPhone',
			engineName: 'WebKit',
			engineVersion: '605.1.15',
			getUA:
				'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
			isEdge: false,
			isYandex: false,
			isIOS13: false,
			isIPad13: false,
			isIPhone13: false,
			isIPod13: false,
			isElectron: false,
			isEdgeChromium: false,
			isLegacyEdge: false,
			isWindows: false,
			isMacOs: false,
			isMIUI: false,
			isSamsungBrowser: false,
			isWebView: false,
			isCrawler: false,
			vendor: 'Apple',
			model: 'iPhone',
			os: 'iOS',
			ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
			userAgent:
				'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
		},
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhbmdlbCIsImV4cCI6MTcxMzk0MjEwNiwiaWF0IjoxNzEzODU1NzA2LCJ1c2VyRGF0YSI6eyJjb3VudHJ5X2NvZGUiOiIiLCJtb2Jfbm8iOiI5NDI1Mzg0ODU1IiwidXNlcl9pZCI6IlA1MjI2MDQwNCIsInNvdXJjZSI6IlNQQVJLIiwiYXBwX2lkIjoiNTY1NiIsImNyZWF0ZWRfYXQiOiIyMDI0LTA0LTIzVDEyOjMxOjQ2LjEwNTU4NzI3NiswNTozMCIsImRhdGFDZW50ZXIiOiIifSwidXNlcl90eXBlIjoiY2xpZW50IiwidG9rZW5fdHlwZSI6Im5vbl90cmFkZV9hY2Nlc3NfdG9rZW4iLCJzb3VyY2UiOiJTUEFSSyIsImFjdCI6e319.SXJi_SM6XSip3xUjrQ1bM0QrHFzyuCYR9pYxH5c8Ll8',
		isGuest: false,
		sparkHeaders: {
			deviceid: 'e10309de-dda4-4077-8b8e-b74bbc6478d3'
		},
		isMissingHeaders: false,
		sparkQuery: {
			deviceid: null
		},
		urlSource: {},
		profile: {
			applicationNo: 'SP59333559',
			clientId: 'P52260404',
			pan: 'OTWPS3299N',
			countryCode: '+91',
			mobile: '9425384855',
			active: true,
			clientAccountType: 'CLI',
			clientAccountSubType: 'IND',
			userType: 'B2C',
			dpNumber: '1203320195082752',
			poaStatus: 'I',
			ddpiStatus: false,
			clientDetails: {
				fullName: 'PRASANN SITANI',
				firstName: 'PRASANN',
				lastName: 'SITANI',
				fatherName: 'RAJESH  SITANI',
				email: 'prasannsitani000@gmail.com',
				branch: 'MPBS',
				subBroker: 'MPDIY',
				sbRegion: 'M P',
				shortName: 'PRASANN',
				birthdate: '06/04/2001',
				gender: 'M',
				tradingPlatform: 'OMNE',
				dcName: '',
				address:
					'WARD NO 05 SANJAY GANDHI NEAR OF STATE BANK SINDHI COLONY POSTSIDHI KOTAHA SIDHI MADHYA SIDHI MADHYA PRADESH India 486661',
				permanentAddress: {
					addressLine1: 'WARD NO 05 SANJAY GANDHI NEAR',
					addressLine2: 'OF STATE BANK SINDHI COLONY',
					addressLine3: 'POSTSIDHI KOTAHA SIDHI MADHYA',
					city: 'SIDHI',
					state: 'MADHYA PRADESH',
					country: 'India',
					pincode: '486661'
				},
				correspondenceAddress: {
					addressLine1: 'WARD NO 05 SANJAY GANDHI NEAR',
					addressLine2: 'OF STATE BANK SINDHI COLONY',
					addressLine3: 'POSTSIDHI KOTAHA SIDHI MADHYA',
					city: 'SIDHI',
					state: 'MADHYA PRADESH',
					country: 'India',
					pincode: '486661'
				},
				zip: '486661',
				rmDealerPhone: '18001020',
				contactUsPhone: '18001020',
				incomeSlab: '04',
				previousSbTag: ''
			},
			activeSegments: {
				equity: true,
				futures: true,
				currency: true,
				commodity: true,
				mutualFund: true,
				ipo: true,
				NSX: true,
				BSX: true,
				MCX: true,
				MCD: false,
				BSE: true,
				NSE: true,
				NCX: true,
				BSEFO: true,
				NSEFO: true,
				NCE: false
			},
			bankDetails: [
				{
					bankName: 'AXIS BANK',
					branchName: 'SIDHI (MADHYA PRADESH)',
					accNO: '922010034304532',
					accountType: 'savings',
					ifscCode: 'UTIB0000655',
					micrCode: '486211051',
					isNetBanking: true,
					isDefalutID: false,
					bankLogo: 'https://cdn.angelone.in/profileServices/images/bankLogo/AB.png',
					updateTs: ''
				}
			],
			dpDetails: {
				dpIdNo: '1203320195082752',
				dpType: 'CDSL',
				dpIdStatus: 'ACTIVE',
				boAccountNo: '12033201',
				dpName: 'ANGEL ONE LIMITED',
				dpSchemeName: 'Itrade Prime VBB'
			},
			brokerageType: 'ITRADEPRIME',
			nomineeDetails: [{}],
			creationDate: '31/07/2023 07:40:23',
			modificationDate: '02/04/2024 16:07:40',
			modifiedBy: 'GLUE_JOB',
			dpcFlag: true,
			inactiveDate: '31/12/2049 23:59:00',
			deactiveReason: '',
			products: {
				intraday: {
					status: 'active',
					activationDate: '31/07/2023 15:19:24'
				},
				mtf: {
					status: 'active',
					activationDate: '31/07/2023 00:00:00'
				},
				commodityOptions: {
					status: 'inactive'
				}
			}
		},
		tokenObj: {
			userToken: {
				NTAccessToken:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhbmdlbCIsImV4cCI6MTcxMzk0MjEwNiwiaWF0IjoxNzEzODU1NzA2LCJ1c2VyRGF0YSI6eyJjb3VudHJ5X2NvZGUiOiIiLCJtb2Jfbm8iOiI5NDI1Mzg0ODU1IiwidXNlcl9pZCI6IlA1MjI2MDQwNCIsInNvdXJjZSI6IlNQQVJLIiwiYXBwX2lkIjoiNTY1NiIsImNyZWF0ZWRfYXQiOiIyMDI0LTA0LTIzVDEyOjMxOjQ2LjEwNTU4NzI3NiswNTozMCIsImRhdGFDZW50ZXIiOiIifSwidXNlcl90eXBlIjoiY2xpZW50IiwidG9rZW5fdHlwZSI6Im5vbl90cmFkZV9hY2Nlc3NfdG9rZW4iLCJzb3VyY2UiOiJTUEFSSyIsImFjdCI6e319.SXJi_SM6XSip3xUjrQ1bM0QrHFzyuCYR9pYxH5c8Ll8',
				NTRefreshToken:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhbmdlbCIsImV4cCI6MTcxNjQ0NzcwNSwiaWF0IjoxNzEzODU1NzA1LCJ1c2VyRGF0YSI6eyJjb3VudHJ5X2NvZGUiOiIiLCJtb2Jfbm8iOiI5NDI1Mzg0ODU1IiwidXNlcl9pZCI6IlA1MjI2MDQwNCIsInNvdXJjZSI6IlNQQVJLIiwiYXBwX2lkIjoiNTY1NiIsImNyZWF0ZWRfYXQiOiIyMDI0LTA0LTIzVDEyOjMxOjQ1LjA2MDE0NjI1MSswNTozMCIsImRhdGFDZW50ZXIiOiIifSwidXNlcl90eXBlIjoiY2xpZW50IiwidG9rZW5fdHlwZSI6Im5vbl90cmFkZV9yZWZyZXNoX3Rva2VuIiwic291cmNlIjoiU1BBUksiLCJhY3QiOnt9fQ.in6kjMa6s1Sndd15pBl9GgsDxooFBrRp5NU3goSl93w'
			},
			guestToken: ''
		},
		searchDashboardData: {
			categories: [
				{
					type: 'click',
					name: 'Top Picks',
					data: [
						{
							id: '105',
							name: 'SIP With ₹100',
							iconUrl: 'https://dm11ybwptwy0u.cloudfront.net/icons/sip_with_100_0.svg',
							shortDescription: '',
							detailedDescription: [''],
							data: []
						},
						{
							id: '106',
							name: 'SIP With ₹500',
							iconUrl: 'https://dm11ybwptwy0u.cloudfront.net/icons/sip_with_500_0.svg',
							shortDescription: '',
							detailedDescription: [''],
							data: []
						},
						{
							id: '112',
							name: 'Index Funds',
							iconUrl: 'https://d3usff6y6s0r8b.cloudfront.net/uat/index_funds_0.svg',
							shortDescription: '',
							detailedDescription: [''],
							data: []
						}
					]
				}
			],
			weeklyTopSchemes: [
				{
					schemeCode: '8176-GR',
					isin: 'INF109K012K1',
					schemeName: 'ICICI Prudential Value Discovery Fund Direct Plan Growth',
					categoryName: 'Equity',
					subcategoryName: 'Value Fund',
					reInvestmentPlan: 'Growth',
					schemePlan: 'DIRECT',
					logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
					returns1yr: 43.14,
					returns3yr: 27.83,
					returns5yr: 22.52,
					arqRating: 5,
					purchaseTxnMode: 'DP',
					navValue: 434.09,
					minSipAmount: 100,
					previousNavValue: 431.12,
					swpFlag: '',
					stpFlag: '',
					switchFlag: '',
					isFavourite: true,
					sortBy2: 0,
					minPurchaseAmount: 1000,
					nfoStartDate: 0,
					nfoEndDate: 0,
					isCartItem: true,
					isSipAllowed: 'Y',
					isLumpsumAllowed: 'Y',
					noOfClientInvested: 6,
					nfoAllotmentDate: 0,
					isActive: 0,
					nfoAllotmentDateString: '',
					deepLink: '',
					displayReInvestmentPlan: ''
				},
				{
					schemeCode: '8042-GR',
					isin: 'INF109K016L0',
					schemeName: 'ICICI Prudential Bluechip Fund Direct Plan Growth',
					categoryName: 'Equity',
					subcategoryName: 'Large Cap Fund',
					reInvestmentPlan: 'Growth',
					schemePlan: 'DIRECT',
					logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
					returns1yr: 39.88,
					returns3yr: 22.65,
					returns5yr: 18.1,
					arqRating: 5,
					purchaseTxnMode: 'DP',
					navValue: 104.57,
					minSipAmount: 20,
					previousNavValue: 103.44,
					swpFlag: '',
					stpFlag: '',
					switchFlag: '',
					isFavourite: false,
					sortBy2: 0,
					minPurchaseAmount: 100,
					nfoStartDate: 0,
					nfoEndDate: 0,
					isCartItem: true,
					isSipAllowed: 'Y',
					isLumpsumAllowed: 'Y',
					noOfClientInvested: 5,
					nfoAllotmentDate: 0,
					isActive: 0,
					nfoAllotmentDateString: '',
					deepLink: '',
					displayReInvestmentPlan: ''
				},
				{
					schemeCode: 'MCOGT-GR',
					isin: 'INF179K01XQ0',
					schemeName: 'HDFC Mid Cap Opportunities Fund Growth Direct Plan',
					categoryName: 'Equity',
					subcategoryName: 'Mid Cap Fund',
					reInvestmentPlan: 'Growth',
					schemePlan: 'DIRECT',
					logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
					returns1yr: 55.64,
					returns3yr: 31.07,
					returns5yr: 24.2,
					arqRating: 4,
					purchaseTxnMode: 'DP',
					navValue: 174.094,
					minSipAmount: 100,
					previousNavValue: 173.274,
					swpFlag: '',
					stpFlag: '',
					switchFlag: '',
					isFavourite: true,
					sortBy2: 0,
					minPurchaseAmount: 100,
					nfoStartDate: 0,
					nfoEndDate: 0,
					isCartItem: true,
					isSipAllowed: 'Y',
					isLumpsumAllowed: 'Y',
					noOfClientInvested: 4,
					nfoAllotmentDate: 0,
					isActive: 0,
					nfoAllotmentDateString: '',
					deepLink: '',
					displayReInvestmentPlan: ''
				},
				{
					schemeCode: 'GFAG-GR',
					isin: 'INF204K01E54',
					schemeName: 'Nippon India Growth Fund Direct Plan Growth',
					categoryName: 'Equity',
					subcategoryName: 'Mid Cap Fund',
					reInvestmentPlan: 'Growth',
					schemePlan: 'DIRECT',
					logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/nippon_angel.svg',
					returns1yr: 55.79,
					returns3yr: 30.71,
					returns5yr: 25.05,
					arqRating: 4.5,
					purchaseTxnMode: 'DP',
					navValue: 3636.6415,
					minSipAmount: 100,
					previousNavValue: 3600.1211,
					swpFlag: '',
					stpFlag: '',
					switchFlag: '',
					isFavourite: true,
					sortBy2: 0,
					minPurchaseAmount: 100,
					nfoStartDate: 0,
					nfoEndDate: 0,
					isCartItem: true,
					isSipAllowed: 'Y',
					isLumpsumAllowed: 'Y',
					noOfClientInvested: 3,
					nfoAllotmentDate: 0,
					isActive: 0,
					nfoAllotmentDateString: '',
					deepLink: '',
					displayReInvestmentPlan: ''
				},
				{
					schemeCode: 'QUTPDG-GR',
					isin: 'INF966L01986',
					schemeName: 'Quant ELSS Tax Saver Fund Growth Direct Plan',
					categoryName: 'Equity',
					subcategoryName: 'ELSS',
					reInvestmentPlan: 'Growth',
					schemePlan: 'DIRECT',
					logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/quant_angel.svg',
					returns1yr: 62.01,
					returns3yr: 33.18,
					returns5yr: 33.31,
					arqRating: 3.5,
					purchaseTxnMode: 'DP',
					navValue: 406.5483,
					minSipAmount: 500,
					previousNavValue: 403.7127,
					swpFlag: '',
					stpFlag: '',
					switchFlag: '',
					isFavourite: false,
					sortBy2: 0,
					minPurchaseAmount: 500,
					nfoStartDate: 0,
					nfoEndDate: 0,
					isCartItem: true,
					isSipAllowed: 'Y',
					isLumpsumAllowed: 'Y',
					noOfClientInvested: 2,
					nfoAllotmentDate: 0,
					isActive: 0,
					nfoAllotmentDateString: '',
					deepLink: '',
					displayReInvestmentPlan: ''
				}
			],
			banner: null,
			amcAd: {
				id: 159,
				name: 'Quant_Mid_Cap_Test',
				header: 'Quant_Mid_Cap_Test_Promo',
				uri: 'https://d3usff6y6s0r8b.cloudfront.net/ad_amc/Fund of the month (1).svg',
				schemeInfo: {
					isin: 'INF966L01887',
					schemeName: 'Quant Mid Cap Fund Growth Direct Plan',
					schemeCode: 'QUOFDG-GR'
				}
			}
		},
		userDetails: {
			subBrokerTag: 'MPDIY',
			userType: 'B2C',
			arn: '',
			euin: '',
			isARNExpired: '',
			panSeeded: true,
			isKycInProgress: false,
			autopayStatus: false,
			cohort: ['MF_NEW']
		},
		investementSummary: {},
		cohortConfig: {
			LF: {
				stories: {
					rowStart: 1,
					columnStart: 1
				},
				startSip: {
					rowStart: 2,
					columnStart: 1
				},
				mostBought: {
					rowStart: 3,
					columnStart: 1
				},
				categories: {
					rowStart: 4,
					columnStart: 1
				},
				iplBanner: {
					rowStart: 5,
					columnStart: 1
				},
				sipCalculator: {
					rowStart: 6,
					columnStart: 1
				},
				trackExtFunds: {
					rowStart: 7,
					columnStart: 1
				},
				screener: {
					rowStart: 8,
					columnStart: 1
				},
				nfoEntry: {
					rowStart: 9,
					columnStart: 1
				},
				videoReel: {
					rowStart: 1,
					columnStart: 2
				}
			},
			SF: {
				search: {
					rowStart: 1,
					columnStart: 1
				},
				stories: {
					rowStart: 2,
					columnStart: 1
				},
				startSip: {
					rowStart: 3,
					columnStart: 1
				},
				mostBought: {
					rowStart: 4,
					columnStart: 1
				},
				categories: {
					rowStart: 5,
					columnStart: 1
				},
				iplBanner: {
					rowStart: 6,
					columnStart: 1
				},
				videoReel: {
					rowStart: 7,
					columnStart: 1
				},
				sipCalculator: {
					rowStart: 8,
					columnStart: 1
				},
				screener: {
					rowStart: 9,
					columnStart: 1
				},
				trackExtFunds: {
					rowStart: 10,
					columnStart: 1
				},
				nfoEntry: {
					rowStart: 11,
					columnStart: 1
				},
				logout: {
					rowStart: 12,
					columnStart: 1
				}
			}
		},
		trendingFundsData: [
			{
				isin: 'INF959L01GF1',
				schemeCode: 'ESLQGD-GR',
				schemePlan: 'DIRECT',
				viewCount: 25,
				schemeName: 'Navi Liquid Fund Direct Plan Growth',
				categoryName: 'Debt',
				subcategoryName: 'Liquid Fund',
				reInvestmentPlan: 'Growth',
				returns1yr: 6.94,
				returns3yr: 5.53,
				returns5yr: 5.05,
				logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/navi_angel.svg'
			},
			{
				isin: 'INF109K012K1',
				schemeCode: '8176-GR',
				schemePlan: 'DIRECT',
				viewCount: 18,
				schemeName: 'ICICI Prudential Value Discovery Fund Direct Plan Growth',
				categoryName: 'Equity',
				subcategoryName: 'Value Fund',
				reInvestmentPlan: 'Growth',
				returns1yr: 43.14,
				returns3yr: 27.83,
				returns5yr: 22.52,
				logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg'
			},
			{
				isin: 'INF966L01689',
				schemeCode: 'QUIBDG-GR',
				schemePlan: 'DIRECT',
				viewCount: 13,
				schemeName: 'Quant Small Cap Fund Growth Direct Plan',
				categoryName: 'Equity',
				subcategoryName: 'Small Cap Fund',
				reInvestmentPlan: 'Growth',
				returns1yr: 72.01,
				returns3yr: 42.02,
				returns5yr: 38.4,
				logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/quant_angel.svg'
			},
			{
				isin: 'INF179K01XQ0',
				schemeCode: 'MCOGT-GR',
				schemePlan: 'DIRECT',
				viewCount: 9,
				schemeName: 'HDFC Mid Cap Opportunities Fund Growth Direct Plan',
				categoryName: 'Equity',
				subcategoryName: 'Mid Cap Fund',
				reInvestmentPlan: 'Growth',
				returns1yr: 55.64,
				returns3yr: 31.07,
				returns5yr: 24.2,
				logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg'
			}
		],
		promotionData: {
			header: {
				title: 'Orange Cap: Best Performing SIPs',
				description: '',
				logoUrl: 'https://dm11ybwptwy0u.cloudfront.net/promotion/orange_cap.svg',
				mobileBgBannerUrl: 'https://dm11ybwptwy0u.cloudfront.net/promotion/card_bg_banner.webp',
				webBgBannerUrl: 'https://dm11ybwptwy0u.cloudfront.net/promotion/ipl_banner.webp',
				bgClour: ''
			},
			body: {},
			schemes: [
				{
					schemeCode: 'SBD192G-GR',
					isin: 'INF200K01UY4',
					schemeName: 'SBI PSU Fund Direct Plan Growth',
					schemePlan: 'DIRECT',
					logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/sbi_angel.svg',
					returns3yr: 43.96,
					sortBy2: 0,
					noOfClientInvested: 0,
					schemeCategory: '',
					categoryOptionName: '',
					textMessage: '',
					minSipAmount: 500
				},
				{
					schemeCode: 'QUISDG-GR',
					isin: 'INF966L01721',
					schemeName: 'Quant Infrastructure Fund Growth Direct Plan',
					schemePlan: 'DIRECT',
					logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/quant_angel.svg',
					returns3yr: 42.69,
					sortBy2: 3,
					noOfClientInvested: 0,
					schemeCategory: '',
					categoryOptionName: '',
					textMessage: '',
					minSipAmount: 1000
				},
				{
					schemeCode: 'PSAG-GR',
					isin: 'INF204K01I92',
					schemeName: 'Nippon India Power and Infra Fund Direct Plan Growth',
					schemePlan: 'DIRECT',
					logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/nippon_angel.svg',
					returns3yr: 40.15,
					sortBy2: 0,
					noOfClientInvested: 0,
					schemeCategory: '',
					categoryOptionName: '',
					textMessage: '',
					minSipAmount: 100
				}
			]
		},
		portfolios: [
			{
				packId: 'HIGH_GROWTH_POTENTIAL',
				packName: 'High Growth Potential',
				packLogoUrl:
					'https://d3usff6y6s0r8b.cloudfront.net/buy_pack_portfolio/high_risk_high_returns.svg',
				features: [],
				benefits: [
					{
						description:
							'Investment spread across mutual funds for mid-cap, small-cap and multi-cap companies'
					},
					{
						description: 'Aims for companies with the highest growth potential'
					},
					{
						description: 'Good for long term investment and investors with a higher risk appetite'
					}
				],
				minSipAmount: 400,
				threeYrReturnAvgPer: 30.731468000000003,
				totalUsersInvested: 0,
				description: 'Invest in companies with maximum potential for returns, with added risk',
				packVideoUrl: '',
				schemes: [
					{
						isin: 'INF109K012K1',
						schemeCode: '8176-GR',
						schemeName: 'ICICI Prudential Value Discovery Fund Direct Plan Growth',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
						weightage: 33,
						wieightPercentage: 33,
						subCategory: 'Value Fund',
						sipMaxInstallmentNo: 9999,
						sipMaxAmount: 999999999,
						sipFrequency: 'MONTHLY',
						minSipAmount: 100,
						returns3yr: 27.8332,
						noOfClientInvested: 6,
						riskoMeterValue: 'Very High Risk'
					},
					{
						isin: 'INF179K01XQ0',
						schemeCode: 'MCOGT-GR',
						schemeName: 'HDFC Mid Cap Opportunities Fund Growth Direct Plan',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
						weightage: 34,
						wieightPercentage: 34,
						subCategory: 'Mid Cap Fund',
						sipMaxInstallmentNo: 9999,
						sipMaxAmount: 999999999,
						sipFrequency: 'MONTHLY',
						minSipAmount: 100,
						returns3yr: 31.0715,
						noOfClientInvested: 4,
						riskoMeterValue: 'Very High Risk'
					},
					{
						isin: 'INF179KA1RW5',
						schemeCode: 'HDACG1G-GR',
						schemeName: 'HDFC Small Cap Fund Growth Direct Plan',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
						weightage: 33,
						wieightPercentage: 33,
						subCategory: 'Small Cap Fund',
						sipMaxInstallmentNo: 9999,
						sipMaxAmount: 999999999,
						sipFrequency: 'MONTHLY',
						minSipAmount: 100,
						returns3yr: 33.2794,
						noOfClientInvested: 0,
						riskoMeterValue: 'Very High Risk'
					}
				],
				tags: ['High Returns and Risk', '3 SIPs']
			},
			{
				packId: 'BALANCED_GROWTH',
				packName: 'Balanced Growth',
				packLogoUrl:
					'https://d3usff6y6s0r8b.cloudfront.net/buy_pack_portfolio/ideal_for_young_inv.svg',
				features: [],
				benefits: [
					{
						description:
							'Investment spread across mutual funds for large-cap, mid-cap and small-cap companies'
					},
					{
						description: 'Aims for a mix of high growth potential and blue chip companies'
					},
					{
						description: 'Good for investors with a moderate risk appetite'
					}
				],
				minSipAmount: 400,
				threeYrReturnAvgPer: 28.935369,
				totalUsersInvested: 0,
				description:
					'Invest in a mix of high growth companies and steady growth blue chip companies',
				packVideoUrl: '',
				schemes: [
					{
						isin: 'INF109K016L0',
						schemeCode: '8042-GR',
						schemeName: 'ICICI Prudential Bluechip Fund Direct Plan Growth',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
						weightage: 34,
						wieightPercentage: 34,
						subCategory: 'Large Cap Fund',
						sipMaxInstallmentNo: 9999,
						sipMaxAmount: 999999999,
						sipFrequency: 'MONTHLY',
						minSipAmount: 20,
						returns3yr: 22.6458,
						noOfClientInvested: 5,
						riskoMeterValue: 'Very High Risk'
					},
					{
						isin: 'INF179K01XQ0',
						schemeCode: 'MCOGT-GR',
						schemeName: 'HDFC Mid Cap Opportunities Fund Growth Direct Plan',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
						weightage: 33,
						wieightPercentage: 33,
						subCategory: 'Mid Cap Fund',
						sipMaxInstallmentNo: 9999,
						sipMaxAmount: 999999999,
						sipFrequency: 'MONTHLY',
						minSipAmount: 100,
						returns3yr: 31.0715,
						noOfClientInvested: 4,
						riskoMeterValue: 'Very High Risk'
					},
					{
						isin: 'INF179KA1RW5',
						schemeCode: 'HDACG1G-GR',
						schemeName: 'HDFC Small Cap Fund Growth Direct Plan',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
						weightage: 33,
						wieightPercentage: 33,
						subCategory: 'Small Cap Fund',
						sipMaxInstallmentNo: 9999,
						sipMaxAmount: 999999999,
						sipFrequency: 'MONTHLY',
						minSipAmount: 100,
						returns3yr: 33.2794,
						noOfClientInvested: 0,
						riskoMeterValue: 'Very High Risk'
					}
				],
				tags: ['Long Term Investments', '3 SIPs']
			},
			{
				packId: 'RISK_PROTECTED_GROWTH',
				packName: 'Risk Protected Growth',
				packLogoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/buy_pack_portfolio/all_weather.svg',
				features: [],
				benefits: [
					{
						description:
							'Investment spread across mutual funds for large-cap and mid cap companies and debt funds'
					},
					{
						description:
							'Aims for a mix of asset classes (equity, debt) for steady growth and protection from market volatility'
					},
					{
						description: 'Good for investors with a low risk appetite'
					}
				],
				minSipAmount: 500,
				threeYrReturnAvgPer: 23.159425000000002,
				totalUsersInvested: 0,
				description:
					'Diversify across asset classes to minimise risk and grow consistently. Best for beginners',
				packVideoUrl: '',
				schemes: [
					{
						isin: 'INF109K010A6',
						schemeCode: '8104-GR',
						schemeName: 'ICICI Prudential Banking and PSU Debt Fund Direct Plan Growth',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
						weightage: 20,
						wieightPercentage: 20,
						subCategory: 'Banking and PSU Fund',
						sipMaxInstallmentNo: 9999,
						sipMaxAmount: 999999999,
						sipFrequency: 'MONTHLY',
						minSipAmount: 100,
						returns3yr: 6.2561,
						noOfClientInvested: 0,
						riskoMeterValue: 'Moderately Low Risk'
					},
					{
						isin: 'INF109K016L0',
						schemeCode: '8042-GR',
						schemeName: 'ICICI Prudential Bluechip Fund Direct Plan Growth',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
						weightage: 35,
						wieightPercentage: 35,
						subCategory: 'Large Cap Fund',
						sipMaxInstallmentNo: 9999,
						sipMaxAmount: 999999999,
						sipFrequency: 'MONTHLY',
						minSipAmount: 20,
						returns3yr: 22.6458,
						noOfClientInvested: 5,
						riskoMeterValue: 'Very High Risk'
					},
					{
						isin: 'INF179K01XQ0',
						schemeCode: 'MCOGT-GR',
						schemeName: 'HDFC Mid Cap Opportunities Fund Growth Direct Plan',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/hdfc_angel.svg',
						weightage: 45,
						wieightPercentage: 45,
						subCategory: 'Mid Cap Fund',
						sipMaxInstallmentNo: 9999,
						sipMaxAmount: 999999999,
						sipFrequency: 'MONTHLY',
						minSipAmount: 100,
						returns3yr: 31.0715,
						noOfClientInvested: 4,
						riskoMeterValue: 'Very High Risk'
					}
				],
				tags: ['Best for Beginners', '3 SIPs']
			}
		],
		pathname: '/mutual-funds/categories',
		api: {
			searchOption: {
				schemes: [
					{
						schemeCode: 'UTNID2-GR',
						isin: 'INF789F01XA0',
						schemeName: 'UTI Nifty 50 Index Fund Growth Direct',
						categoryName: 'Other',
						subcategoryName: 'Index Fund',
						reInvestmentPlan: 'Growth',
						schemePlan: 'DIRECT',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/uti_angel.svg',
						returns1yr: 26.85,
						returns3yr: 16.6,
						returns5yr: 14.53,
						arqRating: 0,
						purchaseTxnMode: 'DP',
						navValue: 153.1815,
						minSipAmount: 500,
						previousNavValue: 151.8854,
						swpFlag: '',
						stpFlag: '',
						switchFlag: '',
						isFavourite: false,
						sortBy2: 1,
						minPurchaseAmount: 5000,
						nfoStartDate: 0,
						nfoEndDate: 0,
						isCartItem: false,
						isSipAllowed: 'Y',
						isLumpsumAllowed: 'Y',
						noOfClientInvested: 0,
						nfoAllotmentDate: 0,
						isActive: 0,
						nfoAllotmentDateString: '',
						deepLink: '',
						displayReInvestmentPlan: ''
					},
					{
						schemeCode: 'IC9209-GR',
						isin: 'INF109KB10X0',
						schemeName: 'ICICI Prudential S&P BSE Sensex Index Fund Direct Plan Cumulative Option',
						categoryName: 'Other',
						subcategoryName: 'Index Fund',
						reInvestmentPlan: 'Growth',
						schemePlan: 'DIRECT',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/icici_angel.svg',
						returns1yr: 24.04,
						returns3yr: 16.13,
						returns5yr: 14.38,
						arqRating: 0,
						purchaseTxnMode: 'DP',
						navValue: 23.9898,
						minSipAmount: 100,
						previousNavValue: 23.8078,
						swpFlag: '',
						stpFlag: '',
						switchFlag: '',
						isFavourite: false,
						sortBy2: 2,
						minPurchaseAmount: 100,
						nfoStartDate: 0,
						nfoEndDate: 0,
						isCartItem: false,
						isSipAllowed: 'Y',
						isLumpsumAllowed: 'Y',
						noOfClientInvested: 0,
						nfoAllotmentDate: 0,
						isActive: 0,
						nfoAllotmentDateString: '',
						deepLink: '',
						displayReInvestmentPlan: ''
					},
					{
						schemeCode: 'AXNIDG-GR',
						isin: 'INF846K01S29',
						schemeName: 'Axis Nifty 100 Index Fund Direct Plan Growth',
						categoryName: 'Other',
						subcategoryName: 'Index Fund',
						reInvestmentPlan: 'Growth',
						schemePlan: 'DIRECT',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/axis_angel.svg',
						returns1yr: 31.98,
						returns3yr: 17.37,
						returns5yr: 0,
						arqRating: 0,
						purchaseTxnMode: 'DP',
						navValue: 20.2256,
						minSipAmount: 100,
						previousNavValue: 20.0347,
						swpFlag: '',
						stpFlag: '',
						switchFlag: '',
						isFavourite: false,
						sortBy2: 3,
						minPurchaseAmount: 100,
						nfoStartDate: 0,
						nfoEndDate: 0,
						isCartItem: false,
						isSipAllowed: 'Y',
						isLumpsumAllowed: 'Y',
						noOfClientInvested: 0,
						nfoAllotmentDate: 0,
						isActive: 0,
						nfoAllotmentDateString: '',
						deepLink: '',
						displayReInvestmentPlan: ''
					},
					{
						schemeCode: 'MOMIGD-GR',
						isin: 'INF247L01916',
						schemeName: 'Motilal Oswal Nifty Midcap 150 Index Fund Direct Plan',
						categoryName: 'Other',
						subcategoryName: 'Index Fund',
						reInvestmentPlan: 'Growth',
						schemePlan: 'DIRECT',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/motilal_angel.svg',
						returns1yr: 54.58,
						returns3yr: 27.71,
						returns5yr: 0,
						arqRating: 0,
						purchaseTxnMode: 'DP',
						navValue: 32.7542,
						minSipAmount: 500,
						previousNavValue: 32.5335,
						swpFlag: '',
						stpFlag: '',
						switchFlag: '',
						isFavourite: false,
						sortBy2: 4,
						minPurchaseAmount: 500,
						nfoStartDate: 0,
						nfoEndDate: 0,
						isCartItem: false,
						isSipAllowed: 'Y',
						isLumpsumAllowed: 'Y',
						noOfClientInvested: 0,
						nfoAllotmentDate: 0,
						isActive: 0,
						nfoAllotmentDateString: '',
						deepLink: '',
						displayReInvestmentPlan: ''
					},
					{
						schemeCode: 'DS842-GR',
						isin: 'INF740KA1CR7',
						schemeName: 'DSP Nifty 50 Equal Weight Index Fund Direct Plan Growth',
						categoryName: 'Other',
						subcategoryName: 'Index Fund',
						reInvestmentPlan: 'Growth',
						schemePlan: 'DIRECT',
						logoUrl: 'https://d3usff6y6s0r8b.cloudfront.net/v1/dsp_investment_angel.svg',
						returns1yr: 38.28,
						returns3yr: 21.37,
						returns5yr: 17.03,
						arqRating: 0,
						purchaseTxnMode: 'DP',
						navValue: 23.1033,
						minSipAmount: 100,
						previousNavValue: 22.8596,
						swpFlag: '',
						stpFlag: '',
						switchFlag: '',
						isFavourite: false,
						sortBy2: 5,
						minPurchaseAmount: 100,
						nfoStartDate: 0,
						nfoEndDate: 0,
						isCartItem: false,
						isSipAllowed: 'Y',
						isLumpsumAllowed: 'Y',
						noOfClientInvested: 0,
						nfoAllotmentDate: 0,
						isActive: 0,
						nfoAllotmentDateString: '',
						deepLink: '',
						displayReInvestmentPlan: ''
					}
				],
				filterCategories: [
					{
						id: '105',
						name: 'SIP With ₹100',
						iconUrl: 'https://dm11ybwptwy0u.cloudfront.net/icons/sip_with_100_0.svg',
						shortDescription: '',
						detailedDescription: ['']
					},
					{
						id: '106',
						name: 'SIP With ₹500',
						iconUrl: 'https://dm11ybwptwy0u.cloudfront.net/icons/sip_with_500_0.svg',
						shortDescription: '',
						detailedDescription: ['']
					},
					{
						id: '112',
						name: 'Index Funds',
						iconUrl: 'https://d3usff6y6s0r8b.cloudfront.net/uat/index_funds_0.svg',
						shortDescription: '',
						detailedDescription: ['']
					}
				]
			},
			url: 'http://localhost:8080/mutual-funds/categories?id=112&type=categories'
		},
		filter: [],
		layoutConfig: {
			title: 'Explore Mutual Funds',
			showSearchIcon: true,
			showBackIcon: true,
			layoutType: 'DEFAULT',
			layoutBodyClass: '!max-w-full'
		},
		pageID: '112',
		pageType: 'categories'
	};

	$: console.log('lariiii: ', data);
	$: pageID = data?.pageID;
	$: pageType = data?.pageType;
	$: modalList = data.filter;
	$: breadCrumbs = [
		{
			text: 'Home',
			href: '/discoverfunds'
		},
		{
			text: 'Explore Mutual Fund',
			href: `/categories${data?.api?.url?.search || ''}`
		}
	];

	let allFilterOptions: CategoryNavItem[] = [];
	let currentFilter: CategoryNavItem;

	const handleFundCardClick = (scheme: ExploreFundsOptions) => {
		const { isin } = scheme;
		const order = scheme?.sortBy2;
		const filter = currentFilter?.title;
		fundCardClick({
			type: 'click',
			category: filter,
			fundisin: isin,
			fundrank: order
		});
	};

	onMount(() => {
		const filter = modalList?.name;
		sExploreMutualFunds({ Category: filter, type: 'null' });
	});

	function sendImpressionAnalyticEvent() {
		const filter = currentFilter?.title;
		sExploreMutualFunds({ Category: filter, type: 'click' });
	}

	async function getFilterAndSchemes(searchOption: Promise) {
		const response = await searchOption;
		const { filterCategories = [], schemes = [] } = response;
		if (pageType === EXPLORE_FUND_PAGE_TYPE.CATEGORIES) {
			allFilterOptions = filterCategories.map((options) => {
				return {
					href: getCategoriesFundsNavigationPath(options.id),
					title: options.name,
					id: options.id,
					shortDescription: options.shortDescription,
					detailedDescription: options.detailedDescription
				};
			});
			currentFilter = allFilterOptions.find(({ id }) => id === pageID) || {};
		}
		sendImpressionAnalyticEvent();
		return { filterOptions: allFilterOptions, schemes };
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, follow" />
</svelte:head>
<article class="flex min-h-screen flex-col">
	<SEO
		seoTitle="Mutual Funds Screener: Explore All Types of Mutual Funds | Angel One"
		seoDescription="MF Screener: Explore and filter various types of mutual funds by category, risk, fund size and start investing in Mutual Funds online with Angel One."
	/>
	<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />

	<h1 class="hidden pb-6 text-lg font-normal text-title sm:mt-3 md:block">
		{pageType === EXPLORE_FUND_PAGE_TYPE.CATEGORIES
			? 'Explore Mutual Funds'
			: modalList?.name || ''}
	</h1>

	<section class="md:rounded-b-lg md:shadow-csm">
		<section
			class="ml-[calc(50%-50vw)] w-screen rounded-b-lg sm:ml-0 sm:w-full md:bg-background-alt md:pt-3"
		>
			<section>
				{#await getFilterAndSchemes(data?.api?.searchOption)}
					<CategoriesLoader />
				{:then { filterOptions, schemes }}
					{#if pageType === EXPLORE_FUND_PAGE_TYPE.CATEGORIES}
						<SearchOptionHeader
							categoryDetails={currentFilter}
							categoryFilterOptions={filterOptions}
							{pageID}
						/>
					{/if}
					<section class="flex flex-col flex-wrap items-center px-2 md:flex-row md:px-6 md:pb-1">
						{#each schemes || [] as scheme}
							<SchemeCardExt
								class="mb-2 w-full rounded-lg bg-background-alt p-3 md:mb-4 md:mr-4 md:w-[336px]"
								schemes={scheme}
								on:onCardClick={() => handleFundCardClick(scheme)}
							/>
						{/each}
					</section>
				{/await}
			</section>
		</section>
	</section>
</article>
