import type { RequestHandler } from './$types';
import { AUTH_URL } from '$env/static/private';
import logger from '$lib/utils/logger';

export const POST = (async ({ request }) => {
	const url = `${AUTH_URL}/refreshToken`;
	try {
		const source = request.headers.get('x-source') || '';
		const body = await request.json();

		logger.debug({
			type: 'Network Request in proxy',
			params: {
				url,
				method: request.method,
				body
			}
		});

		const res = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'x-source': source
			}
		});
		const data = await res.json();
		const status = res.status;

		logger.debug({
			type: 'Network Response in proxy',
			params: {
				url,
				response: data,
				status,
				body
			}
		});

		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json'
			},
			status
		});
	} catch (e) {
		logger.error({
			type: 'Network Error in proxy',
			params: {
				url,
				error: e?.toString()
			}
		});

		return new Response(
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
	}
}) satisfies RequestHandler;
