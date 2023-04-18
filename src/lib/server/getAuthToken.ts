import jwt from 'jsonwebtoken';
const HS256 = 'HS256';
import { env } from '$env/dynamic/private';
const getAuthToken = async (userId: string) => {
	try {
		const JWT_SYMMETRIC_KEY = env.JWT_SYMMETRIC_KEY || '';

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
		console.log(e);
	}
};

export default getAuthToken;
