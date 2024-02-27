import logger from '$lib/utils/logger';

export const isHlsSupported = () => window?.Hls?.isSupported();

export const loadHlsPlayer = () => {
	let hls;
	if (isHlsSupported()) {
		hls = new Hls({
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
		return hls;
	}
};
