/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ICategory } from 'react-heat-streams'
import { ICategoryDataMap } from '../chart/types'
import { IVisualDataOptions } from '../settings/types'

type Sorter = (cat1: ICategory, cat2: ICategory) => number
const invert = (sortComparator: Sorter) => (
	cat1: ICategory,
	cat2: ICategory,
): number => -1 * sortComparator(cat1, cat2)

function getSortComparator(
	categories: ICategory[],
	categoryData: ICategoryDataMap,
	options: IVisualDataOptions,
): Sorter {
	const { sortBy, sortInvert: isInverted } = options

	categories.forEach((cat: ICategory) => {
		const data = categoryData[cat.id]
		const count = data.length
		const sum = data.reduce((prev, current) => prev + current.value, 0)
		const max = Math.max(...data.map(c => c.value))

		cat.metadata = {
			average: sum / count,
			density: data.length,
			max,
			sum,
		}
	})

	const valueCompare = (field: string) => (
		cat1: ICategory,
		cat2: ICategory,
	): number => {
		const v1 = (cat1.metadata && cat1.metadata[field]) || 0
		const v2 = (cat2.metadata && cat2.metadata[field]) || 0
		return v2 - v1
	}

	const SORT_COMPARATORS: { [key: string]: Sorter } = {
		average: valueCompare('average'),
		density: valueCompare('density'),
		max: valueCompare('max'),
		name: (cat1: ICategory, cat2: ICategory) => {
			if (cat1.name < cat2.name) {
				return -1
			} else if (cat1.name > cat2.name) {
				return 1
			} else {
				return 0
			}
		},
	}

	const comparator: Sorter = SORT_COMPARATORS[sortBy]
	return isInverted ? invert(comparator) : comparator
}

export function sortCategories(
	categories: ICategory[],
	categoryData: ICategoryDataMap,
	options: IVisualDataOptions,
): ICategory[] {
	const comparator = getSortComparator(categories, categoryData, options)
	return categories.sort(comparator)
}
