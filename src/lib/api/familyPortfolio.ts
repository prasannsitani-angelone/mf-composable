import { PUBLIC_PORTFOLIO_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import { useFetch } from '$lib/utils/useFetch';

const getFamilyMembers = async (token: string, clientId: string, fetch?: FetchType) => {
	const url = `${PUBLIC_PORTFOLIO_BASE_URL}/family/v1/managemembers`;
	const response = await useFetch(
		url,
		{
			headers: {
				token
			},
			method: 'POST',
			body: JSON.stringify({
				party_code: clientId
			})
		},
		fetch
	);

	if (response?.ok) {
		return response?.data;
	} else {
		return {};
	}
};

export { getFamilyMembers };
