import type { RequestHandler } from './$types';
import { removeAuthHeaders } from '$lib/utils/helpers/logging';
import validateToken from '$lib/server/validateAuthToken';

const BODY_NOT_IN_SPECIFIED_FORMAT_ERROR = {
	message: 'request body is not in specified format',
	status: 400
};

const UNAUTHENTICATED_ERROR = {
	message: 'JWT is not present in headers or is in wrong format',
	status: 401
};

export const POST = (async ({ request }) => {
	try {
		const body = await request.json();
		const headers = Object.fromEntries(request.headers);

		// validating auth token
		if (!headers.accesstoken || !validateToken(headers.accesstoken)) {
			throw new Error(JSON.stringify(UNAUTHENTICATED_ERROR));
		}

		// validating empty content
		if (!Array.isArray(body) || body.length === 0) {
			throw new Error(JSON.stringify(BODY_NOT_IN_SPECIFIED_FORMAT_ERROR));
		}

		// removing headers having sensitive data
		const modifiedHeaders = removeAuthHeaders(headers);

		// iterating body and doing union of headers and logItem and logging it
		body.forEach((logItem) => {
			// validating if logItem is an object
			if (typeof logItem !== 'object') {
				throw new Error(JSON.stringify(BODY_NOT_IN_SPECIFIED_FORMAT_ERROR));
			}
			// generating content to log
			const contentToLog = JSON.stringify({
				...modifiedHeaders,
				...logItem,
				serverTimestamp: Date.now()
			});
			// logging the content
			console.log(contentToLog);
		});

		// return response
		return new Response(
			JSON.stringify({
				status: 'success'
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				},
				status: 200
			}
		);
	} catch (e) {
		try {
			const error = JSON.parse(e.message);
			return new Response(
				JSON.stringify({
					status: 'error',
					message: error.message
				}),
				{
					headers: {
						'Content-Type': 'application/json'
					},
					status: error.status
				}
			);
		} catch (e) {
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
	}
}) satisfies RequestHandler;
