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
