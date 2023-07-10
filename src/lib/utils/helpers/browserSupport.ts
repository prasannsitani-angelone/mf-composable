export const isBrowserSupported = (): BrowserSupport => {
	const ua = navigator.userAgent;
	let tem;
	let M =
		ua.match(/(opera|samsungbrowser|chrome|crios|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ||
		[];

	// Internet Explorer
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];

		// I.E 11
		return {
			browser: 'IE',
			version: tem[1] || '',
			isSupported: false,
			fallback: false
		};
	}

	if (M[1] === 'Chrome') {
		tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
		if (tem != null) {
			// Microsoft Edge
			tem = tem.slice(1).join(' ').replace('OPR', 'Opera').split(' ');
			return {
				browser: tem[0],
				version: tem[1] || '',
				isSupported: true
			};
		}
	}

	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

	if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);

	const str = M.join(' ');

	let browser = str.substring(0, str.indexOf(' '))?.toLowerCase();

	const version = parseInt(str.substring(str.indexOf(' ')).trim());
	// No Support for  Internet Explorer
	if (browser === 'msie') {
		browser = 'Internet Explorer';

		return {
			browser: 'Internet Explorer',
			version: version.toString(),
			isSupported: false,
			fallback: false
		};
	}

	const result = {
		browser,
		version: version.toString(),
		isSupported: true,
		alias: '',
		fallback: true
	};

	const versionMap = {
		chrome: {
			version: 90
		},
		firefox: {
			version: 90
		},
		crios: {
			version: 90,
			alias: 'chrome'
		},
		samsungbrowser: {
			version: 12,
			alias: 'samsung browser'
		}
	};

	if (versionMap[browser]?.version > version) {
		result.isSupported = false;
		result.alias = versionMap[browser]?.alias;
	}

	return result;
};

export interface BrowserSupport {
	browser?: string;
	version?: string;
	alias?: string;
	isSupported: boolean;
	fallback?: boolean;
}

export const BrowserSupportDefault: BrowserSupport = {
	browser: '',
	version: '',
	alias: '',
	isSupported: true,
	fallback: false
};
