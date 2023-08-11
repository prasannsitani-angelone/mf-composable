import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';

export async function invokeRemoveExternalFundsTracking(): Promise<ExternalFundsTrackingResponse> {
	try {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?external=true`;
		const uuid = uuidv4();
		const res = await useFetch(url, {
			method: 'DELETE',
			headers: {
				'X-Request-Id': uuid,
				external: 'true'
			}
		});
		if (res.ok) {
			return {
				...res.data,
				status: 'success'
			};
		}
		return res.data;
	} catch (e) {
		return {
			status: 'failure',
			message: e?.message
		};
	}
}

export interface ExternalFundsTrackingResponse {
	status: 'success' | 'failure';
	message?: string;
	errorCode?: string;
}
