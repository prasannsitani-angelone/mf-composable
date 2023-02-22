import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { MF_CORE_BASE_URL } from '$env/static/private';
import type { User } from '$lib/types/IUserType';

export const GET = (async ({ request }) => {
	const authtoken = request.headers.get('authtoken');
	const userUrl = `${MF_CORE_BASE_URL}/user`;

	const res = await fetch(userUrl, {
		headers: {
			authorization: `Bearer ${authtoken}`
		}
	});

	const user: User = await res.json();

	return json({ ...user });
}) satisfies RequestHandler;
