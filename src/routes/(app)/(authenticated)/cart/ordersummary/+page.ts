import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import { hydrate } from '$lib/utils/helpers/hydrated';
import STATUS_ARR from '$lib/constants/orderFlowStatuses';
import { format } from 'date-fns';

export const load = async ({ fetch, url, depends }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params);
	const { orderID } = decodedParams;

	const getOrderDetailsFunc = async () => {
		const headerContent: Record<string, string | Array<Record<string, string>>> = {
			heading: '',
			subHeadingArr: [],
			status: STATUS_ARR.NONE,
			subHeaderClass: ''
		};
		let investmentType = '';
		let totalAmount = 0;
		let isMandateLinked = false;
		let schemeLogoUrl = '';
		try {
			const response = await useFetch(
				`${PUBLIC_MF_CORE_BASE_URL}/carts/items/orders/${orderID}`,
				{},
				fetch
			);

			if (response.ok) {
				const data = response?.data?.data;
				if (data?.paymentStatus?.toUpperCase() === STATUS_ARR.SUCCESS) {
					headerContent.heading = 'Order Placed Successfully';
					headerContent.subHeadingArr = [
						{
							text: `Your portfolio will be updated by ${format(
								new Date(data?.estimatedCompletionDate),
								'do MMMM yyyy'
							)}`,
							class: '!text-black-title font-normal'
						}
					];
					headerContent.status = STATUS_ARR.SUCCESS;
					headerContent.subHeaderClass = 'bg-green-buy/10';
				} else if (data?.paymentStatus?.toUpperCase() === STATUS_ARR.FAILURE) {
					headerContent.heading = 'Order Failed';
					headerContent.subHeadingArr = [
						{
							text: 'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
							class: 'text-red-sell'
						}
					];
					headerContent.status = STATUS_ARR.FAILED;
					headerContent.subHeaderClass = 'bg-yellow-secondary/20';
				} else if (data?.paymentStatus?.toUpperCase() === STATUS_ARR.PENDING) {
					headerContent.heading = 'Order Pending';
					headerContent.subHeadingArr = [
						{
							text: 'We are confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update',
							class: ''
						}
					];
					headerContent.status = STATUS_ARR.PENDING;
					headerContent.subHeaderClass = 'bg-yellow-secondary/20';
				}

				data?.checkedOutItems.map((item) => {
					totalAmount += item.amount;
					isMandateLinked = isMandateLinked || item.isMandateLinked;
					schemeLogoUrl = item.logoUrl;
					investmentType =
						investmentType.toUpperCase() === 'SIP' || item?.investmentType?.toUpperCase() === 'SIP'
							? 'SIP'
							: 'LUMPSUM';
				});
			}

			return {
				...response,
				headerContent,
				investmentType,
				totalAmount,
				isMandateLinked,
				schemeLogoUrl
			};
		} catch (e) {
			return {
				headerContent,
				investmentType,
				totalAmount,
				isMandateLinked,
				schemeLogoUrl
			};
		}
	};

	depends('app:cart:ordersummary');

	return {
		api: {
			ordersData: hydrate ? getOrderDetailsFunc() : await getOrderDetailsFunc()
		},
		layoutConfig: {
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			title: 'Order Summary'
		}
	};
};
