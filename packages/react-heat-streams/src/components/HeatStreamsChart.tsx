/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useState, useCallback, useMemo } from 'react'
import { scaleLinear, scaleTime } from 'd3-scale'
import {
	DateAggregation,
	ICategory,
	ICategorySelectionMap,
	ICategoryValueMap,
	IColorizer,
	Scrub,
	XDomain,
	TimeDomain,
} from '../types'
import { getSliceEnd } from '../utils'
import { CategoryList } from './CategoryList'

export interface IHeatStreamsState {
	scrollPosition: number
	panPosition: number
}

export interface IHeatStreamsChartProps {
	width: number
	height: number
	xDomain: XDomain
	colorizer: IColorizer
	categories: ICategory[]
	categoryValues: ICategoryValueMap
	numericAggregation?: number
	/**
	 * A map of category id to selected category
	 * @default empty object
	 */
	selections?: ICategorySelectionMap
	dateAggregation?: DateAggregation
	highlightColor?: string
	timeScrub?: TimeDomain
	rowGap?: boolean
	showValues?: boolean
	/**
	 * A flag that determines whether the category names are shown.
	 * @default true
	 */
	showCategories?: boolean
	axisHeight?: number
	rowHeight?: number
	textPercent?: number
	numTicks?: number
	zoomLevel?: number
	onClearSelection?: () => void
	onClickCategory?: (category: ICategory, ctrl: boolean) => void
	onScrub?: (bounds: Scrub) => void
}

const NO_OP = () => null
const DEFAULT_NUM_TICKS = 20
const DEFAULT_TEXT_PERCENT = 0.15
const DEFAULT_ZOOM_LEVEL = 1
const DEFAULT_ROW_HEIGHT = 20
const DEFAULT_ROW_GAP = true
const DEFAULT_AXIS_HEIGHT = 20
const DEFAULT_HIGHLIGHT_COLOR = '#FF0000'
const DEFAULT_SELECTIONS = {}

export const HeatStreamsChart: React.FC<IHeatStreamsChartProps> = memo(
	({
		colorizer,
		width,
		height,
		categories,
		categoryValues,
		xDomain,
		numericAggregation = 1,
		dateAggregation = DateAggregation.Days,
		selections = DEFAULT_SELECTIONS,
		highlightColor = DEFAULT_HIGHLIGHT_COLOR,
		timeScrub = undefined,
		showCategories = true,
		showValues = false,
		rowGap = DEFAULT_ROW_GAP,
		zoomLevel = DEFAULT_ZOOM_LEVEL,
		numTicks = DEFAULT_NUM_TICKS,
		axisHeight = DEFAULT_AXIS_HEIGHT,
		rowHeight = DEFAULT_ROW_HEIGHT,
		textPercent = DEFAULT_TEXT_PERCENT,
		onClickCategory = NO_OP,
		onClearSelection = NO_OP,
		onScrub = NO_OP,
	}) => {
		const [panPosition, scrollPosition, onScroll] = usePanScroll(zoomLevel)
		const xScale = useXScale(
			showCategories,
			width,
			textPercent,
			zoomLevel,
			xDomain,
		)
		const axisOffset = useAxisOffset(
			height,
			axisHeight,
			rowHeight,
			categories.length,
		)
		const sliceWidth = useSliceWidth(
			xDomain,
			xScale,
			numericAggregation,
			dateAggregation,
		)
		const categoryY = useCategoryY(rowHeight, rowGap ? 1 : 0)
		const isCategorySelected = useCallback(
			(cat: ICategory): boolean => !!selections[cat.id],
			[selections],
		)
		const categoryTextWidth = width * textPercent
		const chartWidth = width - categoryTextWidth
		const maxCategories = useMaxCategories(
			rowGap,
			height,
			rowHeight,
			axisHeight,
		)
		const categoryOffsetStart = useCategoryOffsetStart(
			categories,
			scrollPosition,
			rowHeight,
			maxCategories,
		)
		const categoriesInView = useCategoriesInView(
			categories,
			maxCategories,
			categoryOffsetStart,
		)
		const onClick = useOnClickHandler(
			categoriesInView,
			rowHeight,
			rowGap,
			timeScrub,
			onClearSelection,
			onClickCategory,
		)

		return (
			<svg height={height} width={width}>
				<defs>
					<clipPath id="clip-chart">
						<rect
							x={categoryTextWidth}
							y="0"
							width={chartWidth}
							height={height}
						/>
					</clipPath>
					<clipPath id="clip-category-text">
						<rect x="0" y="0" width={categoryTextWidth} height={height} />
					</clipPath>
				</defs>
				<CategoryList
					height={height}
					width={width}
					axisHeight={axisHeight}
					axisOffset={axisOffset}
					categoryY={categoryY}
					categories={categoriesInView}
					categoryValues={categoryValues}
					textPercent={textPercent}
					showCategories={showCategories}
					rowHeight={rowHeight}
					highlightColor={highlightColor}
					showValues={showValues}
					colorizer={colorizer}
					xScale={xScale}
					xDomain={xDomain}
					numAxisTicks={numTicks}
					isCategorySelected={isCategorySelected}
					sliceWidth={sliceWidth}
					onClickCategory={onClickCategory}
					onClick={onClick}
					onScroll={onScroll}
					onScrub={onScrub}
					xPan={panPosition}
					timeScrub={timeScrub}
					onClear={onClearSelection}
				/>
			</svg>
		)
	},
)

type XScale = (input: number | Date) => number
function useXScale(
	showCategories: boolean,
	width: number,
	textPercent: number,
	zoomLevel: number,
	xDomain: XDomain,
): XScale {
	const getXScale = useCallback(
		(domain: XDomain): any => {
			const rangeStart = showCategories ? width * textPercent : 0
			const range = [rangeStart, width * zoomLevel]
			const isNumberDomain = typeof domain[0] === 'number'
			if (isNumberDomain) {
				return scaleLinear()
					.domain(domain)
					.range(range)
			} else {
				return scaleTime()
					.domain(domain)
					.range(range)
			}
		},
		[showCategories, textPercent, width, zoomLevel],
	)
	return useMemo(() => getXScale(xDomain), [getXScale, xDomain])
}

function useSliceWidth(
	xDomain: XDomain,
	xScale: XScale,
	numericAggregation: number,
	dateAggregation: DateAggregation,
): number {
	return useMemo(() => {
		const start = xDomain[0]
		const end = getSliceEnd(start, numericAggregation, dateAggregation)
		return xScale(end) - xScale(start)
	}, [xScale, xDomain, numericAggregation, dateAggregation])
}

function useCategoryY(rowHeight: number, rowGap: number) {
	return useCallback(
		(index: number): number => rowHeight * index + (rowGap ? index : 0),
		[rowHeight, rowGap],
	)
}

function useAxisOffset(
	height: number,
	axisHeight: number,
	rowHeight: number,
	numRows: number,
) {
	return useMemo(() => {
		return Math.min(height - axisHeight, numRows * rowHeight + axisHeight)
	}, [numRows, axisHeight, rowHeight, height])
}

function useMaxCategories(
	rowGap: boolean,
	height: number,
	rowHeight: number,
	axisHeight: number,
) {
	return useMemo(() => {
		const gap = rowGap ? 1 : 0
		return Math.floor((height - axisHeight) / (rowHeight + gap))
	}, [rowGap, height, axisHeight, rowHeight])
}

function useCategoryOffsetStart(
	categories: ICategory[],
	scrollPosition: number,
	rowHeight: number,
	maxCategories: number,
) {
	return useMemo(() => {
		let categoryOffsetStart = Math.floor(scrollPosition / rowHeight)
		if (categories.length < categoryOffsetStart) {
			categoryOffsetStart = categories.length - maxCategories
		}
		return categoryOffsetStart
	}, [maxCategories, scrollPosition, rowHeight, categories.length])
}

function useCategoriesInView(
	categories: ICategory[],
	maxCategories: number,
	categoryOffsetStart: number,
) {
	return useMemo(() => {
		return categories.slice(
			categoryOffsetStart,
			categoryOffsetStart + maxCategories,
		)
	}, [categoryOffsetStart, maxCategories, categories])
}

function useOnClickHandler(
	categoriesInView: ICategory[],
	rowHeight: number,
	rowGap: boolean,
	timeScrub: TimeDomain | undefined,
	onClearSelection: () => void,
	onClickCategory: (category: ICategory, ctrl: boolean) => void,
) {
	return useCallback(
		(x: number, y: number, ctrlKey: boolean): void => {
			if (timeScrub) {
				onClearSelection()
			} else {
				const gap = rowGap ? 1 : 0
				const category = categoriesInView[Math.floor(y / (rowHeight + gap))]
				if (category) {
					onClickCategory(category, ctrlKey)
				} else {
					onClearSelection()
				}
			}
		},
		[
			categoriesInView,
			onClearSelection,
			onClickCategory,
			rowGap,
			rowHeight,
			timeScrub,
		],
	)
}

function usePanScroll(
	zoomLevel: number,
): [number, number, (dx: number, dy: number) => void] {
	const [panPosition, setPanPosition] = useState(0)
	const [scrollPosition, setScrollPosition] = useState(0)

	const onScroll = useCallback(
		(dx: number, dy: number): void => {
			const newPanPos = zoomLevel === 1 ? 0 : Math.min(0, panPosition - dx)
			const newScrollPos = Math.max(0, scrollPosition + dy)
			setPanPosition(newPanPos)
			setScrollPosition(newScrollPos)
		},
		[panPosition, scrollPosition, zoomLevel],
	)

	return [panPosition, scrollPosition, onScroll]
}
