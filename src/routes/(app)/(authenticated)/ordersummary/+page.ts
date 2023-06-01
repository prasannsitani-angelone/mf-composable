import { PUBLIC_MF_ANDROID_APN, PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import { hydrate } from '$lib/utils/helpers/hydrated';
import type { SchemeCardItems, SIPData } from './type';
import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
import { STATUS_ARR } from './constant';
import { format } from 'date-fns';
import type { BankDetailsEntity } from '$lib/types/IUserProfile';
import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
import { base } from '$app/paths';
import { shareMessage } from '$lib/utils/share';

export const load = async ({ fetch, url, parent, depends }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params);
	const { profile } = await parent();
	const { orderID, sipID, firstTimePayment } = decodedParams;
	let schemeData: Record<string, string>;
	const getOrderDetailsFunc = async () => {
		try {
			if (firstTimePayment) {
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

	const onClickShareIcon = async () => {
		const parentData = await parent();
		const link = `https://angeloneapp.page.link/?link=${parentData.scheme}//${
			parentData.host
		}${base}/schemes/${normalizeFundName(
			schemeData?.schemeName,
			schemeData?.isin,
			schemeData?.schemeCode
		)}&apn=${PUBLIC_MF_ANDROID_APN}`;
		const message = {
			text: `Hey, I just invested in the ${schemeData?.schemeName}. Join me in investing on Angel One - ${link}`
		};
		shareMessage(parentData.sparkHeaders, message);
	};

	const getAPIData = async () => {
		const response = await Promise.all([getSIPDetailsFunc(), getOrderDetailsFunc()]);
		const sipData = response[0];
		const orderData = response[1];
		const schemeCardItems: Array<SchemeCardItems> = [];
		const schemeDetails: Record<string, string> = {};
		const statusHistoryItems: Array<Record<string, any>> = [];
		let statusCardHeading = '';
		const headerContent: Record<string, any> = {
			heading: '',
			subHeadingArr: [],
			status: STATUS_ARR.SUCCESS,
			subHeaderClass: ''
		};

		const isLumpsumOrder = orderID && !sipID;
		const isSIPOrder = (orderID && sipID) || (!firstTimePayment && sipID);

		if (orderData?.ok) {
			const data = orderData?.data?.data;
			if (data?.statusHistory && data.statusHistory.length > 0) {
				let previousStepCurrentState: number | null = null;
				data.statusHistory.forEach((item: Record<string, any>, index: number) => {
					let status = STATUS_ARR.NONE;
					let subTitle = `Estimated by: ${format(new Date(item.timeStamp), 'dd MMMM yyyy')}`;
					if (isNull(previousStepCurrentState) && item.failed) {
						status = STATUS_ARR.FAILED;
						statusCardHeading = item.description;
						subTitle = format(new Date(item.timeStamp), 'dd MMMM yyyy hh:mm a');
					} else if (isNull(previousStepCurrentState) && item.currentState) {
						previousStepCurrentState = index;
						statusCardHeading = item.description;
						status = STATUS_ARR.PENDING;
					} else if (isNull(previousStepCurrentState)) {
						status = STATUS_ARR.SUCCESS;
						statusCardHeading = item.description;
						subTitle = format(new Date(item.timeStamp), 'dd MMMM yyyy hh:mm a');
					}
					statusHistoryItems.push({
						title: item.description,
						subTitle,
						status
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
							headerContent.subHeaderClass = 'bg-yellow-secondary/20';
						} else if (item.status === STATUS_ARR.PENDING) {
							item.status = STATUS_ARR.PAYMENT_PENDING;
							headerContent.heading = 'Order Pending';
							headerContent.subHeadingArr = [
								{
									text: 'We are confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update',
									class: ''
								}
							];
							headerContent.status = STATUS_ARR.PENDING;
							headerContent.subHeaderClass = 'bg-yellow-secondary/20';
						} else if (item.status === STATUS_ARR.SUCCESS) {
							headerContent.heading = 'Order Placed Successfully';
							headerContent.subHeadingArr = [
								{
									text: `Your portfolio will be updated by ${format(
										new Date(data.statusHistory[data.statusHistory.length - 1].timeStamp),
										'do MMMM yyyy'
									)}`,
									class: '!text-black-title font-medium'
								}
							];
							headerContent.status = STATUS_ARR.SUCCESS;
							headerContent.subHeaderClass = 'bg-green-buy/10';
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
						headerContent.subHeaderClass = 'bg-yellow-secondary/20';
					}
				});
			}
			if (isLumpsumOrder) {
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
		}
		if (!firstTimePayment && sipData?.ok) {
			const data = sipData?.data?.data;
			headerContent.heading = 'SIP Created Successfully';
			headerContent.subHeadingArr = [
				{
					text: `Your first SIP payment is on ${getNextSIPDate(data)}`,
					class: '!text-black-title font-medium'
				}
			];
			headerContent.status = STATUS_ARR.SUCCESS;
			headerContent.subHeaderClass = 'bg-green-buy/10';
		}
		schemeData = schemeDetails;
		return {
			schemeCardItems,
			schemeDetails,
			statusHistoryItems,
			statusCardHeading,
			headerContent,
			ok:
				(isLumpsumOrder && orderData?.ok) ||
				(isSIPOrder && ((orderData?.ok && sipData?.ok) || (!firstTimePayment && sipData?.ok))),
			paymentStatus: orderData?.data?.data?.paymentStatus,
			emandateBankDetails: getBankDetailsByAccountNumber(
				profile?.bankDetails,
				sipData?.data?.data?.accountNo
			),
			orderData,
			sipData
		};
	};

	depends('app:ordersummary');

	return {
		api: {
			data: hydrate ? getAPIData() : await getAPIData()
		},
		layoutConfig: {
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			title: 'Order Summary',
			showShareIcon: true,
			onClickShareIcon: onClickShareIcon
		}
	};
};
