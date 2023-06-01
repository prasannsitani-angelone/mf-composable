import type { RequestHandler } from './$types';
import { MF_PROFILE_BASE_URL } from '$env/static/private';
import type { UserProfile } from '$lib/types/IUserProfile';
import logger from '$lib/utils/logger';

interface ProfileData {
	data: UserProfile;
}
export const GET = (async ({ request }) => {
	try {
		logger.debug({
			type: 'Network Request in proxy',
			params: {
				url: request.url,
				method: request.method
			}
		});

		const authorization = request.headers.get('authorization');
		const userUrl = `${MF_PROFILE_BASE_URL}/profile`;

		const res = await fetch(userUrl, {
			headers: {
				authorization,
				accept: 'application/json',
				'content-type': 'application/json'
			}
		});
		let profile: ProfileData = {
			data: { clientId: '', userType: 'B2C', dpNumber: 'D' }
		};
		let status: number;
		if (res.ok) {
			profile = await res.json();
			status = res.status;
		}

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
				message: e.toString()
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
				response: errRes
			}
		});

		return errRes;
	}
}) satisfies RequestHandler;
