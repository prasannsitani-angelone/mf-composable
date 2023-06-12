import { getInvestmentType } from '$lib/utils/helpers/investmentOrder';
import type { CartEntity } from '$lib/types/ICartStore';
import type { MetaData, FundsInList } from '$lib/types/ICartStore';

export const createPatchPayload = (cartItem: CartEntity) => {
	const patchPayload = {
		amount: Number(cartItem?.amount),
		investmentType: getInvestmentType(cartItem),
		isSelected: cartItem?.isSelected,
		selectedSipDay: cartItem?.sipDay
	};
	return patchPayload;
};

export function createCartEventMetaDataAnalytics(cartItems: CartEntity[]) {
	const metaData: MetaData = {
		NoOfCheckedFunds: 0,
		NoOfUnchecked: 0,
		CheckedFundsList: [],
		TotalAmount: 0
	};

	Array.isArray(cartItems) &&
		cartItems.forEach((item) => {
			if (item.isSelected) {
				metaData.NoOfCheckedFunds++;
				const fund: FundsInList = {
					Name: item.schemeName,
					Type: item.investmentType,
					Amount: item.amount,
					Date: item.investmentType === 'SIP' ? item.sipDay : 'NA'
				};
				metaData.CheckedFundsList.push(fund);
				metaData.TotalAmount = metaData.TotalAmount + item.amount;
			} else {
				metaData.NoOfUnchecked++;
			}
		});
	return metaData;
}
