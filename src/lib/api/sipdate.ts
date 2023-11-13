import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';

export const getValidSIPRegDate = async () => {
	let sipRegDate = new Date();
	const url = `${PUBLIC_MF_CORE_BASE_URL}/utils/meta?nextSipDate=true`;
	const response = await useFetch(url);

	if (response.ok) {
		try {
			sipRegDate = new Date(response.data.sipRegDate * 1000);
		} catch (e) {
			console.log(e);
		}
	}
	return sipRegDate;
};
