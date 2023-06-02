import type { RequestHandler } from './$types';
import { MF_PROFILE_BASE_URL } from '$env/static/private';
import type { UserProfile } from '$lib/types/IUserProfile';
import logger from '$lib/utils/logger';

interface ProfileData {
	data: UserProfile;
}
export const GET = (async ({ request }) => {
	const url = `${MF_PROFILE_BASE_URL}/profile`;
	try {
		logger.debug({
			type: 'Network Request in proxy',
			params: {
				url,
				method: request.method
			}
		});

		const authorization = request.headers.get('authorization');

		const res = await fetch(url, {
			headers: {
				authorization,
				accept: 'application/json',
				'content-type': 'application/json'
			}
		});
		let profile: ProfileData = {
			data: { clientId: '', userType: 'B2C', dpNumber: 'D' }
		};

		const status = res.status;
		logger.debug({
			type: 'Network Response in proxy before parsing data',
			params: {
				url,
				data: res,
				status
			}
		});

		profile = await res.json();

		logger.debug({
			type: 'Network Response in proxy',
			params: {
				url,
				response: profile,
				status
			}
		});

		return new Response(JSON.stringify(profile), {
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
