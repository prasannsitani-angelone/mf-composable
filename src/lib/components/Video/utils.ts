import logger from '$lib/utils/logger';

export const isHlsSupported = (hls) => {
	return hls?.isSupported();
};

export const loadHlsPlayer = async () => {
	try {
		const Hls = await import('hls.js');
		if (isHlsSupported(Hls)) {
			const hls = new Hls.default({
				startFragPrefetch: true
			});
			hls.on(Hls.Events.ERROR, (_, data) => {
				if (data.fatal) {
					switch (data.type) {
						case Hls.ErrorTypes.MEDIA_ERROR:
							logger.error({
								type: 'Fatal error running Video stream MEDIA_ERROR',
								params: "'fatal media error encountered, try to recover'"
							});
							hls.recoverMediaError();
							break;
						case Hls.ErrorTypes.NETWORK_ERROR:
							logger.error({
								type: 'Fatal error running Video stream NETWORK_ERROR',
								params: "'fatal media error encountered, try to recover'"
							});
							break;
						default:
							logger.error({
								type: 'Fatal error running Video stream DEFAULT',
								params: "'fatal media error encountered, try to recover'"
							});
							hls.destroy();
							break;
					}
				}
			});
			return {
				hls,
				hlsContext: Hls.default
			};
		}
		logger.error({
			type: 'Video Error',
			params: {
				message: 'Hls player not supported'
			}
		});
		return null;
	} catch (e) {
		logger.error({
			type: 'Video Error',
			params: {
				message: 'Unable to initiate Hls player',
				error: e?.toString()
			}
		});
		return null;
	}
};
