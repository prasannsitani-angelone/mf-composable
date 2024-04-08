import { useFetch } from '$lib/utils/useFetch';
import STATUS_ARR from '$lib/constants/orderFlowStatuses';

export const getTpinStatusMf = async (url: string, body: string, uuid = '') => {
	const res = await useFetch(url, {
		method: 'POST',
		headers: {
			'X-Request-Id': uuid,
			'X-SESSION-ID': uuid,
			'X-device-type': 'WEB'
		},
		body
	});

	return res || {};
};

export const getEdisPoaStatus = async (url: string, body: string, uuid = '') => {
	const res = await getTpinStatusMf(url, body, uuid);

	let isPoaActive = false;

	if (res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
		isPoaActive = res?.data?.data?.tpinStatus?.toUpperCase() === 'POA';
	}

	return isPoaActive;
};
