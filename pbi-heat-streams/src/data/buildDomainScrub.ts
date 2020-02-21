/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import powerbiVisualsApi from 'powerbi-visuals-api'
import * as powerbiModels from 'powerbi-models'
import { TimeDomain } from 'react-heat-streams'

function getTarget(column: any): powerbiModels.IFilterColumnTarget {
	return <powerbiModels.IFilterColumnTarget>{
		column: column.ref,
		table: column.source.entity,
	}
}

export function buildDomainScrub(
	bounds: TimeDomain,
	column: powerbiVisualsApi.data.ISQExpr,
): powerbiModels.AdvancedFilter {
	const start = bounds[0]
	const end = bounds[1]
	const filterVal = (v: any): any => (typeof v === 'number' ? v : v)
	return new powerbiModels.AdvancedFilter(
		getTarget(column),
		'And',
		{ operator: 'GreaterThan', value: filterVal(start) },
		{ operator: 'LessThan', value: filterVal(end) },
	)
}
