import { deleteCookie } from './cookie';
import { getUserCookieName, getUserCookieOptions } from './token';

export const logout = () => {
	deleteCookie(getUserCookieName(), getUserCookieOptions());
	deleteCookie('UserType');
	deleteCookie('AccountType');
};
