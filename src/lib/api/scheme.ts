import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import { useFetch } from '$lib/utils/useFetch';
import type { StockData } from '$lib/types/ISchemeDetails';
import { format } from 'date-fns';

export const getStockInfo = async (scripId: string, fetch?: FetchType) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/scrips/${scripId}`;
	let stockData: StockData = {};

	const res = await useFetch(url, {}, fetch);
	let stockInfo = {};

	if (res.ok) {
		stockData = res?.data?.data;
		const date = new Date(stockData?.expiryDateUnix || 0);
		stockInfo = {
			symbolName: stockData?.symbolName,
			instrumentName: '',
			segmentId: '1',
			tokenId: stockData?.symbol,
			tradeSymbol: stockData?.trdSymbol,
			expiryDate: format(date, 'ddMMMyyyy'),
			isin: stockData?.ISIN,
			securityDesc: stockData?.desc,
			strikePrice: '-1',
			regularLot: stockData?.lotSize?.toString(),
			priceTick: '0.05',
			isCashWithFnO: true,
			nseCashToken: stockData?.symbol,
			futToken: '',
			companyName: stockData?.desc,
			isCommodityWithOption: false,
			series: 'EQ',
			minimumLot: stockData?.lotSize?.toString(),
			productType: '',
			instrumentType: 'CASH',
			maxSingleTransactionQty: 1,
			ltp: ''
		};
	}
	return stockInfo;
};
