import jwt from 'jsonwebtoken';
const HS256 = 'HS256';
import { JWT_SYMMETRIC_KEY } from '$env/static/private';

const getAuthToken = async (userId: string) => {
	try {
		const token = jwt.sign(
			{
				userData: {
					user_id: userId
				}
			},
			JWT_SYMMETRIC_KEY,
			{
				algorithm: HS256,
				expiresIn: '1d'
			}
		);
		return token;
	} catch (e) {
		// const { status, statusText, url } = e.response
		console.log(e);
	}
};

export default getAuthToken;
