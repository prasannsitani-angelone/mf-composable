import type { RequestHandler } from './$types';
import { EDIS_SERVICE_V3_BASE_URL } from '$env/static/private';
import logger from '$lib/utils/logger';

export const POST = (async ({ request }) => {
	const url = `${EDIS_SERVICE_V3_BASE_URL}/VerifyDISMF`;

	const requestId = request.headers.get('x-request-id');
	const sessionId = request.headers.get('x-session-id');
	const authtoken = request.headers.get('authtoken');

	const headers = {
		'X-Request-Id': requestId,
		'X-SESSION-ID': sessionId,
		'X-device-type': 'WEB',
		'Content-Type': 'application/json',
		accessToken: authtoken
	};

	const body = await request.json();

	if (body?.IPAddress) {
		delete body.IPAddress;
	}

	try {
		logger.debug({
			type: 'Network Request in proxy',
			params: {
				url: request.url,
				method: request.method,
				headers: headers,
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
				headers,
				response: data
			}
		});

		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json'
			},
			status
		});
	} catch (e) {
		return new Response(
			JSON.stringify({
				status: 'error',
				message: e.toString()
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				},
				status: 500
			}
		);
	}
}) satisfies RequestHandler;
