/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DateAggregation } from './types'

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
	if (dateAggregation === DateAggregation.Hours) {
		return addHours(start, 1)
	} else if (dateAggregation === DateAggregation.Days) {
		return addDays(start, 1)
	} else if (dateAggregation === DateAggregation.Months) {
		return addMonths(start, 1)
	} else if (dateAggregation === DateAggregation.Years) {
		return addYears(start, 1)
	} else {
		throw new Error('unknown aggregation: ' + dateAggregation)
	}
}

export function getSliceEnd(
	start: Date | number,
	numericAggregation?: number,
	dateAggregation?: DateAggregation,
): Date | number {
	const isNumber = typeof start === 'number'
	return isNumber
		? (start as number) + numericAggregation!
		: dateSliceEnd(start as Date, dateAggregation!)
}
