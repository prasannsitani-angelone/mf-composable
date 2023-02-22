import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { MF_PROFILE_BASE_URL } from '$env/static/private';
import type { UserProfile } from '$lib/types/IUserProfile';
interface ProfileData {
	data: UserProfile;
}
export const GET = (async ({ request }) => {
	const authtoken = request.headers.get('authtoken');
	const userUrl = `${MF_PROFILE_BASE_URL}/profile`;

	const res = await fetch(userUrl, {
		headers: {
			authorization: `Bearer ${authtoken}`
		}
	});

	const profile: ProfileData = await res.json();

	return json({ ...profile });
}) satisfies RequestHandler;
