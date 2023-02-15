import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import getAuthToken from '$lib/server/getAuthToken';
import { MF_CORE_BASE_URL } from '$env/static/private';

const searchScheme = `${MF_CORE_BASE_URL}/search`;

export const GET = (async ({ url }) => {
	const searchTerm = url.searchParams.get('value');
	const searchSchemeUrl = `${searchScheme}?value=${searchTerm}`;
	const token = await getAuthToken('guest');

	const schemeResult = await fetch(searchSchemeUrl, {
		headers: {
			authorization: `Bearer ${token}`,
			accountType: 'D',
			userType: 'B2C'
		}
	});

	const schemeList = await schemeResult.json();
	return json({ schemeList });
}) satisfies RequestHandler;
