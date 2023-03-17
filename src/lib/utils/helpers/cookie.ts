export const setCookie = (cname: string, cvalue: string, options?: object) => {
	let expires = '';
	let ss = '';
	let secureFlag = '';
	const { sameSite, secure, exDays } = options || {};
	if (exDays) {
		const d = new Date();
		d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
		expires = `expires=${d.toUTCString()};`;
	}
	if (sameSite) {
		ss = `SameSite=${sameSite};`;
	}
	if (secure) {
		secureFlag = 'secure;';
	}

	document.cookie = `${cname}=${cvalue};${expires}${ss}${secureFlag}`;
};

export const getCookie = (cname: string) => {
	const name = cname + '=';
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
};
