/**
 * compareVersion: returns true when version1 is greater than or equal to version2
 *
 * @param {string} version1
 * @param {string} version2
 * @returns {boolean} isV1GreaterEqualV2
 */
export const compareVersion = (version1 = '', version2: string): boolean => {
	const version1Array = version1.split('.');
	const version2Array = version2.split('.');
	const length = Math.max(version1Array.length, version2Array.length);

	for (let i = 0; i < length; i++) {
		const num1 = parseInt(version1Array[i]) || 0;
		const num2 = parseInt(version2Array[i]) || 0;

		if (num1 > num2) {
			return true;
		}
		if (num1 < num2) {
			return false;
		}
	}
	return true;
};

export const groupByArrayElements = (arr, key: string) => {
	if (!Array.isArray(arr)) {
		return {};
	}
	const group = {};
	arr.forEach((item) => {
		if (group[item[key]]) {
			group[item[key]].push(item);
		} else {
			group[item[key]] = [item];
		}
	});
	return group;
};
