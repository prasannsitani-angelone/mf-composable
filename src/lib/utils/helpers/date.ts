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

export const getTimestampDaysDifference = (
	timeStamp1: number = Date.now(),
	timeStamp2: number = Date.now()
) => {
	const difference = timeStamp1 - timeStamp2;
	const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);

	return daysDifference;
};

export const getTimestampHoursDifference = (
	timeStamp1: number = Date.now(),
	timeStamp2: number = Date.now()
) => {
	const difference = timeStamp1 - timeStamp2;
	const hoursDifference = Math.floor(difference / 3600000);

	return hoursDifference;
};

export const getNextMonthDate = (
	dateTs: number,
	dateTimeType = 'DATE',
	shortMonthName = false,
	dateSuperScript = false
) => {
	const currentMonthDate = new Date(dateTs);
	currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
	const dateTimeObj = getDateTimeProperties(currentMonthDate.getTime());
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
 * getSIPMonthIncrementBasedOnDate: Get next sip date month increment factor
 *
 * @param calendarDate
 * @param date
 * @returns
 */
export const getSIPMonthIncrementBasedOnDate = (
	calendarDate: number,
	date: Date = new Date(),
	bufferDays = 31
) => {
	const daysInCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Total number of days in the ongoing month
	let monthIncrementFactor = 1; // default value is 1 (for current month)

	const bufferDaysToCompare = 31; // for comparing the buffer days

	if (bufferDays >= bufferDaysToCompare) {
		if (calendarDate + daysInCurrentMonth - date?.getDate() >= bufferDays) {
			monthIncrementFactor += 1; // next month
		} else {
			monthIncrementFactor += 2; // next to next month
		}
	} else {
		if (calendarDate < date?.getDate()) {
			if (calendarDate + daysInCurrentMonth - date?.getDate() > bufferDays) {
				monthIncrementFactor += 1; // next month
			} else {
				monthIncrementFactor += 2; // next to next month
			}
		} else if (calendarDate - date?.getDate() <= bufferDays) {
			monthIncrementFactor += 1; // next month
		}
	}

	return monthIncrementFactor;
};

export const getSIPMonthBasedOnDate = (
	calendarDate: number,
	date: Date = new Date(),
	bufferDays = 31
) => {
	return date?.getMonth() + getSIPMonthIncrementBasedOnDate(calendarDate, date, bufferDays);
};

export const getSIPYearBasedOnDate = (
	calendarDate: number,
	date: Date = new Date(),
	bufferDays = 31
) => {
	const month = getSIPMonthBasedOnDate(calendarDate, date, bufferDays);
	return month > 12 ? date.getFullYear() + 1 : date.getFullYear();
};

export const getCompleteSIPDateBasedonDD = (
	calendarDate: number,
	date: Date = new Date(),
	bufferDays = 31
) => {
	const month = getSIPMonthBasedOnDate(calendarDate, date, bufferDays) - 1;
	const year = date?.getFullYear();
	return new Date(year, month, calendarDate);
};

/**
 * getFinancialYearList: returns array of objects of requested length (listLength)
 * each object has info of a different financial year (title,
 * fromDate, toDate, filename, selected)
 * first object in current financial year, it decreases with each consequent object
 *
 * @param {number} listLength
 * @returns {Array} financialYearList
 */
export const getFinancialYearList = (listLength = 3) => {
	const today = new Date();
	let endYear;
	today.getMonth() < 3 // before April
		? (endYear = today.getFullYear())
		: (endYear = today.getFullYear() + 1);

	const financialYearList = [];
	for (let i = 0; i < listLength; i++) {
		const temp = {
			fromDate: `${endYear - 1}-04-01`,
			toDate: `${endYear}-03-31`,
			selected: false,
			fileName: `Apr_${endYear - 1}_Mar_${endYear}`,
			title: `Apr ${endYear - 1} - Mar ${endYear}`
		};
		endYear -= 1;
		financialYearList.push(temp);
	}
	return financialYearList;
};

/**
 * convertToTwoDigit: returns string after converting a number to two digit format
 *
 * @param {number} date
 * @returns {string} twoDigitNumber
 */
export const convertToTwoDigit = (date: number): string => {
	return ('0' + date).slice(-2);
};

/**
 * getFrequentTimePeriodList: returns Array of Objects of frequently used time period
 * used in opitons for Txn History reports
 *
 * @returns {Array} frequentTimePeriodList
 */
export const getFrequentTimePeriodList = () => {
	let today = new Date();
	const toDate = `${today.getFullYear()}-${convertToTwoDigit(
		today.getMonth() + 1
	)}-${convertToTwoDigit(today.getDate())}`;
	const _3MonthBefore = new Date(today.setMonth(today.getMonth() - 3));
	today = new Date();
	const _6MonthBefore = new Date(today.setMonth(today.getMonth() - 6));
	const Jan1 = new Date(new Date().getFullYear(), 0, 1);

	const frequentTimePeriodList = [];
	frequentTimePeriodList.push({
		title: 'Last 3 Months',
		isSelected: false,
		fromDate: `${_3MonthBefore.getFullYear()}-${convertToTwoDigit(
			_3MonthBefore.getMonth() + 1
		)}-${convertToTwoDigit(_3MonthBefore.getDate())}`,
		toDate
	});
	frequentTimePeriodList.push({
		title: 'Last 6 Months',
		isSelected: false,
		fromDate: `${_6MonthBefore.getFullYear()}-${convertToTwoDigit(
			_6MonthBefore.getMonth() + 1
		)}-${convertToTwoDigit(_6MonthBefore.getDate())}`,
		toDate
	});
	frequentTimePeriodList.push({
		title: 'Year Till Date',
		isSelected: false,
		fromDate: `${Jan1.getFullYear()}-${convertToTwoDigit(Jan1.getMonth() + 1)}-${convertToTwoDigit(
			Jan1.getDate()
		)}`,
		toDate
	});
	return frequentTimePeriodList;
};
