<script lang="ts">
	import DoughnutChart from '$lib/components/Charts/DoughnutChart.svelte';
	import LineChart from '$lib/components/Charts/LineChart.svelte';
	import Riskometer from '$lib/components/Charts/Riskometer.svelte';

	const getTime = (years: number, month = 0, date = new Date()) => {
		date.setFullYear(date.getFullYear() - years);
		date.setMonth(date.getMonth() - month);
		return date;
	};

	const lineData = {
		labels: [
			getTime(0),
			getTime(1),
			getTime(2),
			getTime(2, 4),
			getTime(3),
			getTime(3),
			getTime(4),
			getTime(4)
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
	};

	const lineChartOptions = {
		maintainAspectRatio: false,
		elements: {
			point: {
				borderWidth: 6, // make responsive
				pointRadius: 10, // make responsive
				hoverRadius: 10, // make responsive
				hoverBorderWidth: 6 // make responsive
			}
		}
	};

	// doughnut chart
	const doughnutData = {
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
	};

	const doughnutChartOptions = {
		plugins: {
			tooltipLine: {
				heading: '15,120',
				subHeading: 'Crores'
			}
		}
	};

	// riskometer
	const riskometerData = {
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
</script>

<section>Portfolio page goes here!!</section>
<section>
	<LineChart data={lineData} chartOptions={lineChartOptions} chartClass="w-full h-64 relative" />
	<DoughnutChart
		data={doughnutData}
		chartOptions={doughnutChartOptions}
		tooltipLength={50}
		chartClass="w-48 h-48 m-auto mt-2"
	/>
	<Riskometer data={riskometerData} chartClass="!w-64 !h-32" />
</section>
