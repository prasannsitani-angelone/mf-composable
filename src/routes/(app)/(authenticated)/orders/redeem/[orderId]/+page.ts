import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { IOrderDetails } from '$lib/types/IOrderDetails';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import { format } from 'date-fns';
import type { PageLoad } from './$types';
import STATUS_ARR from '$lib/constants/orderFlowStatuses';
import { switchOrderSummaryScreenOpenAnalytics } from '$lib/analytics/switch/switch';
import type { StatusHistoryItem } from '../../../ordersummary/type';

export const load = (async ({ fetch, params }) => {
	let ordersData: IOrderDetails;
	let orderStatusItems = <Array<StatusHistoryItem>>[];

	const isNull = (val: unknown) => {
		if (!val && val !== 0) {
			return true;
		}
		return false;
	};

	const headerContent = {
		heading: 'Order Placed Successfully',
		subHeading: ''
	};
	let estimatedETA: string;

	const ordersUrl = `${PUBLIC_MF_CORE_BASE_URL}/orders/${params?.orderId}?statusHistory=true`;

	const getOrdersData = async () => {
		const res = await useFetch(ordersUrl, {}, fetch);
		if (res.ok && res?.data?.data) {
			ordersData = res?.data?.data;

			const { statusHistory } = ordersData;

			if (statusHistory && statusHistory.length > 0) {
				const statusHistoryItems: Array<StatusHistoryItem> = [];
				let previousStepCurrentState: unknown = null;

				statusHistory.forEach((item, index) => {
					let status = STATUS_ARR.NONE;
					let subTitle = `Estimated by: ${format(new Date(item.timeStamp), 'dd MMMM yyyy')}`;

					let bgColorPending = false;
					let textColorPending = false;
					let showSubTitle = true;
					if (index === 3) {
						headerContent.subHeading = `Your portfolio will be updated by ${format(
							new Date(item?.timeStamp || 0),
							'dd MMMM yyyy'
						)}`;
					}
					if (index === 2) {
						estimatedETA = format(new Date(item?.timeStamp || 0), 'dd MMMM yyyy');
					}
					if (isNull(previousStepCurrentState) && item.failed) {
						status = STATUS_ARR.FAILED;
						subTitle = format(new Date(item.timeStamp), 'dd MMMM yyyy hh:mm a');
					} else if (isNull(previousStepCurrentState) && item.currentState) {
						if (index === 0) {
							bgColorPending = true;
							textColorPending = true;
							showSubTitle = false;
						}

						status = STATUS_ARR.PENDING;
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

			const eventMetadata = {
				Message: 'Switch Order Placed Successfully',
				SwitchDetails: `${ordersData?.schemeName} - Switch Out, ${ordersData?.toSchemeName} - SwitchIn`,
				AmountSwitched: ordersData?.amount,
				EstCompletionTime: format(new Date(ordersData?.ExpectedNavDate * 1000), 'dd MMM yyyy'),
				Status: ordersData?.remarks?.length
					? ordersData?.remarks
					: ordersData?.statusHistory?.find((item) => item?.currentState)?.description
			};

			switchOrderSummaryScreenOpenAnalytics(eventMetadata);

			return {
				ordersData,
				orderStatusItems,
				headerContent,
				estimatedETA
			};
		}
		return {
			ordersData,
			orderStatusItems,
			headerContent,
			estimatedETA
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
