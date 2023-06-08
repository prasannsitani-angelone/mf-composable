import { getInvestmentType } from '$lib/utils/helpers/investmentOrder';

export const createPatchPayload = (cartItem) => {
	const patchPayload = {
		amount: Number(cartItem?.amount),
		investmentType: getInvestmentType(cartItem),
		isSelected: cartItem?.isSelected,
		selectedSipDay: cartItem?.sipDay
	};
	return patchPayload;
};
