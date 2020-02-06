/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as models from 'powerbi-models'
import { TimeDomain } from '@essex/react-heat-streams'

function getTarget(column: any): models.IFilterColumnTarget {
	return {
		column: (column as any).ref,
		table: (column as any).source.entity,
	} as models.IFilterColumnTarget
}

export default function buildDomainScrub(
	bounds: TimeDomain,
	column: powerbi.data.ISQExpr,
): models.AdvancedFilter {
	const start = bounds[0]
	const end = bounds[1]
	const filterVal = (v: any): any => (typeof v === 'number' ? v : v)
	return new models.AdvancedFilter(
		getTarget(column),
		'And',
		{ operator: 'GreaterThan', value: filterVal(start) },
		{ operator: 'LessThan', value: filterVal(end) },
	)
}
