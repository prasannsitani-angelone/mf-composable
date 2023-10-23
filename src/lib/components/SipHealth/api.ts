import { useFetch } from '$lib/utils/useFetch';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';

export const getSipHealth = async () => {
	const response = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/sips/health`);
	if (response.ok) {
		const sipHealth = response.data;
		return sipHealth.data;
	}
	throw new Error('');
};
