import { invalidateAll } from '$app/navigation';
import { deleteCookie } from './cookie';
import { getUserCookieName, getUserCookieOptions } from './token';

export const logout = async () => {
	await invalidateAll();
	deleteCookie(getUserCookieName(), getUserCookieOptions());
	deleteCookie('UserType');
	deleteCookie('AccountType');
};
