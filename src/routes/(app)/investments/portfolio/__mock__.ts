const getTime = (years: number, month = 0, date = new Date()) => {
	date.setFullYear(date.getFullYear() - years);
	date.setMonth(date.getMonth() - month);
	return date;
};
export const lineData = {
	data: {
		labels: [
			getTime(0),
			getTime(1),
			getTime(2),
			getTime(3),
			getTime(4),
			getTime(5),
			getTime(6),
			getTime(7)
		],
		datasets: [
			{
				label: 'NAV',
				backgroundColor: '#1EC7B6',
				borderColor: '#1EC7B6',
				yAxisID: 'y',
				fill: false,
				data: [40, 39, 40, 10, 40, 39, 80, 40]
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
		}
	}
};

export const doughnutData = {
	data: {
		labels: ['REC Ltd.', 'ABC Ltd.', 'DEF Ltd.', 'XYZ Ltd.', 'NOV Ltd.', 'DEC Ltd.'],
		datasets: [
			{
				backgroundColor: ['#F9BA4D', '#4BD9EA', '#581DBE', '#1EC7B6', '#F65E5A', '#3F5BD9'],
				hoverBackgroundColor: ['#F9BA4D', '#4BD9EA', '#581DBE', '#1EC7B6', '#F65E5A', '#3F5BD9'],
				hoverBorderColor: ['#F9BA4D', '#4BD9EA', '#581DBE', '#1EC7B6', '#F65E5A', '#3F5BD9'],
				data: [25, 15, 15, 10, 5, 30],
				cutout: '70%',
				borderRadius: 0,
				borderWidth: 2, // can make responsive
				borderAlign: 'inner',
				borderColor: '#F4F6FB',
				offset: 0,
				hoverOffset: 3,
				borderJoinStyle: 'round'
			}
		]
	},
	options: {
		plugins: {
			tooltipLine: {
				heading: '15,120',
				subHeading: 'Crores'
			}
		}
	}
};

export const riskometerData = {
	labels: ['Low', 'Medium', 'Moderate', 'High', 'Very High', 'V Very High'],
	datasets: [
		{
			backgroundColor: ['#5EC4B6', '#6EA160', '#D7AE45', '#F5D290', '#F6895A', '#F65E5A'],
			data: [1, 1, 1, 1, 1, 1],
			cutout: '55%',
			circumference: 180,
			rotation: 270,
			borderRadius: 2,
			borderWidth: 0,
			needleValue: 0.1
		},
		{
			backgroundColor: ['#8ED6CC', '#91BDB9', '#D8C561', '#F5D290', '#F9AD8C', '#F98F8C'],
			data: [1, 1, 1, 1, 1, 1],
			cutout: '70%',
			circumference: 180,
			rotation: 270,
			borderRadius: 0,
			borderWidth: 0
		}
	]
};

export const holdingsSummary = {
	status: 'success',
	data: {
		summary: {
			currentValue: 5852.7983,
			investedValue: 5699.7269,
			returnsValue: 153.0714,
			returnsAbsolutePer: 2.69,
			xirr: 99.5552798,
			returns1MonthPer: 0,
			returns3MonthPer: 0,
			returns6MonthPer: 0,
			returns1YearPer: 0,
			returns3YearPer: 0,
			totalSips: 0,
			totalLumpsums: 0,
			previousDayReturns: 23.5384,
			previousDayReturnPercentage: 0.4,
			shortTermGain: 0,
			longTermGain: 0
		},
		folioHoldings: null,
		distributions: null
	}
};

export const months6 = {
	status: 'success',
	data: {
		summary: {},
		chart: [
			{ value: 5852.7983, timestamp: 1680998400000 },
			{ value: 5852.7983, timestamp: 1680912000000 },
			{ value: 5852.7983, timestamp: 1680825600000 },
			{ value: 5829.2599, timestamp: 1680739200000 },
			{ value: 5843.2235, timestamp: 1680652800000 },
			{ value: 5819.1805, timestamp: 1680566400000 },
			{ value: 5819.1805, timestamp: 1680480000000 },
			{ value: 5819.1805, timestamp: 1680393600000 },
			{ value: 5819.1805, timestamp: 1580307200000 },
			{ value: 5748.0236, timestamp: 1480220800000 },
			{ value: 605.9606, timestamp: 1380134400000 },
			{ value: 611.2137, timestamp: 1280048000000 }
		],
		folioHoldings: null,
		distributions: null
	}
};

export const months3 = {
	status: 'success',
	data: {
		summary: {},
		chart: [
			{ value: 5852.7983, timestamp: 1680998400000 },
			{ value: 5852.7983, timestamp: 1680912000000 },
			{ value: 5852.7983, timestamp: 1680825600000 },
			{ value: 5829.2599, timestamp: 1680739200000 },
			{ value: 5843.2235, timestamp: 1680652800000 },
			{ value: 5819.1805, timestamp: 1680566400000 },
			{ value: 5819.1805, timestamp: 1680480000000 },
			{ value: 5819.1805, timestamp: 1680393600000 },
			{ value: 5819.1805, timestamp: 1680307200000 },
			{ value: 5748.0236, timestamp: 1680220800000 },
			{ value: 605.9606, timestamp: 1680134400000 },
			{ value: 611.2137, timestamp: 1680048000000 }
		],
		folioHoldings: null,
		distributions: null
	}
};
