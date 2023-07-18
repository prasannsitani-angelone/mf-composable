import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import ORDER_DATA from '$lib/constants/orderDataItems';
import type { IOrderDetails } from '$lib/types/IOrderDetails';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
import type { ISip } from '$lib/types/ISipType';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import { format } from 'date-fns';
import type { PageLoad } from './$types';
import type { IStatusItem } from '../../../orders/[orderId]/type';
import { calculateTransactionCharges } from '$lib/utils/helpers/order';
import STATUS_ARR from '$lib/constants/orderFlowStatuses';
import type { StatusHistoryItem } from '../../type';
import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
import { withdrawOrderSummaryScreenOpenAnalytics } from '$lib/analytics/redemption/redemption';

export const load = (async ({ fetch, params }) => {
	let ordersData: IOrderDetails;

	let statusItems: Array<IStatusItem> = [
		{
			title: ORDER_DATA.TRANSACTION_DATE,
			value: ''
		},
		{
			title: ORDER_DATA.EXPECTED_NAV_DATE,
			value: '',
			informationIcon: true,
			informationHeading: 'Expected NAV Date',
			informationSubheading: ''
		},
		{
			title: ORDER_DATA.PAYMENT_METHOD,
			value: ''
		},
		{
			title: ORDER_DATA.TRANSACTION_ID,
			value: '',
			copyIcon: true
		},
		{
			title: ORDER_DATA.STAMP_DUTY,
			value: ''
		},
		{
			title: ORDER_DATA.FOLIO_NUMBER,
			value: ''
		},
		{
			title: ORDER_DATA.ESTIMATED_CREDIT_DATE,
			value: ''
		},
		{
			title: ORDER_DATA.BANK_DETAILS,
			value: '',
			node: true
		}
	];

	let schemeDetails = <SchemeDetails>{};
	let sipDetails = <ISip>{};
	let orderStatusItems = <Array<StatusHistoryItem>>[];
	let amountTitle = 'Amount';
	let bankName = '';
	let bankAccountNumber = '';
	let displayAmountUnit = '';

	const headerContent = {
		heading: '',
		subHeading: '',
		status: 'SUCCESS'
	};

	const isNull = (val: unknown) => {
		if (!val && val !== 0) {
			return true;
		}
		return false;
	};

	const ordersUrl = `${PUBLIC_MF_CORE_BASE_URL}/orders/${params?.orderId}?statusHistory=true`;

	const getOrdersData = async () => {
		const res = await useFetch(ordersUrl, {}, fetch);
		if (res.ok && res?.data?.data) {
			ordersData = res?.data?.data;

			const {
				investmentType,
				createdTs,
				statusHistory,
				transactionType,
				ExpectedNavDate,
				orderId,
				pgTxnId,
				transactionRefNumber,
				folioNumber,
				amount,
				paymentStatus,
				status,
				sipId,
				quantity,
				isin,
				schemeCode,
				paymentMode
			} = ordersData;

			bankName = ordersData?.bankName;
			bankAccountNumber = ordersData?.bankAccountNo;

			if (investmentType?.toUpperCase() === 'SIP') {
				const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${sipId}`;

				const sipResponse = await useFetch(sipUrl, {}, fetch);
				sipDetails = sipResponse?.data?.data;

				bankName = sipDetails?.bankName;
				bankAccountNumber = sipDetails?.accountNo;
			}

			statusItems[0].value = format(new Date(createdTs), 'do MMM yyyy');

			const expectedNavDate = statusHistory?.find((state) => state.status === 'ORDER_SENT_TO_RTA')
				?.timeStamp;

			if (transactionType === 'REDEEM' && ExpectedNavDate) {
				statusItems[1].value = format(new Date(ExpectedNavDate * 1000), 'do MMM yyyy');
				statusItems[1].informationSubheading =
					'NAV date for withdrawal is subject to order being successful on BSE STAR before cut-off. Your actual NAV date may differ.';
			} else if (expectedNavDate) {
				statusItems[1].value = format(new Date(expectedNavDate), 'do MMM yyyy');
				statusItems[1].informationSubheading =
					'Waiting for the exchange to confirm all details of your order. Your NAV will be confirmed on realisation of funds by AMC. Your actual NAV date may differ.';
			}

			statusItems[2].value = paymentMode;

			statusItems[3].value = `${
				transactionType === 'REDEEM'
					? Math.abs(orderId)
					: pgTxnId?.length
					? pgTxnId
					: transactionRefNumber
			}`;

			statusItems[4].value = `₹${calculateTransactionCharges(amount?.toString())}`;
			statusItems[5].value = folioNumber;

			const bankcreditDate = statusHistory?.find((state) => state.status === 'ORDER_SENT_TO_RTA')
				?.timeStamp;
			statusItems[6].value = format(new Date(bankcreditDate || createdTs), 'do MMM yyyy');

			statusItems[7].value = `<div class="flex flex-col items-end md:items-center"><div>${bankName}</div><div class="text-sm text-grey-body">${
				bankAccountNumber?.length
					? '****' + bankAccountNumber?.substring(bankAccountNumber?.length - 4)
					: ''
			}</div></div>`;

			const paymentStatusString = paymentStatus?.toUpperCase();

			if (transactionType === 'REDEEM') {
				if (paymentStatusString !== STATUS_ARR.FAILED && status !== 'ORDER_REJECTED') {
					statusItems = statusItems?.filter(
						(item) =>
							item?.title === ORDER_DATA.TRANSACTION_DATE ||
							item?.title === ORDER_DATA.EXPECTED_NAV_DATE ||
							item?.title === ORDER_DATA.TRANSACTION_ID ||
							item?.title === ORDER_DATA.FOLIO_NUMBER ||
							item?.title === ORDER_DATA.ESTIMATED_CREDIT_DATE ||
							item?.title === ORDER_DATA.BANK_DETAILS
					);
				} else if (paymentStatusString === STATUS_ARR.FAILED || status === 'ORDER_REJECTED') {
					statusItems = statusItems?.filter(
						(item) =>
							item?.title === ORDER_DATA.TRANSACTION_DATE ||
							item?.title === ORDER_DATA.TRANSACTION_ID ||
							item?.title === ORDER_DATA.FOLIO_NUMBER ||
							item?.title === ORDER_DATA.BANK_DETAILS
					);
				}
			} else {
				statusItems = statusItems?.filter(
					(item) =>
						item?.title === ORDER_DATA.TRANSACTION_DATE || item?.title === ORDER_DATA.TRANSACTION_ID
				);
			}

			if (statusHistory && statusHistory.length > 0) {
				const statusHistoryItems: Array<StatusHistoryItem> = [];
				let previousStepCurrentState: unknown = null;

				statusHistory.forEach((item, index) => {
					let status = STATUS_ARR.NONE;
					let subTitle = `Estimated by: ${format(new Date(item.timeStamp), 'dd MMMM yyyy')}`;

					let bgColorPending = false;
					let textColorPending = false;
					let showSubTitle = true;

					if (isNull(previousStepCurrentState) && item.failed) {
						status = STATUS_ARR.FAILED;
						subTitle = format(new Date(item.timeStamp), 'dd MMMM yyyy hh:mm a');

						headerContent.heading = item?.description;
					} else if (isNull(previousStepCurrentState) && item.currentState) {
						if (index === 0) {
							bgColorPending = true;
							textColorPending = true;
							showSubTitle = false;
						}

						status = STATUS_ARR.PENDING;

						headerContent.heading = 'Your payment is being processed';

						if (transactionType === 'REDEEM') {
							headerContent.heading = 'Your payout is being processed';
						}

						previousStepCurrentState = index;
					} else if (isNull(previousStepCurrentState)) {
						status = STATUS_ARR.SUCCESS;
						subTitle = format(new Date(item.timeStamp), 'dd MMMM yyyy hh:mm a');
					}
					statusHistoryItems.push({
						title: item.description,
						subTitle,
						status,
						bgColorPending,
						textColorPending,
						showSubTitle,
						currentState: item?.currentState
					});
				});

				orderStatusItems = statusHistoryItems;
			}

			if (status === 'ORDER_PROCESSING') {
				headerContent.status = STATUS_ARR.PENDING;
			} else if (status === 'ORDER_REJECTED') {
				headerContent.status = STATUS_ARR.FAILURE;
			}

			if (paymentStatusString?.length) {
				if (paymentStatusString === STATUS_ARR?.PENDING) {
					headerContent.status = paymentStatusString;
				}
			}

			headerContent.heading = 'Withdraw Order Placed Sucessfully';
			headerContent.subHeading = 'Your withdrawal verification is successful';
			headerContent.status = STATUS_ARR.SUCCESS;

			const schemeUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;

			const schemeResponse = await useFetch(schemeUrl, {}, fetch);
			schemeDetails = schemeResponse?.data;

			displayAmountUnit = `${addCommasToAmountString(parseFloat(amount?.toFixed(2))?.toString())}`;

			if (transactionType === 'PURCHASE') {
				if (investmentType === 'SIP') {
					amountTitle = 'SIP Amount';
				} else if (investmentType === 'LUMPSUM') {
					amountTitle = 'Investment Amount';
				}
			} else if (transactionType === 'REDEEM') {
				if (amount > 0) {
					amountTitle = 'Withdrawal Amount';
				} else if (quantity > 0) {
					amountTitle = 'Withdrawal Units';
					displayAmountUnit = quantity?.toFixed(3);
				}
			} else {
				amountTitle = 'Amount';
			}

			if (investmentType !== 'SIP' && investmentType !== 'XSIP') {
				statusItems[0].title = ORDER_DATA.ORDER_DATE;
			}

			const eventMetadata = {
				Message: 'Withdraw Order Successfully Placed',
				WithdrawalDetails: ordersData?.schemeName,
				AmountWithdrawn: ordersData?.amount,
				EstCompletionTime: format(new Date(ordersData?.ExpectedNavDate * 1000), 'dd MMM yyyy'),
				Status: ordersData?.remarks?.length
					? ordersData?.remarks
					: ordersData?.statusHistory?.find((item) => item?.currentState)?.description,
				FolioNumber: ordersData?.folioNumber,
				TransactionDate: format(new Date(ordersData?.createdTs), 'dd MMM yyyy'),
				TransactionID: Math.abs(ordersData?.orderId)
			};

			withdrawOrderSummaryScreenOpenAnalytics(eventMetadata);

			return {
				ordersData,
				headerContent,
				orderStatusItems,
				statusItems,
				bankName,
				schemeDetails,
				bankAccountNumber,
				amountTitle,
				displayAmountUnit,
				eventMetadata
			};
		}
		return {
			data: ordersData
		};
	};

	return {
		layoutConfig: {
			title: 'Order Summary',
			showBackIcon: true,
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING'
		},
		orderId: params?.orderId || '',
		api: {
			getOrdersData: hydrate ? getOrdersData() : await getOrdersData()
		}
	};
}) satisfies PageLoad;
