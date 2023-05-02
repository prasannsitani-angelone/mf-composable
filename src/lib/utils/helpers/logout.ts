import { deleteCookie } from './cookie';
import { getUserCookieName } from './token';

export const logout = () => {
	deleteCookie(getUserCookieName());
	deleteCookie('UserType');
	deleteCookie('AccountType');
};
