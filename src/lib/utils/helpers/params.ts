const encodeString = (string) => {
	return btoa(string);
};

const decodeString = (string) => {
	return atob(string);
};

export const encodeObject = (obj = {}) => {
	try {
		return encodeString(JSON.stringify(obj));
	} catch (err) {
		return '';
	}
};

export const decodeToObject = (str = '') => {
	try {
		return JSON.parse(decodeString(str));
	} catch (err) {
		return {};
	}
};

export const getQueryParamsObj = () => {
	const urlParams = new URLSearchParams(window?.location?.search);
	const paramsObj = {};

	for (const [key, value] of urlParams) {
		paramsObj[key] = value;
	}

	return paramsObj;
};
