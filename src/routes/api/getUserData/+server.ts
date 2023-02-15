import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import getAuthToken from '$lib/server/getAuthToken';
import { MF_CORE_BASE_URL, MF_PROFILE_BASE_URL } from '$env/static/private';

const userAPIUrl = `${MF_CORE_BASE_URL}/user`;
const profileUrl = `${MF_PROFILE_BASE_URL}/profile`;

export const GET = (async ({ url }) => {
	const userId: string = url.searchParams.get('userID') || '';

	const token = await getAuthToken(userId);

	const userDetails = await fetch(userAPIUrl, {
		headers: {
			authorization: `Bearer ${token}`,
			accountType: 'D',
			userType: 'B2C'
		}
	});

	const userProfile = await fetch(profileUrl, {
		headers: {
			authorization: `Bearer ${token}`
		}
	});
	const user = await userDetails.json();

	const profile = await userProfile.json();
	const userName = profile?.data?.clientDetails?.fullName || '';
	const { userType = '' } = user;
	return json({ userType, userName });
}) satisfies RequestHandler;
