import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
const startTime = new Date();

export const GET = (async () => {
	return json({
		status: 'success',
		uptime: process.uptime(),
		upSince: startTime,
		localTime: new Date(),
		service: {
			name: 'mf-support-web'
		}
	});
}) satisfies RequestHandler;
