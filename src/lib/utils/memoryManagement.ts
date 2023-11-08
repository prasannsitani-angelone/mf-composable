import logger from './logger';

class MemoryManagement {
	static MAX_PERCENT_THRESHOLD = 70;
	constructor() {
		this.hasAlarmed = false;
	}

	// as this method will be called everytime before next repaint will happen, so should be used only when required till then we can send it as part of logs framework
	startMonitoring() {
		const memoryMetrics = this.getMemoryMetrics();
		if (!memoryMetrics || !window.requestAnimationFrame) {
			return;
		}

		requestAnimationFrame(
			function onFrame() {
				// Check if we have exceeded relative memory limit for client
				if (this.checkIfCrossedRelativeMemory()) {
					this.hasAlarmed = true;
					logger.error({
						type: 'Memory Usage Exceeded',
						params: {
							memory: memoryMetrics
						}
					});
				}

				// Only alert once
				if (!this.hasAlarmed) {
					requestAnimationFrame(onFrame.bind(this));
				}
			}.bind(this)
		);
	}

	getRelativeMemoryUsage() {
		const memoryMetrics = this.getMemoryMetrics();
		if (!memoryMetrics) {
			return 0;
		}
		return (memoryMetrics.usedJSHeapSize / memoryMetrics.jsHeapSizeLimit) * 100;
	}

	checkIfCrossedRelativeMemory() {
		if (!this.getMemoryMetrics()) {
			return false;
		}
		if (this.getRelativeMemoryUsage() > MemoryManagement.MAX_PERCENT_THRESHOLD) {
			return true;
		}
		return false;
	}

	getMemoryMetrics() {
		return window.performance?.memory;
	}
}

const memoryManagement = new MemoryManagement();
export default memoryManagement;
