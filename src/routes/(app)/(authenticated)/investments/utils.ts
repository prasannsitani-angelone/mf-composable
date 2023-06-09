import type { FolioHoldingType, InvestmentEntity } from '$lib/types/IInvestments';

export const partialImportCheck = (data: FolioHoldingType | InvestmentEntity) => {
	return (
		data?.externalFundImportStatus !== 'COMPLETED' ||
		(data?.externalFundImportStatus === 'COMPLETED' && data?.externalImportFailed === true)
	);
};
