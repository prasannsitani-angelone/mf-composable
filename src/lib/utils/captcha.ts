import logger from './logger';

export const getCaptchaCode = (key: string) => {
	return new Promise((resolve) => {
		window.grecaptcha.enterprise.ready(function () {
			window.grecaptcha.enterprise
				.execute(key, { action: 'submit' })
				.then(function (token: string) {
					resolve(token);
				})
				.catch(function (err) {
					logger.error({
						type: 'Error getting cpaha : ',
						message: err?.toString()
					});
					resolve('');
				});
		});
	});
};
