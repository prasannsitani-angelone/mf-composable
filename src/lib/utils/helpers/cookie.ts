export const setCookie = (cname: string, cvalue: string, options?: object) => {
	let expires = '';
	let ss = '';
	let secureFlag = '';
	let domainStr = '';
	let pathStr = '';
	const { sameSite, secure, exDays, domain, path } = options || {};
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
	if (domain) {
		domainStr = `domain=${domain};`;
	}
	if (path) {
		pathStr = `path=${path};`;
	}

	document.cookie = `${cname}=${cvalue};${expires}${ss}${secureFlag}${domainStr}${pathStr}`;
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

export const deleteCookie = (cname: string, options?: object) => {
	let domainStr = '';
	let pathStr = 'path=/;';
	let ss = '';
	let secureFlag = '';
	const maxAge = 'max-age=0;';
	const { domain, sameSite, secure, path } = options || {};
	if (domain) {
		domainStr = `domain=${domain};`;
	}
	if (sameSite) {
		ss = `SameSite=${sameSite};`;
	}
	if (secure) {
		secureFlag = 'secure;';
	}
	if (path) {
		pathStr = `path=${path};`;
	}
	document.cookie = `${cname}=;${maxAge}${pathStr}${domainStr}${secureFlag}${ss}`;
};
