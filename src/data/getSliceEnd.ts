import { IVisualDataOptions } from '../chart/interfaces'
import { dateSliceEnd } from './dateUtils'

export default function getSliceEnd(
	start: Date | number,
	options: IVisualDataOptions,
) {
	const isNumber = typeof start === 'number'
	return isNumber
		? (start as number) + options.numericAggregation
		: dateSliceEnd(start as Date, options.dateAggregation)
}
