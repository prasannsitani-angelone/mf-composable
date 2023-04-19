const encodeString = (str: string) => {
	return btoa(str);
};

const decodeString = (str: string) => {
	return atob(str);
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
