/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { getSliceEnd, XDomain } from '@essex/react-heat-streams'
import { extent } from 'd3-array'
import { ICategoryDataMap, IVisualDataOptions } from '../chart/interfaces'

export default function determinePositionDomain(
	data: ICategoryDataMap,
	options: IVisualDataOptions,
): XDomain {
	// Get the domain of each category
	const domainsByCategory = Object.keys(data).map(category =>
		extent(data[category], (pv: { position: Date | number }) => pv.position),
	) as XDomain[]

	// Smang the domains together into an array
	const mergedDomains = [...domainsByCategory]

	// Get the extent of the domain
	const domain = extent(mergedDomains) as XDomain

	// The actual end should be the end of the final slice
	domain[1] = getSliceEnd(
		domain[1],
		options.numericAggregation,
		options.dateAggregation,
	)
	return domain
}
