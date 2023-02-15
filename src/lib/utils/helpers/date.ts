/**
 * getDateTimeProperties: Function to get Date and Time properties object from date timestamp.
 *
 * @param date
 * @returns
 */
export const getDateTimeProperties = (date: number) => {
	const dateString = new Date(date);
	let calendarDay = new Date(dateString)?.getDate()?.toString();
	if (calendarDay.length === 1) {
		calendarDay = '0' + calendarDay;
	}
	const calendarYear = new Date(dateString)?.getFullYear()?.toString();
	const calendarMonth = new Date(dateString)?.toLocaleString('default', { month: 'long' });
	const calendarMonthShort = new Date(dateString)?.toLocaleString('default', { month: 'short' });

	let calendarHours = new Date(dateString)?.getHours().toString();

	const calendarAmPm = parseInt(calendarHours) < 12 ? 'AM' : 'PM';

	if (parseInt(calendarHours) > 12) {
		calendarHours = (parseInt(calendarHours) - 12).toString();
	}

	if (calendarHours?.length === 1) {
		calendarHours = '0' + calendarHours;
	}

	let calendarMinutes = new Date(dateString)?.getMinutes()?.toString();

	if (calendarMinutes.length === 1) {
		calendarMinutes = '0' + calendarMinutes;
	}

	const dateTimeObj = {
		date: calendarDay,
		month: calendarMonth,
		monthShort: calendarMonthShort,
		year: calendarYear,
		hours: calendarHours,
		minutes: calendarMinutes,
		amPm: calendarAmPm
	};

	return dateTimeObj;
};

/**
 * getDateTimeString: Function to get date-time string.
 *
 * @param dateTs
 * @param dateTimeType
 * @param shortMonthName
 * @returns
 */
export const getDateTimeString = (
	dateTs: number,
	dateTimeType = 'DATE',
	shortMonthName = false,
	dateSuperScript = false
) => {
	const dateTimeObj = getDateTimeProperties(dateTs);
	const { month, monthShort, year, hours, minutes, amPm } = dateTimeObj || {};

	let { date } = dateTimeObj || {};

	if (dateSuperScript) {
		const dateSuffix = getDateSuperscript(parseInt(date));
		date = date + dateSuffix;
	}

	return dateTimeType === 'DATETIME'
		? `${date} ${shortMonthName ? monthShort : month} ${year}, ${hours}:${minutes} ${amPm}`
		: `${date} ${shortMonthName ? monthShort : month} ${year}`;
};

/**
 * getDateSuperscript: Function to get Date Superscript like 1st, 2nd, 3rd, 4th, etc.
 *
 * @param {number} val
 * @returns {string} dateSuperscript
 */
export const getDateSuperscript = (val: number) => {
	let dateSuperscript = '';

	if (val) {
		if (val === 1 || val === 21) {
			dateSuperscript = 'st';
		} else if (val === 2 || val === 22) {
			dateSuperscript = 'nd';
		} else if (val === 3 || val === 23) {
			dateSuperscript = 'rd';
		} else {
			dateSuperscript = 'th';
		}
	}

	return dateSuperscript;
};

/**
 * getDateDiffInDays: Function to get difference in days.
 *
 * @param {Date} futureDate
 * @returns {Date} currentDate
 */

export const getDateDiffInDays = (futureDate: Date, currentDate: Date = new Date()) => {
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
	const currentUTCDate = Date.UTC(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate()
	);
	const futureUTCDate = Date.UTC(
		futureDate.getFullYear(),
		futureDate.getMonth(),
		futureDate.getDate()
	);

	return Math.floor((futureUTCDate - currentUTCDate) / _MS_PER_DAY);
};
