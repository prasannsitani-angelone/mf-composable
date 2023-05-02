import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const HS256 = 'HS256';

const validateToken = (token: string) => {
	try {
		jwt.verify(token, env.JWT_SYMMETRIC_KEY || '', {
			algorithm: HS256
		});
		return true;
	} catch (err) {
		return false;
	}
};

export default validateToken;
