import { getCookie, setCookie } from '$lib/utils/helpers/cookie';

const clevertapNudgeCookieName = 'ctNotificationCookie';

const getCTCookie = () => {
	const ctCookie = getCookie(clevertapNudgeCookieName);
	let ctNotificationCookie: { [seen: string]: boolean };
	try {
		ctNotificationCookie = JSON.parse(ctCookie);
	} catch {
		ctNotificationCookie = {};
	}
	return ctNotificationCookie;
};

export const hideClevertapNudge = (topic: string) => {
	const ctNotificationCookie = getCTCookie();
	ctNotificationCookie[topic] = true;

	setCookie(clevertapNudgeCookieName, JSON.stringify(ctNotificationCookie), {
		maxAge: 259200,
		secure: true,
		sameSite: 'Strict'
	});
};

export const canShowClevertapNudge = (topic: string): boolean => {
	const ctNotificationCookie = getCTCookie();
	return ctNotificationCookie[topic] === undefined && !ctNotificationCookie[topic];
};
