export const isAbsoluteUrl = (str: string) => {
	// eslint-disable-next-line no-useless-escape
	const url = str.match(/^(([a-z]+:)?(\/\/)?[^\/]+\/).*$/);

	return url && url.length > 0 ? true : false;
};

export const extractRedirectUrl = (str: string) => {
	const url = str?.match(/https?:\/\/[^\s]+/)?.[0];
	return url;
};
