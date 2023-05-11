import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { IEmandate } from '$lib/types/IEmandate';
import { useFetch } from '$lib/utils/useFetch';

const getEmandateMap = (data: Array<IEmandate>, amount: number) => {
	const map: Record<string, Array<IEmandate>> = {};
	data.forEach((emandate) => {
		if (
			emandate.mandateType?.toLowerCase() !== 'xsip' &&
			(!amount || (amount && emandate.availableAmount >= amount))
		) {
			if (!map[emandate.accountNo]) {
				map[emandate.accountNo] = [];
			}
			map[emandate.accountNo].push(emandate);
		}
	});
	return map;
};

const getEmandateData = async (sipDate: Date, amount: number, status = 'success') => {
	const date = `${sipDate.getFullYear()}-${sipDate.toLocaleString('default', {
		month: '2-digit'
	})}-${sipDate.toLocaleString('default', { day: '2-digit' })}`;
	const url = `${PUBLIC_MF_CORE_BASE_URL}/mandates?startDate=${date}&status=${status}`;
	try {
		const response = await useFetch(url);
		const returnResponse = {
			...response
		};
		if (response.ok) {
			returnResponse.data = getEmandateMap(response.data.data, amount);
		} else if (response.status === 404) {
			returnResponse.data = {};
			returnResponse.ok = true;
		}
		return returnResponse;
	} catch (e) {
		return {};
	}
};

export default getEmandateData;
