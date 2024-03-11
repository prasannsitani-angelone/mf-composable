import Analytics from '$lib/utils/analytics';

export interface IFund {
	FundName: string;
	FundWeightage?: number;
	Amount?: number;
}

export const buildPortfolioCardClicked = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'BuildaPortfolioIcon',
		event_property: null,
		event_id: '324.0.0.1.0'
	});
};

export const buildPortfolioScreenImpression = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SelectAPortfolio',
		event_type: 'Impression',
		event_sub_type: 'screen',
		event_name: 'SelectAportfolioScreen',
		event_property: null,
		event_id: '324.0.0.1.1'
	});
};

export const portfolioClicked = (eventMetaData: {
	Portfolio: string;
	MinSipAmount: number;
	'3yReturn': number;
	peopleinvetsed: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SelectAPortfolio',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'SelectAPortfolio',
		event_property: null,
		event_id: '324.0.0.1.2',
		event_metadata: eventMetaData
	});
};

export const portfolioImpression = (eventMetaData: {
	Portfolio: string;
	MinSipAmount: number;
	'3yReturn': number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfoliodetails',
		event_type: 'Impression',
		event_sub_type: 'Screen',
		event_name: 'PortfolioDetails',
		event_property: null,
		event_id: '324.0.0.1.3',
		event_metadata: eventMetaData
	});
};

export const portfolioFundsImpression = (eventMetaData: IFund[]) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfoliodetails',
		event_type: 'Impression',
		event_sub_type: 'card',
		event_name: 'PortfolioAllocation',
		event_property: null,
		event_id: '324.0.0.1.4',
		event_metadata: eventMetaData
	});
};

export const fundCardClick = (eventMetaData: {
	SelectedFundNo: number;
	FundName: string;
	Weightage: number;
	'3yReturn': number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfoliodetails',
		event_type: 'click',
		event_sub_type: 'chevron',
		event_name: 'Selectedportfoliocard',
		event_property: null,
		event_id: '324.0.0.1.5',
		event_metadata: eventMetaData
	});
};

export const proceedToInvest = (eventMetaData: { SelectedFunds: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfoliodetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ProceedtoInvest',
		event_property: null,
		event_id: '324.0.0.1.6',
		event_metadata: eventMetaData
	});
};

export const graphImpression = (eventMetaData: { Graph: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-portfoliodetails',
		event_type: 'Impression',
		event_sub_type: 'card',
		event_name: 'PortfolioGrowthGraph',
		event_property: null,
		event_id: '324.0.0.1.7',
		event_metadata: eventMetaData
	});
};

export const orderPadImpression = (eventMetaData: { Portfolio: string; 'Returnp.a.': number }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'Impression',
		event_sub_type: 'Screen',
		event_name: 'startsiporderpad',
		event_property: null,
		event_id: '324.0.0.1.8',
		event_metadata: eventMetaData
	});
};

export const plusAmountClick = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'plusamountbutton',
		event_property: null,
		event_id: '324.0.0.1.9'
	});
};

export const minusAmountClick = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'minusamountbutton',
		event_property: null,
		event_id: '324.0.0.1.10'
	});
};

export const popularAmountClick = (eventMetaData: { amount: number }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'PopularAmountbutton',
		event_property: null,
		event_id: '324.0.0.1.11',
		event_metadata: eventMetaData
	});
};

export const sipDateClick = (eventMetaData: { DayOfMonth: number }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'MonthlySIPDate',
		event_property: null,
		event_id: '324.0.0.1.12',
		event_metadata: eventMetaData
	});
};

export const payClick = (eventMetaData: IFund[]) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Pay',
		event_property: null,
		event_id: '324.0.0.1.13',
		event_metadata: eventMetaData
	});
};

export const paymentModeChange = (eventMetaData: IFund[]) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'SelectPaymentMethod',
		event_property: null,
		event_id: '324.0.0.1.14',
		event_metadata: eventMetaData
	});
};

export const portfolioOrderSummary = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ordersummary',
		event_type: 'Impression',
		event_sub_type: 'screen',
		event_name: 'portfolioordersummary',
		event_property: null,
		event_id: '324.0.0.1.15',
		event_metadata: eventMetaData
	});
};

export const handleCarouselImpressionAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'PortfolioForYou',
		event_property: null,
		event_id: '308.0.0.1.19',
		event_metadata: eventMetaData
	});
};

export const handleCarouselItemClickAnalytics = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'PortfolioForYouClick',
		event_property: null,
		event_id: '308.0.0.1.20',
		event_metadata: eventMetaData
	});
};
