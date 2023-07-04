import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import {
	orderDetailsPageCompletedOrdersScreenOpenAnalytics,
	orderDetailsPageFailedOrdersScreenOpenAnalytics,
	orderDetailsPageInProgressOrdersScreenOpenAnalytics
} from '$lib/analytics/orders/orders';
import { NAV_DETAILS, NAV_DETAILS_WITHDRAWAL, SETTLEMENT_TYPES } from '$lib/constants/order';
import ORDER_DATA from '$lib/constants/orderDataItems';
import STATUS_ARR, { ORDER_STATUS } from '$lib/constants/orderFlowStatuses';
import { TRANSACTION_TYPE } from '$lib/constants/transactionType';
import type { IOrderDetails } from '$lib/types/IOrderDetails';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
import type { ISip } from '$lib/types/ISipType';
import { getDateTimeString } from '$lib/utils/helpers/date';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { calculateTransactionCharges } from '$lib/utils/helpers/order';
import { getExpectedNavDate } from '$lib/utils/helpers/order';
import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
import { useFetch } from '$lib/utils/useFetch';
import { format } from 'date-fns';
import type { StatusHistoryItem } from '../../ordersummary/type';
import type { PageLoad } from './$types';
import type { IStatusItem, IStatusObject } from './type';

export const load = (async ({ fetch, params, parent }) => {
	const ordersUrl = `${PUBLIC_MF_CORE_BASE_URL}/orders/${params?.orderId}`;
	let ordersData: IOrderDetails;
	let schemeDetails: SchemeDetails;
	let isInvestmentSipOrXsip = false;
	let lumpsumMandateOrder = false;
	let showStatusNote = false;
	let showFooterButton = false;
	let isOrderFailedAtExchange = false;
	const { userDetails } = await parent();
	const orderStatusItems: Array<StatusHistoryItem> = [];
	let sipDetails: ISip;
	let statusItems: IStatusObject = {
		[ORDER_DATA.ORDER_DATE]: {
			title: ORDER_DATA.ORDER_DATE,
			value: ''
		},
		[ORDER_DATA.SIP_DUE_DATE]: {
			title: ORDER_DATA.SIP_DUE_DATE,
			value: ''
		},
		[ORDER_DATA.NAV_DATE]: {
			title: ORDER_DATA.NAV_DATE,
			value: '-'
		},
		[ORDER_DATA.EXPECTED_NAV_DATE]: {
			title: ORDER_DATA.EXPECTED_NAV_DATE,
			value: '-',
			informationIcon: true,
			informationHeading: 'Expected NAV Date',
			informationSubheading: NAV_DETAILS
		},
		[ORDER_DATA.UNITS]: {
			title: ORDER_DATA.UNITS,
			value: ''
		},
		[ORDER_DATA.FOLIO_NUMBER]: {
			title: ORDER_DATA.FOLIO_NUMBER,
			value: ''
		},
		[ORDER_DATA.ORDER_ID]: {
			title: ORDER_DATA.ORDER_ID,
			value: '',
			copyIcon: true
		},
		[ORDER_DATA.SIP_ID]: {
			title: ORDER_DATA.SIP_ID,
			value: ''
		},
		[ORDER_DATA.BANK_DETAILS]: {
			title: ORDER_DATA.BANK_DETAILS,
			value: '',
			node: true
		},
		[ORDER_DATA.STAMP_DUTY]: {
			title: ORDER_DATA.STAMP_DUTY,
			value: ''
		},
		[ORDER_DATA.ESTIMATED_CREDIT_DATE]: {
			title: ORDER_DATA.ESTIMATED_CREDIT_DATE,
			value: ''
		}
	};
	const transactionDetails: IStatusItem[] = [];
	let bankName = '';
	let bankAccountNumber = '';
	let tag = 'orders';
	const headerContent: Record<string, string> = {
		heading: 'In Progress',
		subHeadingText: 'Your order is completed by AMC',
		status: STATUS_ARR.PENDING,
		subHeaderClass: ''
	};
	const isNull = (val: number | null) => {
		if (!val && val !== 0) {
			return true;
		}
		return false;
	};

	const orderDetailsPageAnalytics = (orderDetailsData: IOrderDetails) => {
		const data = orderDetailsData;

		if (!data) {
			return;
		}
		const { status: orderStatus } = orderDetailsData;
		const currentState = data?.statusHistory?.find((item) => item?.currentState);
		const eventMetaData = {
			FundName: data?.schemeName,
			Status: orderStatus,
			OrderType: data?.investmentType,
			Amount: data?.amount,
			EXNAVDATE: getExpectedNavDate(data),
			Message: currentState?.message || currentState?.description
		};
		if (orderStatus === ORDER_STATUS.ORDER_COMPLETE) {
			orderDetailsPageCompletedOrdersScreenOpenAnalytics(eventMetaData);
		} else if (orderStatus === ORDER_STATUS.ORDER_REJECTED) {
			orderDetailsPageFailedOrdersScreenOpenAnalytics(eventMetaData);
		} else {
			orderDetailsPageInProgressOrdersScreenOpenAnalytics(eventMetaData);
		}
	};

	const filterObject = (items: IStatusObject, filters: string[]) => {
		const resulItem = Object.keys(items)
			.filter((i) => filters.includes(i))
			.reduce((obj, key) => {
				return Object.assign(obj, {
					[key]: statusItems[key]
				});
			}, {});
		return resulItem;
	};

	const getOrdersData = async () => {
		const res = await useFetch(ordersUrl + '?statusHistory=true', {}, fetch);
		if (res.ok && res?.data?.data) {
			const {
				investmentType,
				mandateRefNo,
				createdTs,
				firstOrder,
				scheduledTs,
				statusHistory,
				transactionType,
				ExpectedNavDate,
				orderId,
				pgTxnId,
				transactionRefNumber,
				folioNumber,
				amount,
				paymentStatus,
				status: orderStatus,
				bankAccountNo: bankAcc,
				bankName: bankname,
				schemePlan,
				sipId,
				actualNavDate,
				units,
				quantity,
				isin,
				schemeCode,
				settlementType,
				isNfoClosed,
				createdBy
			} = res.data.data;
			bankName = bankname;
			bankAccountNumber = bankAcc;
			// Flag to check the SIP or XSIP investment type
			isInvestmentSipOrXsip =
				investmentType?.toUpperCase() === 'SIP' || investmentType?.toUpperCase() === 'XSIP';
			lumpsumMandateOrder = investmentType?.toUpperCase() === 'LUMPSUM' && mandateRefNo?.length;

			// Fetching SIP details
			if (isInvestmentSipOrXsip) {
				tag += '_sip';
				if (firstOrder?.toUpperCase() === 'Y') {
					tag += '_ftpy';
				} else {
					tag += '_ftpn';
				}
				const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${sipId}`;
				const res = await useFetch(sipUrl, {}, fetch);
				if (res.ok && res?.data?.data) {
					sipDetails = res.data.data;
					if (firstOrder?.toUpperCase() === 'N' && !bankAcc) {
						bankName = sipDetails?.bankName;
						bankAccountNumber = sipDetails?.accountNo;
					}
				}
			}

			if (investmentType?.toUpperCase() === 'LUMPSUM') {
				tag += '_lumpsum';
			}
			// Fetching Scheme Details
			const schemeUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
			const schemeResponse = await useFetch(schemeUrl, {}, fetch);
			if (schemeResponse.ok && schemeResponse?.data) {
				schemeDetails = schemeResponse.data;
			}

			statusItems[ORDER_DATA.ORDER_DATE].value = format(new Date(createdTs), 'dd MMM yyyy');

			// if ((isInvestmentSipOrXsip && firstOrder?.toUpperCase() === 'N') || lumpsumMandateOrder) {
			// 	statusItems[ORDER_DATA.ORDER_DATE].value = format(new Date(scheduledTs), 'dd MMM yyyy');
			// }

			const expectedNavDate = statusHistory?.find(
				(state: { status: string }) => state.status === 'ORDER_SENT_TO_RTA'
			)?.timeStamp;

			if (settlementType?.toUpperCase() !== SETTLEMENT_TYPES.MF) {
				if (
					(transactionType === 'REDEEM' ||
						investmentType === 'LUMPSUM' ||
						(investmentType?.toUpperCase() === 'SIP' && firstOrder?.toUpperCase() === 'Y')) &&
					ExpectedNavDate
				) {
					statusItems[ORDER_DATA.EXPECTED_NAV_DATE].value = format(
						new Date(ExpectedNavDate * 1000),
						'dd MMM yyyy'
					);
					statusItems[ORDER_DATA.EXPECTED_NAV_DATE].informationSubheading = NAV_DETAILS_WITHDRAWAL;
				} else if (expectedNavDate && transactionType !== TRANSACTION_TYPE.SWITCH) {
					statusItems[ORDER_DATA.EXPECTED_NAV_DATE].value = format(
						new Date(expectedNavDate),
						'dd MMM yyyy'
					);
					statusItems[ORDER_DATA.EXPECTED_NAV_DATE].informationSubheading = NAV_DETAILS;
				}
			}

			statusItems[ORDER_DATA.ORDER_ID].value =
				transactionType === 'REDEEM' || transactionType === 'SWITCH'
					? Math?.abs(orderId)
					: pgTxnId?.length
					? pgTxnId
					: transactionRefNumber;

			if (transactionType === 'PURCHASE' && !pgTxnId?.length && !transactionRefNumber?.length) {
				statusItems[ORDER_DATA.ORDER_ID].copyIcon = false;
			}

			statusItems[ORDER_DATA.STAMP_DUTY].value = `₹${calculateTransactionCharges(amount)}`;
			statusItems[ORDER_DATA.FOLIO_NUMBER].value = folioNumber;

			const bankcreditDate = statusHistory?.find(
				(state: { status: string }) => state.status === 'ORDER_SENT_TO_RTA'
			)?.timeStamp;
			statusItems[ORDER_DATA.ESTIMATED_CREDIT_DATE].value = format(
				new Date(bankcreditDate || createdTs),
				'dd MMM yyyy'
			);

			statusItems[
				ORDER_DATA.BANK_DETAILS
			].value = `<div class="flex flex-col"><div>${bankName}</div><div class="text-sm text-grey-body">${
				bankAccountNumber?.length
					? '****' + bankAccountNumber?.substring(bankAccountNumber?.length - 4)
					: ''
			}</div></div>`;

			statusItems[ORDER_DATA.UNITS].value = units || quantity;
			if (actualNavDate) {
				statusItems[ORDER_DATA.NAV_DATE].value = format(
					new Date(actualNavDate * 1000),
					'dd MMM yyyy'
				);
			}
			statusItems[ORDER_DATA.SIP_DUE_DATE].value = getDateTimeString(scheduledTs, 'DATE', true);
			statusItems[ORDER_DATA.SIP_ID].value = sipId;

			const paymentStatusString = paymentStatus?.toUpperCase();

			// Setting the Transaction Details
			if (transactionType === 'PURCHASE') {
				if (orderStatus !== ORDER_STATUS.ORDER_REJECTED) {
					if (isInvestmentSipOrXsip) {
						const filter = [
							ORDER_DATA.ORDER_DATE,
							ORDER_DATA.ORDER_ID,
							ORDER_DATA.STAMP_DUTY,
							ORDER_DATA.BANK_DETAILS
						];
						if (orderStatus !== ORDER_STATUS.ORDER_COMPLETE) {
							filter.push(ORDER_DATA.EXPECTED_NAV_DATE);
						}
						if (orderStatus == ORDER_STATUS.ORDER_COMPLETE) {
							filter.push(ORDER_DATA.NAV_DATE);
						}
						if (
							orderStatus !== ORDER_STATUS.ORDER_COMPLETE &&
							firstOrder?.toUpperCase() === 'N' &&
							sipDetails?.mandateRefId?.length > 0
						) {
							filter.push(ORDER_DATA.SIP_DUE_DATE);
						}
						if (orderStatus === ORDER_STATUS.ORDER_COMPLETE) {
							filter.push(ORDER_DATA.UNITS);
						}
						if (orderStatus !== ORDER_STATUS.ORDER_COMPLETE && !sipDetails?.mandateRefId?.length) {
							filter.push(ORDER_DATA.SIP_ID);
						}
						statusItems = filterObject(statusItems, filter);
					} else if (investmentType === 'LUMPSUM') {
						const filter = [
							ORDER_DATA.ORDER_DATE,
							ORDER_DATA.BANK_DETAILS,
							ORDER_DATA.ORDER_ID,
							ORDER_DATA.STAMP_DUTY
						];
						if (orderStatus !== ORDER_STATUS.ORDER_COMPLETE) {
							filter.push(ORDER_DATA.EXPECTED_NAV_DATE);
						}
						if (orderStatus == ORDER_STATUS.ORDER_COMPLETE) {
							filter.push(ORDER_DATA.NAV_DATE);
							filter.push(ORDER_DATA.UNITS);
						}
						statusItems = filterObject(statusItems, filter);
					}
				} else if (orderStatus === ORDER_STATUS.ORDER_REJECTED) {
					if (isInvestmentSipOrXsip) {
						const filter = [ORDER_DATA.ORDER_DATE, ORDER_DATA.ORDER_ID, ORDER_DATA.BANK_DETAILS];
						if (firstOrder?.toUpperCase() === 'N') {
							filter.push(ORDER_DATA.SIP_DUE_DATE);
						}
						statusItems = filterObject(statusItems, filter);
					} else if (investmentType === 'LUMPSUM') {
						const filter = [ORDER_DATA.ORDER_DATE, ORDER_DATA.ORDER_ID, ORDER_DATA.BANK_DETAILS];
						statusItems = filterObject(statusItems, filter);
					}
					tag += '_rejected';
				}
				if (
					orderStatus?.toUpperCase() !== ORDER_STATUS.ORDER_COMPLETE &&
					orderStatus?.toUpperCase() !== ORDER_STATUS.ORDER_REJECTED
				) {
					tag += '_inprogress';
					if (paymentStatusString?.toUpperCase() === STATUS_ARR.SUCCESS) {
						tag += '_payment_success';
					}
					if (paymentStatusString?.toUpperCase() === STATUS_ARR.PENDING) {
						tag += '_payment_pending';
					}
				}
				if (orderStatus?.toUpperCase() === ORDER_STATUS.ORDER_COMPLETE) {
					tag += '_complete';
				}
			} else if (transactionType === 'REDEEM') {
				if (
					paymentStatusString !== STATUS_ARR.FAILED &&
					orderStatus !== ORDER_STATUS.ORDER_REJECTED
				) {
					const filter = [
						ORDER_DATA.ORDER_DATE,
						ORDER_DATA.ORDER_ID,
						ORDER_DATA.FOLIO_NUMBER,
						ORDER_DATA.ESTIMATED_CREDIT_DATE,
						ORDER_DATA.BANK_DETAILS,
						ORDER_DATA.UNITS
					];
					if (orderStatus === ORDER_STATUS.ORDER_COMPLETE) {
						filter.push(ORDER_DATA.NAV_DATE);
					} else {
						filter.push(ORDER_DATA.EXPECTED_NAV_DATE);
					}
					statusItems = filterObject(statusItems, filter);
				} else if (
					paymentStatusString === STATUS_ARR.FAILED ||
					orderStatus === ORDER_STATUS.ORDER_REJECTED
				) {
					const filter = [
						ORDER_DATA.ORDER_DATE,
						ORDER_DATA.ORDER_ID,
						ORDER_DATA.FOLIO_NUMBER,
						ORDER_DATA.UNITS
					];
					statusItems = filterObject(statusItems, filter);
				}
			} else if (transactionType === 'SWITCH') {
				if (orderStatus === ORDER_STATUS.ORDER_REJECTED) {
					const filter = [ORDER_DATA.ORDER_DATE, ORDER_DATA.ORDER_ID];
					statusItems = filterObject(statusItems, filter);
				} else if (orderStatus === ORDER_STATUS.ORDER_COMPLETE) {
					const filter = [
						ORDER_DATA.ORDER_DATE,
						ORDER_DATA.ORDER_ID,
						ORDER_DATA.NAV_DATE,
						ORDER_DATA.UNITS
					];
					statusItems = filterObject(statusItems, filter);
				} else {
					const filter = [
						ORDER_DATA.ORDER_DATE,
						ORDER_DATA.ORDER_ID,
						ORDER_DATA.EXPECTED_NAV_DATE,
						ORDER_DATA.UNITS
					];
					statusItems = filterObject(statusItems, filter);
				}
			} else {
				const filter = [ORDER_DATA.ORDER_DATE, ORDER_DATA.ORDER_ID];
				statusItems = filterObject(statusItems, filter);
			}
			// When order is type SIP investment recurring order OR lumpsum order via mandate ref number,
			// change some data for transaction details
			if (
				transactionType === 'PURCHASE' &&
				((isInvestmentSipOrXsip && firstOrder?.toUpperCase() === 'N') || lumpsumMandateOrder)
			) {
				Object.keys(statusItems)?.forEach((key) => {
					if (key === ORDER_DATA.ORDER_ID && !bankAcc?.length) {
						statusItems[key].value = Math?.abs(orderId)?.toString();
					}
					if (key === ORDER_DATA.BANK_DETAILS && !bankAcc?.length) {
						statusItems[key].title = ORDER_DATA.AUTO_PAY_BANK;
					}
				});
			}

			// If first order is Y and the mandate bank details is present
			if (
				transactionType === 'PURCHASE' &&
				isInvestmentSipOrXsip &&
				firstOrder?.toUpperCase() === 'Y' &&
				orderStatus !== ORDER_STATUS.ORDER_REJECTED &&
				orderStatus !== ORDER_STATUS.ORDER_COMPLETE &&
				sipDetails?.bankName?.length
			) {
				const autoPayDetails = {
					[ORDER_DATA.AUTO_PAY_BANK]: {
						title: ORDER_DATA.AUTO_PAY_BANK,
						value: '',
						node: true
					}
				};
				autoPayDetails[ORDER_DATA.AUTO_PAY_BANK].value = `<div class="flex flex-col"><div>${
					sipDetails?.bankName
				}</div><div class="text-sm text-grey-body">${
					sipDetails?.accountNo?.length
						? '****' + sipDetails?.accountNo?.substring(sipDetails?.accountNo?.length - 4)
						: ''
				}</div></div>`;
				// To maintain the odering that stamp duty should be last
				const stampDutyDetails = statusItems[ORDER_DATA.STAMP_DUTY];
				delete statusItems[ORDER_DATA.STAMP_DUTY];
				statusItems = { ...statusItems, ...autoPayDetails, stampDutyDetails };
			}

			// History to set the timeline data
			if (statusHistory && statusHistory.length > 0) {
				let previousStepCurrentState: number | null = null;
				let isCurrentStateAvailable = false;
				let showSubTitle = true;
				statusHistory.forEach(
					(
						item: {
							timeStamp: string | number | Date;
							failed: boolean;
							message: string;
							description: string;
							currentState: boolean;
						},
						index: number | null
					) => {
						let status = STATUS_ARR.NONE;
						let subTitle = `Estimated by: ${format(new Date(item.timeStamp), 'dd MMM yyyy')}`;
						let message = '';
						let bgColorPending = false;
						let textColorPending = false;
						message = item?.message || '';
						if (isNull(previousStepCurrentState) && item.failed) {
							status = STATUS_ARR.FAILED;
							subTitle = `Failed: ${format(new Date(item.timeStamp), 'dd MMM yyyy, hh:mm a')}`;
							if (index === 2) {
								isOrderFailedAtExchange = true;
							}
							headerContent.subHeadingText = item?.description || '';
						} else if (isNull(previousStepCurrentState) && item.currentState) {
							if (index === 0) {
								status = STATUS_ARR.PAYMENT_PENDING;
								bgColorPending = true;
								textColorPending = true;
								headerContent.subHeadingText = 'Your payment is being processed';
								if (transactionType === 'REDEEM') {
									headerContent.subHeadingText = 'Your payout is being processed';
								}
								showSubTitle = false;
								message =
									'If the payment is not processed, it will be refunded to your bank account automatically';
							} else if (index === 2) {
								status = STATUS_ARR.PENDING;
								headerContent.status = STATUS_ARR.PENDING;
								headerContent.heading = 'In Progress';
								headerContent.subHeadingText = item?.description || item?.message;
							} else {
								status = STATUS_ARR.PENDING;
								headerContent.subHeadingText = 'Your payment is being processed';
								if (transactionType === 'REDEEM') {
									headerContent.subHeadingText = 'Your payout is being processed';
								}
								if (index === 3) {
									headerContent.subHeadingText = `Your portfolio will be updated by ${getDateTimeString(
										Number(item.timeStamp),
										'DATE',
										true
									)}`;
								}
							}
							previousStepCurrentState = index;
						} else if (isNull(previousStepCurrentState)) {
							status = STATUS_ARR.SUCCESS;
							subTitle = `${format(new Date(item.timeStamp), 'dd MMM yyyy, hh:mm a')}`;
							headerContent.subHeadingText = `Portfolio updated on ${getDateTimeString(
								Number(item.timeStamp),
								'DATE',
								true
							)}`;
						}
						if (item.currentState && !isCurrentStateAvailable) {
							isCurrentStateAvailable = true;
						}
						if (
							index === statusHistory.length - 1 &&
							!isCurrentStateAvailable &&
							orderStatus !== ORDER_STATUS.ORDER_COMPLETE
						) {
							item.currentState = true;
						}
						orderStatusItems.push({
							title: item.description,
							subTitle,
							status,
							message,
							showSubTitle,
							currentState: item.currentState,
							bgColorPending,
							textColorPending
						});
					}
				);
			}

			if (orderStatus === ORDER_STATUS.ORDER_PROCESSING) {
				headerContent.status = STATUS_ARR.PENDING;
			} else if (orderStatus === ORDER_STATUS.ORDER_REJECTED) {
				headerContent.status = STATUS_ARR.FAILURE;
				headerContent.heading = 'Failed';
			} else if (orderStatus === ORDER_STATUS.ORDER_COMPLETE) {
				headerContent.status = STATUS_ARR.SUCCESS;
				headerContent.heading = 'Completed';
			}

			showStatusNote =
				transactionType === 'PURCHASE' &&
				orderStatus === ORDER_STATUS.ORDER_REJECTED &&
				isOrderFailedAtExchange;

			showFooterButton =
				isInvestmentAllowed(userDetails?.userType, schemePlan) &&
				(transactionType === TRANSACTION_TYPE.PURCHASE ||
					transactionType === TRANSACTION_TYPE.REDEEM) &&
				orderStatus === ORDER_STATUS.ORDER_REJECTED &&
				investmentType !== 'XSIP' &&
				!isNfoClosed;

			if (paymentStatusString?.length) {
				if (paymentStatusString === STATUS_ARR?.PENDING) {
					headerContent.status = paymentStatusString;
				}
			}
			if (createdBy?.toLowerCase() === 'nudge') {
				tag += '_nudge';
			}
			orderDetailsPageAnalytics(res.data.data, isInvestmentSipOrXsip, lumpsumMandateOrder);
			return {
				data: res.data.data,
				isInvestmentSipOrXsip,
				lumpsumMandateOrder,
				showStatusNote,
				headerContent,
				showFooterButton,
				isOrderFailedAtExchange,
				orderStatusItems,
				statusItems,
				bankName,
				schemeDetails,
				transactionDetails,
				bankAccountNumber,
				tag
			};
		}
		return {
			data: ordersData
		};
	};

	return {
		layoutConfig: {
			title: 'Order Details',
			showBackIcon: true,
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING'
		},
		orderId: params?.orderId || '',
		api: {
			getOrdersData: hydrate ? getOrdersData() : await getOrdersData()
		}
	};
}) satisfies PageLoad;
