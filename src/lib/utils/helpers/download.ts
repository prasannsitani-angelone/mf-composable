/**
 * downloadFile: downloads file by creating a URL for the file returned from API,
 * creating an anchor element and attachning the URL created to it. A simulation
 * for a click event is done, which downloads the file on the machine
 *
 * @param {ArrayBuffer} data
 * @param {string} type
 * @returns {void}
 */
export const downloadFile = (data: ArrayBuffer, type: string, fileName: string): void => {
	const blob = new Blob([data], { type });

	const href = URL.createObjectURL(blob);
	const a = Object.assign(document.createElement('a'), {
		href,
		style: 'display: none',
		download: fileName
	});
	document.body.appendChild(a);

	a.click();
	// URL.revokeObjectURL(href) - commented out for testing in webview
	a.remove();
};
