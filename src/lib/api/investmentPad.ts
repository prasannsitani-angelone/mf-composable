import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';

export const checkRequestIdExpired = async (linkSource?: string, linkRequestId?: string) => {
	const allowedSources = ['sales', 'dealerdashboard', 'support'];

	const source = linkSource?.toLowerCase() || '';
	const xRequestId = linkRequestId;
	if (!allowedSources.includes(source) || !xRequestId) {
		return false;
	}

	const url = `${PUBLIC_MF_CORE_BASE_URL}/orders/ValidateOrderLink`;
	const response = await useFetch(url, { headers: { 'X-Request-Id': xRequestId } });
	/*
	// invalid id response
	{
		"status": "failure",
		"message": "Invalid Link",
		"errorCode": "MF-SVC-ORDER-24"
	}

	// valid id response
	{
		"status": "success"
	}
*/

	try {
		return response.data?.status === 'failure';
	} catch (e) {
		return false;
	}
};
