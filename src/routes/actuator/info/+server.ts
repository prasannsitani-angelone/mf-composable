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
		},
		env: {
			nodeEnv: process.env.NODE_ENV,
			nodeVersion: process.version,
			processName: process.title,
			pid: process.pid
		}
	});
}) satisfies RequestHandler;
