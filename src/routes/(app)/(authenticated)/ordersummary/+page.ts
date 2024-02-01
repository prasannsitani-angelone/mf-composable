import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { decodeToObject, encodeObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import { hydrate } from '$lib/utils/helpers/hydrated';
import type { AutopayTimelineItems, SchemeCardItems, SIPData } from './type';
import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
import { STATUS_ARR } from './constant';
import { format } from 'date-fns';
import type { BankDetailsEntity } from '$lib/types/IUserProfile';
import { ORDER_STATUS } from '$lib/constants/orderFlowStatuses';
import { faqsIconClick } from '$lib/analytics/faqs/faqs';

export const load = async ({ fetch, url, parent, depends }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params);
	const { profile } = await parent();
	const { orderID, sipID, firstTimePayment, isRedeem, isSwitch, isSwp } = decodedParams;
	const isLumpsumOrder = orderID && !sipID;
	const isSIPOrder = (orderID && sipID) || (!firstTimePayment && sipID);
	const autopayTimelineItems: Array<AutopayTimelineItems> = [];
	let tag = 'orders';
	let isInvestmentSipOrXsip = false;
	let faqParams = encodeObject({
		tag,
		orderId: orderID
	});

	const getOrderDetailsFunc = async () => {
		try {
			if (firstTimePayment || isRedeem || isSwitch || isSwp) {
				const response = await useFetch(
					`${PUBLIC_MF_CORE_BASE_URL}/orders/${orderID}?statusHistory=true`,
					{},
					fetch
				);
				return response;
			}
		} catch (e) {
			return {};
		}
	};

	const getSIPDetailsFunc = async () => {
		try {
			if (sipID) {
				const response = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/sips/${sipID}`, {}, fetch);
				return response;
			}
		} catch (e) {
			return {};
		}
	};

	const isNull = (val: number | null) => {
		if (!val && val !== 0) {
			return true;
		}
		return false;
	};

	const getNextSIPDate = (data: SIPData = {}) => {
		return data?.startDate ? format(new Date(data.startDate), 'dd MMM yyyy') : '';
	};

	const getBankDetailsByAccountNumber = (bankDetails: Array<BankDetailsEntity>, accNO: string) => {
		return bankDetails?.find((bankAccount) => {
			return accNO === bankAccount.accNO;
		});
	};

	const getAutopayTimelineItems = (
		nextSipDate: number,
		firstOrderToday: boolean,
		currentStatus: string
	) => {
		const nextSipDueDate = new Date(nextSipDate);
		const status = currentStatus;
		const futurePaymentMonths = firstOrderToday ? 3 : 4;

		if (firstOrderToday) {
			autopayTimelineItems.push({
				title: `${new Date()?.toLocaleDateString('en-US', { month: 'short' })}`,
				status: status
			});
		}

		for (let i = 0; i < futurePaymentMonths; i++) {
			const monthsToAdd = i === 0 ? 0 : 1;
			const temp = new Date(nextSipDueDate?.setMonth(nextSipDueDate.getMonth() + monthsToAdd));
			const status = i === 0 ? STATUS_ARR.FAILED : STATUS_ARR.NONE;
			autopayTimelineItems.push({
				title: `${temp?.toLocaleDateString('en-US', { month: 'short' })}`,
				status: status
			});
		}
	};

	const onClickFaqsIcon = () => {
		faqsIconClick({
			Source: 'OrderSummary'
		});
	};

	const getAPIData = async () => {
		const response = await Promise.all([getSIPDetailsFunc(), getOrderDetailsFunc()]);
		const sipData = response[0];
		const orderData = response[1];
		const schemeCardItems: Array<SchemeCardItems> = [];
		const schemeDetails: Record<string, string> = {};
		const statusHistoryItems: Array<Record<string, any>> = [];
		let amount = '';
		let statusCardHeading = '';
		const headerContent: Record<string, any> = {
			heading: '',
			subHeadingArr: [],
			status: STATUS_ARR.SUCCESS,
			subHeaderClass: '',
			remarks: ''
		};

		if (orderData?.ok) {
			const data = orderData?.data?.data;
			if (data?.statusHistory && data.statusHistory.length > 0) {
				let previousStepCurrentState: number | null = null;
				data.statusHistory.forEach((item: Record<string, any>, index: number) => {
					let status = STATUS_ARR.NONE;
					let subTitle = `Estimated by: ${format(new Date(item.timeStamp), 'dd MMM yyyy')}`;
					const currentState = item?.currentState || false;
					if (isNull(previousStepCurrentState) && item.failed) {
						status = STATUS_ARR.FAILED;
						statusCardHeading = item.description;
						subTitle = format(new Date(item.timeStamp), 'dd MMM yyyy, hh:mm a');
					} else if (isNull(previousStepCurrentState) && item.currentState) {
						previousStepCurrentState = index;
						statusCardHeading = item.description;
						status = STATUS_ARR.PENDING;
					} else if (isNull(previousStepCurrentState)) {
						status = STATUS_ARR.SUCCESS;
						statusCardHeading = item.description;
						subTitle = format(new Date(item.timeStamp), 'dd MMM yyyy, hh:mm a');
					}
					statusHistoryItems.push({
						title: item.description,
						subTitle,
						status,
						currentState
					});
				});
				statusHistoryItems.forEach((item, index) => {
					if (index === 0) {
						if (item.status === STATUS_ARR.FAILED) {
							headerContent.heading = 'Order Failed';
							headerContent.subHeadingArr = [
								{
									text: 'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
									class: 'text-red-sell'
								}
							];
							headerContent.status = STATUS_ARR.FAILED;
						} else if (item.status === STATUS_ARR.PENDING) {
							item.status = STATUS_ARR.PENDING;
							headerContent.heading = 'Order Pending';
							headerContent.remarks =
								'If the payment is not processed, it will be refunded to your bank account automatically';
							headerContent.subHeadingArr = [
								{
									text: 'We are confirming the status of your payment. This usually takes a few minutes.',
									class: ''
								}
							];
							headerContent.status = STATUS_ARR.PENDING;
						} else if (item.status === STATUS_ARR.SUCCESS) {
							headerContent.heading = 'Order Placed Successfully';
							headerContent.subHeadingArr = [
								{
									text: `Your portfolio will be updated by ${format(
										new Date(data.statusHistory[data.statusHistory.length - 1].timeStamp),
										'dd MMM yyyy'
									)}`,
									class: ''
								}
							];
							headerContent.status = STATUS_ARR.SUCCESS;
						}
					} else if (index === 2 && item.status === STATUS_ARR.FAILED) {
						headerContent.heading = 'Order Processing Failed by AMC';
						headerContent.subHeadingArr = [
							{
								text: 'We are currently unable to process the mandate request to schedule automatic fund transfer from your bank account to trading account for SIP investments due to some technical issues. Please try again',
								class: 'text-red-sell'
							}
						];
						headerContent.status = STATUS_ARR.FAILED;
					}
				});
			}
			if (isLumpsumOrder) {
				headerContent.heading = 'One Time Order Placed Successfully';
				amount = `₹${addCommasToAmountString(data?.amount)}`;
				schemeCardItems.push({
					title: 'One Time Investment Amount',
					value: `₹ ${addCommasToAmountString(data?.amount)}`
				});
				schemeDetails.logoUrl = data?.logoUrl;
				schemeDetails.schemePlan = data?.schemePlan;
				schemeDetails.schemeName = data?.schemeName;
				schemeDetails.isin = data?.isin;
				schemeDetails.schemeCode = data?.schemeCode;
			}
		}

		if (sipData?.ok) {
			const data = sipData?.data?.data;
			amount = `₹${addCommasToAmountString(data?.installmentAmount)}`;
			schemeCardItems.push({
				title: 'Amount',
				value: `₹ ${addCommasToAmountString(data?.installmentAmount)}`
			});
			schemeCardItems.push({
				title: firstTimePayment ? 'Next SIP Payment' : 'First SIP Payment',
				value: getNextSIPDate(data)
			});
			schemeDetails.logoUrl = data?.logoUrl;
			schemeDetails.schemePlan = data?.schemePlan;
			schemeDetails.schemeName = data?.schemeName;
			schemeDetails.isin = data?.isin;
			schemeDetails.schemeCode = data?.schemeCode;

			headerContent.heading = 'SIP Order Placed';
			if (!firstTimePayment) {
				headerContent.subHeadingArr = [
					{
						text: `Your first SIP payment is on ${getNextSIPDate(data)}`,
						class: ''
					}
				];
				headerContent.status = STATUS_ARR.SUCCESS;
			} else if (data?.isFtpWithMandate) {
				headerContent.subHeadingArr = [
					{
						text: 'SIP amount will be debited from your Autopay bank account within 3 working days',
						class: ''
					}
				];
			}

			getAutopayTimelineItems(
				sipData?.data?.data?.nextSipDueDate,
				sipData?.data?.data?.firstOrderToday,
				headerContent?.status
			);
		}

		// ** ============ FAQ tag specification ============= **
		if (orderData?.ok) {
			const data = orderData?.data?.data;
			const {
				investmentType,
				firstOrder,
				transactionType,
				createdBy,
				status: orderStatus,
				paymentStatus
			} = data;
			const paymentStatusString = paymentStatus?.toUpperCase();

			isInvestmentSipOrXsip =
				investmentType?.toUpperCase() === 'SIP' || investmentType?.toUpperCase() === 'XSIP';
			if (isInvestmentSipOrXsip) {
				tag += '_sip';
				if (firstOrder?.toUpperCase() === 'Y') {
					tag += '_ftpy';
				} else {
					tag += '_ftpn';
				}
			}

			if (investmentType?.toUpperCase() === 'LUMPSUM') {
				tag += '_lumpsum';
			}

			if (transactionType === 'PURCHASE') {
				if (orderStatus === ORDER_STATUS.ORDER_REJECTED) {
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
			}
			if (createdBy?.toLowerCase() === 'nudge') {
				tag += '_nudge';
			}
			faqParams = encodeObject({
				tag,
				orderId: orderID
			});
		}

		if (isRedeem) {
			headerContent.heading = 'Withdraw Order Placed';
		} else if (isSwitch) {
			headerContent.heading = 'Switch Order Placed';
		} else if (isSwp) {
			headerContent.heading = 'SWP Order Placed';
		}

		if (headerContent.status == STATUS_ARR.PENDING) {
			headerContent.heading = 'Order Pending';
		}

		return {
			amount,
			schemeCardItems,
			schemeDetails,
			statusHistoryItems,
			statusCardHeading,
			headerContent,
			ok:
				(isLumpsumOrder && orderData?.ok) ||
				(isSIPOrder && ((orderData?.ok && sipData?.ok) || (!firstTimePayment && sipData?.ok))) ||
				isRedeem ||
				isSwitch ||
				isSwp,
			paymentStatus: orderData?.data?.data?.paymentStatus,
			emandateBankDetails: getBankDetailsByAccountNumber(
				profile?.bankDetails,
				sipData?.data?.data?.accountNo
			),
			orderData,
			sipData,
			autopayTimelineItems,
			isRedeem,
			isSwitch,
			isSwp,
			tag
		};
	};

	depends('app:ordersummary');

	return {
		api: {
			data: hydrate ? getAPIData() : await getAPIData()
		},
		layoutConfig: {
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			layoutClass: 'bg-white md:bg-grey',
			title: 'Order Summary',
			showFaqIcon: true,
			faqParams,
			onClickFaqsIcon,
			faqIconStroke: '#3F5BD9'
		}
	};
};
