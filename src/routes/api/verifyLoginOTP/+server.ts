import type { RequestHandler } from './$types';
import { AUTH_URL } from '$env/static/private';

export const POST = (async ({ request }) => {
	const url = `${AUTH_URL}/verifyLoginOTP`;
	try {
		const body = await request.json();
		const res = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(body)
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
