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
			ltp: '',
			details: stockData?.desc,
			atp: '0.0',
			availableQty: 0,
			baseAvgPrice: 0,
			baseQty: 0,
			bseCashToken: '',
			buyAvgPrice: 0,
			customTagData: {
				exchange: 'NSE',
				tags: [],
				tradeSymbol: stockData?.symbol
			},
			dayGainLoss: 0,
			dbap: '0.0',
			dbq: '0.0',
			dpHoldingQty: 0,
			dsap: '0.0',
			dsq: '0.0',
			exchange: '',
			highPrice: '',
			holdingCnt: 0,
			invested: 0,
			isComingFromScreen: '',
			isCommodityOptionAvailable: false,
			isFromInstaTrade: false,
			isIndices: false,
			lowPrice: '',
			lvl: '',
			marketValue: 0,
			npriceDen: '1',
			npriceNum: '1',
			perChange: '+0.40',
			preClosingPrice: 0,
			prevAvgPrice: 0,
			prevQty: 0,
			priceChange: '',
			pricePerChange: '+0.40 +0.24%',
			product: '',
			quantity: 0,
			realizedGL: 0,
			scripTypeValue: '',
			todayAvgPrice: 0,
			todayQty: 0,
			totalQty: 0,
			volume: 0,
			yearHigh: 0,
			yearLow: 0,
			staticEvent: '',
			sourceparameter: 's-all'
		};
	}
	return stockInfo;
};
