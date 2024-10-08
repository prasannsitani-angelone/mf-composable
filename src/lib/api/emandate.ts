import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { IEmandate } from '$lib/types/IEmandate';
import { useFetch } from '$lib/utils/useFetch';
import { SOURCE } from '$lib/constants/source';

const getEmandateMap = (data: Array<IEmandate>, amount: number, source: string) => {
	const map: Record<string, Array<IEmandate>> = {};
	data.forEach((emandate) => {
		if (
			(source === SOURCE.NXT ||
				(source !== SOURCE.NXT && emandate.mandateType?.toLowerCase() !== 'xsip')) &&
			(!amount || (amount && emandate.availableAmount >= amount))
		) {
			if (!map[emandate.accountNo]) {
				map[emandate.accountNo] = [];
			}

			if (emandate.mandateType === 'SIP') {
				map[emandate.accountNo].unshift(emandate);
			} else {
				map[emandate.accountNo].push(emandate);
			}
		}
	});
	return map;
};

const getEmandateData = async (
	sipDate: Date,
	amount: number,
	source?: string,
	mandateType?: string,
	mandateFor?: string,
	status = 'success'
) => {
	try {
		const year = sipDate.getFullYear();
		const month = (sipDate.getMonth() + 1).toString().padStart(2, '0');
		const day = sipDate.getDate().toString().padStart(2, '0');
		const date = `${year}-${month}-${day}`;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/mandates?startDate=${date}&status=${status}&mandateType=${mandateType}&mandateFor=${mandateFor}`;
		const response = await useFetch(url);
		const returnResponse = {
			...response
		};
		if (response.ok) {
			returnResponse.data = getEmandateMap(response.data.data, amount, source);
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
