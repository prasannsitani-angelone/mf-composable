export const customCanvasBackgroundColorPlugin = {
	id: 'customCanvasBackgroundColor',
	beforeDraw: (chart, args, options) => {
		const { ctx } = chart;
		const radius = chart._metasets[0].controller.innerRadius;
		const x = chart.getDatasetMeta(0).data[0].x;
		const y = chart.getDatasetMeta(0).data[0].y;
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fillStyle = options.fill;
		ctx.fill();
	}
};
