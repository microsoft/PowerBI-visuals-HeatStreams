/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as models from 'powerbi-models'

function getTarget(column: any) {
	return {
		column: (column as any).ref,
		table: (column as any).source.entity,
	} as models.IFilterColumnTarget
}

export default function buildDomainScrub(
	bounds: Array<Date | number>,
	column: powerbi.data.ISQExpr,
) {
	const start = bounds[0]
	const end = bounds[1]
	const filterVal = v => (typeof v === 'number' ? v : v)
	return new models.AdvancedFilter(
		getTarget(column),
		'And',
		{ operator: 'GreaterThan', value: filterVal(start) },
		{ operator: 'LessThan', value: filterVal(end) },
	)
}
