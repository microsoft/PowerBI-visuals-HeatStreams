import { DateAggregation } from './interfaces'

export function addMilliseconds(date: Date, num: number): Date {
	const result = new Date(date)
	result.setUTCMilliseconds(result.getUTCMilliseconds() + num)
	return result
}

export function addSeconds(date: Date, num: number): Date {
	const result = new Date(date)
	result.setUTCSeconds(result.getUTCSeconds() + num)
	return result
}

export function addMinutes(date: Date, num: number): Date {
	const result = new Date(date)
	result.setUTCMinutes(result.getUTCMinutes() + num)
	return result
}

export function addHours(date: Date, num: number): Date {
	const result = new Date(date)
	result.setUTCHours(result.getUTCHours() + num)
	return result
}

export function addDays(date: Date, num: number): Date {
	const result = new Date(date)
	result.setUTCDate(result.getUTCDate() + num)
	return result
}

export function addMonths(date: Date, num: number): Date {
	const result = new Date(date)
	result.setUTCMonth(result.getUTCMonth() + num)
	return result
}

export function addYears(date: Date, num: number): Date {
	const result = new Date(date)
	result.setUTCFullYear(result.getUTCFullYear() + num)
	return result
}

export function dateSliceEnd(
	start: Date,
	dateAggregation: DateAggregation,
): Date {
  if (dateAggregation === 'milliseconds') {
		return addMilliseconds(start, 1)
	}	else if (dateAggregation === 'seconds') {
		return addSeconds(start, 1)
	}	else if (dateAggregation === 'minutes') {
		return addMinutes(start, 1)
	}	else if (dateAggregation === 'hours') {
		return addHours(start, 1)
	} else if (dateAggregation === 'days') {
		return addDays(start, 1)
	} else if (dateAggregation === 'months') {
		return addMonths(start, 1)
	} else if (dateAggregation === 'years') {
		return addYears(start, 1)
	} else {
		throw new Error('unknown aggregation: ' + dateAggregation)
	}
}

export function getSliceEnd(
	start: Date | number,
	numericAggregation?: number,
	dateAggregation?: DateAggregation,
) {
	const isNumber = typeof start === 'number'
	return isNumber
		? (start as number) + numericAggregation
		: dateSliceEnd(start as Date, dateAggregation)
}
