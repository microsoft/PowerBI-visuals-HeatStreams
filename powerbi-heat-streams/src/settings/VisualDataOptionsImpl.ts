/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DateAggregation } from 'react-heat-streams'
import { IVisualDataOptions } from './types'
import { SortBy } from '../types'

export class VisualDataOptionsImpl implements IVisualDataOptions {
	public dateAggregation: DateAggregation = DateAggregation.Days
	public numericAggregation = 1
	public valueMin = undefined
	public valueMax = undefined
	public scoreSplit = undefined
	public isLogScale = false
	public sortBy: SortBy = SortBy.Name
	public sortInvert = false
}
