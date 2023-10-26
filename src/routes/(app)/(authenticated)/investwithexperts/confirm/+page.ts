import { NET_BANKING_MIN_LIMIT, UPI_MAX_LIMIT } from '$components/Payment/constants';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { profileStore } from '$lib/stores/ProfileStore';
import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';

const colorCategoryMapping = {
	'large cap fund': '#008F75',
	'index fund': '#F65E5A',
	'small cap fund': '#F9BA4D',
	'mid cap fund': '#3F5BD9'
};

export const load = async ({ fetch, url, parent, depends }) => {
	const { profile, deviceType } = await parent();

	depends('app:investwithexperts:confirm');

	const params = url.searchParams.get('params');
	const { amount = 0, packId = '' } = decodeToObject(params || '');
	const os = deviceType?.osName || deviceType?.os;

	const getPacks = async () => {
		try {
			const response = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/schemes/packs`, {}, fetch);

			if (response.ok) {
				const data = packId?.length
					? response?.data?.packs?.find((itm) => itm.packId === packId)
					: response?.data?.packs?.[0];
				const schemesData = data?.schemes;
				const labels = [];
				let totalWeightage = 0;
				const dataset = {
					data: [],
					backgroundColor: [],
					borderColor: [],
					borderAlign: 'center',
					displayData: [],
					subDisplayData: []
				};

				const schemes = [];

				schemesData.forEach(({ weightage }) => {
					totalWeightage += weightage;
				});

				schemesData.forEach((scheme) => {
					const { weightage, subCategory } = scheme;
					const amt = (weightage / totalWeightage) * amount;
					dataset.data.push(weightage);
					dataset.backgroundColor.push(colorCategoryMapping[subCategory?.toLowerCase()] || '#fff');
					dataset.borderColor.push(colorCategoryMapping[subCategory?.toLowerCase()] || '#fff');
					dataset.displayData.push(`${(weightage / totalWeightage) * 100}%`);
					dataset.subDisplayData.push(`₹${addCommasToAmountString(amt)}`);
					labels.push(subCategory?.replace('Fund', ''));

					schemes.push({
						...scheme,
						amount: amt
					});
				});

				return {
					ok: true,
					schemes,
					packId: data.packId,
					chartData: {
						labels,
						datasets: [dataset]
					}
				};
			} else {
				return {
					ok: false,
					schemes: [],
					packId: '',
					chartData: {
						labels: [],
						datasets: [
							{
								data: [],
								backgroundColor: [],
								borderColor: [],
								borderAlign: 'center',
								displayData: [],
								subDisplayData: []
							}
						]
					}
				};
			}
		} catch (e) {
			return {
				ok: false,
				schemes: [],
				packId: '',
				chartData: {
					labels: [],
					datasets: [
						{
							data: [],
							backgroundColor: [],
							borderColor: [],
							borderAlign: 'center',
							displayData: [],
							subDisplayData: []
						}
					]
				}
			};
		}
	};

	const getPreviousPaymentDetails = async () => {
		const previousPaymentDetails = {
			selectedAccount: 0,
			paymentMode: '',
			upiId: '',
			firstTimeUser: true
		};
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/user/paymentHandlers`;
			const response = await useFetch(url, {}, fetch);
			if (response.ok) {
				const data = response?.data;
				const bankDetails = profile?.bankDetails;
				const index = profileStore.bankAccountIndexByAccountNumberOnServer(
					bankDetails,
					data?.accountNo
				);
				if (index < 0) {
					return previousPaymentDetails;
				}
				previousPaymentDetails.upiId = data?.upiId;
				previousPaymentDetails.selectedAccount = index;
				const paymentMode = data?.paymentMode;
				if (amount > UPI_MAX_LIMIT) {
					previousPaymentDetails.paymentMode = 'NET_BANKING';
				} else if (paymentMode === 'NET_BANKING' && amount < NET_BANKING_MIN_LIMIT) {
					previousPaymentDetails.paymentMode = 'UPI';
				} else if (
					(paymentMode === 'GOOGLEPAY' || paymentMode === 'PHONEPE' || paymentMode === 'PAYTM') &&
					os !== 'Android' &&
					os !== 'iOS'
				) {
					previousPaymentDetails.paymentMode = 'UPI';
				} else {
					previousPaymentDetails.paymentMode = paymentMode;
				}
				previousPaymentDetails.firstTimeUser = false;
			}
			return previousPaymentDetails;
		} catch (e) {
			return previousPaymentDetails;
		}
	};

	return {
		api: {
			basket: hydrate ? getPacks() : await getPacks(),
			previousPaymentDetails: hydrate
				? getPreviousPaymentDetails()
				: await getPreviousPaymentDetails()
		},
		layoutConfig: {
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			title: 'Confirm Your Order',
			showBackIcon: true
		}
	};
};
