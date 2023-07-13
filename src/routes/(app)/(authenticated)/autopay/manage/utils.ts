import type { INudge } from '$lib/types/INudge';

export const getSipAmountWithoutMandate = (list: INudge[]) => {
	if (!list || !Array.isArray(list)) {
		return 0;
	}
	const filteredSip = list.filter((item: INudge) => item.nudgesType === 'mandate');
	return filteredSip.reduce((acc: number, curr: INudge) => acc + Number(curr.amount), 0) || 0;
};
