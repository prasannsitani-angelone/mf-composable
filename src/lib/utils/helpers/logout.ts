import { invalidateAll } from '$app/navigation';
import { deleteCompleteCache } from '../cache';
import logger from '../logger';
import { deleteCookie } from './cookie';
import { getUserCookieName, getUserCookieOptions } from './token';

export const logout = async () => {
	deleteCompleteCache();
	deleteCookie(getUserCookieName(), getUserCookieOptions());
	deleteCookie('UserType');
	deleteCookie('AccountType');
	try {
		await invalidateAll();
	} catch (e) {
		logger.error({ type: 'logout invalidateAll error', params: e });
	}
};
