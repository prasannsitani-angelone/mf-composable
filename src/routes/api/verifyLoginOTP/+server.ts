import type { RequestHandler } from './$types';
import { AUTH_URL } from '$env/static/private';
import logger from '$lib/utils/logger';
import getAuthToken from '$lib/server/getAuthToken';

const TEST_ACC_CONTACT = '4444444444';

export const POST = (async ({ request }) => {
	const url = `${AUTH_URL}/verifyLoginOTP`;
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

		// test user flow
		if (body.mob_no === TEST_ACC_CONTACT) {
			const guestToken = await getAuthToken('guest');
			return new Response(
				JSON.stringify({
					data: {
						PartyCodeDetails: {
							TEST: {
								non_trading_access_token: guestToken || ''
							}
						}
					},
					status: 'success'
				}),
				{
					headers: {
						'Content-Type': 'application/json'
					},
					status: 200
				}
			);
		}

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
