export const lineChartSchema = {
	data: {
		labels: [],
		datasets: [
			{
				label: 'Portfolio Value',
				backgroundColor: '#1EC7B6',
				borderColor: '#1EC7B6',
				yAxisID: 'y',
				fill: false,
				data: []
			}
		]
	},
	options: {
		maintainAspectRatio: false,
		elements: {
			point: {
				borderWidth: 6, // make responsive
				pointRadius: 10, // make responsive
				hoverRadius: 10, // make responsive
				hoverBorderWidth: 6 // make responsive
			}
		},
		scales: {
			x: {
				time: {
					unit: 'month'
				},
				ticks: {
					callback: function (value: number) {
						const date = new Date(value);
						const month = date.toLocaleString('default', { month: 'short' });
						const year = date.getFullYear()?.toString();
						return ' ' + month + ' ' + year + ' ';
					}
				}
			}
		}
	}
};
