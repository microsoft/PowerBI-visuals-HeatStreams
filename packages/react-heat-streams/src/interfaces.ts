/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * The coarseness of x-aggregated blocks (when using dates)
 */
export type DateAggregation = 'hours' | 'days' | 'months' | 'years'

/**
 * Represents the X-Domain of the Visual
 */
export type XDomain = TimeDomain

/**
 * A user scrub over the X-Domain of the Visual
 */
export type Scrub = Array<Date | number>

/**
 * A Visualized Category
 */
export interface ICategory {
	id: number
	name: string
	metadata?: {
		[key: string]: number
	}
}

/**
 * A Selection of Category names
 */
export interface ICategorySelectionMap {
	[key: string]: ICategory
}

/**
 * Interface for the value to color function
 */
export type IColorizer = (value: number) => string

/**
 * Interface for the domain to position scaler, usually a d3-scaler
 */
export type IScaler = (value: number | Date) => number

export interface IValueSlice {
	start: Date | number
	end: Date | number
	value: number
}

export interface ICategoryValueMap {
	[key: string]: IValueSlice[]
}

/**
 * Callback signature for when the user has performed a selection interaction with a category
 */
export type SelectionChangedHandler = (
	category: ICategory,
	multiselect: boolean,
) => void

/**
 * Callback signature for when the user has cleared the selection
 */
export type SelectionClearedHandler = () => void

/**
 * Callback Signature for when the user has performed a domain-scrub operation
 */
export type ScrubbedHandler = (bounds: Scrub) => void

export type TimeDomain = [number, number] | [Date, Date]
