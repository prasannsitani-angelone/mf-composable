import type { RequestHandler } from './$types';
import { EDIS_SERVICE_V1_BASE_URL } from '$env/static/private';
import logger from '$lib/utils/logger';
import { removeAuthHeaders } from '$lib/utils/helpers/logging';

export const POST = (async ({ request }) => {
	const url = `${EDIS_SERVICE_V1_BASE_URL}/GetTranStatus`;

	try {
		const requestId = request.headers.get('x-request-id');
		const sessionId = request.headers.get('x-session-id');
		const tokenValue = (request?.headers?.get('authorization') || '')?.split(' ')[1];

		const headers = {
			'X-Request-Id': requestId,
			'X-SESSION-ID': sessionId,
			'X-device-type': 'WEB',
			'Content-Type': 'application/json',
			accessToken: tokenValue
		};

		const body = await request.json();

		if (body?.IPAddress) {
			delete body.IPAddress;
		}

		logger.debug({
			type: 'Network Request in proxy',
			params: {
				url,
				method: request.method,
				headers: removeAuthHeaders(headers),
				body
			}
		});

		const res = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(body)
		});

		const data = await res.json();
		const status = res.status;

		logger.debug({
			type: 'Network Response in proxy',
			params: {
				requestHeaders: removeAuthHeaders(headers),
				response: data,
				body,
				url,
				status
			}
		});

		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json'
			},
			status
		});
	} catch (e) {
		const errRes = new Response(
			JSON.stringify({
				status: 'error',
				message: e?.toString()
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				},
				status: 500
			}
		);

		logger.error({
			type: 'Network Error in proxy',
			params: {
				url,
				error: e?.toString()
			}
		});

		return errRes;
	}
}) satisfies RequestHandler;
