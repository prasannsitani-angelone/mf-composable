import { MF_PROFILE_BASE_URL } from '$env/static/private';
import getAuthToken from '$lib/server/getAuthToken';
import { profileStore } from '$lib/stores/ProfileStore';
import { userStore } from '$lib/stores/UserStore';
import type { UserProfile } from '$lib/types/IUserProfile';
import type { WMSCookie } from '$lib/types/IWMSCookie';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { parse } from 'cookie-es';

const profileData = async (authtoken: string) => {
	const res = await fetch(`${MF_PROFILE_BASE_URL}/profile`, {
		headers: {
			authorization: `Bearer ${authtoken}`
		}
	});
	const resData = await res.json();
	const { data }: { data: UserProfile } = resData;
	return {
		...data
	};
};

export const handle = (async ({ event, resolve }) => {
	const cookie: WMSCookie = parse(event.request.headers.get('cookie') || '');
	// console.log(event.cookies.set('BGVVVV','XYZZZ',{
	// 	httpOnly:true
	// }))
	// console.log('in Handle', cookie);

	let isAuthenticatedUser = true;
	let authtoken = event.request.headers.get('authtoken') || cookie['ABUserCookie'] || '';

	if (!authtoken) {
		// TODO: Check if Guest token is in Cookie
		authtoken = await getAuthToken('guest');
		isAuthenticatedUser = false;
	} else {
		const profile: UserProfile = await profileData(authtoken);
		event.locals = { ...event.locals, profile };
	}
	event.locals = { ...event.locals, token: authtoken };
	event.request.headers.set('authToken', authtoken);
	event.request.headers.set('isGuest', isAuthenticatedUser ? 'false' : 'true');
	const response = await resolve(event);

	if (isAuthenticatedUser) {
		response.headers.set('set-cookie', `ABUserCookie=${authtoken}`);
		response.headers.set('set-cookie', `BGVVVV=XYZZZ; HttpOnly`);
	} else {
		response.headers.set('set-cookie', `ABGuestCookie=${authtoken}`);
	}

	return response;
}) satisfies Handle;

// export const handleFetch = (({ event, request, fetch }) => {
// 	// Set Auth token for Server api calls
// 	console.log("In handleFetch")

// 	return fetch(request);
// }) satisfies HandleFetch;
