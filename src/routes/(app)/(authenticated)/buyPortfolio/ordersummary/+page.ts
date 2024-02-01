import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import { hydrate } from '$lib/utils/helpers/hydrated';
import STATUS_ARR from '$lib/constants/orderFlowStatuses';
import type { AutopayTimelineItems } from '../../ordersummary/type';

export const load = async ({ fetch, url, depends }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params);
	const { bulkId } = decodedParams;
	const autopayTimelineItems: Array<AutopayTimelineItems> = [];

	const getAutopayTimelineItems = (currentStatus: string) => {
		const status = currentStatus;
		const futurePaymentMonths = 3;

		autopayTimelineItems.push({
			title: `${new Date()?.toLocaleDateString('en-US', { month: 'short' })}`,
			status: status
		});

		const temp = new Date();
		for (let i = 0; i < futurePaymentMonths; i++) {
			temp?.setMonth(temp.getMonth() + 1);
			const status = i === 0 ? STATUS_ARR.FAILED : STATUS_ARR.NONE;
			autopayTimelineItems.push({
				title: `${temp?.toLocaleDateString('en-US', { month: 'short' })}`,
				status: status
			});
		}
	};

	const getAPIData = async () => {
		const headerContent: Record<string, string | Array<Record<string, string>>> = {
			heading: '',
			subHeadingArr: [],
			status: STATUS_ARR.NONE,
			subHeaderClass: ''
		};

		try {
			const response = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/sips/bulk/${bulkId}`, {}, fetch);

			if (response.ok) {
				const bulkData = response?.data?.data;

				if (bulkData?.paymentStatus?.toUpperCase() === STATUS_ARR.SUCCESS) {
					headerContent.heading = 'Basket Order Placed';
					headerContent.subHeadingArr = [
						{
							text: `Your portfolio will be updated`,
							class: '!text-black-title font-normal'
						}
					];
					headerContent.status = STATUS_ARR.SUCCESS;
				} else if (bulkData?.paymentStatus?.toUpperCase() === STATUS_ARR.FAILURE) {
					headerContent.heading = 'Order Failed';
					headerContent.subHeadingArr = [
						{
							text: 'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
							class: 'text-red-sell'
						}
					];
					headerContent.status = STATUS_ARR.FAILED;
				} else if (bulkData?.paymentStatus?.toUpperCase() === STATUS_ARR.PENDING) {
					headerContent.heading = 'Order Pending';
					headerContent.subHeadingArr = [
						{
							text: 'We are confirming the status of your payment. This usually takes a few minutes.',
							class: ''
						}
					];
					headerContent.status = STATUS_ARR.PENDING;
				}

				getAutopayTimelineItems(headerContent?.status);
			}
			return {
				...response,
				headerContent,
				autopayTimelineItems
			};
		} catch (e) {
			return {
				headerContent,
				autopayTimelineItems
			};
		}
	};

	depends('app:buyportfolio:ordersummary');

	return {
		api: {
			ordersData: hydrate ? getAPIData() : await getAPIData()
		},
		layoutConfig: {
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			layoutClass: 'bg-white md:bg-grey',
			title: 'Order Summary',
			showBackIcon: true
		}
	};
};
