import type { RequestHandler } from './$types';
import { AUTH_URL } from '$env/static/private';
import { env } from '$env/dynamic/private';

const TEST_ACC_CONTACT = '4444444444';

export const POST = (async ({ request }) => {
	const url = `${AUTH_URL}/verifyLoginOTP`;
	try {
		const source = request.headers.get('x-source') || '';
		const body = await request.json();
		if (body.mob_no === TEST_ACC_CONTACT) {
			return new Response(
				JSON.stringify({
					data: {
						data: {
							PartyCodeDetails: {
								TEST: {
									non_trading_access_token: env.TEST_NON_TRADING_ACCESS_TOKEN || ''
								}
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
